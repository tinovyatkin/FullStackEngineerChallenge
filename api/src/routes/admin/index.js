import Router from "koa-router";
import { adminEmployeeRoutes } from "./employees.js";
import { adminReviewsRoutes } from "./reviews.js";

export const adminRoutes = new Router({ prefix: "/admin" });

// make sure user has an admin role
adminRoutes.use(async (ctx, next) => {
  ctx.assert(
    ctx.state.user?.roles?.includes("admin"),
    401,
    `Access denied - not enoughs rights`
  );
  return next();
});

adminRoutes
  .use(adminEmployeeRoutes.routes())
  .use(adminEmployeeRoutes.allowedMethods())
  .use(adminReviewsRoutes.routes())
  .use(adminReviewsRoutes.allowedMethods());
