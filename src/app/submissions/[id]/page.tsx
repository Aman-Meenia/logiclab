import React from "react";
import axios from "axios";

import PageNotFound from "@/components/pageNotFound/PageNotFound";
import DisplaySubmissionDetails from "./DisplaySubmissionDetails";

const domain = process.env.NEXT_PUBLIC_DOMAIN;
export type submissionDetailType = {
  _id: string;
  problemId: {
    _id: string;
    problemName: string;
    problemTitle: string;
  };
  userId: string;
  language: string;
  status: string;
  code: string;
  time: string;
  memory: string;
  createdAt: string;
};

async function getSubmissionDetail(submissionId: string) {
  const res = await axios
    .post(`${domain}/api/latest-submissions`, {
      submissionId: submissionId,
    })
    .then((res) => {
      if (res?.data?.success === "true") {
        return res.data;
      }
      return null;
    })
    .catch(() => {
      return null;
    });
  return res?.messages?.[0]?.[0] || null;
}

const ProblemPage = async ({ params }: { params: { id: string } }) => {
  const submissionFind: submissionDetailType | null = await getSubmissionDetail(
    params.id,
  );
  if (!submissionFind) {
    return <PageNotFound />;
  } else {
    // console.log("<================= Submission Find =====================>");
    // console.log(submissionFind);
    return <DisplaySubmissionDetails submissionDetails={submissionFind} />;
  }
};

export default ProblemPage;
