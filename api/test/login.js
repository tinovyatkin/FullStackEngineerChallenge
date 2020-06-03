import { once } from "events";
import bcrypt from "bcrypt";
import request from "supertest";
import chai from "chai";

import connectMongoDb from "../src/mongodb.js";
import { app } from "../src/app.js";

const { expect } = chai;

describe("login unprotected routes", function () {
  /** @type {import('http').Server} */
  let server;
  let knownUserEmail = "test@user.com";
  let knownUserPassword = "test12244";

  before(async function () {
    // connecting to db
    await connectMongoDb(app);
    // launch server
    server = app.listen(0);
    await once(server, "listening");
    // creating known user
    await app.context.db.collection("Users").findOneAndUpdate(
      {
        email: knownUserEmail,
      },
      {
        $set: {
          email: knownUserEmail,
          password_hash: bcrypt.hashSync(knownUserPassword, 10),
          status: "active",
        },
      },
      { upsert: true }
    );
  });

  after(async function () {
    server.close();
  });

  it("should return token for known user", async function () {
    await request(server)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({
        email: knownUserEmail.toUpperCase(),
        password: knownUserPassword,
      })
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).to.be.string;
        expect(res.headers["set-cookie"]).to.be.instanceOf(Array);
        expect(res.headers["set-cookie"][0]).to.include("auth=");
      })
      .expect(200);
  });

  it("should return 401 for unknown user", async function () {
    await request(server)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({
        email: knownUserEmail,
        password: knownUserPassword.slice(1),
      })
      .expect(401);
  });
});
