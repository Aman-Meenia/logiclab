import dbConnect from "@/db/dbConnect";
import ProblemCnt from "@/models/problemCntModel";
import { responseType } from "@/types/problemType";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // await ProblemCnt.updateOne({}, { $inc: { cnt: 1 } }, { upsert: true });
    const updatedCnt = await ProblemCnt.findOne({});
    const successResponse: responseType = {
      message: "Successfully fetched the problem count",
      messages: [{ cnt: updatedCnt }],
      success: "true",
      status: 200,
    };

    return NextResponse.json(successResponse);
  } catch (err) {
    const errorResponse: responseType = {
      message: "Internal server error while updating the problem count",
      messages: [{ err: err }],
      success: "false",
      status: 400,
    };
    return NextResponse.json(errorResponse);
  }
}

export async function PATCH() {
  try {
    await dbConnect();

    await ProblemCnt.findOneAndUpdate(
      {},
      { $inc: { cnt: 1 } },
      { upsert: true },
    );
    const updatedCnt = await ProblemCnt.findOne({});

    const successResponse: responseType = {
      message: "Successfully updated the problem count",
      messages: [{ cnt: updatedCnt }],
      success: "true",
      status: 200,
    };

    return NextResponse.json(successResponse);
  } catch (err) {
    const errorResponse: responseType = {
      message: "Internal server error while updating the problem count",
      messages: [{ err: err }],
      success: "false",
      status: 400,
    };
    return NextResponse.json(errorResponse);
  }
}
