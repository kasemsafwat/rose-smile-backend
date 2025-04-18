import nodemailer, { Transporter } from "nodemailer";
import Queue from "bull";
import { EmailSendConfigration, REDIS } from "../config/env";
import userModel from "../DB/models/user.model";
import { IEmail } from "../DB/interfaces/Email.interface";

class EmailService implements IEmail {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  message: string;
  private static transporterInstance: Transporter | null = null;

  constructor({
    to,
    subject = "No Subject",
    text = "",
    html = "<p>No Content</p>",
    message = "Mentora",
  }: Partial<IEmail> & { to: string | string[] }) {
    this.from = String(process.env.EMAIL);
    this.to = to;
    this.subject = subject;
    this.text = text;
    this.html = html;
    this.message = message;
  }

  private static createTransporter(): Transporter {
    if (!this.transporterInstance) {
      this.transporterInstance = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: EmailSendConfigration.EMAIL,
          pass: EmailSendConfigration.PASSWORD,
        },
      });
    }
    return this.transporterInstance;
  }

  public async send(): Promise<boolean> {
    try {
      const transporter = EmailService.createTransporter();
      const info = await transporter.sendMail({
        from: `${this.message} <${this.from}>`,
        to: this.to,
        subject: this.subject,
        text: this.text,
        html: this.html,
      });

      console.log("Email sent:", info.messageId);
      return info.accepted.length > 0;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }
}

// ============ Queue Setup =============
const emailQueue = new Queue("emailQueue", {
  redis: {
    host: REDIS.HOST,
    port: REDIS.PORT,
    maxRetriesPerRequest: null,
    retryStrategy(times) {
      return Math.min(times * 100, 3000);
    },
  },
});

// ============ Queue Processor ==========
emailQueue.process(async (job) => {
  try {
    console.log(`Processing email for: ${job.data.to}`);
    const emailInstance = new EmailService(job.data);
    const isSend = await emailInstance.send();

    if (!isSend) {
      throw new Error(`Failed to send email to: ${job.data.to}`);
    }

    console.log("Email sent successfully!");
  } catch (error) {
    await userModel.deleteOne({ email: job.data.to });
    console.error("Error sending email via queue:", error);
  }
});

emailQueue.on("failed", (job, error) => {
  console.error(`Job failed for email: ${job.data.to}`, error);
});

// ============ Helper Functions ==========
export const sendEmailNow = async (emailData: IEmail): Promise<boolean> => {
  const emailInstance = new EmailService(emailData);
  return await emailInstance.send();
};

export const addEmailToQueue = async (emailData: IEmail): Promise<void> => {
  await emailQueue.add(emailData);
};

// ============ Export =============
export { EmailService, emailQueue };
