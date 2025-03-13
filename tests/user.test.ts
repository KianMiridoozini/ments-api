import { test, expect } from "@playwright/test";

export default function userTestCollection() {
  test("Valid user regitration info", async ({ request }) => {
    
    test.setTimeout(10_000);

    // Arrange
    const user = {
      name: "John Doe",
      email: "mail@doe.com",
      password: "12345678",
    };

    // Act
    const response = await request.post("/api/user/register", { data: user });
    const json = await response.json();

    // Assert
    expect(response.status()).toBe(201);
    expect(json.error).toEqual(null);

  });
}
