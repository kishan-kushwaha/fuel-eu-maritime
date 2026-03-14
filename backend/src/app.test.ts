import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "./app.js";

describe("Fuel EU Maritime backend routes", () => {
  it("GET /health should return ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("GET /routes should return routes list", async () => {
    const response = await request(app).get("/routes");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("GET /routes/comparison should return comparison list", async () => {
    const response = await request(app).get("/routes/comparison");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("GET /compliance/cb?year=2025 should return compliance balance", async () => {
    const response = await request(app).get("/compliance/cb").query({ year: 2025 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("year", 2025);
    expect(response.body).toHaveProperty("currentBalance");
    expect(response.body).toHaveProperty("status");
  });

  it("GET /compliance/adjusted-cb?year=2025 should return pools list", async () => {
    const response = await request(app).get("/compliance/adjusted-cb").query({ year: 2025 });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});