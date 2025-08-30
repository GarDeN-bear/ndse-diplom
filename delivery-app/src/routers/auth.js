import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";

import User from "../db/users.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  try {
    const data = req.user;

    const user = await User.findByEmail(data.email);
    if (!user) {
      return res
        .status(404)
        .json({ error: "me: Error: User not found!", status: "error" });
    }

    res.status(200).json({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
      },
      status: "ok",
    });
  } catch (error) {
    res.status(500).json({
      error: `get: Error: ${error}!`,
      status: "error",
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, contactPhone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        error: "signup: Error: `email`, `password` and `name` are required!",
        status: "error",
      });
    }

    let user = await User.findByEmail(email);
    if (user) {
      return res.status(409).json({
        error: "signup: Error: User with this email already exists!",
        status: "error",
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    user = await User.create({
      email: email,
      name: name,
      passwordHash: passwordHash,
      contactPhone: contactPhone,
    });

    res.status(201).json({
      data: {
        email: email,
        name: name,
        contactPhone: contactPhone,
      },
      status: "ok",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: `signup: Error: ${error}!`, status: "error" });
  }
});

router.post("/signin", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return res.status(500).json({
        error: `signin: Error: ${error}!`,
        status: "error",
      });
    }

    if (!user) {
      return res.status(401).json({
        error: "signin: Error: wrong signin!",
        status: "error",
      });
    }

    req.logIn(user, (error) => {
      if (error) {
        return res.status(500).json({
          error: `signin: Error: ${error}!`,
          status: "error",
        });
      }

      return res.status(200).json({
        data: {
          email: user.email,
          name: user.name,
          contactPhone: user.contactPhone,
        },
        status: "ok",
      });
    });
  })(req, res, next);
});

router.post("/signout", (req, res) => {
  req.logout((error) => {
    if (error) {
      return res.status(500).json({
        error: `signout: Error: ${error}!`,
        status: "error",
      });
    }

    res.status(200).json({
      status: "ok",
    });
  });
});

export default router;
