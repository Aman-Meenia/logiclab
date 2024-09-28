import dbConnect from "@/db/dbConnect";
import { responseType } from "@/types/problemType";
import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";
import {
  diffLang,
  languageCode,
} from "../../../../boilerPlateGenerator/LanguageCode";
import { v4 as uuidv4 } from "uuid";
import redis from "@/db/redisConnect";

const timeOut = 5 * 60;

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
    problemTitle: z.string(),
    flag: z.enum(["run", "submit"]),
  })
  .strict();
type submissionRequestType = z.infer<typeof submissionTypeValidation>;

export async function POST(request: NextRequest) {
  try {
    //TODO: Firstly check if the user is login on not by checking the session

    await dbConnect();
    const body: submissionRequestType = await request.json();
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

    if (zodResponse.success === false) {
      console.log(fromZodError(zodResponse?.error).message);
      const errorResponse: responseType = {
        message: fromZodError(zodResponse?.error).message,
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    // Firsly read all the inputs and outputs file of selected problem

    const inputFile = readInputFiles(body.problemTitle);
    const outputFile = readOutputFiles(body.problemTitle);
    let testCaseSize = inputFile.response.length;

    if (body.flag === "run") {
      testCaseSize = 3;
    }
    // console.log("<------------Input And Output  File Start ------------>");
    // console.log(inputFile, outputFile);
    // console.log("<------------Input And Output File End ------------>");

    if (inputFile.success === false || outputFile.success === false) {
      const errorResponse: responseType = {
        message: "File not found only when the title is wrong ",
        // message:
        //   inputFile.success === false
        //     ? inputFile.errMessage
        //     : outputFile.errMessage,
        status: 500,
        success: "false",
      };
      return NextResponse.json(errorResponse);
    }

    // Read the full boiler plate of the selected language and replace the // Add user function here with the user given code
    const fullCode = readFullBoilerPlate(
      body.problemTitle,
      body.language,
      body.code,
    );

    if (fullCode.success === false) {
      const errorResponse: responseType = {
        message: fullCode.code,
        status: 500,
        success: "false",
      };
      return NextResponse.json(errorResponse);
    }

    // Replace the  //Enter the exact testcase number with actual testcase number
    fullCode.code = fullCode.code.replace(
      "//Enter the exact testcase number",
      `${testCaseSize}`,
    );
    // console.log("<-------------FULL CODE START ------------------->");
    // console.log(fullCode.code);
    // console.log("<-------------FULL CODE END ------------------->");

    // Make the judge0 call
    const language_id = languageCode.get(body.language);
    const inputs = inputFile.response;
    const outputs = outputFile.response;
    // console.log("callback is " + process.env.CALLBACK_URI);

    // generate uniqueId
    const uniqueId = uuidv4();
    // console.log("unique Id" + uniqueId);

    // create uuid_status in readis to store the status of the code

    const uuid_status = {
      cnt: 1,
      error: false,
      errorMessage: "",
      userId: String(body.userId),
      problemId: String(body.problemId),
      code: body.code,
      language: body.language,
      problemTitle: body.problemTitle,
      flag: body.flag,
    };

    await redis.set(
      uniqueId + "_status",
      JSON.stringify(uuid_status),
      `EX`,
      timeOut,
    );
    let combineInput = "";
    // console.log("input length" + inputs.length);
    // console.log("output length" + outputs.length);

    for (let i = 0; i < testCaseSize; i++) {
      combineInput = combineInput + inputs[i];
    }

    let combineOutput = "";
    for (let i = 0; i < testCaseSize; i++) {
      combineOutput = combineOutput + outputs[i] + "$$$\n";
    }
    // console.log(combineInput);
    // console.log(combineOutput);

    // also store the user code in the redis (because i am not storing the submissions in mongodb intitally store only when the judge0 give ouput for all testcase)

    await redis.set(uniqueId + "_code", body.code, `EX`, timeOut);

    // send the code to judge0 for all the inputs
    const response = await axios.post(`${process.env.JUDGE_URI}/submissions`, {
      source_code: fullCode.code,
      language_id: language_id,
      stdin: combineInput,
      expected_output: combineOutput,
      callback_url: process.env.CALLBACK_URI,
      max_processes_and_or_threads: null,
      enable_per_process_and_thread_time_limit: true,
      enable_per_process_and_thread_memory_limit: true,
      max_file_size: null,
      enable_network: true,
    });
    // save the toke id with the uuid to know which sumissions output is this
    const token = response.data.token;
    await redis.set(
      token,
      JSON.stringify({
        uuid: uniqueId,
      }),
      `EX`,
      timeOut,
    );
    // }

    const successResponse: responseType = {
      message: "Successfully submitted the code",
      messages: [
        {
          uniqueId: uniqueId,
          status: "pending",
        },
      ],
      status: 200,
      success: "true",
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log(err);
    const errorResponse: responseType = {
      message: "Internal server error ",
      status: 500,
      success: "false",
    };
    return NextResponse.json(errorResponse);
  }
}

type responseMsg = {
  success: false | true;
  response: string[];
  errMessage: string;
};
const filepath = path.resolve(process.cwd(), "problems");

const readInputFiles = (title: string): responseMsg => {
  const problempath = path.join(filepath, title, "input");
  // console.log("FIle path " + filepath);
  // console.log("path is " + problempath);
  // console.log(`Current Working Directory: ${process.cwd()}`);
  if (!fs.existsSync(problempath)) {
    console.log("File not found");
    return {
      success: false,
      errMessage: "File not found",
      response: [],
    };
  }
  // console.log("Input working ");
  const input: string[] = [];

  for (let i = 1; i <= 10; i++) {
    const inputFilePath = path.join(problempath, `${i}.txt`);
    if (!fs.existsSync(inputFilePath)) {
      break;
    }
    const data = fs.readFileSync(inputFilePath, "utf-8");
    input.push(data);
  }

  return {
    success: true,
    response: input,
    errMessage: "No error",
  };
};

const readOutputFiles = (title: string): responseMsg => {
  const problempath = path.join(filepath, title, "output");

  if (!fs.existsSync(problempath)) {
    // console.log("File not found");
    return {
      success: false,
      errMessage: "File not found",
      response: [],
    };
  }

  const output: string[] = [];

  for (let i = 1; i <= 10; i++) {
    const outputFilePath = path.join(problempath, `${i}.txt`);

    if (!fs.existsSync(outputFilePath)) {
      break;
    }
    const data = fs.readFileSync(outputFilePath, "utf-8");
    output.push(data);
    // console.log(data);
  }
  // console.log(output);

  return {
    success: true,
    response: output,
    errMessage: "No error",
  };
};
// readOutputFile("Room-Allocation");

// Read the full boilerPlate of the selected languange and replace the function with user given code

type boilerPlateResponse = {
  success: false | true;
  code: string;
};
const readFullBoilerPlate = (
  title: string,
  lang: string,
  userCode: string,
): boilerPlateResponse => {
  const problempath = path.join(filepath, title, "boilerplateFullDir");

  if (!fs.existsSync(problempath)) {
    // console.log("File not found");
    return {
      success: false,
      code: "File not found",
    };
  }

  const boilerPlateFilePath = path.join(
    problempath,
    `boilerplate-full-${lang}.txt`,
  );
  if (!fs.existsSync(boilerPlateFilePath)) {
    // console.log("File not found");
    return {
      success: false,
      code: "File not found",
    };
  }

  let code = fs.readFileSync(boilerPlateFilePath, "utf-8");
  code = code.replace("// Add user function here", userCode);

  // console.log("<-------------------CODE------------------->");
  // console.log(code);
  return {
    success: true,
    code: code,
  };
};
