import { auth } from "@/lib/auth";
import { expect, it } from "vitest";

it.skip("reguster", async () => {
  const res = await auth.api.signUpEmail({
    body: {
      email: "test@test.com",
      password: "testtest",
      name: "test",
    },
  });
  expect(res.user.id).toBeDefined();
});

it("login", async () => {
  const res = await auth.api.signInEmail({
    body: {
      email: "demo@demo.com",
      password: "demodemo",
    },
  });
  expect(res.user.id).toBeDefined();
});

export const getLoginSession = async () => {
  const res = await auth.api.signInEmail({
    body: {
      email: "demo@demo.com",
      password: "demodemo",
    },
  });
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${res.token}`);
  const session = await auth.api.getSession({
    headers,
  });
  return session;
};
