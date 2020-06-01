import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";

import createLogger from "./log.js";

export const app = /** @type {Koa & { context: KoaContext }} */ (new Koa());
const router = new Router();

createLogger(app);

app.use(cors()).use(router.routes()).use(router.allowedMethods());
