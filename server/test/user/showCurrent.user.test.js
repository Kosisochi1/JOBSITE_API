const app = require("../../app");
const userModel = require("../../model/userAuthModel");
const supertest = require("supertest");
const connect = require("../database");

describe("Should show the current User", () => {
  let token;
  beforeAll(connect.connect);
  beforeEach(async () => {
    await userModel.create({
      Username: "Kosi",
      UserType: "admin",
      Email: "ezeoyiri9212@gmail.com",
      PhoneNumber: 8111719006,
      Password: "kosi",
      IsVerify: true,
    });
    const response = await supertest(app)
      .post("/api/v1/auth-user/login")
      .set("content-type", "application/json")
      .send({
        Email: "ezeoyiri9212@gmail.com",
        Password: "kosi",
      });

    token = response.headers["set-cookie"][0];
  });
  afterEach(connect.cleanup);
  afterAll(connect.disconnect);

  it("It should show current user", async () => {
    const res = await supertest(app)
      .get("/api/v1/users/currentUser")
      .set("content-type", "application/json")
      .set("Cookie", token);

    expect(res.status).toBe(200);
  });
});
