import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.test" });

// Set test database URI if not set
if (!process.env.TEST_DB_URI) {
  process.env.TEST_DB_URI = "mongodb://localhost:27017/rose-smile-test";
}

// Increase timeout for tests
jest.setTimeout(30000);
