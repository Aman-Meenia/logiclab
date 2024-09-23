import mongoose, { Document, Schema } from "mongoose";
import Problem from "./problemModel";

export interface ContestType extends Document {
  contestName: string;
  description: string;
  contestCreator: string;
  startTime: Date;
  endTime: Date;
  status: "upcoming" | "ongoing" | "completed";
  problems: {
    problem1: mongoose.Types.ObjectId;
    problem2: mongoose.Types.ObjectId;
    problem3: mongoose.Types.ObjectId;
    problem4: mongoose.Types.ObjectId;
  };
}

const contestSchema: Schema<ContestType> = new mongoose.Schema(
  {
    contestName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    contestCreator: {
      type: String,
      trim: true,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
    problems: {
      problem1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Problem,
        required: true,
      },
      problem2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Problem,
        required: true,
      },
      problem3: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Problem,
        required: true,
      },
      problem4: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Problem,
        required: true,
      },
    },
  },

  {
    timestamps: true,
  },
);
// Check if the model already exists and delete it
// if (mongoose.models.Contest) {
//   delete mongoose.models.Contest;
// }
const Contest =
  (mongoose.models.Contest as mongoose.Model<ContestType>) ||
  mongoose.model<ContestType>("Contest", contestSchema);
export default Contest;
