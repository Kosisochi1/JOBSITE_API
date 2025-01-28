const app = require("../../app");
const supertest = require("supertest");
const connect = require("../database");
const userModel = require("../../model/userAuthModel");
const applicationModel = require("../../model/applicationModel");
const jobsModel = require("../../model/jobsModel");

describe("Should test all job aplication endpoints", () => {
  let token;
  let userId;
  let jobId;
  let applicationId;
  let fakeId;
  let deleteId;

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
  });
  afterEach(connect.cleanup);
  afterAll(connect.disconnect);

  describe("Should test job apply endpoint", () => {
    it("It should apply for job", async () => {
      const resp = await supertest(app)
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
        });

      expect(resp.status).toBe(200);
      expect(resp.body.massage).toBe("Application submited");
    });
    it("It should check if req body contains Firstname,Lastname and Email", async () => {
      const resp = await supertest(app)
        .post(`/api/v1/applications/jobs/${jobId}`)
        .set("content-type", "application/json")
        .set("Cookie", token)
        .send({
          //  LastName: "Kenn",
          //  FirstName: "Kosi",
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
          //  Email: "emma@gmail.com",
          Status: "Interviewed",
        });

      expect(resp.status).toBe(400);
      expect(resp.body.msg).toBe("Check empty Fields");
    });
  });
  describe("Should test update endpoint", () => {
    // beforeAll(async () => {

    // });

    it("It should test jobs update", async () => {
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
        });
      applicationId = jobResponse.body.data._id;
      const response = await supertest(app)
        .patch(`/api/v1/applications/jobs/${applicationId}`)
        .set("content-type", "application/json")
        .set("Cookie", token)
        .send({ LastName: "Kamsi", FirstName: "Kenn" });
      expect(response.status).toBe(200);
      expect(response.body.massage).toBe("APplication Updated");
    });
    it("It should check if application already exist", async () => {
      fakeId = "123456";
      const response = await supertest(app)
        .patch(`/api/v1/applications/jobs/${applicationId}`)
        .set("content-type", "application/json")
        .set("Cookie", token)
        .send({ LastName: "Kamsi", FirstName: "Kenn" });
      expect(response.status).toBe(404);
      expect(response.body.msg).toBe(`No application with ID:${applicationId}`);
    });
  });
  describe("Should test all job application  endpoint", () => {
    it("It should get all applied job", async () => {
      await supertest(app)
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
        });
      const response = await supertest(app)
        .get("/api/v1/applications/jobs")
        .set("content-type", "application/json")
        .set("Cookie", token);
      expect(response.status).toBe(200);
      expect(response.body.massage).toBe("All Applications");
    });
    it("It should check if there is any application", async () => {
      const response = await supertest(app)
        .get("/api/v1/applications/jobs")
        .set("content-type", "application/json")
        .set("Cookie", token);

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Nothing Found");
    });
  });
  describe("Should test Single User end point", () => {
    it("It should get a specific applied job", async () => {
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
        });
      applicationId = jobResponse.body.data._id;

      const response = await supertest(app)
        .get(`/api/v1/applications/job/${applicationId}`)
        .set("content-type", "application/json")
        .set("Cookie", token);
      expect(response.status).toBe(200);
      // expect(response.body.massage).toBe("All Applications");
    });
  });
});
