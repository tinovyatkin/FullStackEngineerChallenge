import { once } from "events";
import request from "supertest";
import chai from "chai";

import connectMongoDb from "../src/mongodb.js";
import { app } from "../src/app.js";

const { expect } = chai;

describe("admin -> employees routes", function () {
  /** @type {import('http').Server} */
  let server;
  let token;
  let knownUserEmail = "employee@test.com";
  let knownUserPassword = "test12244";

  before(async function () {
    // connecting to db
    await connectMongoDb(app);
    // launch server
    server = app.listen(0);
    await once(server, "listening");

    // getting admin token
    const { body } = await request(server)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({
        email: "admin@test.com",
        password: "admin",
      })
      .expect(200);
    token = body.token;
  });

  after(async function () {
    server.close();
  });

  it("should not allow unauthorized access", async function () {
    await request(server).get("/admin/employees").expect(401);
  });

  it("should allow authorized access", async function () {
    await request(server)
      .get("/admin/employees")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("should create an employee", async function () {
    // delete existing employee if any
    await app.context.db
      .collection("Users")
      .findOneAndDelete({ email: knownUserEmail });

    await request(server)
      .post("/admin/employees")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: knownUserEmail,
        password: knownUserPassword,
      })
      .expect(201);
  });

  it("should not allow an employee to access admin routes", async function () {
    // get employee token
    const { body } = await request(server)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({
        email: knownUserEmail,
        password: knownUserPassword,
      })
      .expect(200);
    // try to access admin route with this token
    await request(server)
      .get("/admin/employees")
      .set("Authorization", `Bearer ${body.token}`)
      .expect(/not enoughs rights/i)
      .expect(401);
  });

  it("should return list of all employees", async function () {
    await request(server)
      .get("/admin/employees")
      .set("Authorization", `Bearer ${token}`)
      .expect((res) => {
        expect(res.body).to.be.instanceOf(Array);
        expect(res.body.length).to.be.greaterThan(0);
        const user = res.body.find((u) => u.email === knownUserEmail);
        expect(user).not.to.be.null;
      })
      .expect(200);
  });

  it("should delete user", async function () {
    await request(server)
      .delete(`/admin/employees/${knownUserEmail}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(202);
  });

  it("should return 404 for unknown/deleted employee", async function () {
    await request(server)
      .delete(`/admin/employees/${knownUserEmail}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});
