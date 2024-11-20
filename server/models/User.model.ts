import mongoose, { model, models, Schema } from "mongoose";
import { IUser } from "../interfaces/User";
import { authorizationRoles } from "../constants/auth";
import jwt from "jsonwebtoken";
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide name"],
      minLength: [3, "Name can't be smaller than 3 characters"],
      maxLength: [15, "Name can't be greater than 15 characters"],
    },
    surname: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Please provide surname"],
      minLength: [3, "Surname can't be smaller than 3 characters"],
      maxLength: [15, "Surname can't be greater than 15 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      // a regular expression to validate an email address(stackoverflow)
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: false,
      trim: true,
      lowercase: true,
      maxLength: [128, "Email can't be greater than 128 characters"],
      index: false,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: [6, "Password must be more than 6 characters"],
      trim: true,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please provide confirmed Password"],
      minlength: [6, "Password must be more than 6 characters"],
      trim: true,
      select: false,
    },
    address: {
      type: String,
      default: "",
      trim: true,

      maxLength: [128, "Address can't be greater than 128 characters"],
    },
    phoneNumber: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      maxLength: [15, "Phone number can't be greater than 15 characters"],
    },
    bio: {
      type: String,
      default: "No bio",
      trim: true,

      maxLength: [256, "Bio can't be greater than 256 characters"],
    },
    role: {
      type: String,
      trim: true,
      lowercase: true,
      enum: [
        authorizationRoles.user,
        authorizationRoles.admin,

        authorizationRoles.client,
      ],
      default: authorizationRoles.user,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.createJWT = function () {
  const payload = {
    userId: this._id,
    email: this.email,
    name: this.firstName,
    dateOfBirth: this.dateOfBirth,
    gender: this.gender,
    address: this.address,
    phoneNumber: this.phoneNumber,
    bio: this.bio,
    role: this.role,
  };

  return jwt.sign(payload, process.env.TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
};

export default mongoose.model<IUser>("User", UserSchema);
