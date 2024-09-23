"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Define more specific types for our components
type CommonProps = {
  node?: any;
  children?: React.ReactNode;
};

type HeadingProps = CommonProps & React.HTMLAttributes<HTMLHeadingElement>;
type CodeProps = CommonProps &
  React.HTMLAttributes<HTMLElement> & {
    inline?: boolean;
    className?: string;
  };
type PreProps = CommonProps & React.HTMLAttributes<HTMLPreElement>;
type ListProps = CommonProps & React.HTMLAttributes<HTMLUListElement>;
type BreakProps = CommonProps & React.HTMLAttributes<HTMLBRElement>;

const RenderTestCaseInput = ({ testCaseInput }: { testCaseInput: string }) => {
  const markdownStyles = {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "rgba(13, 17, 23)",
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    color: "white",
    fontSize: "1em",
    lineHeight: "1.6",
    overflowWrap: "break-word" as const,
    wordWrap: "break-word" as const,
  };

  const components = {
    h1: ({ node, ...props }: HeadingProps) => (
      <h1 style={{ ...markdownStyles, fontSize: "2em" }} {...props} />
    ),
    h2: ({ node, ...props }: HeadingProps) => (
      <h2 style={{ ...markdownStyles, fontSize: "1.5em" }} {...props} />
    ),
    h3: ({ node, ...props }: HeadingProps) => (
      <h3 style={{ ...markdownStyles, fontSize: "1.2em" }} {...props} />
    ),
    h4: ({ node, ...props }: HeadingProps) => (
      <h4 style={{ ...markdownStyles, fontSize: "1em" }} {...props} />
    ),
    pre: ({ node, ...props }: PreProps) => (
      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        <pre
          style={{
            backgroundColor: "rgba(22, 27, 34)",
            color: "#f9f9f9",
            padding: "10px",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          {...props}
        />
      </div>
    ),
    code: ({ inline, className, children, ...props }: CodeProps) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline ? (
        <pre
          style={{
            display: "block",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            backgroundColor: "rgba(22, 27, 34)",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code
          className={className}
          style={{ padding: "2px 4px", borderRadius: "3px" }}
          {...props}
        >
          {children}
        </code>
      );
    },
    ul: ({ node, ...props }: ListProps) => (
      <ul style={{ listStyleType: "disc", marginLeft: "20px" }} {...props} />
    ),
    br: ({ node, ...props }: BreakProps) => (
      <br
        style={{ display: "block", margin: "10px 0", content: " " }}
        {...props}
      />
    ),
  };

  return (
    <div style={markdownStyles}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="custom-markdown"
        components={components}
      >
        {testCaseInput}
      </ReactMarkdown>
    </div>
  );
};

export default RenderTestCaseInput;
// "use client";
// import React from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
//
// const RenderTestCaseInput = ({ testCaseInput }: { testCaseInput: string }) => {
//   const markdownStyles = {
//     fontFamily: "Arial, sans-serif",
//     backgroundColor: "rgba(13, 17, 23)",
//     width: "100%",
//     padding: "10px",
//     borderRadius: "10px",
//     color: "white",
//     fontSize: "1em",
//     lineHeight: "1.6",
//     overflowWrap: "break-word" as const,
//     wordWrap: "break-word" as const,
//   };
//
//   return (
//     <div style={markdownStyles}>
//       <ReactMarkdown
//         remarkPlugins={[remarkGfm]}
//         className="custom-markdown"
//         components={{
//           h1: ({ node, ...props }) => (
//             <h1 style={{ ...markdownStyles, fontSize: "2em" }} {...props} />
//           ),
//           h2: ({ node, ...props }) => (
//             <h2 style={{ ...markdownStyles, fontSize: "1.5em" }} {...props} />
//           ),
//           h3: ({ node, ...props }) => (
//             <h3 style={{ ...markdownStyles, fontSize: "1.2em" }} {...props} />
//           ),
//           h4: ({ node, ...props }) => (
//             <h4 style={{ ...markdownStyles, fontSize: "1em" }} {...props} />
//           ),
//           pre: ({ node, ...props }) => (
//             <div style={{ overflowX: "auto", maxWidth: "100%" }}>
//               <pre
//                 style={{
//                   backgroundColor: "rgba(22, 27, 34)",
//                   color: "#f9f9f9",
//                   padding: "10px",
//                   borderRadius: "5px",
//                   whiteSpace: "pre-wrap",
//                   wordBreak: "break-word",
//                 }}
//                 {...props}
//               />
//             </div>
//           ),
//           code: ({ node, inline, ...props }) =>
//             inline ? (
//               <code
//                 style={{ padding: "2px 4px", borderRadius: "3px" }}
//                 {...props}
//               />
//             ) : (
//               <code
//                 style={{
//                   display: "block",
//                   overflowX: "auto",
//                   whiteSpace: "pre-wrap",
//                   wordBreak: "break-word",
//                 }}
//                 {...props}
//               />
//             ),
//           ul: ({ node, ...props }) => (
//             <ul
//               style={{ listStyleType: "disc", marginLeft: "20px" }}
//             {...props}
//           />
//         ),
//         br: ({ node, ...props }) => (
//           <br
//             style={{ display: "block", margin: "10px 0", content: " " }}
//             {...props}
//           />
//         ),
//       }}
//     >
//       {testCaseInput}
//     </ReactMarkdown>
//   </div>
// );
// };
//
// export default RenderTestCaseInput;
// "use client";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import React from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
//
// const RenderTestCaseInput = ({ testCaseInput }: { testCaseInput: string }) => {
//   const markdownStyles = {
//     fontFamily: "Arial, sans-serif",
//     backgroundColor: "rgba(13, 17, 23)",
//     // padding: "20px",
//     width: "100%",
//     paddingLeft: "10px",
//     paddingRight: "10px",
//     borderRadius: "10px",
//     color: "white",
//     fontSize: "1em", // Adjust as per your headings
//     lineHeight: "1.6", // Adjust line height
//   };
//
//   return (
//     <div style={markdownStyles}>
//       <ReactMarkdown
//         remarkPlugins={[remarkGfm]}
//         className="custom-markdown"
//         components={{
//           h1: ({ node, ...props }) => (
//             <h1 style={{ ...markdownStyles, fontSize: "2em" }} {...props} />
//           ),
//           h2: ({ node, ...props }) => (
//             <h2 style={{ ...markdownStyles, fontSize: "1.5em" }} {...props} />
//           ),
//           h3: ({ node, ...props }) => (
//             <h3 style={{ ...markdownStyles, fontSize: "1.2em" }} {...props} />
//           ),
//           h4: ({ node, ...props }) => (
//             <h4 style={{ ...markdownStyles, fontSize: "1em" }} {...props} />
//           ),
//           pre: ({ node, ...props }) => (
//             <pre
//               style={{
//                 backgroundColor: "rgba(22, 27, 34)",
//                 color: "#f9f9f9",
//                 padding: "10px",
//                 borderRadius: "5px",
//               }}
//               {...props}
//             />
//           ),
//           code: ({ node, ...props }) => (
//             <code
//               style={{ padding: "2px 4px", borderRadius: "3px" }}
//               {...props}
//             />
//           ),
//           ul: ({ node, ...props }) => (
//             <ul
//               style={{ listStyleType: "disc", marginLeft: "20px" }}
//               {...props}
//             />
//           ),
//           br: ({ node, ...props }) => (
//             <br
//               style={{ display: "block", margin: "10px 0", content: " " }}
//               {...props}
//             />
//           ),
//         }}
//       >
//         {testCaseInput}
//       </ReactMarkdown>
//     </div>
//   );
// };
//
// export default RenderTestCaseInput;
