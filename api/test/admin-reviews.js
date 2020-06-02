import { once } from "events";
import { randomBytes } from "crypto";

import request from "supertest";
import chai from "chai";

import connectMongoDb from "../src/mongodb.js";
import { app } from "../src/app.js";

const { expect } = chai;

describe("admin -> reviews routes", function () {
  /** @type {import('http').Server} */
  let server;
  let token;

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

  it("should assign reviews", async function () {
    const employeeToReview = "empl1@test.com";
    const employeeToAssign = "emp2@test.com";

    // delete existing employees if any
    await app.context.db
      .collection("Users")
      .deleteMany({ email: { $in: [employeeToReview, employeeToAssign] } });

    // create employees
    await request(server)
      .post("/admin/employees")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: employeeToReview,
        password: randomBytes(10).toString("hex"),
      })
      .expect(201);
    await request(server)
      .post("/admin/employees")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: employeeToAssign,
        password: randomBytes(10).toString("hex"),
      })
      .expect(201);

    // assign one to another
    await request(server)
      .put(`/admin/reviews/${employeeToReview}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        assignee: employeeToAssign,
      })
      .expect(200);
  });
});
