import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import { string, z } from "zod";
import { fromZodError } from "zod-validation-error";
import { responseType } from "@/types/problemType";
import redis from "@/db/redisConnect";
import { ObjectId } from "mongodb";
import { diffLang } from "../../../../boilerPlateGenerator/LanguageCode";
import Submission from "@/models/submissionModel";
const pollingRequestTypeValidation = z
  .object({
    uniqueId: z.string().min(1, "uniqueId is required"),
  })
  .strict();

type pollingRequestType = z.infer<typeof pollingRequestTypeValidation>;

const submissionTypeValidation = z
  .object({
    problemId: z.instanceof(ObjectId, {
      message: "problemId must be mongodb instance",
    }),
    userId: z.instanceof(ObjectId, {
      message: "userId must be mongodb instance",
    }),
    code: z.string().trim().min(1, "code is required"),
    language: z.enum(diffLang),
    problemTitle: z.string().trim().min(1, "problemTitle is required"),
    status: z.string().trim().min(1, "status is required"),
    time: z.string(),
    memory: z.string(),
  })
  .strict();

type submissionType = z.infer<typeof submissionTypeValidation>;

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body: pollingRequestType = await request.json();

    // console.log(body);

    // check for the status of the problem in redis

    const problemData = await redis.get(body.uniqueId + "_status");
    // console.log(problemData);

    if (!problemData) {
      const errorResponse: responseType = {
        message: "Invalid uniqueId",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    const parseProblemData = JSON.parse(problemData);
    //TODO: if the error in problem or the all the testcase are evaluated store the submission in database
    // console.log(parseProblemData);
    // if the cnt is not 0 it mean than the problem is not solved yet

    if (parseProblemData.cnt === 1) {
      const successResponse: responseType = {
        message: "Successfully polled the problem",
        success: "true",
        status: 200,
        messages: [
          {
            status: "Pending",
          },
        ],
      };
      return NextResponse.json(successResponse);
    }

    // store the submission in database and return the response (store onlywhen user submit the problem)
    if (parseProblemData.flag === "submit") {
      parseProblemData.problemId = new ObjectId(parseProblemData.problemId);
      parseProblemData.userId = new ObjectId(parseProblemData.userId);
      const dbSubmission: submissionType = {
        problemId: parseProblemData.problemId, //parseProblemData.problemId,
        userId: parseProblemData.userId,
        code: parseProblemData.code,
        language: parseProblemData.language,
        problemTitle: parseProblemData.problemTitle,
        status: parseProblemData.status,
        time: String(parseProblemData.time) || "N/A",
        memory: String(parseProblemData.memory) || "N/A",
      };

      // console.log("<----------------- DBSUBMISSION ----------------->");
      // console.log(dbSubmission);

      // validate the submission
      const submissionValidation =
        submissionTypeValidation.safeParse(dbSubmission);
      if (!submissionValidation.success) {
        const errorResponse: responseType = {
          message: fromZodError(submissionValidation.error).message,
          success: "false",
          status: 400,
        };
        return NextResponse.json(errorResponse);
      }
      // console.log(dbSubmission);

      await new Submission(dbSubmission).save();
    }

    const successResponse: responseType = {
      message: "Successfully polled the problem",
      success: "true",
      status: 200,
      messages: [
        {
          status: parseProblemData.status,
          error: parseProblemData.error,
          errorMessage: "",
          time: parseProblemData.time,
          memory: parseProblemData.memory,
          stdout: parseProblemData.stdout,
          testCaseResult: parseProblemData.testCaseResult,
          compile_output: parseProblemData.compile_output,
        },
      ],
    };
    return NextResponse.json(successResponse);
    // }
  } catch (err) {
    // console.log("Eroor in polling", err);
    // console.log(err);
    const errorResponse: responseType = {
      message: "Internal server error ",
      success: "false",
      messages: [{ err: err }],
      status: 500,
    };
    return NextResponse.json(errorResponse);
  }
}
