import { Schema } from "mongoose";

export interface IToken {
    userId: Schema.Types.ObjectId,
    accessToken?: string,
    refreshToken?: string,
}