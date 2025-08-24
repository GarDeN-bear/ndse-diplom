import express from "express";

import Advertisements from "../db/advertisements.js";

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

    const advertisement = await Advertisements.find(params).exec();
    res.status(200).json(advertisement);
  } catch (error) {
    res.status(500).json({
      error: `advertisements.get: Error: ${error}!`,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = {
      shortText: req.body.shortText,
      description: req.body.description,
      images: req.body.images || [],
      userId: req.body.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: req.body.tags || [],
      isDeleted: false,
    };

    const advertisement = await Advertisements.create(data);
    res.status(201).json(advertisement);
  } catch (error) {
    res.status(500).json({
      error: `advertisements.post: Error: ${error}!`,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const advertisement = await Advertisements.remove(id);

    if (!advertisement) {
      return res.status(404).json({
        error: "advertisements.delete: Error: Advertisement doesn't exist!",
      });
    }

    res.status(200).json(advertisement);
  } catch (error) {
    res.status(500).json({
      error: `advertisements.delete: Error: ${error}!`,
    });
  }
});

export default router;
