const app = require("../../app");
const supertest = require("supertest");
const connect = require("../database");
const userModel = require("../../model/userAuthModel");
const applicationModel = require("../../model/applicationModel");
const jobsModel = require("../../model/jobsModel");

describe("Should test remove job end point", () => {
  let token;
  let userId;
  let jobId;
  let applicationId;

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
    // console.log(response.body.data);

    token = response.headers["set-cookie"][0];
    userId = response.body.data._id;
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
    jobId = res.body.data._id;
    const jobResponse = await supertest(app)
      .post(`/api/v1/applications/jobs/${jobId}`)
      .set("content-type", "application/json")
      .set("Cookie", token)
      .send({
        LastName: "Kenn",
        FirstName: "Kosi",
        Education: [
          {
            InstitutionName: "ESUT",
            Start: "2011-08-24",
            End: "2016-06-27",
          },
        ],
        Experience: [
          {
            NameOfCompany: "NBC",
            Start: "2018-03-23",
            End: "2020-04-20",
          },
        ],
        Email: "emma@gmail.com",
        Status: "Interviewed",
        User_Id: userId,
      });
    applicationId = jobResponse.body.data._id;
  });
  afterEach(connect.cleanup);
  afterAll(connect.disconnect);

  describe("Should remove Application", () => {
    it("It should remove applied job", async () => {
      const response = await supertest(app)
        .delete(`/api/v1/applications/job/${applicationId}`)
        .set("content-type", "application/json")
        .set("Cookie", token);
      //   expect(response.status).toBe(200);
      expect(response.body).toBe("Deleted");
    });
  });
});
