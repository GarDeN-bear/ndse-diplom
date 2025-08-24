import express from "express";

import users from "./users.js";
import advertisements from "./advertisements.js";

const router = express.Router();

router.use("/api/users", users);
router.use("/api/advertisements", advertisements);

export default router;
