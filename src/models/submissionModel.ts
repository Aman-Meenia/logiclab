import mongoose, { Document } from "mongoose";
import Problem from "./problemModel";
import User from "./UserModel";

export interface SubmissionType extends Document {
  problemId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  language: string;
  code: string;
  status: string;
  time: string;
  memory: string;
  type?: "contest";
  contestName?: string;
}

const submissionSchema: mongoose.Schema<SubmissionType> = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Problem,
      index: true,
      required: [true, "Problem id is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      index: true,
      required: [true, "User id is required"],
    },
    language: {
      type: String,
      trim: true,
      required: [true, "Language is required"],
    },
    code: {
      type: String,
      trim: true,
      required: [true, "Code is required"],
    },
    status: {
      type: String,
      trim: true,
      required: [true, "Status is required"],
    },
    time: {
      type: String,
      trim: true,
      default: "N/A",
      required: [true, "Time taken is required"],
    },
    memory: {
      type: String,
      trim: true,
      default: "N/A",
      required: [true, "Memory used is required"],
    },
    type: {
      type: String,
      enum: ["contest"],
    },
    contestName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);
// Check if the model already exists and delete it
// if (mongoose.models.Submission) {
//   delete mongoose.models.Submission;
// }

const Submission =
  (mongoose.models.Submission as mongoose.Model<SubmissionType>) ||
  mongoose.model<SubmissionType>("Submission", submissionSchema);

export default Submission;
