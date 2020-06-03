import Router from "koa-router";
import bcrypt from "bcrypt";
import normalizeEmail from "validator/lib/normalizeEmail.js";
import jwt from "jsonwebtoken";

export const loginRoutes = new Router({ prefix: "/login" });

loginRoutes.post(
  "/",
  /**
   * @param {KoaContext} ctx
   * @param {Function} next
   */
  async (ctx) => {
    const { email, password } = ctx.request.body;
    ctx.assert(
      typeof email === "string" && email.length > 3,
      422,
      `User email is required`
    );
    ctx.assert(
      typeof password === "string" && password.length > 1,
      422,
      `Password is required`
    );
    // getting user from db
    const user = await ctx.db
      .collection("Users")
      .findOne(
        { email: normalizeEmail(email), status: "active" },
        { projection: { password_hash: 1, email: 1, roles: 1, _id: 0 } }
      );
    ctx.assert(user, 401, `User ${user} is unknown or inactive`);
    const match = await bcrypt.compare(password, user.password_hash);
    ctx.assert(match, 401, `Invalid password or username`);

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "5h" });
    ctx.status = 200;
    ctx.body = {
      token,
    };

    // save it to the cookie too
    ctx.cookies.set("auth", token);
  }
);
