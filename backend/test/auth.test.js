import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../app.js"; // 引入 Express 应用程序
const should = chai.should();

chai.use(chaiHttp);

describe("Auth API", () => {
  describe("POST /auth/register", () => {
    it("should register a new user", (done) => {
      const user = {
        username: "testuser",
        email: "testuser@example.com",
        password: "testpassword",
      };
      chai
        .request(app)
        .post("/auth/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("token");
          done();
        });
    });
  });

  describe("POST /auth/login", () => {
    it("should log in the user", (done) => {
      const credentials = {
        email: "testuser@example.com",
        password: "testpassword",
      };
      chai
        .request(app)
        .post("/auth/login")
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("token");
          done();
        });
    });
  });
});
