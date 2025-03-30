import Queue from "bull";
import { REDIS } from "../config/env";
import S3Instance from "./aws.sdk.s3";

// 🔹 Initialize File Queue
const FileQueue = new Queue("FileUpload", {
  redis: {
    host: REDIS.HOST,
    port: REDIS.PORT,
    maxRetriesPerRequest: null,
    retryStrategy: (times) => Math.min(times * 100, 3000),
  },
});

// 🔹 Function to process file uploads
const processFileUpload = async (job: Queue.Job) => {
  const { file, model, value, key } = job.data;

  try {
    console.log(`🚀 Processing file upload: ${file}`);

    const s3 = new S3Instance();
    const response = await s3.uploadLargeFile(file);

    if (response instanceof Error) {
      console.error("❌ Upload Failed:", response.message);
      await model?.deleteOne?.({ [key]: value });
      throw response; // Mark job as failed
    }

    console.log("✅ File uploaded successfully!");
  } catch (error) {
    console.error("❌ Error during file upload:", error);
    await model?.deleteOne?.({ [key]: value });
    throw error; // Mark job as failed
  }
};

// 🔹 Attach Processor
FileQueue.process(processFileUpload);

// 🔹 Event Listener for Failures
FileQueue.on("failed", (job, error) => {
  console.error(`❌ Job failed for file: ${job.data.file}`, error);
});

export default FileQueue;
