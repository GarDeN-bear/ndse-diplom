import express from "express";

import Advertisements from "../db/advertisements.js";
import requireAuth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { shortText, description, userId, tags } = req.query;

    let tagsArray = [];
    if (tags) {
      tagsArray = Array.isArray(tags) ? tags : tags.split(",");
    }

    const params = {
      isDeleted: false,
    };

    if (shortText) {
      params.shortText = { $regex: shortText, $options: "i" };
    }

    if (description) {
      params.description = { $regex: description, $options: "i" };
    }

    if (userId) {
      params.userId = userId;
    }

    if (tags) {
      if (Array.isArray(tagsArray)) {
        params.tagsArray = { $all: tagsArray };
      } else {
        params.tagsArray = { $all: [tagsArray] };
      }
    }

    const advertisements = await Advertisements.find(params).exec();
    res.status(200).json({ data: advertisements, status: "ok" });
  } catch (error) {
    res.status(500).json({
      error: `advertisements.get: Error: ${error}!`,
      status: "error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const advertisement = await Advertisements.findById(id).exec();

    if (!advertisement || advertisement.isDeleted) {
      return res.status(404).json({
        error: "Advertisement not found",
        status: "error",
      });
    }

    res.status(200).json({ data: advertisement, status: "ok" });
  } catch (error) {
    res.status(500).json({
      error: `advertisements.get:id: Error: ${error}!`,
      status: "error",
    });
  }
});

router.post("/", requireAuth, upload.array("images", 10), async (req, res) => {
  try {
    const data = {
      shortText: req.body.shortText,
      description: req.body.description,
      images: req.files
        ? req.files.map((file) => `/upload/${file.filename}`)
        : [],
      userId: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: req.body.tags || [],
      isDeleted: false,
    };

    if (!data.shortText || !data.userId) {
      return res.status(400).json({
        error:
          "advertisements.post: Error: `shortText` and `userId` are required!",
        status: "error",
      });
    }

    const advertisement = await Advertisements.create(data);
    res.status(200).json({ data: advertisement, status: "ok" });
  } catch (error) {
    res.status(500).json({
      error: `advertisements.post: Error: ${error}!`,
      status: "error",
    });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    let advertisement = await Advertisements.findById(id).exec();

    if (!advertisement) {
      return res.status(404).json({
        error: "advertisements.delete: Error: Advertisement doesn't exist!",
        status: "error",
      });
    }

    if (advertisement.userId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "advertisements.delete: Error: Permission denied!",
        status: "error",
      });
    }

    advertisement = await Advertisements.remove(id);

    res.status(200).json({ data: advertisement, status: "ok" });
  } catch (error) {
    res.status(500).json({
      error: `advertisements.delete: Error: ${error}!`,
      status: "error",
    });
  }
});

export default router;
