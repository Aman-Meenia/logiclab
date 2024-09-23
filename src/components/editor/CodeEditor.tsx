"use client";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import React from "react";
import { languageType } from "./Editor";

const CodeEditor = ({
  langName,
  editorRef,
  userCode,
  setUserCode,
}: {
  langName: languageType;
  editorRef: any;
  userCode: string;
  setUserCode: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { theme } = useTheme();
  return (
    <Editor
      height="100%"
      theme={theme === "light" ? "vs-dark" : "vs-dark"}
      path={langName.name}
      defaultLanguage={langName.submitCode}
      value={userCode}
      onMount={(editor) => (editorRef.current = editor)}
      onChange={(value) => {
        setUserCode(value || "");
      }}
      options={{
        lineNumbers: (lineNumber: number) => `${lineNumber + 4}`,
        fontSize: 16,
        lineDecorationsWidth: 2,
        minimap: { enabled: false },
      }}
    />
  );
};

export default CodeEditor;
