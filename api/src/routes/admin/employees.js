import Router from "koa-router";
import normalizeEmail from "validator/lib/normalizeEmail.js";
import isEmail from "validator/lib/isEmail.js";
import bcrypt from "bcrypt";

export const adminEmployeeRoutes = new Router({ prefix: "/employees" });

/**
 * Create new employee
 */
adminEmployeeRoutes.post(
  "/",
  /**
   * @param {KoaContext} ctx
   * @param {Function} next
   */
  async (ctx, next) => {
    const { email, password } = ctx.request.body;
    ctx.assert(email, 422, `Email is required`);
    ctx.assert(password, 422, `Password is required`);
    // try to insert it into the database
    // it will throw if user already exists
    const user = await ctx.db.collection("Users").insertOne({
      email: normalizeEmail(email),
      password_hash: await bcrypt.hash(password, 10),
      status: "active",
      roles: ["employee"],
    });
    ctx.status = 201; // created
    ctx.body = {
      id: user._id,
    };
    return next();
  }
);

/**
 * List all employees
 */
adminEmployeeRoutes.get(
  "/",
  /**
   * @param {KoaContext} ctx
   * @param {Function} next
   * @param netx
   */
  async (ctx, next) => {
    // getting all active users with employee role
    const { paginate = 20, page = 0 } = ctx.query;
    const users = await ctx.db.collection("Users").find(
      { roles: "employee", status: "active" },
      {
        limit: paginate,
        skip: page * paginate,
        sort: { email: 1 },
        projection: { email: 1, name: 1 },
      }
    );

    ctx.status = 200;
    ctx.body = await users.toArray();
    return next();
  }
);

/**
 * Remove an employee
 */
adminEmployeeRoutes.delete(
  "/:email",
  /**
   * @param {KoaContext} ctx
   * @param {Function} next
   */
  async (ctx, next) => {
    const { email } = ctx.params;
    ctx.assert(isEmail(email), 422, `Employee email is required`);

    const user = await ctx.db.collection("Users").findOneAndUpdate(
      {
        email: normalizeEmail(email),
        status: { $ne: "deleted" },
      },
      {
        $set: {
          status: "deleted",
        },
      },
      { projection: { _id: 1 } }
    );

    ctx.assert(
      user.lastErrorObject?.updatedExisting,
      404,
      `Unknown or deleted user`
    );
    ctx.status = 202; // resource marked for deletion
    ctx.body = { id: user._id };
    return next();
  }
);
