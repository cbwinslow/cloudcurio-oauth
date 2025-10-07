import { describe, it, expect, vi } from "vitest";
import { get as statusEndpoint } from "../pages/api/status";

describe("GET /api/status", () => {
  it("should return status ok when db is connected", async () => {
    const mockDb = {
      prepare: () => ({
        first: vi.fn().mockResolvedValue({ 1: 1 }),
      }),
    };

    const locals = {
      runtime: {
        env: {
          DB: mockDb,
        },
      },
    };

    const context = {
      locals,
      request: new Request("http://localhost/api/status"),
    };

    // @ts-ignore
    const response = await statusEndpoint(context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ status: "ok" });
  });

  it("should return status error when db connection fails", async () => {
    const mockDb = {
      prepare: () => ({
        first: vi.fn().mockRejectedValue(new Error("DB error")),
      }),
    };

    const locals = {
      runtime: {
        env: {
          DB: mockDb,
        },
      },
    };

    const context = {
      locals,
      request: new Request("http://localhost/api/status"),
    };

    // @ts-ignore
    const response = await statusEndpoint(context);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ status: "error" });
  });
});