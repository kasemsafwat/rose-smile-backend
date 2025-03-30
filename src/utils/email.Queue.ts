import Queue from "bull";
import EmailService from "./nodemailer";
import userModel from "../DB/models/user.model";
import { REDIS } from "../config/env";

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

emailQueue.process(async (job) => {
  try {
    console.log(`Processing email for: ${job.data.to}`);
    const emailInstance = new EmailService({ ...job.data });
    const isSend = await emailInstance.send();

    if (!isSend) {
      throw new Error(`ERROR IN SENDING EMAIL to user: ${job.data.to}`);
    }

    console.log("Email sent successfully!");
  } catch (error) {
    await userModel.deleteOne({ email: job.data.to });
    console.error("Error sending email:");
  }
});

emailQueue.on("failed", (job, error) => {
  console.error(`Job failed for email: ${job.data.to}`, error);
});

export default emailQueue;
