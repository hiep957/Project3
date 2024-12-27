import request from "supertest";
import { app } from '../index';
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

describe("POST /signup", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it("should register a new user successfully", async () => {
    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "John",
        surname: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        confirmPassword: "password123",
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("Registration successful");
  });

  it("should return error if passwords do not match", async () => {
    const response = await request(app)
      .post("/signup")
      .send({
        name: "John",
        surname: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        confirmPassword: "password124",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Passwords do not match");
  });
});
