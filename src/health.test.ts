import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "./app";

describe("Health Check", () => {
  it("deve retornar status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      message: "API funcionando",
    });
  });
});