import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { responseType } from "@/types/problemType";
import Problem from "@/models/problemModel";
import dbConnect from "@/db/dbConnect";

const problemTitleSchema = z.object({
  problemTitle: z.string().min(1, { message: "Problem title is required" }),
});

// this check whether the problem exists or not whether its a cntest problem or regular problme

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const problemTitle = searchParams.get("title");
    const zodResponse = problemTitleSchema.safeParse({ problemTitle });

    if (zodResponse.success === false) {
      console.log(fromZodError(zodResponse?.error).message);
      const errorResponse: responseType = {
        message: fromZodError(zodResponse?.error).message,
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }
    console.log("title is " + problemTitle);

    const problem = await Problem.findOne({
      problemTitle: problemTitle,
    });

    if (!problem) {
      const errorResponse: responseType = {
        message: "Problem not found",
        success: "false",
        status: 404,
      };
      return NextResponse.json(errorResponse);
    }

    const successResponse: responseType = {
      message: "Problem exists",
      success: "true",
      status: 200,
      messages: [
        {
          problem: {
            _id: problem._id,
          },
        },
      ],
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    const errorResponse: responseType = {
      message: "Internal server error",
      success: "false",
      status: 500,
    };

    return NextResponse.json(errorResponse);
  }
}
