import fs from "fs";
import path from "path";
type Field = { type: string; name: string };

export const helperTestCase = (
  lines: string[],
  inputs: Field[],
  outputs: Field[], // As output is a single field to make the function  generice we make it array
  filePath: string,
  fileNumber: number,
): string => {
  const extractInputField = (line: string): Field => {
    line = line.replace("Input Field:", "");
    const parts = line.trim().split(/\s+/);

    if (parts.length < 2) {
      console.log("Inputs are not in proper format");
      process.exit(1);
    }

    const type = parts.slice(0, -1).join(" "); // Join all parts except the last one (which is the variable name)
    const name = parts[parts.length - 1];
    return { type, name };
  };
  // TO GET THE OUTPUTFIELDS

  const extractOutputField = (line: string): Field => {
    line = line.replace("Output Field:", "");

    line = line.trim();
    return { type: line, name: "" };
  };

  lines.forEach((line: string) => {
    if (line.startsWith("Input Field:")) {
      const field = extractInputField(line);
      inputs.push(field);
      // console.log(line);
    } else if (line.startsWith("Output Field:")) {
      const field = extractOutputField(line);
      // console.log(line);
      outputs.push(field);
    }
  });

  // console.log(inputs);
  // console.log(outputs);

  // Read input file and output file

  const inputFile = readInputAndOutputFile(filePath, `input/${fileNumber}.txt`);
  const outputFile = readInputAndOutputFile(
    filePath,
    `output/${fileNumber}.txt`,
  );

  if (inputFile[inputFile.length - 1] === "") {
    inputFile.pop();
  }
  if (outputFile[outputFile.length - 1] === "") {
    outputFile.pop();
  }

  // console.log("Input file ", inputFile);
  // console.log("OUtpue File ", outputFile);

  let generateTestCase = "";
  // Generate Default TestCase Input
  generateTestCase += generateDefaultTestCaseMdFileStructure(
    "Input",
    inputs,
    inputFile,
  );
  // Generate Default TestCase Output

  generateTestCase += generateDefaultTestCaseMdFileStructure(
    "Output",
    outputs,
    outputFile,
  );
  // console.log("generateTestCase", generateTestCase);
  return generateTestCase;
};

// Read Input files

const readInputAndOutputFile = (
  filePath: string,
  filename: string,
): string[] => {
  const newFilePath = path.join(filePath, filename);

  // check if the file exists
  // console.log("NewFilePath" + newFilePath);
  if (!fs.existsSync(newFilePath)) {
    console.error(`File ${newFilePath} does not exists in the provided path.`);
    process.exit(1);
  }

  if (!fs.existsSync(newFilePath)) {
    console.error(`File ${newFilePath} does not exist.`);
    process.exit(1);
  }
  let inputFile = fs.readFileSync(newFilePath, "utf-8");
  const lines = inputFile.split("\n").map((line) => line.trim());

  return lines;
};

// Generate Default TestCase Md File structure

const generateDefaultTestCaseMdFileStructure = (
  typeIs: "Input" | "Output",
  inputs: Field[],
  inputFile: string[],
): string => {
  let generateTestCase = "";
  if (typeIs === "Input") {
    generateTestCase += `##### Input \n`;
  } else {
    generateTestCase += `##### Output \n`;
  }
  let lineCnt = 0;
  console.log("inputFile", inputs);

  inputs.map(({ type, name }) => {
    // console.log("type " + type);
    if (
      type === "int" ||
      type === "float" ||
      type === "double" ||
      type === "char" ||
      type === "string" ||
      type === "bool" ||
      type === "long" ||
      type === "long long"
    ) {
      if (typeIs === "Input") generateTestCase += `${name} = \n `;
      generateTestCase += ` \`\`\` `;
      if (type === "string") {
        generateTestCase += ` 
${inputFile[lineCnt++]}
\`\`\`
&nbsp;
`;
      } else {
        generateTestCase += `
${inputFile[lineCnt++]}
\`\`\`
&nbsp;

`;
      }
    } else if (
      type === "vector<int>" ||
      type === "vector<float>" ||
      type === "vector<double>" ||
      type === "vector<char>" ||
      type === "vector<string>" ||
      type === "vector<bool>" ||
      type === "vector<long>" ||
      type === "vector<long long>"
    ) {
      // Because we dont want the size of the array
      lineCnt++;
      if (typeIs === "Input") generateTestCase += `${name} = \n `;
      const splitVector = inputFile[lineCnt++].split(" ");
      generateTestCase += ` \`\`\` \n`;

      // if (typeIs === "Input") generateTestCase += ` ${name}  = `;
      generateTestCase += `[`;

      if (type === "vector<string>") {
        for (let i = 0; i < splitVector.length; i++) {
          if (i < splitVector.length - 1) {
            generateTestCase += `"${splitVector[i]}",`;
          } else {
            generateTestCase += `"${splitVector[i]}"`;
          }
        }
      } else {
        for (let i = 0; i < splitVector.length; i++) {
          if (i < splitVector.length - 1) {
            generateTestCase += `${splitVector[i]},`;
          } else {
            generateTestCase += `${splitVector[i]}`;
          }
        }
      }
      generateTestCase += `] \n`;
      generateTestCase += `\`\`\` \n &nbsp;
`;
    } else if (
      type === "vector<vector<int>>" ||
      type === "vector<vector<float>>" ||
      type === "vector<vector<double>>" ||
      type === "vector<vector<char>>" ||
      type === "vector<vector<string>>" ||
      type === "vector<vector<bool>>" ||
      type === "vector<vector<long>>" ||
      type === "vector<vector<long long>>"
    ) {
      if (typeIs === "Input") generateTestCase += `${name} = \n `;

      // we want the n-> no of row to take input for every row
      let rowSize = Number(inputFile[lineCnt++].split(" ")[0]);
      // console.log("RowSize is " + rowSize);
      generateTestCase += ` \`\`\` \n`;
      // if (typeIs === "Input") generateTestCase += ` ${name}  = `;
      generateTestCase += `[`;

      for (let i = 0; i < rowSize; i++) {
        generateTestCase += `[`;
        const splitVector = inputFile[lineCnt++].split(" ");
        if (type === "vector<vector<string>>") {
          for (let j = 0; j < splitVector.length; j++) {
            if (j < splitVector.length - 1) {
              generateTestCase += `"${splitVector[j]}",`;
            } else {
              generateTestCase += `"${splitVector[j]}"`;
            }
          }
        } else {
          for (let j = 0; j < splitVector.length; j++) {
            if (j < splitVector.length - 1) {
              generateTestCase += `${splitVector[j]},`;
            } else {
              generateTestCase += `${splitVector[j]}`;
            }
          }
        }
        if (i < rowSize - 1) {
          generateTestCase += `],`;
        } else {
          generateTestCase += `]`;
        }
      }
      generateTestCase += `] \n`;
      generateTestCase += ` \`\`\` \n &nbsp;
`;
    }
  });

  console.log(generateTestCase);
  return generateTestCase;
};
