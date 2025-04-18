import request from "supertest";
import app from "../app.controller";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

/**
 * Section API Test Suite
 *
 * This test suite covers all CRUD operations for the section module,
 * including image uploads and search functionality.
 */

let createdId: string | null = null;
let cookies: string[];

// Sample image path for testing
const testImagePath = path.join(process.cwd(), "src", "tests", "test.jpg");

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.TEST_DB_URI!);

  // Login and get cookies before all tests
  const loginRes = await request(app).post("/api/v1/auth/login").send({
    email: "mh674281@gmail.com",
    password: "MH2020salah",
  });



  if (loginRes.status !== 200 || !loginRes.headers["set-cookie"]) {
    throw new Error("Failed to login: " + JSON.stringify(loginRes.body));
  }

  // Store cookies from response
  cookies = loginRes.headers["set-cookie"] as unknown as string[];
});

afterAll(async () => {
  // Clean up test data
  if (createdId) {
    try {
      await request(app)
        .delete(`/api/v1/section/${createdId}`)
        .set("Cookie", cookies);
    } catch (error) {
      console.log("Error cleaning up test section:", error);
    }
  }

  // Disconnect from database
  await mongoose.disconnect();
});

describe("Section API Tests", () => {
  // Test section creation
  describe("Create Section", () => {
    it("should create a new section with image", async () => {
      const res = await request(app)
        .post("/api/v1/section/add")
        .set("Cookie", cookies)
        .attach("image", testImagePath)
        .field("title", "test section")
        .field("desc", "test description");


      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("section");
      expect(res.body.section).toHaveProperty("_id");
      expect(res.body.section.title).toBe("test section");
      expect(res.body.section.desc).toBe("test description");
      expect(res.body.section.image).toHaveProperty("imageUrl");
      createdId = res.body.section._id;
    });

    it("should fail to create section without image", async () => {
      const res = await request(app)
        .post("/api/v1/section/add")
        .set("Cookie", cookies)
        .send({
          title: "test section",
          desc: "test description",
        });

  

      expect(res.status).toBe(400);
    });
  });

  // Test section retrieval
  describe("Get Section", () => {
    it("should get section by ID", async () => {
      if (!createdId) {
        throw new Error("No section ID available for testing");
      }

      const res = await request(app)
        .get(`/api/v1/section/${createdId}`)
        .set("Cookie", cookies);



      expect(res.status).toBe(200);
      expect(res.body.section._id).toBe(createdId);
      expect(res.body.section.title).toBe("test section");
    });

    it("should return 404 for non-existent section", async () => {
      const res = await request(app)
        .get("/api/v1/section/6802624a669ef3d4c51ddbef")
        .set("Cookie", cookies);



      expect(res.status).toBe(404);
    });
  });

  // Test section search
  describe("Search Sections", () => {
    it("should search sections with pagination", async () => {
      const res = await request(app)
        .get("/api/v1/section?page=1&size=10&search=test")
        .set("Cookie", cookies);



      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("sections");
      expect(Array.isArray(res.body.sections)).toBe(true);
      expect(res.body).toHaveProperty("totalPages");
      expect(res.body).toHaveProperty("totalsections");
    });

    it("should search sections with sorting", async () => {
      if (!createdId) {
        throw new Error("No section ID available for testing");
      }

      const res = await request(app)
        .get("/api/v1/section?sort=-createdAt:asc")
        .set("Cookie", cookies);



      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("sections");
      expect(Array.isArray(res.body.sections)).toBe(true);
      expect(res.body.sections.length).toBeGreaterThan(0);
      expect(res.body.sections.some((s: any) => s._id === createdId)).toBe(
        true
      );
    });
  });

  // Test section update
  describe("Update Section", () => {
    it("should update section with new image", async () => {
      if (!createdId) {
        throw new Error("No section ID available for testing");
      }

      const res = await request(app)
        .patch(`/api/v1/section/update?sectionId=${createdId}`)
        .set("Cookie", cookies)
        .attach("image", testImagePath)
        .field("title", "updated section");



      expect(res.status).toBe(200);
      expect(res.body.section.title).toBe("updated section");
      expect(res.body.section.image).toHaveProperty("imageUrl");
    });

    it("should update section without image", async () => {
      if (!createdId) {
        throw new Error("No section ID available for testing");
      }

      const res = await request(app)
        .patch(`/api/v1/section/update?sectionId=${createdId}`)
        .set("Cookie", cookies)
        .send({
          desc: "updated description",
        });



      expect(res.status).toBe(200);
      expect(res.body.section.desc).toBe("updated description");
    });
  });

  // Test section deletion
  describe("Delete Section", () => {
    it("should delete section", async () => {
      if (!createdId) {
        throw new Error("No section ID available for testing");
      }

      const res = await request(app)
        .delete(`/api/v1/section/${createdId}`)
        .set("Cookie", cookies);



      expect(res.status).toBe(200);
      expect(res.body.message).toBe("section deleted successfully");
      createdId = null; // Clear the ID after deletion
    });

    it("should fail to delete non-existent section", async () => {
      const res = await request(app)
        .delete("/api/v1/section/6802624a669ef3d4c51ddbef")
        .set("Cookie", cookies);



      expect(res.status).toBe(404);
    });
  });
});
