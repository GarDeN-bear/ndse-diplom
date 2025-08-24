import { mongoose } from "mongoose";

export default async function connectToMongoDb(url) {
  try {
    await mongoose.connect(url);
  } catch (error) {
    console.log("connectToMongoDb: Error: Connection is wrong!");
  }
}
