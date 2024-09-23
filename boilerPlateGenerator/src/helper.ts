type Field = { type: string; name: string };

export class ProblemDefinitionParser {
  problemName: string = "";
  functionName: string = "";
  inputFields: Field[] = [];
  outputFields: Field[] = [];

  parse(input: string): void {
    const lines = input.split("\n").map((line) => line.trim());

    // console.log(lines);

    let currentSection: "input" | "output" | null = null;

    lines.forEach((line) => {
      // console.log("Line is " + line);
      if (line.startsWith("Problem Name:")) {
        this.problemName = this.extractQuotedValue(line);
      } else if (line.startsWith("Function Name:")) {
        // console.log("Function Name working :");
        // console.log(line);
        this.functionName = this.extractQuotedValue(line);
      } else if (line.startsWith("Input Structure:")) {
        currentSection = "input";
      } else if (line.startsWith("Output Structure:")) {
        currentSection = "output";
      } else if (line.startsWith("Input Field:")) {
        if (currentSection === "input") {
          const field = this.extractInputField(line);
          if (field) this.inputFields.push(field);
        }
      } else if (line.startsWith("Output Field:")) {
        if (currentSection === "output") {
          const field = this.extractOutputField(line);
          if (field) this.outputFields.push(field);
        }
      }
    });
    // console.log(this.inputFields);
    // console.log(this.outputFields);
    // console.log(this.problemName);
    // console.log(this.functionName);
  }

  private extractQuotedValue(line: string): string {
    const match = line.match(/: "(.*)"$/);
    return match ? match[1] : "";
  }

  // TO GET THE INPUT FIELDS
  private extractInputField(line: string): Field | null {
    line = line.replace("Input Field:", "");
    const parts = line.trim().split(/\s+/);

    if (parts.length < 2) {
      // If there are not enough parts, the line might be malformed
      return null;
    }

    // The type is the first part
    const type = parts.slice(0, -1).join(" "); // Join all parts except the last one (which is the variable name)

    // The name is the last part
    const name = parts[parts.length - 1];
    return { type, name };
  }

  // TO GET THE OUTPUTFIELDS

  private extractOutputField(line: string): Field | null {
    line = line.replace("Output Field:", "");

    line = line.trim();
    return { type: line, name: "" };
  }

  generateCpp(): string {
    return this.generateFunction("cpp");
  }

  generateJs(): string {
    return this.generateFunction("js");
  }

  generateTs(): string {
    return this.generateFunction("ts");
  }

  private generateFunction(lang: "cpp" | "js" | "ts"): string {
    const inputParams = this.inputFields
      .map((field) => this.mapType(field.type, lang) + " " + field.name)
      .join(", ");

    // console.log("Input params ");
    // console.log(inputParams);

    const returnType =
      this.outputFields.length > 0
        ? this.mapType(this.outputFields[0].type, lang)
        : this.defaultReturnType(lang);

    const implementationPlaceholder = lang === "ts" ? "" : "";

    let functionSignature;
    switch (lang) {
      case "cpp":
        functionSignature = `${returnType} ${this.functionName}(${inputParams})`;
        break;
      case "js":
        functionSignature = `let ${this.functionName} = function (${this.inputFields
          .map((field) => field.name)
          .join(", ")})`;
        break;
      case "ts":
        functionSignature = `function ${this.functionName}(${this.inputFields
          .map((field) => `${field.name}: ${this.mapType(field.type, "ts")}`)
          .join(", ")}) :${returnType}`;
        break;
    }

    let InputAndOutputParams: string = "";

    if (lang == "js") {
      InputAndOutputParams = `/**
 * @param {${inputParams}} ${this.inputFields
   .map((field) => field.name)
   .join(", ")}
 * @returns {${returnType}}
 */
`;
    }

    return `

${InputAndOutputParams}

${functionSignature} {
    // Implementation goes here
    ${implementationPlaceholder}
}`.trim();
  }

  private mapType(type: string, lang: "cpp" | "js" | "ts"): string {
    const typeMapping: { [key: string]: { [key: string]: string } } = {
      int: { cpp: "int", js: "number", ts: "number" },
      float: { cpp: "float", js: "number", ts: "number" },
      char: { cpp: "char", js: "string", ts: "string" },
      string: { cpp: "string", js: "string", ts: "string" },
      double: { cpp: "double", js: "number", ts: "number" },
      "vector<int>": {
        cpp: "vector<int>",
        js: "number[]",
        ts: "number[]",
      },
      "vector<float>": {
        cpp: "vector<float>",
        js: "number[]",
        ts: "number[]",
      },
      "vector<char>": {
        cpp: "vector<char>",
        js: "string[]",
        ts: "string[]",
      },
      "vector<string>": {
        cpp: "vector<string>",
        js: "string[]",
        ts: "string[]",
      },
      "vector<double>": {
        cpp: "vector<double>",
        js: "number[]",
        ts: "number[]",
      },
      "vector<bool>": {
        cpp: "vector<bool>",
        js: "boolean[]",
        ts: "boolean[]",
      },
      "vector<vector<int>>": {
        cpp: "vector<vector<int>>",
        js: "number[][]",
        ts: "number[][]",
      },
      "vector<vector<float>>": {
        cpp: "vector<vector<float>>",
        js: "number[][]",
        ts: "number[][]",
      },
      "vector<vector<char>>": {
        cpp: "vector<vector<char>>",
        js: "string[][]",
        ts: "string[][]",
      },
      "vector<vector<string>>": {
        cpp: "vector<vector<string>>",
        js: "string[][]",
        ts: "string[][]",
      },
      "vector<vector<double>>": {
        cpp: "vector<vector<double>>",
        js: "number[][]",
        ts: "number[][]",
      },
      "vector<vector<bool>>": {
        cpp: "vector<vector<bool>>",
        js: "boolean[][]",
        ts: "boolean[][]",
      },
    };

    return typeMapping[type][lang] || "unknown";
  }

  private defaultReturnType(lang: "cpp" | "js" | "ts"): string {
    switch (lang) {
      case "cpp":
        return "void";
      case "js":
        return "void";
      case "ts":
        return "void";
      default:
        return "unknown";
    }
  }
}
