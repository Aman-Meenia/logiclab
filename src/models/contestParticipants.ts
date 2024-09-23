import mongoose, { Document } from "mongoose";
import User from "./UserModel";

export interface contestParticipantType extends Document {
  contestName: string;
  userId: mongoose.Types.ObjectId;
  points: number;
  rank: number;
  completionTime: {
    problem1: Date;
    problem2: Date;
    problem3: Date;
    problem4: Date;
  };
  acceptedSolutions: {
    problem1: string;
    problem2: string;
    problem3: string;
    problem4: string;
  };
}

const contestParticipantSchema: mongoose.Schema<contestParticipantType> =
  new mongoose.Schema(
    {
      contestName: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
        index: true,
      },
      points: {
        type: Number,
        default: 0,
      },
      rank: {
        type: Number,
        default: 0,
      },
      completionTime: {
        problem1: {
          type: Date,
          default: undefined,
        },
        problem2: {
          type: Date,
          default: undefined,
        },
        problem3: {
          type: Date,
          default: undefined,
        },
        problem4: {
          type: Date,
          default: undefined,
        },
      },
      acceptedSolutions: {
        problem1: {
          type: String,
          default: undefined,
        },
        problem2: {
          type: String,
          default: undefined,
        },
        problem3: {
          type: String,
          default: undefined,
        },
        problem4: {
          type: String,
          default: undefined,
        },
      },
    },
    {
      timestamps: true,
    },
  );

// Check if the model already exists and delete it
// if (mongoose.models.ContestParticipant) {
//   delete mongoose.models.ContestParticipant;
// }

const ContestParticipant =
  (mongoose.models
    .ContestParticipant as mongoose.Model<contestParticipantType>) ||
  mongoose.model<contestParticipantType>(
    "ContestParticipant",
    contestParticipantSchema,
  );

export default ContestParticipant;
