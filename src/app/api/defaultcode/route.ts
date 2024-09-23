import dbConnect from "@/db/dbConnect";
import DefaultCode from "@/models/defaultCodeModel";
import { responseType } from "@/types/problemType";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const defaultCodeTypeValidation = z
  .object({
    title: z.string().min(1, { message: "title is required" }),
    cppCode: z.string().min(1, { message: "cppCode is required" }),
    tsCode: z.string().min(1, { message: "tsCode is required" }),
    jsCode: z.string().min(1, { message: "jsCode is required" }),
  })
  .strict();

type defaultCodeRequestType = z.infer<typeof defaultCodeTypeValidation>;

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data: defaultCodeRequestType = await request.json();
    console.log(data);
    const zodResponse = defaultCodeTypeValidation.safeParse(data);

    if (zodResponse.success === false) {
      console.log(fromZodError(zodResponse?.error).message);
      const errorResponse: responseType = {
        message: fromZodError(zodResponse?.error).message,
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    // check if the default code is already present
    const alreadyExistsDefaultCode = await DefaultCode.findOne({
      title: data.title,
    });

    if (alreadyExistsDefaultCode) {
      // if already present update with new code

      await DefaultCode.updateOne(
        { _id: alreadyExistsDefaultCode._id },
        {
          $set: {
            cppCode: data.cppCode,
            tsCode: data.tsCode,
            jsCode: data.jsCode,
          },
        },
      );

      const errorResponse: responseType = {
        message: "Default code with this title already exists",
        success: "true",
        messages: [{ _id: alreadyExistsDefaultCode._id }],
        status: 200,
      };
      return NextResponse.json(errorResponse);
    }

    // console.log("Code is " + data);
    const defaultCode = new DefaultCode(data);
    // console.log(defaultCode);
    await defaultCode.save();

    const successResponse: responseType = {
      message: "Successfully saved the default code",
      messages: [{ _id: defaultCode._id, code: defaultCode }],
      success: "true",
      status: 200,
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log(err);
    const errorResponse: responseType = {
      message: "Internal server error while saving the default code",
      messages: [{ err: err }],
      success: "false",
      status: 400,
    };
    return NextResponse.json(errorResponse);
  }
}
