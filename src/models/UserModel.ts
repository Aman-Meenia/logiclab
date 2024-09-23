import mongoose, { Document, Schema } from "mongoose";

export interface UserType extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  profilePic?: string;
  otp: string;
  otpExpiry: Date;
  passwordResetOtp?: String;
  passwordResetOtpExpiry?: Date;
}

const userSchema: Schema<UserType> = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  profilePic: {
    type: String,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpiry: {
    type: Date,
    required: true,
  },
  passwordResetOtp: {
    type: String,
  },
  passwordResetOtpExpiry: {
    type: Date,
  },
});

const User =
  (mongoose.models.User as mongoose.Model<UserType>) ||
  mongoose.model<UserType>("User", userSchema);
export default User;
