import Router from "koa-router";
import jwt from "koa-jwt";

import { loginRoutes } from "./login/index.js";
import { adminRoutes } from "./admin/index.js";
export const router = new Router();

// registering unprotected login route
router.use(loginRoutes.routes()).use(loginRoutes.allowedMethods());

// protect following routes
router.use(jwt({ secret: process.env.JWT_SECRET, cookie: "auth" }));

router.use(adminRoutes.routes()).use(adminRoutes.allowedMethods());
