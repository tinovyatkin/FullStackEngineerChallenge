import Koa from "koa";
import cors from "@koa/cors";
import bodyparser from "koa-bodyparser";

import createLogger from "./log.js";
import { router } from "./routes/index.js";

export const app = /** @type {Koa & { context: KoaContext }} */ (new Koa());

createLogger(app);

app.on("error", (err) => {
  app.context.log.error(err);
});
app
  .use(cors())
  .use(
    bodyparser({
      onerror(err) {
        app.context.log.error(err);
      },
    })
  )
  .use(router.routes())
  .use(router.allowedMethods());
