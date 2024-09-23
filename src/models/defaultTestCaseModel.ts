import mongoose, { Document } from "mongoose";

export interface DefaultTestCaseType extends Document {
  title: string;
  testCase1: string;
  testCase2: string;
  testCase3: string;
}

const defaultTestCaseSchema: mongoose.Schema<DefaultTestCaseType> =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      testCase1: {
        type: String,
        required: true,
      },
      testCase2: {
        type: String,
        required: true,
      },
      testCase3: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    },
  );

const DefaultTestCase =
  (mongoose.models.DefaultTestCase as mongoose.Model<DefaultTestCaseType>) ||
  mongoose.model<DefaultTestCaseType>("DefaultTestCase", defaultTestCaseSchema);

export default DefaultTestCase;
