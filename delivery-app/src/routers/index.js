import express from "express";

import users from "./users.js";
import advertisements from "./advertisements.js";
import chats from "./chats.js";

const router = express.Router();

router.use("/api/users", users);
router.use("/api/advertisements", advertisements);
router.use("/api/chats", chats);

export default router;
