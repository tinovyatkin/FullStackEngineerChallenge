import { once } from "events";

import { app } from "./app.js";
import connectMongoDB from "./mongodb.js";

// connect MongoDB before starting server
await connectMongoDB(app);
// start listening
const server = app.listen(process.env.PORT || 3030);
await once(server, "listening");
app.context.log.info(`Server is listening on port ${server.address().port}`);
