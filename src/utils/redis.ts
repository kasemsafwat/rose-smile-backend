import Redis from "ioredis";
import { REDIS } from "../config/env";

const redis = new Redis({
  host: REDIS.HOST,
  port: REDIS.PORT,
  enableReadyCheck: true,
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    return Math.min(times * 100, 3000);
  },
});

redis.on("connect", () => {
  console.log("Connected to Redis successfully!");
});

redis.on("error", (error) => {
  console.error("Redis connection error:", error);
});

export default redis;
