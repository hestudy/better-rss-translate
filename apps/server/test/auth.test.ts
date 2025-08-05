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
