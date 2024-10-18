import mongoose, { Schema } from "mongoose";
import { IToken } from "../interfaces/Token";
import jwt from "jsonwebtoken";
export const TokenSchema: Schema<IToken> = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  accessToken: {
    type: String,
    required: false,
  },
  refreshToken: {
    type: String,
    required: false,
  },
});

TokenSchema.methods.generateToken = function (
  payload: { userId: Schema.Types.ObjectId },
  secret: string,
  signOptions: any
): Promise<string> {
  return new Promise(function (resolve, reject) {
    jwt.sign(
      payload,
      secret,
      signOptions,
      (err: Error | null, encoded: string | undefined) => {
        if (err === null && encoded !== undefined) {
          resolve(encoded);
        } else {
          reject(err);
        }
      }
    );
  });
};

TokenSchema.post("save", function () {
  if (process?.env?.NODE_ENV && process.env.NODE_ENV === "development") {
    console.log("Token is been Save ", this);
  }
});
export default mongoose.models.Token || mongoose.model("Token", TokenSchema);
