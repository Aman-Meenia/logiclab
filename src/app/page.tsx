import HomePage from "@/components/home/HomePage";
import Link from "next/link";

export type problemsType = {
  problemNumber: number;
  difficulty: "easy" | "medium" | "hard";
  problemName: string;
  problemTitle: string;
  _id: string;
};

async function fetchProblems() {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/problem?start=1&end=100`, {
    next: { revalidate: 10 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch problems");
  }

  const data = await res.json();
  return data?.messages?.[0]?.problems || null;
}

function ProblemsLoader({ problems }: { problems: problemsType[] | null }) {
  if (!problems) {
    return <Link href="/login">Login</Link>;
  }
  console.log(problems);
  return <HomePage problems={problems} />;
}

export default async function Home() {
  const problems = await fetchProblems();

  return <ProblemsLoader problems={problems} />;
}
