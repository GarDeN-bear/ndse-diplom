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

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email });
};

userSchema.statics.create = function (data) {
  const advertisement = new this(data);
  return advertisement.save();
};

export default model("User", userSchema);
