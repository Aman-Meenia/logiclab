import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import Contest from "@/models/contestModel";
import { responseType } from "@/types/problemType";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const contests = await Contest.find({
      startTime: {
        $gte: new Date(),
      },
    })
      .select("-_id -__v -createdAt -updatedAt -problems")
      .sort({ startTime: 1 })
      .limit(2);
    // const contests = await Contest.find({
    //   contestName: "Weekly Contest 1",
    // });
    console.log(contests);
    const successResponse: responseType = {
      message: "Contests fetched successfully",
      success: "true",
      status: 200,
      messages: [
        {
          contests,
        },
      ],
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log(err);
    const errorResponse: responseType = {
      message: "Internal server error",
      success: "false",
      status: 500,
      messages: [
        {
          err,
        },
      ],
    };
    return NextResponse.json(errorResponse);
  }
}
