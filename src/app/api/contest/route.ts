import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import Contest from "@/models/contestModel";
import dbConnect from "@/db/dbConnect";
import { responseType } from "@/types/problemType";
import { ObjectId } from "mongodb";

const contestTypeValidation = z.object({
  contestName: z.string().min(1, { message: "Contest name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  contestCreator: z.string().min(1, { message: "Contest creator is required" }),
  startTime: z.date(),
  endTime: z.date(),
  problems: z.object({
    problem1: z.instanceof(ObjectId),
    problem2: z.instanceof(ObjectId),
    problem3: z.instanceof(ObjectId),
    problem4: z.instanceof(ObjectId),
  }),
});

type contestType = z.infer<typeof contestTypeValidation>;

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    console.log("contest controller");
    const data: contestType = await request.json();
    await dbConnect();
    // validate using zod

    data.startTime = new Date(data.startTime);
    data.endTime = new Date(data.endTime);

    try {
      data.problems.problem1 = new ObjectId(data.problems.problem1);
      data.problems.problem2 = new ObjectId(data.problems.problem2);
      data.problems.problem3 = new ObjectId(data.problems.problem3);
      data.problems.problem4 = new ObjectId(data.problems.problem4);
    } catch (err) {
      console.log(err);
      const errResponse: responseType = {
        message: "Problem id is not valid",
        success: "false",
        status: 500,
      };
      return NextResponse.json(errResponse);
    }

    const zodResponse = contestTypeValidation.safeParse(data);
    if (zodResponse.success === false) {
      console.log(fromZodError(zodResponse?.error).message);
      const errorResponse: responseType = {
        message: fromZodError(zodResponse?.error).message,
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    // check if contest with same name already present

    const alreadyPresent = await Contest.findOne({
      contestName: data.contestName,
    });
    // console.log("contest already present");
    // console.log(alreadyPresent);
    //
    if (alreadyPresent) {
      const errorResponse: responseType = {
        message: "Contest with same name already exists",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    const contest = new Contest(data);
    await contest.save();

    const successResponse: responseType = {
      message: "Contest created successfully",
      success: "true",
      status: 200,
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log(err);
    const errResponse: responseType = {
      message: "Internal server error",
      success: "false",
      status: 500,
    };
    return NextResponse.json(errResponse);
  }
}

// Get all the completed contests

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    await dbConnect();

    const contests = await Contest.find({
      status: "completed",
    })
      .select("-_id -__v -createdAt -updatedAt")
      .populate({
        path: "problems.problem1 problems.problem2 problems.problem3 problems.problem4",
        select: "problemTitle problemName difficulty -_id",
      });

    const successResponse: responseType = {
      message: "Contests fetched successfully",
      success: "true",
      status: 200,
      messages: [{ contests }],
    };

    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error in the get contest route" + err);
    const errResponse: responseType = {
      message: "Internal server error",
      success: "false",
      status: 500,
    };
    return NextResponse.json(errResponse);
  }
}
