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
    await request(server).get("/admin/employee").expect(401);
  });

  it("should allow authorized access", async function () {
    await request(server)
      .get("/admin/employee")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });
});
