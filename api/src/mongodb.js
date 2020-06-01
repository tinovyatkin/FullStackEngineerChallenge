import path from "path";
import { createRequire } from "module";
import { readdir } from "fs/promises";
import { fileURLToPath } from "url";

import mongo from "mongodb";

/**
 * @param {import('koa')} app
 * @param {string} [url]
 */
export default async (
  app,
  url = process.env.MONGOHQ_URL || "mongodb://localhost/paypay-challenge"
) => {
  const client = await mongo.MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    loggerLevel: process.env.NODE_ENV === "production" ? "error" : "warn",
    validateOptions: process.env.NODE_ENV !== "production",
  });
  const db = client.db();
  app.context.log.info(`MongoDB connected to ${new URL(url).hostname}`);

  // Configure JSON schemas
  const schemasDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "./schemas"
  );
  /** @type {[import('fs').Dirent[], { name: string }[]]} */
  const [schemas, collections] = await Promise.all([
    readdir(schemasDir, { withFileTypes: true }),
    db.listCollections({}, { nameOnly: true }).toArray(),
  ]);

  const loadJson = createRequire(import.meta.url);
  for (const file of schemas) {
    if (file.isDirectory() || path.extname(file.name) !== ".json") continue;
    // get collection name from schema file name
    const collection = path.basename(file.name, ".json");
    const schema = loadJson(path.join(schemasDir, file.name));

    try {
      if (!collections.find(({ name }) => name === collection)) {
        // creating collection for that scheme, that's mostly for tests
        await db.createCollection(collection, {
          validator: {
            $jsonSchema: schema,
          },
          validationLevel: "strict",
        });
      } else {
        // ok, let's try to add it to mongo
        await db.command({
          collMod: collection,
          validator: {
            $jsonSchema: schema,
          },
          validationLevel: "strict",
        });
      }
    } catch (err) {
      if (err.codeName !== "NamespaceExists") throw err;
    }
  }

  // create index for user email and email/password
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("users").createIndex({ email: 1, password: 1 });

  // save reference to global app context
  app.context.db = db;
};
