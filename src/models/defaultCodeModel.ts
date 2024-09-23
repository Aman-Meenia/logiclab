import mongoose, { Document } from "mongoose";

export interface DefaultCodeType extends Document {
  title: string;
  cppCode: string;
  tsCode: string;
  jsCode: string;
}

const defaultCodeSchema: mongoose.Schema<DefaultCodeType> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    cppCode: {
      type: String,
      required: true,
    },
    tsCode: {
      type: String,
      required: true,
    },
    jsCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const DefaultCode =
  (mongoose.models.DefaultCode as mongoose.Model<DefaultCodeType>) ||
  mongoose.model<DefaultCodeType>("DefaultCode", defaultCodeSchema);

export default DefaultCode;
