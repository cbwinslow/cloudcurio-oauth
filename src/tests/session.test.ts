import { describe, it, expect, vi } from "vitest";
import { setSessionCookie, destroySessionCookie } from "../utils/session";

describe("session utilities", () => {
  const mockCookies = {
    set: vi.fn(),
  };

  it("should set a session cookie with the correct parameters", () => {
    const sessionId = "test-session-id";
    setSessionCookie(mockCookies, sessionId);

    expect(mockCookies.set).toHaveBeenCalledWith("session", sessionId, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });
  });

  it("should destroy a session cookie", () => {
    destroySessionCookie(mockCookies);

    expect(mockCookies.set).toHaveBeenCalledWith("session", "", {
      path: "/",
      maxAge: 0,
    });
  });
});