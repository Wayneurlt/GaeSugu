import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it, mock } from "node:test";
import { checkCredentials, createSession, verifySession } from "@/lib/admin/auth";

const saved = { ...process.env };
const setEnv = (values: Record<string, string>) => Object.assign(process.env, values);

describe("admin sign-in", () => {
  beforeEach(() =>
    setEnv({
      ADMIN_EMAIL: "admin@example.com",
      ADMIN_PASSWORD: "correct horse battery staple",
      AUTH_SECRET: "test-secret-that-is-long-enough",
    }),
  );
  afterEach(() => {
    process.env = { ...saved };
    mock.timers.reset();
  });

  it("accepts the right email (any case, extra spaces) and password", async () => {
    assert.equal(await checkCredentials("admin@example.com", "correct horse battery staple"), true);
    assert.equal(await checkCredentials("  Admin@Example.com ", "correct horse battery staple"), true);
  });

  it("refuses a wrong email or password", async () => {
    assert.equal(await checkCredentials("admin@example.com", "wrong"), false);
    assert.equal(await checkCredentials("someone@example.com", "correct horse battery staple"), false);
    assert.equal(await checkCredentials("", ""), false);
  });

  it("issues sessions that verify, and rejects tampered ones", async () => {
    const token = await createSession();
    assert.equal(await verifySession(token), true);
    assert.equal(await verifySession(`${token}x`), false);
    const [expires, sig] = token.split(".");
    assert.equal(await verifySession(`${Number(expires) + 100000}.${sig}`), false);
    assert.equal(await verifySession(undefined), false);
    assert.equal(await verifySession("garbage"), false);
  });

  it("rejects sessions after they expire (12 hours)", async () => {
    const token = await createSession();
    mock.timers.enable({ apis: ["Date"], now: Date.now() + 13 * 60 * 60 * 1000 });
    assert.equal(await verifySession(token), false);
  });

  it("signs everyone out when the secret changes", async () => {
    const token = await createSession();
    setEnv({ AUTH_SECRET: "a-different-secret" });
    assert.equal(await verifySession(token), false);
  });
});
