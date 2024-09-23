"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ProblemRenderer = ({
  problemDescription,
}: {
  problemDescription: string;
}) => {
  const markdownStyles = {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "rgba(13, 17, 23)",
    // padding: "20px",
    paddingLeft: "10px",
    paddingRight: "10px",
    borderRadius: "10px",
    color: "white",
    fontSize: "1em", // Adjust as per your headings
    lineHeight: "1.6", // Adjust line height
  };

  return (
    <ScrollArea className="h-[calc(100vh-120px)] rounded-md">
      <div style={markdownStyles}>
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
          {problemDescription}
        </ReactMarkdown>
      </div>
    </ScrollArea>
  );
};

export default ProblemRenderer;

// "use client";
//
// import React from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import styled from "styled-components";
//
// const MarkdownContainer = styled.div`
//   font-family: Arial, sans-serif;
//   background-color: rgba(13, 17, 23);
//   padding: 20px;
//   border-radius: 10px;
//   height: 100%;
//
//   h1 {
//     font-size: 2em;
//     color: white;
//   }
//
//   h2 {
//     font-size: 1.5em;
//     color: white;
//   }
//   h3 {
//     font-size: 1.2em;
//     color: white;
//   }
//   h4 {
//     font-size: 1em;
//     color: white;
//   }
//
//   pre {
//     background-color: rgba(22, 27, 34);
//     color: #f9f9f9;
//     padding: 10px;
//     border-radius: 5px;
//   }
//
//   code {
//     padding: 2px 4px;
//     border-radius: 3px;
//   }
//
//   ul {
//     list-style-type: disc;
//     margin-left: 20px;
//   }
//
//   br {
//     display: block;
//     margin: 10px 0;
//     content: " ";
//   }
// `;
//
// const ProblemRenderer = ({
//   problemDescription,
// }: {
//   problemDescription: string;
// }) => {
//   return (
//     <MarkdownContainer>
//       <ReactMarkdown remarkPlugins={[remarkGfm]}>
//         {problemDescription}
//       </ReactMarkdown>
//     </MarkdownContainer>
//   );
// };
//
// export default ProblemRenderer;
