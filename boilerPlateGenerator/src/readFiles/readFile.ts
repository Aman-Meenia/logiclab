import path from "path";
import fs from "fs";

// const filePath = "../../../problems/"; (Not working because it )
// const filePath = path.resolve("", "../../../problems/"); //
// const filePath = "../../../../problems/";
// const filepath = path.resolve(process.cwd(), "problems");
const filepath = path.resolve(process.cwd(), "problems");

export type responseMsg = {
  success: false | true;
  response: string[];
  errMessage: string;
};

// Read input of the testcase

export const readInputFiles = (title: string): responseMsg => {
  const problempath = path.join(filepath, title, "input");

  console.log("path is " + problempath);
  console.log(`Current Working Directory: ${process.cwd()}`);
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

const res = readInputFiles("Room-Allocation");
console.log(res);

// Read output of the testcase

export const readOutputFiles = (title: string): responseMsg => {
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
export const readFullBoilerPlate = (
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

  // console.log(code);

  return {
    success: true,
    code: code,
  };
};

// const userCode = "function hello(){\nconsole.log('hello');\n}";
// readFullBoilerPlate("Room-Allocation", "cpp", userCode);
