import ProfilePage from "@/components/profile/Profile";
import axios from "axios";

export type submissionProfileType = {
  _id: string;
  problemId: {
    _id: string;
    problemName: string;
  };
  createdAt: string;
};

export type profileType = {
  username: string;
  profilePic: string;
  totalSolvedCount: number;
  totalProblemCount: number;
  easyProblemCount: number;
  easySolvedCount: number;
  mediumProblemCount: number;
  mediumSolvedCount: number;
  hardProblemCount: number;
  hardSolvedCount: number;
  submissions: submissionProfileType[];
};

async function fetchProfile() {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;

  const res = await axios
    .get(`${domain}/api/profile`)
    .then((res) => {
      console.log("data fetched succesfully");
      console.log(res.data);
      return res;
    })
    .catch((err) => {
      console.log("Error in profile page ");
      console.log(err.response?.data);
      return err.response;
    });

  if (res?.data?.success === "true" && res?.data?.messages[0]) {
    return res?.data?.messages[0];
  }
  return null;
}

export default async function Profile() {
  // const profileDetails: profileType | null = await fetchProfile();
  const profileDetails = null;
  if (!profileDetails) {
    //TODO: Add the page if the profile detail fetch fails
    return (
      <div>
        <h1> Error while fetching the Profile</h1>
      </div>
    );
  } else return <ProfilePage profileDetails={profileDetails} />;
}
