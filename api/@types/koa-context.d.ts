/**
 * Interface for our extended KoaContext
 * That we've extended via adjusting app.context at '../apps/app.js'
 *
 * DON'T USE Top-level imports here to keep this interface global
 */

declare type KoaContext = {
  db: import("mongodb").Db;
  log: import("winston").Logger;
} & import("koa-router").IRouterContext;
