import express from "express";

import auth from "./auth.js";
import advertisements from "./advertisements.js";
import chats from "./chats.js";

const router = express.Router();

router.use("/api/", auth);
router.use("/api/advertisements", advertisements);
router.use("/api/chats", chats);

export default router;
