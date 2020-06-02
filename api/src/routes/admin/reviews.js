import Router from "koa-router";
import normalizeEmail from "validator/lib/normalizeEmail.js";
import isEmail from "validator/lib/isEmail.js";

export const adminReviewsRoutes = new Router({ prefix: "/reviews" });

/**
 * Assign employees to participate in another employee's performance review
 */
adminReviewsRoutes.put(
  "/:employeeToReview",
  /**
   * @param {KoaContext} ctx
   * @param {Function} next
   */
  async (ctx, next) => {
    const { assignee } = ctx.request.body;
    ctx.assert(
      isEmail(ctx.params.employeeToReview),
      422,
      `Email of employee to review is in wrong format`
    );
    ctx.assert(
      isEmail(assignee),
      422,
      `Email of assigned employee is required`
    );

    // ensure that both, reviewer and objective are known users
    const count = await ctx.db.collection("Users").countDocuments({
      email: {
        $in: [
          normalizeEmail(ctx.params.employeeToReview),
          normalizeEmail(assignee),
        ],
      },
      status: "active",
    });
    ctx.assert(count === 2, 404, `Both employees must be in out database`);

    const review = await ctx.db.collection("Reviews").findOneAndUpdate(
      {
        employee: normalizeEmail(ctx.params.employeeToReview),
      },
      {
        $currentDate: { updated_at: true },
        $addToSet: { assignee: normalizeEmail(assignee) },
        $setOnInsert: { created_at: new Date() },
      },
      { upsert: true }
    );
    ctx.assert(review.ok === 1, 411);

    ctx.status = 200;
    ctx.body = {
      id: review.value?._id,
    };

    return next();
  }
);
