import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
    unique: false,
  },
  name: {
    type: String,
    required: true,
    unique: false,
  },
  contactPhone: {
    type: String,
    required: false,
    unique: false,
  },
});

userSchema.statics.findByEmail = async function (email) {
  return await this.findOne({ email: email });
};

userSchema.statics.create = async function (data) {
  const advertisement = new this(data);
  return await advertisement.save();
};

export default model("User", userSchema);
