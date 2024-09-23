import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import Contest from "@/models/contestModel";
import { responseType } from "@/types/problemType";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const contests = await Contest.find({
      $and: [
        {
          startTime: {
            $lte: new Date(),
          },
        },
        {
          endTime: {
            $gte: new Date(),
          },
        },
      ],
    })
      .select("-_id -__v -createdAt -updatedAt")
      .populate({
        path: "problems.problem1 problems.problem2 problems.problem3 problems.problem4",
        select: "problemTitle problemName difficulty -_id",
      });

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
