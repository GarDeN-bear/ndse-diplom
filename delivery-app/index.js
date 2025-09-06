import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import passport from "passport";
import session from "express-session";
import path from "path";

import config from "./config/index.js";
import router from "./src/routers/index.js";
import connectToMongoDb from "./src/db/connection.js";
import initChatHandlers from "./src/server/communication.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

initChatHandlers(io);

app.use(session(config.auth.session));
app.use(passport.initialize());
app.use(passport.session());

app.use(
  "/upload",
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authorized");
    }
    next();
  },
  express.static(path.join(process.cwd(), "upload"))
);

app.use(express.json());
app.use(router);

async function start(port, mongoUrl) {
  try {
    await connectToMongoDb(mongoUrl);
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("Error connection to server!");
  }
}

start(config.server.port, config.mongo.mongoUrl);
