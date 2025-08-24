import express from "express";

import router from "./src/routers/index.js";
import connectToMongoDb from "./src/db/connection.js";

const app = express();

app.use(express.json());
app.use(router);

const mongoUrl = process.env.ME_CONFIG_MONGODB_URL;

const port = process.env.PORT || 3000;

async function start(port, mongoUrl) {
  try {
    await connectToMongoDb(mongoUrl);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("Error connection to server!");
  }
}

start(port, mongoUrl);
