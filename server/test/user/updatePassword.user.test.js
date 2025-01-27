const app = require("../../app");
const userModel = require("../../model/userAuthModel");
const supertest = require("supertest");
const connect = require("../database");

describe("Should update password", () => {
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

  it("It should update user Password", async () => {
    const res = await supertest(app)
      .patch("/api/v1/users/updatePassword")
      .set("content-type", "application/json")
      .set("Cookie", token)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Invalid Fields");
  });

  it("It should update user password", async () => {
    const res = await supertest(app)
      .patch("/api/v1/users/updatePassword")
      .set("content-type", "application/json")
      .set("Cookie", token)
      .send({ oldPassword: "kosi", newPassword: "kamsi" });

    expect(res.status).toBe(200);
    expect(res.body.msg).toBe("Password Successfull Change");
  });
});
