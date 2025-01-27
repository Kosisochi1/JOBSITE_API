const app = require("../../app");
const connect = require("../database");
const supertest = require("supertest");
const userAuthModel = require("../../model/userAuthModel");

describe("Should send reset password link", () => {
  beforeAll(connect.connect);
  afterEach(connect.cleanup);
  afterAll(connect.disconnect);

  it("It should check if user exist", async () => {
    await userAuthModel.create({
      Username: "Kosi",
      UserType: "admin",
      Email: "ezeoyiri9212@gmail.com",
      PhoneNumber: 8111719006,
      Password: "kosi",
    });

    const response = await supertest(app)
      .post("/api/v1/auth-user/forgot-password")
      .set("content-type", "application/json")
      .send({ Email: "ezeoyiri9212@gmail.com" });

    expect(response.status).toBe(200);
    expect(response.body.Massage).toBe(
      "Please !!! Check Your Mail  for Password Link"
    );
  });
  it("It should check if rquest body is empty", async () => {
    await userAuthModel.create({
      Username: "Kosi",
      UserType: "admin",
      Email: "ezeoyiri9212@gmail.com",
      PhoneNumber: 8111719006,
      Password: "kosi",
    });
    const response = await supertest(app)
      .post("/api/v1/auth-user/forgot-password")
      .set("content-type", "application/json")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Please Fill empty Feild");
  });
  it("It should return user not found", async () => {
    await userAuthModel.create({
      Username: "Kosi",
      UserType: "admin",
      Email: "ezeoyiri9212@gmail.com",
      PhoneNumber: 8111719006,
      Password: "kosi",
    });
    const response = await supertest(app)
      .post("/api/v1/auth-user/forgot-password")
      .set("content-type", "application/json")
      .send({ Email: "ezeoyiri921@gmail.com" });

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("User Not Found");
  });
});
