// const { connect } = require("../database");
const supertest = require("supertest");
const app = require("../../app");
const userAuthModel = require("../../model/userAuthModel");
const connect = require("../database");
// const { connect } = require("../../database");

// Test Suit  for UserAuth

describe("Should test signup endpoint", () => {
  beforeAll(connect.connect);
  afterAll(connect.cleanup);

  afterAll(connect.disconnect);

  it("It should register users", async () => {
    const response = await supertest(app)
      .post("/api/v1/auth-user/create-user")
      .set("content-type", "application/json")
      .send({
        Username: "Kosi",
        Email: "ezeoyiri921@gmail.com",
        Password: "kosi",
        PhoneNumber: "08111719006",
        UserType: "employer",
      });

    expect(response.status).toBe(201);
    expect(response.body.Massage).toBe("Check your Mail to Validate");
    expect(response.body.data).toMatchObject({
      Username: "Kosi",
      UserType: "admin",
      Email: "ezeoyiri921@gmail.com",
      PhoneNumber: 8111719006,
    });
  }, 10000);
  it("It should check if user already existed", async () => {
    await userAuthModel.create({
      Username: "Kosi",
      UserType: "admin",
      Email: "ezeoyiri9212@gmail.com",
      PhoneNumber: 8111719006,
    });
    const response = await supertest(app)
      .post("/api/v1/auth-user/create-user")
      .set("content-type", "application/json")
      .send({
        Username: "Kosi",
        Email: "ezeoyiri921@gmail.com",
        Password: "kosi",
        PhoneNumber: "08111719006",
        UserType: "employer",
      });
    expect(response.status).toBe(409);
    expect(response.body.msg).toBe("User already exist");
  });

  it("It should check if this first user ", async () => {
    await userAuthModel.create({
      Username: "Kosi",
      UserType: "admin",
      Email: "ezeoyiri9212@gmail.com",
      PhoneNumber: 8111719006,
    });
    const response = await supertest(app)
      .post("/api/v1/auth-user/create-user")
      .set("content-type", "application/json")
      .send({
        Username: "Kosi",
        UserType: "admin",
        Email: "ezeoyiri9212@gmail.com",
        PhoneNumber: 8111719006,
      });
    expect(response.status).toBe(409);
  });
});
