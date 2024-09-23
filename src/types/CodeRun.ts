// {
//   "problemId": "66879fd73f90b0ed8b11aac5",
//   "userId": "66879fd73f90b0ed8b11aac5",
//   "code": "bool isPalindrome(string &s){\n    \n    int n = s.size();\n\nint low =0;\nint high = n-1;\n\nwhile(low<=high){\nif(s[low\n            ]!=s[high\n            ]){\n    return false;\n            }\nlow++;\nhigh--;\n        }\n\nreturn true;\n    }\n\nstring longestPalindrome(string s) {\n        // Implementation goes here\n\nstring ans=\"\";\n\nfor(int i=0; i<s.size(); i++){\n    string t;\n    for(int j=i; j<s.size(); j--){\nt.push_back(s[j\n                ]);\n\nif(isPalindrome(t)){\nif(t.size()>ans.size()){\nans = t;\n                    }\n                }\n            }\n        }\n\n    return ans;\n    }",
//   "language": "cpp",
//   "problemTitle": "Longest-Palindrome-Substring",
//   "flag":"run"
// }

interface codeRunType {
  problemId: string;
  userId: string;
  code: string;
  language: string;
  problemTitle: string;
  flag: "run" | "submit";
}
