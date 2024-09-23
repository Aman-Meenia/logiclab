import {
  InputMultipleVector,
  InputSimpleDateTypes,
  InputSingleVector,
} from "./c++FUllCodeHelper";

type Field = { type: string; name: string };

export class FullBoilerCodeGenerator {
  problemName: string = "";
  functionName: string = "";
  inputFields: Field[] = [];
  outputFields: Field[] = [];

  parse(input: string): void {
    const lines = input.split("\n").map((line) => line.trim());

    // console.log(lines);
    let currentSection: "input" | "output" | null = null;

    lines.forEach((line) => {
      if (line.startsWith("Problem Name:")) {
        this.problemName = this.extractQuotedValue(line);
      } else if (line.startsWith("Function Name:")) {
        // console.log("Function Name working :");
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
    // console.log("Function name is " + this.functionName);
  }
  private extractQuotedValue(line: string): string {
    const match = line.match(/: "(.*)"$/);
    return match ? match[1] : "";
  }

  // TO GET THEINPUT FIELDS
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

  // TO GET THEOUTPUTFIELDS

  private extractOutputField(line: string): Field | null {
    line = line.replace("Output Field:", "");

    line = line.trim();
    return { type: line, name: "" };
  }

  generateCppFull(): string {
    return this.generateFullCode("cpp");
  }

  //TODO: Generate Full boilder code for js and ts
  private generateFullCode(lang: "cpp" | "js" | "ts"): string {
    const inputFields = this.inputFields;
    const outputFields = this.outputFields;
    // console.log(inputFields);
    // console.log(outputFields);
    // console.log(typeof inputFields);
    let cnt = 0;

    if (lang === "cpp") {
      // TAKE INPUT

      let inputCode: string = "";
      for (let i = 0; i < inputFields.length; i++) {
        // console.log(inputFields[i].type);
        if (
          inputFields[i].type === "int" ||
          inputFields[i].type === "float" ||
          inputFields[i].type === "double" ||
          inputFields[i].type === "char" ||
          inputFields[i].type === "string" ||
          inputFields[i].type === "bool" ||
          inputFields[i].type === "long" ||
          inputFields[i].type === "long long"
        ) {
          inputCode += InputSimpleDateTypes(
            inputFields[i].type,
            inputFields[i].name,
          );
        } else if (
          inputFields[i].type === "vector<int>" ||
          inputFields[i].type === "vector<float>" ||
          inputFields[i].type === "vector<double>" ||
          inputFields[i].type === "vector<char>" ||
          inputFields[i].type === "vector<string>" ||
          inputFields[i].type === "vector<bool>" ||
          inputFields[i].type === "vector<long>" ||
          inputFields[i].type === "vector<long long>"
        ) {
          cnt += 1;
          inputCode += InputSingleVector(
            inputFields[i].type,
            inputFields[i].name,
            cnt,
          );
        } else if (
          inputFields[i].type === "vector<vector<int>>" ||
          inputFields[i].type === "vector<vector<float>>" ||
          inputFields[i].type === "vector<vector<double>>" ||
          inputFields[i].type === "vector<vector<char>>" ||
          inputFields[i].type === "vector<vector<string>>" ||
          inputFields[i].type === "vector<vector<bool>>" ||
          inputFields[i].type === "vector<vector<long>>" ||
          inputFields[i].type === "vector<vector<long long>>"
        ) {
          cnt += 1;
          inputCode += InputMultipleVector(
            inputFields[i].type,
            inputFields[i].name,
            cnt,
          );
        }
      }

      // console.log(inputCode);

      // PRINT OUTPUT CODE TO COMARE WITH ANS

      let outputCode = "";
      for (let i = 0; i < outputFields.length; i++) {
        if (
          outputFields[i].type === "int" ||
          outputFields[i].type === "float" ||
          outputFields[i].type === "double" ||
          outputFields[i].type === "char" ||
          outputFields[i].type === "string" ||
          outputFields[i].type === "bool" ||
          outputFields[i].type === "long" ||
          outputFields[i].type === "long long"
        ) {
          outputCode += `cout<<ans<<endl;`;
        } else if (
          outputFields[i].type === "vector<int>" ||
          outputFields[i].type === "vector<float>" ||
          outputFields[i].type === "vector<double>" ||
          outputFields[i].type === "vector<char>" ||
          outputFields[i].type === "vector<string>" ||
          outputFields[i].type === "vector<bool>" ||
          outputFields[i].type === "vector<long>" ||
          outputFields[i].type === "vector<long long>"
        ) {
          outputCode += `cout<<ans.size()<<endl; \n`;
          outputCode += `for(int i = 0; i < ans.size(); i++) {cout<<ans[i]<<" ";} cout<<endl; `;
        } else if (
          outputFields[i].type === "vector<vector<int>>" ||
          outputFields[i].type === "vector<vector<float>>" ||
          outputFields[i].type === "vector<vector<double>>" ||
          outputFields[i].type === "vector<vector<char>>" ||
          outputFields[i].type === "vector<vector<string>>" ||
          outputFields[i].type === "vector<vector<bool>>" ||
          outputFields[i].type === "vector<vector<long>>" ||
          outputFields[i].type === "vector<vector<long long>>"
        ) {
          outputCode += `cout<<ans.size()<<" "<<ans[0].size()<<endl; \n`;
          outputCode += `
for(int i=0; i<ans.size(); i++){
    for(int j=0; j<ans[0].size(); j++){
        cout<<ans[i][j]<<" ";
    }
       cout<<endl;
}
cout<<endl;
`;
        }
      }

      // How to write the function call
      let functionCall = "";
      functionCall += this.functionName + "(";
      for (let i = 0; i < inputFields.length; i++) {
        functionCall += inputFields[i].name;
        functionCall += " ";
        if (i != inputFields.length - 1) {
          functionCall += ",";
        }
      }
      functionCall = functionCall.slice(0, -1);
      functionCall += ");\n";

      //TODO: we have the add the user function here
      return `
#include <bits/stdc++.h>
using namespace std;

// Add user function here

int  main(){

int tc= //Enter the exact testcase number ;
while(tc--){
${inputCode}
${outputFields[0].type} ans = ${functionCall}
${outputCode}
cout<<"$$$"<<endl;

}
return 0;
}
`;
    }

    return "";
  }
}

// const obj = new FullBoilerCodeGenerator();
//
// obj.parse(`
// Problem Name: "Problem Name"
// Function Name: "maxoftwonumber"
// Input Structure:
// Input Field: int a
// Input Field: float f
// Input Field: vector<vector<int>> v1
// Input Field: vector<vector<string>> v2
// Input Field: vector<int> v3
// Input Field: vector<string> v4
// Output Structure:
// Output Field: vector<vector<string>>
// `);
//
// console.log(obj.generateCpp());
