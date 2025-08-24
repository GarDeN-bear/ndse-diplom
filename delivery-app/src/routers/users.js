import express from "express";
import bcrypt from "bcrypt";

import User from "../db/users.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res
        .status(400)
        .json({ error: "users.get: Error: Email is required!" });
    }

    const user = await User.findByEmail(email);

    if (!user) {
      return req
        .status(404)
        .json({ error: "users.get: Error: User not found!" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: `users.get: Error: ${error}!`,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;

    if (!data.email || !data.password || !data.name) {
      return res.status(400).json({
        error: "users.post: Error: Email, passwordHash and name are required!",
      });
    }

    let user = await User.findByEmail(data.email);
    if (user) {
      return res.status(409).json({
        error: "users.post: Error: User with this email already exists!",
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    user = await User.create({
      email: data.email,
      name: data.name,
      passwordHash: passwordHash,
      contactPhone: data.contactPhone,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: `users.post: Error: ${error}!` });
  }
});

export default router;
