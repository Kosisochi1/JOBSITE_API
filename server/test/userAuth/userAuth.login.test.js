const supertest = require("supertest");
const app = require("../../app");
const connect = require("../database");
const userAuthModel = require("../../model/userAuthModel");

describe("Should test Login endpoint", () => {
  beforeAll(connect.connect);
  afterEach(connect.cleanup);
  afterAll(connect.disconnect);

  it("It should login users", async () => {
    await userAuthModel.create({
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

    expect(response.status).toBe(200);
    expect(response.body.Massage).toBe("Login Successfull");
  });

  it("It should if req.body is empty", async () => {
    const response = await supertest(app)
      .post("/api/v1/auth-user/login")
      .set("content-type", "application/json")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Fill the empty Field");
  });
  it("It should check if user exist", async () => {
    const response = await supertest(app)
      .post("/api/v1/auth-user/login")
      .set("content-type", "application/json")
      .send({ Email: "ezeoyiri921@gmail.com", Password: "kosi" });

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("No User Found");
  });
});
