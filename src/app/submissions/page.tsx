"use client";
import { useState, useEffect } from "react";
import DisplaySubmissions from "@/components/Submissions/DisplaySubmissions";
import axios from "axios";
import SubmissionsSkeleton from "@/components/Submissions/SubmissionsSkeleton";

export type submissionType = {
  _id: string;
  problemId: {
    _id: string;
    problemName: string;
  };
  createdAt: string;
  language: string;
  status: string;
  totalProblems: number;
};

const ITEMS_PER_PAGE = 20;

async function fetchSubmissions(page: number, limit: number) {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await axios
    .get(`${domain}/api/latest-submissions?page=${page}&limit=${limit}`, {
      withCredentials: true,
    })
    .then((res) => {
      if (res?.data?.success === "true") {
        return res?.data?.messages[0];
      }
      return null;
    })
    .catch((err) => {
      return null;
    });
  return res;
}

export default function Submissions() {
  const [submissions, setSubmissions] = useState<submissionType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSubmissions() {
      setIsLoading(true);
      const data = await fetchSubmissions(1, ITEMS_PER_PAGE);
      setSubmissions(data);
      setIsLoading(false);
    }

    loadSubmissions();
  }, []);

  if (isLoading) {
    return <SubmissionsSkeleton />;
  }

  if (!submissions) {
    return <SubmissionsSkeleton />;
  }

  return (
    <>
      <DisplaySubmissions submissions={submissions} />
    </>
  );
}

// import DisplaySubmissions from "@/components/Submissions/DisplaySubmissions";
// import axios from "axios";
//
// export type submissionType = {
//   _id: string;
//   problemId: {
//     _id: string;
//     problemName: string;
//   };
//   createdAt: string;
//   language: string;
//   status: string;
//   totalProblems: number;
// };
// const page = 1;
// const limit = 20;
//
// async function fetchSubmissions() {
//   const domain = process.env.NEXT_PUBLIC_DOMAIN;
//   const res = await axios
//     .get(`${domain}/api/latest-submissions?page=${page}&limit=${limit}`)
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => {
//       return err?.response;
//     });
//
//   if (res?.data?.success === "true" && res?.data?.messages[0]) {
//     return res.data.messages[0];
//   }
//   return null;
// }
//
// export default async function Submissions() {
//   // const submissions: submissionType[] | null = await fetchSubmissions();
//
//   const submissions = null;
//   if (!submissions) {
//     //TODO: Add the page if unable to fetchSubmissons
//     return (
//       <>
//         <div>
//           <h1> Unable to fetch Submissions</h1>
//         </div>
//       </>
//     );
//   }
//   return <DisplaySubmissions submissions={submissions} />;
// }
