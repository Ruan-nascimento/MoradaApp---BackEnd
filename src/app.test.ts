import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "./app";

describe("API", () => {
  it("deve responder quando acessar uma rota inexistente", async () => {
    const response = await request(app).get("/inexistente");

    expect(response.status).toBe(404);
  });
});