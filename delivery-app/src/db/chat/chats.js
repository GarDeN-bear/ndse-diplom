import { Schema, model, Types } from "mongoose";
import EventEmitter from "events";

import MessageSchema from "./message.js";

class ChatEventEmitter extends EventEmitter {}
const chatEmitter = new ChatEventEmitter();

const chatSchema = new Schema({
  users: {
    type: [[Types.ObjectId, Types.ObjectId]],
    required: true,
    unique: false,
  },
  createdAt: {
    type: Date,
    required: true,
    unique: false,
  },
  messages: {
    type: [MessageSchema],
    required: false,
    unique: false,
  },
});

chatSchema.statics.find = async function (users) {
  return await this.findOne({ users: users.sort() });
};

chatSchema.statics.sendMessage = async function (data) {
  const { author, receiver, text } = data;

  const users = [author, receiver].sort();

  let chat = await this.findOne({ users });

  if (!chat) {
    chat = new this({ users, createdAt: new Date(), messages: [] });
  }

  const newMessage = {
    author,
    sentAt: new Date(),
    text,
    readAt: null,
  };

  chat.messages.push(newMessage);

  chatEmitter.emit("newMessage", {
    chatId: chat._id,
    message: newMessage,
  });

  await chat.save();

  return newMessage;
};

chatSchema.statics.getHistory = async function (id) {
  const chat = await this.findById(id);
  return chat ? chat.messages : [];
};

chatSchema.statics.subscribe = function (callback) {
  chatEmitter.on("newMessage", callback);
  return () => chatEmitter.off("newMessage", callback);
};

chatSchema.statics.unsubscribe = function (callback) {
  chatEmitter.off("newMessage", callback);
};

export default model("Chat", chatSchema);
