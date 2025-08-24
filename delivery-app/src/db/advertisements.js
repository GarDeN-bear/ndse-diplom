import { Schema, model, Types } from "mongoose";

const advertisementsSchema = new Schema({
  shortText: {
    type: String,
    required: true,
    unique: false,
  },
  description: {
    type: String,
    required: true,
    unique: false,
  },
  images: {
    type: [String],
    required: true,
    unique: false,
  },
  userId: {
    type: Types.ObjectId,
    required: false,
    unique: false,
  },
  createdAt: {
    type: Date,
    required: false,
    unique: false,
  },
  updatedAt: {
    type: Date,
    required: false,
    unique: false,
  },
  tags: {
    type: [String],
    required: false,
    unique: false,
  },
  isDeleted: {
    type: Boolean,
    required: false,
    unique: false,
  },
});

advertisementsSchema.statics.create = function (data) {
  const advertisement = new this(data);

  return advertisement.save();
};

advertisementsSchema.statics.remove = function (id) {
  return this.findByIdAndUpdate(
    id,
    { isDeleted: true, updatedAt: new Date() },
    { new: true }
  ).exec();
};

export default model("Advertisement", advertisementsSchema);
