const app = require("../../app");
const supertest = require("supertest");
const userAuthModel = require("../../model/userAuthModel");
const connect = require("../database");

describe("It should verify user", () => {
  beforeAll(connect.connect);
  afterAll(connect.cleanup);
  afterAll(connect.disconnect);

  it("It should verify every new user", async () => {
    await userAuthModel.create({
      Username: "Kosi",
      UserType: "admin",
      Email: "ezeoyiri9212@gmail.com",
      PhoneNumber: 8111719006,
      Password: "kosi",
      IsVerify: false,
    });
    const response = await supertest(app)
      .post("/api/v1/auth-user/verify-user")
      .set("content-type", "application/json")
      .query({ Email: "ezeoyiri9212@gmail.com" });

    expect(response.status).toBe(200);
    expect(response.body.Massage).toBe("User Verified");
    expect(response.body.data.IsVerify).toBeTruthy();
  });

  it("It should user exist", async () => {
    await userAuthModel.create({
      Username: "Kosi",
      UserType: "admin",
      Email: "ezeoyiri9212@gmail.com",
      PhoneNumber: 8111719006,
      Password: "kosi",
      IsVerify: false,
    });
    const response = await supertest(app)
      .post("/api/v1/auth-user/verify-user")
      .set("content-type", "application/json")
      .query({ Email: "ezeoyiri921@gmail.com" });
    expect(response.status).toBe(404);
  });
});
