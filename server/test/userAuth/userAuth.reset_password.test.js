const app = require("../../app");
const connect = require("../database");
const supertest = require("supertest");
const userAuthModel = require("../../model/userAuthModel");

describe("Should reset password", () => {
  beforeAll(connect.connect);
  afterEach(connect.cleanup);
  afterAll(connect.disconnect);

  it("It should check if req.body is empty", async () => {
    await userAuthModel.create({
      Username: "Kosi",
      UserType: "admin",
      Email: "ezeoyiri9212@gmail.com",
      PhoneNumber: 8111719006,
      Password: "kosi",
    });

    const response = await supertest(app)
      .post("/api/v1/auth-user/reset-password")
      .set("content-type", "application/json")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Please fill empty Feild");
  });

  it("It should reset password", async () => {
    const resp = await supertest(app)
      .post("/api/v1/auth-user/reset-password")
      .set("content-type", "application/json")
      .send({ Email: "ezeoyiri9212@gmail.com", newPassword: "kos" });

    expect(resp.status).toBe(200);
    expect(resp.body.Massage).toBe("Pasword Changed Successfull");
  });
});
