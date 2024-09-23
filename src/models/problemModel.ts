import mongoose, { Document } from "mongoose";
import DefaultTestCase from "./defaultTestCaseModel";
import DefaultCode from "./defaultCodeModel";

export interface ProblemType extends Document {
  problemNumber: number;
  type: "contest" | "regularProblem";
  difficulty: "easy" | "medium" | "hards";
  description: string;
  problemName: string;
  problemTitle: string; // Folder name of the problem in the problems folder
  defaultTestCase: mongoose.Types.ObjectId;
  defaultCode: mongoose.Types.ObjectId;
  age: number;
}

const problemSchema: mongoose.Schema<ProblemType> = new mongoose.Schema(
  {
    age: {
      type: Number,
      // required: [true, "Age is required"],
    },
    problemNumber: {
      type: Number,
      required: [true, "Problem number is required"],
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["contest", "regularProblem"],
      // default: "regularProblem",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    description: {
      type: String,
      required: [true, "Problem description is required"],
    },
    problemName: {
      type: String,
      required: [true, "Problem name is required"],
      unique: true,
      index: true,
    },
    problemTitle: {
      type: String,
      required: [
        true,
        "Problem title is required as it is the folder name of problem",
      ],
      unique: true,
      index: true,
    },
    defaultTestCase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DefaultTestCase,
      required: [true, "Default test case is required"],
    },
    defaultCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DefaultCode,
      required: [true, "Default code is required"],
    },
  },
  {
    timestamps: true,
  },
);

// Check if the model already exists and delete it
// if (mongoose.models.Problem) {
//   delete mongoose.models.Problem;
// }
const Problem =
  (mongoose.models.Problem as mongoose.Model<ProblemType>) ||
  mongoose.model<ProblemType>("Problem", problemSchema);

export default Problem;
