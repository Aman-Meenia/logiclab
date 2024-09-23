import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { responseType } from "@/types/problemType";
import dbConnect from "@/db/dbConnect";
import Submission from "@/models/submissionModel";
import { ObjectId } from "mongodb";

const submissionTypeValidation = z
  .object({
    problemId: z.instanceof(ObjectId, {
      message: "problemId must be mongodb instance",
    }),
    userId: z.instanceof(ObjectId, {
      message: "userId must be mongodb instance",
    }),
  })
  .strict();

type submissionRequestType = z.infer<typeof submissionTypeValidation>;

export async function POST(req: NextRequest) {
  try {
    dbConnect();
    const body: submissionRequestType = await req.json();

    try {
      body.problemId = new ObjectId(body.problemId);
      body.userId = new ObjectId(body.userId);
    } catch (e) {
      const errorResponse: responseType = {
        message: "problemId and userId must be mongodb instance",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }
    const zodResponse = submissionTypeValidation.safeParse(body);

    if (!zodResponse.success) {
      const errorResponse: responseType = {
        success: "false",
        status: 400,
        message: fromZodError(zodResponse?.error).message,
      };
      return NextResponse.json(errorResponse);
    }

    const userSubmissions = await Submission.find({
      userId: new ObjectId(body.userId),
      problemId: new ObjectId(body.problemId),
    })
      .select({
        _id: false,
        language: true,
        status: true,
        memory: true,
        time: true,
        createdAt: true,
      })
      .sort({ createdAt: -1 });

    const successResponse: responseType = {
      success: "true",
      status: 200,
      message: "user submissions fetched successfully",
      messages: [userSubmissions],
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log(err);
    const errorResponse: responseType = {
      success: "false",
      status: 500,
      message: "Internal server error",
    };
    return NextResponse.json(errorResponse);
  }
}
