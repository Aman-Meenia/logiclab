import * as path from "path";
import * as fs from "fs";
import { ProblemDefinitionParser } from "./helper";
import { FullBoilerCodeGenerator } from "./helperFullCode";

// Check if folder path is provided as argument
if (process.argv.length < 3) {
  console.log("Folder path is missing.");
  process.exit(1);
}

// Get folder path from command line argument
const folderPath = process.argv[2];
// console.log("Folder path: " + folderPath);

// Validate if folder exists
if (!fs.existsSync(folderPath)) {
  console.error(`Folder "${folderPath}" does not exist.`);
  process.exit(1);
}

// Read structure.md file from the provided folder
const structureFilePath = path.join(folderPath, "structure.md");
if (!fs.existsSync(structureFilePath)) {
  console.error(`File "structure.md" not found in "${folderPath}".`);
  process.exit(1);
}

const input = fs.readFileSync(structureFilePath, "utf-8");
// console.log("Input: " + input);

// Create a directory for boilerplate files if it doesn't exist
const boilerplateDir = path.join(folderPath, "boilerplate");
if (!fs.existsSync(boilerplateDir)) {
  fs.mkdirSync(boilerplateDir);
}

// Parse the input and generate code files
const parser = new ProblemDefinitionParser();
parser.parse(input);

try {
  const cppCode = parser.generateCpp();
  fs.writeFileSync(path.join(boilerplateDir, "boilerplate-cpp.txt"), cppCode);
  console.log("C++ code file generated successfully.");
} catch (error) {
  console.error("Failed to generate C++ code:", error);
}

try {
  const jsCode = parser.generateJs();
  fs.writeFileSync(path.join(boilerplateDir, "boilerplate-js.txt"), jsCode);
  console.log("JavaScript code file generated successfully.");
} catch (error) {
  console.error("Failed to generate JavaScript code:", error);
}

try {
  const tsCode = parser.generateTs();
  fs.writeFileSync(path.join(boilerplateDir, "boilerplate-ts.txt"), tsCode);
  console.log("TypeScript code file generated successfully.");
} catch (error) {
  console.error("Failed to generate TypeScript code:", error);
}

// FULL BOILERPLATE GENERATION

// Create a directory for boilerplate files if it doesn't exist
const boilerplateFullDir = path.join(folderPath, "boilerplateFullDir");
if (!fs.existsSync(boilerplateFullDir)) {
  fs.mkdirSync(boilerplateFullDir);
}

const FullCode = new FullBoilerCodeGenerator();
FullCode.parse(input);

try {
  const cppFullCode = FullCode.generateCppFull();
  fs.writeFileSync(
    path.join(boilerplateFullDir, "boilerplate-full-cpp.txt"),
    cppFullCode,
  );
  console.log("Full C++ code file generated successfully.");
} catch (error) {
  console.error("Failed to generate Full C++ code:", error);
}

console.log(
  'Code files generated successfully in the "boilerplate" directory.',
);
