import express from "express";

import auth from "./auth.js";
import advertisements from "./advertisements.js";

const router = express.Router();

router.use("/api/", auth);
router.use("/api/advertisements", advertisements);

export default router;
