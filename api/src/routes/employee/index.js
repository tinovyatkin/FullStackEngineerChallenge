import Router from "koa-router";
import { employeeFeedbackRoutes } from "./feedback.js";

export const employeeRoutes = new Router({ prefix: "/employee" });

// make sure user has an admin role
employeeRoutes.use(async (ctx, next) => {
  ctx.assert(
    ctx.state.user?.roles?.includes("employee"),
    401,
    `Access denied - not enoughs rights`
  );
  return next();
});

employeeRoutes
  .use(employeeFeedbackRoutes.routes())
  .use(employeeFeedbackRoutes.allowedMethods());
