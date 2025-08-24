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
    required: true,
    unique: false,
  },
  createdAt: {
    type: Date,
    required: true,
    unique: false,
  },
  updatedAt: {
    type: Date,
    required: true,
    unique: false,
  },
  tags: {
    type: [String],
    required: false,
    unique: false,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    unique: false,
  },
});

advertisementsSchema.statics.create = async function (data) {
  const advertisement = new this(data);

  return await advertisement.save();
};

advertisementsSchema.statics.remove = async function (id) {
  return await this.findByIdAndUpdate(
    id,
    { isDeleted: true, updatedAt: new Date() },
    { new: true }
  ).exec();
};

export default model("Advertisement", advertisementsSchema);
