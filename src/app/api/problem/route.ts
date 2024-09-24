import { responseType } from "@/types/problemType";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { fromZodError } from "zod-validation-error";
import Problem from "@/models/problemModel";
import DefaultTestCase from "@/models/defaultTestCaseModel";
import dbConnect from "@/db/dbConnect";
import DefaultCode from "@/models/defaultCodeModel";
const problemTypeValidation = z
  .object({
    problemNumber: z.number().int().positive(),
    type: z.enum(["contest", "regularProblem"]),
    difficulty: z.enum(["easy", "medium", "hard"]),
    description: z.string().min(1, "Problem description is required"),
    problemName: z.string().min(1, "Problem name is required"),
    problemTitle: z.string().min(1, "Problem title is required"),
    defaultTestCase: z.instanceof(ObjectId),
    defaultCode: z.instanceof(ObjectId),
  })
  .strict();

type problemRequestType = z.infer<typeof problemTypeValidation>;

//TODO: Also check here if the user is admin or not by checking the secret
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data: problemRequestType = await request.json();
    // console.log(data);
    // Convert defaultTestCase and defaultCode to ObjectId
    data.defaultTestCase = new ObjectId(data.defaultTestCase);
    data.defaultCode = new ObjectId(data.defaultCode);

    const zodResponse = problemTypeValidation.safeParse(data);
    if (zodResponse.success === false) {
      // console.log(fromZodError(zodResponse?.error).message);
      const errorResponse: responseType = {
        message: fromZodError(zodResponse?.error).message,
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    // check if the default testCase and defaultCode exists or not
    //
    const defaultTestCaseExists = await DefaultTestCase.findById(
      data.defaultTestCase,
    );

    if (!defaultTestCaseExists) {
      const errorResponse: responseType = {
        message: "Default test case doesn't exist",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }
    const defaultCodeExists = await DefaultCode.findById(data.defaultCode);

    if (!defaultCodeExists) {
      const errorResponse: responseType = {
        message: "Default code doesn't exist",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    // Check if the problem is already present in the db than update it

    const alreadyExistsProblem = await Problem.findOne({
      $or: [
        { problemName: data.problemName },
        { problemTitle: data.problemTitle },
        { problemNumber: data.problemNumber },
      ],
    });

    if (alreadyExistsProblem) {
      const successResponse: responseType = {
        message: `Problem with same name or same title already exists`,
        status: 400,
        success: "false",
      };
      return NextResponse.json(successResponse);
    }

    // Everything is fine now we finaly store the problem
    const problem = new Problem(data);
    await problem.save();

    const successResponse: responseType = {
      message: `Problem ${data.problemName} created successfully`,
      status: 200,
      success: "true",
    };
    return NextResponse.json(successResponse);
  } catch (err: any) {
    // console.log("error ");
    // console.log(err);

    const errorResponse: responseType = {
      error: err.message,
      message: "Problem creation failed",
      status: 500,
      success: "false",
    };
    return NextResponse.json(errorResponse);
  }
}

// <--------------------------------GET Problem in range start to end  ------------------------------------->

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const queryParams = {
      start: searchParams.get("start"),
      end: searchParams.get("end"),
    };
    // console.log(queryParams);
    const start = Number(queryParams.start);
    const end = Number(queryParams.end);
    // console.log("start " + start + " end " + end);
    if (start <= 0 || end <= 0 || start > end || isNaN(start) || isNaN(end)) {
      const errorResponse: responseType = {
        message: "Invalid query params",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    const problems = await Problem.find({
      problemNumber: { $gte: start, $lte: end },
    })
      .select("_id problemTitle problemName problemNumber difficulty ")
      .sort({ problemNumber: 1 });

    const successResponse: responseType = {
      message: "Problem fetched successfully",
      messages: [{ problems: problems }],
      status: 200,
      success: "true",
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    const errorResponse: responseType = {
      message: "Internal server error",
      status: 500,
      success: "false",
    };
    return NextResponse.json(errorResponse);
  }
}

// update problem

export async function PATCH(request: NextRequest) {
  try {
    // TODO: check that user is a admin or not by checking the secret
    await dbConnect();
    const data: problemRequestType = await request.json();
    // console.log(data);
    // Convert defaultTestCase and defaultCode to ObjectId
    data.defaultTestCase = new ObjectId(data.defaultTestCase);
    data.defaultCode = new ObjectId(data.defaultCode);

    const zodResponse = problemTypeValidation.safeParse(data);
    if (zodResponse.success === false) {
      // console.log(fromZodError(zodResponse?.error).message);
      const errorResponse: responseType = {
        message: fromZodError(zodResponse?.error).message,
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    // check if the problem already exists or not if not the return error

    const problemExists = await Problem.findOne({
      problemName: data.problemName,
    });
    if (!problemExists) {
      const errorResponse: responseType = {
        message: "Problem doesn't exist",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    const updateProblem = await Problem.updateOne(
      { _id: problemExists._id },
      {
        $set: {
          type: data.type,
          difficulty: data.difficulty,
          description: data.description,
          problemName: data.problemName,
          problemTitle: data.problemTitle,
          defaultTestCase: data.defaultTestCase,
          defaultCode: data.defaultCode,
        },
      },
    );

    const successResponse: responseType = {
      message: "Problem updated successfully",
      status: 200,
      success: "true",
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    // console.log("Error in update problem controller " + err);

    const errResponse: responseType = {
      message: "Internal server error",
      status: 500,
      success: "false",
    };
    return NextResponse.json(errResponse);
  }
}
