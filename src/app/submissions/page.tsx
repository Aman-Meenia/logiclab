import DisplaySubmissions from "@/components/Submissions/DisplaySubmissions";
import axios from "axios";

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
const page = 1;
const limit = 20;

async function fetchSubmissions() {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await axios
    .get(`${domain}/api/latest-submissions?page=${page}&limit=${limit}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err?.response;
    });

  if (res?.data?.success === "true" && res?.data?.messages[0]) {
    return res.data.messages[0];
  }
  return null;
}

export default async function Submissions() {
  // const submissions: submissionType[] | null = await fetchSubmissions();

  const submissions = null;
  if (!submissions) {
    //TODO: Add the page if unable to fetchSubmissons
    return (
      <>
        <div>
          <h1> Unable to fetch Submissions</h1>
        </div>
      </>
    );
  }
  return <DisplaySubmissions submissions={submissions} />;
}
