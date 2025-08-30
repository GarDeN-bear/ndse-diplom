import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import passport from "passport";
import session from "express-session";

import router from "./src/routers/index.js";
import connectToMongoDb from "./src/db/connection.js";
import initChatHandlers from "./src/server/communication.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

initChatHandlers(io);

app.use(session({ secret: "SECRET" }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(router);

const mongoUrl = process.env.ME_CONFIG_MONGODB_URL;

const port = process.env.PORT || 3000;

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

start(port, mongoUrl);
