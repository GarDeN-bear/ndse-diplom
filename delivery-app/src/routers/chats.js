import express from "express";

import Chats from "../db/chat/chats.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let { users } = req.query;

    const chat = await Chats.find(users.split(","));
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({
      error: `chats.get: Error: ${error}!`,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = {
      author: req.body.author,
      receiver: req.body.receiver,
      text: req.body.text,
    };

    if (!data.author || !data.receiver || !data.text) {
      return res.status(400).json({
        error:
          "chats.post: Error: `author`, `receiver` and `text` are required!",
      });
    }

    const message = await Chats.sendMessage(data);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      error: `chats.post: Error: ${error}!`,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await Chats.getHistory(id);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      error: `chats.get.id: Error: ${error}!`,
    });
  }
});

export default router;
