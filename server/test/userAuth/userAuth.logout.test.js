const app = require("../../app");
const supertest = require("supertest");
const connect = require("../database");

describe("Should log user out", () => {
  it("It should logout user", async () => {
    const response = await supertest(app)
      .get("/api/v1/auth-user/logout")
      .set("content-type", "application/json");

    expect(response.status).toBe(200);
  });
});
