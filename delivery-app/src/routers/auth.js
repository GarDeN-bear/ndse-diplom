import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";

import User from "../db/users.js";
import requireAuth from "../middleware/auth.js";
import responseHelpers from "../utils/responseHelpers.js";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  try {
    const data = req.user;

    const user = await User.findByEmail(data.email);
    if (!user) {
      return responseHelpers.notFoundResponse(res, data.email);
    }

    responseHelpers.successResponse(res, {
      id: user.id,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    });
  } catch (error) {
    responseHelpers.errorResponse(res, `get: Error: ${error}!`);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, contactPhone } = req.body;

    if (!email || !password || !name) {
      return responseHelpers.validationErrorResponse(
        res,
        "signup: Error: `email`, `password` and `name` are required!"
      );
    }

    let user = await User.findByEmail(email);
    if (user) {
      return responseHelpers.duplicateEntryResponse(
        res,
        "signup: Error: User with this email already exists!"
      );
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    user = await User.create({
      email: email,
      name: name,
      passwordHash: passwordHash,
      contactPhone: contactPhone,
    });

    responseHelpers.successResponse(
      res,
      {
        email: email,
        name: name,
        contactPhone: contactPhone,
      },
      201
    );
  } catch (error) {
    responseHelpers.errorResponse(res, `signup: Error: ${error}!`);
  }
});

router.post("/signin", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return responseHelpers.errorResponse(res, `signin: Error: ${error}!`);
    }

    if (!user) {
      return responseHelpers.unauthorizedResponse(
        res,
        "signin: Error: authentication required!"
      );
    }

    req.logIn(user, (error) => {
      if (error) {
        return responseHelpers.errorResponse(res, `signin: Error: ${error}!`);
      }
      return responseHelpers.successResponse(res, {
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
      });
    });
  })(req, res, next);
});

router.post("/signout", (req, res) => {
  req.logout((error) => {
    if (error) {
      return responseHelpers.errorResponse(res, `signout: Error: ${error}!`);
    }

    responseHelpers.successResponse(res);
  });
});

export default router;
