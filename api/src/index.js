import { once } from "events";
import { app } from "./app.js";
import connectMongoDB from "./mongodb.js";

const server = app.listen(process.env.PORT || 3030);
await Promise.all([once(server, "listening"), connectMongoDB(app)]);
app.context.log.info(`Server is listening on port ${server.address().port}`);
