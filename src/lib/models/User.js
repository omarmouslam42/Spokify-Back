import mongoose from "mongoose";
import { compare, hash } from "../../utlis/hashingAndCompare.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
    },
    resetToken: String,
    resetTokenExpires: Date,

    profileImage: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash({
    plaintext: this.password,
  });

  next();
});

// compare password
userSchema.methods.comparePassword = async function (password) {
  const isMatch = await compare({
    plaintext: password,
    hashValue: this.password,
  });
  return isMatch;
};

const User = mongoose.model("User", userSchema);
export default User;
