import fs from "fs";
import path from "path";
import { helperTestCase } from "./helperTestCase";

type Field = { type: string; name: string };

// Generate Default TestCase

// console.log(process.argv);

if (process.argv.length < 3) {
  console.log("Folder path is missing.");
  process.exit(1);
}

const folderPath = process.argv[2];

// check if problem folder exists

if (!fs.existsSync(folderPath)) {
  console.log("Folder does not exist");
  process.exit(1);
}

// Read the structure.md file to get the type of input and output

const structureFilePath = path.join(folderPath, "structure.md");

// Check if structure.md file exists

if (!fs.existsSync(structureFilePath)) {
  console.log(`structure.md file does not exist in  path ${folderPath}`);
  process.exit(1);
}
// console.log(structureFilePath);

// Read the structure.md file
const structureMd = fs.readFileSync(structureFilePath, "utf-8");

const lines = structureMd.split("\n").map((line) => line.trim());

let inputs: Field[] = [];
let outputs: Field[] = []; // As output is a single field to make the function  generice we make it array
// private extractOutputField(line: string): Field | null {
// line = line.replace("Output Field:", "");
//
// line = line.trim();
// return { type: line, name: "" };
// }

const defaultTestCaseMarkdown1 = helperTestCase(
  lines,
  inputs,
  outputs,
  folderPath,
  1,
);
inputs = [];
outputs = [];
const defaultTestCaseMarkdown2 = helperTestCase(
  lines,
  inputs,
  outputs,
  folderPath,
  2,
);
outputs = [];
inputs = [];
const defaultTestCaseMarkdown3 = helperTestCase(
  lines,
  inputs,
  outputs,
  folderPath,
  3,
);
// console.log(inputs);

// console.log(defaultTestCaseMarkdown);

// Now create the default test case code file in the folder defaultTC in the problem folder

const defaultTestCaseFolder = path.join(folderPath, "defaultTC");
if (!fs.existsSync(defaultTestCaseFolder)) {
  fs.mkdirSync(defaultTestCaseFolder);
}

const defaultTestCasePath1 = path.join(defaultTestCaseFolder, "defaultTC1.md");
const defaultTestCasePath2 = path.join(defaultTestCaseFolder, "defaultTC2.md");
const defaultTestCasePath3 = path.join(defaultTestCaseFolder, "defaultTC3.md");

fs.writeFileSync(defaultTestCasePath1, defaultTestCaseMarkdown1);
fs.writeFileSync(defaultTestCasePath2, defaultTestCaseMarkdown2);
fs.writeFileSync(defaultTestCasePath3, defaultTestCaseMarkdown3);
console.log(
  "Default testCase mardown file generated successfully for testcase1 , testcase2 , testcase3",
);
