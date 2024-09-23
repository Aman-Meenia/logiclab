import mongoose, { Document } from "mongoose";

export interface ProblemCntType extends Document {
  cnt: number;
}

const problemcntSchema: mongoose.Schema<ProblemCntType> = new mongoose.Schema(
  {
    cnt: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const ProblemCnt =
  (mongoose.models.ProblemCnt as mongoose.Model<ProblemCntType>) ||
  mongoose.model<ProblemCntType>("ProblemCnt", problemcntSchema);

export default ProblemCnt;
