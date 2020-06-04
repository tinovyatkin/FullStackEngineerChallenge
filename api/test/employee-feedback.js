import { once } from "events";

import request from "supertest";
import chai from "chai";

import connectMongoDb from "../src/mongodb.js";
import { app } from "../src/app.js";

const { expect } = chai;

describe("employee -> feedback routes", function () {
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
        email: "employee@test.com",
        password: "employee1",
      })
      .expect(200);
    token = body.token;
    expect(body.roles).to.include("employee");
  });

  after(async function () {
    server.close();
  });

  it("should return list of performance reviews requiring feedback", async function () {
    // create employees
    await request(server)
      .get("/employee/feedback")
      .set("Authorization", `Bearer ${token}`)
      .query({
        sortBy: "employee",
        sortDesc: -1,
        itemsPerPage: 7,
      })
      .expect(({ body }) => {
        expect(body.total).to.be.greaterThan(0);
        // check it respected pagination
        expect(body.reviews).to.have.length(7);
        // make sure it sorted descending
        expect(body.reviews[0].employee).to.match(/^z/i);
      })
      .expect(200);
  });
});
