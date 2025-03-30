import dotenv from "dotenv";

dotenv.config();

export const databaseConfigration = {
  DB_URL: process.env.DB_URL || "mongodb://localhost:27017/app",
};

export const NODE_ENV = process.env.NODE_ENV || "development";

export const PORT = Number(process.env.PORT) || 5000;

export const ApiDocumentation =
  process.env.ApiDocumentation || "https://www.youtube.com/watch?v=tpv35Uia4tc";

export const TokenConfigration = {
  ACCESS_TOKEN_START_WITH: process.env.ACCESS_TOKEN_START_WITH,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_EXPIRE: process.env.ACCESS_EXPIRE,
  REFRESH_EXPIRE: process.env.REFRESH_EXPIRE,
};

export const EmailSendConfigration = {
  EMAIL: process.env.EMAIL,
  PASSWORD: process.env.PASSWORD,
};

export const FRONTEND = {
  RESET_PASSWORD_URL: process.env.RESET_PASSWORD_URL,
  BASE_URL: process.env.BASE_URL,
  CONFIRM_EMAIL: process.env.CONFIRM_EMAIL,
};

export const SALT_ROUND = process.env.SALT_ROUND;

export const AWS_S3Keys = {
  BUCKET_NAME: process.env.BUCKET_NAME,
  REGION: process.env.REGION,
  ENDPOINT_URL: process.env.ENDPOINT_URL,
  ACCESS_KEY: process.env.ACCESS_KEY,
  SECRET_KEY: process.env.SECRET_KEY,
};

export const REDIS = {
  HOST: process.env.REDIS_HOST,
  PORT: Number(process.env.REDIS_PORT),
};
