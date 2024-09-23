"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRender = ({ markdownContent }: { markdownContent: string }) => {
  const markdownStyles = {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "rgba(13, 17, 23)",
    // padding: "20px",
    paddingLeft: "10px",
    paddingRight: "10px",
    borderRadius: "10px",
    height: "100%",
    color: "white",
    fontSize: "1em", // Adjust as per your headings
    lineHeight: "1.6", // Adjust line height
  };

  return (
    <div style={markdownStyles} className=" p-4 h-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="custom-markdown"
        components={{
          h1: ({ node, ...props }) => (
            <h1 style={{ ...markdownStyles, fontSize: "2em" }} {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 style={{ ...markdownStyles, fontSize: "1.5em" }} {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 style={{ ...markdownStyles, fontSize: "1.2em" }} {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 style={{ ...markdownStyles, fontSize: "1em" }} {...props} />
          ),
          pre: ({ node, ...props }) => (
            <pre
              style={{
                backgroundColor: "rgba(22, 27, 34)",
                color: "#f9f9f9",
                padding: "10px",
                borderRadius: "5px",
              }}
              {...props}
            />
          ),
          code: ({ node, ...props }) => (
            <code
              style={{ padding: "2px 4px", borderRadius: "3px" }}
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              style={{ listStyleType: "disc", marginLeft: "20px" }}
              {...props}
            />
          ),
          br: ({ node, ...props }) => (
            <br
              style={{ display: "block", margin: "10px 0", content: " " }}
              {...props}
            />
          ),
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRender;
