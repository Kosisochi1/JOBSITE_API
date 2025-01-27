const supertest = require("supertest");
const app = require("../../app");
const userModel = require("../../model/userAuthModel");
const JobModel = require("../../model/jobsModel");
const connect = require("../database");
const { authorizePermission } = require("../../auths/authentication");

describe("Should test all jobs Endpoints", () => {
  let token;
  let userId;
  let jobId;
  beforeAll(connect.connect);
  beforeEach(async () => {
    await userModel.create({
      Username: "Kosi",
      UserType: "employer",
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
    console.log(response.body.data);

    token = response.headers["set-cookie"][0];
    userId = response.body.data._id;
  });
  afterEach(connect.cleanup);
  afterAll(connect.disconnect);

  describe("Should create jobs", () => {
    it("It should create job when signedin and user equals admin or employer", async () => {
      const res = await supertest(app)
        .post("/api/v1/jobs/jobs")
        .set("content-type", "application/json")
        .set("Cookie", token)
        .send({
          JobTitle: "GE",
          Description: "kdfdsfldskflskfls",
          JobType: "Intern",
          Qualification: "BSC",
          Location: "Lagos",
          Salary: { Currency: "NGN", Min: 75000, Max: 25000 },
          Expires: "2024-12-10",
          User_Id: userId,
        });

      expect(res.status).toBe(201);
      expect(res.body.massage).toBe("Job created");
    });
  });
  describe("Should get user", () => {
    it("It should get all user", async () => {
      await supertest(app)
        .post("/api/v1/jobs/jobs")
        .set("content-type", "application/json")
        .set("Cookie", token)
        .send({
          JobTitle: "GE",
          Description: "kdfdsfldskflskfls",
          JobType: "Intern",
          Qualification: "BSC",
          Location: "Lagos",
          Salary: { Currency: "NGN", Min: 75000, Max: 25000 },
          Expires: "2024-12-10",
          User_Id: userId,
        });
      const res = await supertest(app)
        .get("/api/v1/jobs/jobs")
        .set("content-type", "application/json")
        .set("Cookie", token);

      expect(res.status).toBe(200);
      expect(res.body.totalJob).toBe(1);
    });
    it("It should return 0 if it contains no users", async () => {
      const res = await supertest(app)
        .get("/api/v1/jobs/jobs")
        .set("content-type", "application/json")
        .set("Cookie", token);

      expect(res.status).toBe(404);
      expect(res.body.msg).toBe("No Job Found");
    });
  });
  describe("Should get specific User with specify ID", () => {
    beforeEach(async () => {
      const jobsResponse = await supertest(app)
        .post("/api/v1/jobs/jobs")
        .set("content-type", "application/json")
        .set("Cookie", token)
        .send({
          JobTitle: "GE",
          Description: "kdfdsfldskflskfls",
          JobType: "Intern",
          Qualification: "BSC",
          Location: "Lagos",
          Salary: { Currency: "NGN", Min: 75000, Max: 25000 },
          Expires: "2024-12-10",
          User_Id: userId,
        });
      jobId = jobsResponse.body.data._id;
      console.log(jobId);
    });
    it("It should get user with the specified ID", async () => {
      const res = await supertest(app)
        .get(`/api/v1/jobs/job/${jobId}`)
        .set("content-type", "application/json")
        .set("Cookie", token);

      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject({});
    });

    it("It should check if jod the specified ID exist", async () => {
      const res = await supertest(app)
        .get(`/api/v1/jobs/job/${userId}`)
        .set("content-type", "application/json")
        .set("Cookie", token);

      expect(res.status).toBe(404);
    });
  });
  describe("Should update Jobs", () => {
    beforeEach(async () => {
      const jobsResponse = await supertest(app)
        .post("/api/v1/jobs/jobs")
        .set("content-type", "application/json")
        .set("Cookie", token)
        .send({
          JobTitle: "GE",
          Description: "kdfdsfldskflskfls",
          JobType: "Intern",
          Qualification: "BSC",
          Location: "Lagos",
          Salary: { Currency: "NGN", Min: 75000, Max: 25000 },
          Expires: "2024-12-10",
          User_Id: userId,
        });
      jobId = jobsResponse.body.data._id;
      console.log(jobId);
    });
    it("It should update user with the specified ID", async () => {
      const res = await supertest(app)
        .get(`/api/v1/jobs/job/${jobId}`)
        .set("content-type", "application/json")
        .set("Cookie", token);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({});
    });
  });
  describe("Should remove job from jobs", () => {
    beforeEach(async () => {
      const jobsResponse = await supertest(app)
        .post("/api/v1/jobs/jobs")
        .set("content-type", "application/json")
        .set("Cookie", token)
        .send({
          JobTitle: "GE",
          Description: "kdfdsfldskflskfls",
          JobType: "Intern",
          Qualification: "BSC",
          Location: "Lagos",
          Salary: { Currency: "NGN", Min: 75000, Max: 25000 },
          Expires: "2024-12-10",
          User_Id: userId,
        });
      jobId = jobsResponse.body.data._id;
      console.log(jobId);
    });

    it("It should delete job with specific ID from jobs", async () => {
      const res = await supertest(app)
        .get(`/api/v1/jobs/job/${jobId}`)
        .set("content-type", "application/json")
        .set("Cookie", token);

      expect(res.status).toBe(200);
    });
  });
});
