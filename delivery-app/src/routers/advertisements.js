import express from "express";

import Advertisements from "../db/advertisements.js";
import requireAuth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import responseHelpers from "../utils/responseHelpers.js";

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
    return responseHelpers.successResponse(res, advertisements);
  } catch (error) {
    return responseHelpers.errorResponse(
      res,
      `advertisements.get: Error: ${error}!`
    );
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const advertisement = await Advertisements.findById(id).exec();

    if (!advertisement || advertisement.isDeleted) {
      return responseHelpers.notFoundResponse(res);
    }

    responseHelpers.successResponse(res, advertisements);
  } catch (error) {
    responseHelpers.errorResponse(res, `advertisements.get: Error: ${error}!`);
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
      return responseHelpers.validationErrorResponse(
        res,
        "advertisements.post: Error: `shortText` and `userId` are required!"
      );
    }

    const advertisement = await Advertisements.create(data);
    responseHelpers.successResponse(res, advertisement);
  } catch (error) {
    responseHelpers.errorResponse(res, `advertisements.post: Error: ${error}!`);
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    let advertisement = await Advertisements.findById(id).exec();

    if (!advertisement) {
      return responseHelpers.notFoundResponse(res, id.toString());
    }

    if (advertisement.userId.toString() !== req.user.id) {
      return responseHelpers.forbiddenResponse(
        res,
        "advertisements.delete: Error: Permission denied!"
      );
    }

    advertisement = await Advertisements.remove(id);

    responseHelpers.successResponse(res, advertisement);
  } catch (error) {
    responseHelpers.errorResponse(
      res,
      `advertisements.delete: Error: ${error}!`
    );
  }
});

export default router;
