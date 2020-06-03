import Router from "koa-router";

export const employeeFeedbackRoutes = new Router({ prefix: "/feedback" });

/**
 * List of performance reviews requiring feedback
 */
employeeFeedbackRoutes.get(
  "/",
  /**
   * @param {KoaContext} ctx
   * @param {Function} next
   */
  async (ctx, next) => {
    const {
      itemsPerPage = 20,
      page = 1,
      sortBy = "created_at",
      sortDesc = "1",
    } = ctx.query;

    // getting total number of reviews
    const total = await ctx.db.collection("Reviews").countDocuments({
      assignee: ctx.state.user.email,
      "feedback.author": { $ne: ctx.state.user.email },
    });

    const reviews = await ctx.db
      .collection("Reviews")
      .find({
        assignee: ctx.state.user.email,
        "feedback.author": { $ne: ctx.state.user.email },
      })
      .sort({ [sortBy]: parseInt(sortDesc, 10) })
      .skip((parseInt(page, 10) - 1) * parseInt(itemsPerPage, 10))
      .limit(Math.max(0, parseInt(itemsPerPage, 10)));

    ctx.status = 200;
    ctx.body = {
      total,
      reviews: (await reviews.toArray()).map((review) => ({
        ...review,
        created_at: review.created_at.getTime(),
      })),
    };
    return next();
  }
);
