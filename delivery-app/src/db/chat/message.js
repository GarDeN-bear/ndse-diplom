import { Schema, Types } from "mongoose";

const messageSchema = new Schema({
  author: {
    type: Types.ObjectId,
    required: true,
    unique: false,
  },
  sentAt: {
    type: Date,
    required: true,
    unique: false,
  },
  text: {
    type: String,
    required: true,
    unique: false,
  },
  readAt: {
    type: Date,
    required: false,
    unique: false,
  },
});

export default messageSchema;
