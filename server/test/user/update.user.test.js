const app = require("../../app");
const userModel = require("../../model/userAuthModel");
const supertest = require("supertest");
const connect = require("../database");

describe("Should check for user Update", () => {
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

  it("It should check if the request body contains Email and Username", async () => {
    const res = await supertest(app)
      .patch("/api/v1/users/updateUser")
      .set("content-type", "application/json")
      .set("Cookie", token)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Invalid Fields");
  });

  it("It should update User", async () => {
    const res = await supertest(app)
      .patch("/api/v1/users/updateUser")
      .set("content-type", "application/json")
      .set("Cookie", token)
      .send({
        Username: "Kosiii",
        Email: "ezeoyiri9212@gmail.com",
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      Email: "ezeoyiri9212@gmail.com",
      UserType: "admin",
    });
  });
});
