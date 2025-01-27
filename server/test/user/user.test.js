const app = require("../../app");
const userModel = require("../../model/userAuthModel");
const supertest = require("supertest");
const connect = require("../database");

describe("Should test all Users endpoint", () => {
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
  });
  afterEach(connect.cleanup);
  afterAll(connect.disconnect);

  it("It should get all users", async () => {
    const responses = await supertest(app)
      .post("/api/v1/auth-user/login")
      .set("content-type", "application/json")
      .send({
        Email: "ezeoyiri9212@gmail.com",

        Password: "kosi",
      });
    const token = responses.headers["set-cookie"][0];

    const response = await supertest(app)
      .get("/api/v1/users/allUsers")
      .set("content-type", "application/json")
      .set("Cookie", token);

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({});
  });
});
