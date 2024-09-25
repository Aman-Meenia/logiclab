"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ProfilePage from "@/components/profile/Profile";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

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
    .get(`${domain}/api/profile`, { withCredentials: true })
    .then((res) => {
      if (res?.data?.success === "true") {
        return res?.data?.messages[0] || null;
      }
      return null;
    })
    .catch((err) => {
      return null;
    });
  return res;
}

export default function Profile() {
  const [profileDetails, setProfileDetails] = useState<profileType | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      const data = await fetchProfile();
      setProfileDetails(data);
      setIsLoading(false);
    }

    loadProfile();
  }, []);

  // console.log("<================== Profile Details=============>");
  // console.log(profileDetails);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!profileDetails) {
    return <ProfileSkeleton />;
  }

  return <ProfilePage profileDetails={profileDetails} />;
}

// import ProfilePage from "@/components/profile/Profile";
// import axios from "axios";
//
// export type submissionProfileType = {
//   _id: string;
//   problemId: {
//     _id: string;
//     problemName: string;
//   };
//   createdAt: string;
// };
//
// export type profileType = {
//   username: string;
//   profilePic: string;
//   totalSolvedCount: number;
//   totalProblemCount: number;
//   easyProblemCount: number;
//   easySolvedCount: number;
//   mediumProblemCount: number;
//   mediumSolvedCount: number;
//   hardProblemCount: number;
//   hardSolvedCount: number;
//   submissions: submissionProfileType[];
// };
//
// async function fetchProfile() {
//   const domain = process.env.NEXT_PUBLIC_DOMAIN;
//
//   const res = await axios
//     .post(`${domain}/api/profile`, {
//       userId: "ashfdoi1032ui31j",
//     })
//     .then((res) => {
//       console.log("data fetched succesfully");
//       console.log(res.data);
//       return res;
//     })
//     .catch((err) => {
//       console.log("Error in profile page ");
//       console.log(err);
//       return err.response;
//     });
//   // const res = await fetch(`${domain}/api/profile`, {
//   //   next: { revalidate: 3600 },
//   // });
//   //
//   // if (!res.ok) {
//   //   throw new Error("Failed to fetch your profile");
//   // }
//   // const data = await res.json();
//   // if (res?.data?.success === "true" && res?.data?.messages[0]) {
//   //   return res?.data?.messages[0];
//   // }
//   // console.log("Data is " + data);
//   return res?.data?.messages?.[0] || null;
// }
//
// function ProfileLoader({
//   profileDetails,
// }: {
//   profileDetails: profileType | null;
// }) {
//   console.log(profileDetails);
//   if (!profileDetails) {
//     //TODO: Add the page if the profile detail fetch fails
//     return (
//       <div>
//         <h1> Error while fetching the Profile</h1>
//       </div>
//     );
//   }
//   return <ProfilePage profileDetails={profileDetails} />;
// }
//
// export default async function Profile() {
//   const profileDetails: profileType | null = await fetchProfile();
//   console.log("<================== Profile Details=============>");
//   console.log(profileDetails);
//   return <ProfileLoader profileDetails={profileDetails} />;
// }
