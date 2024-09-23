"use client";
import React from "react";
import { ModeToggle } from "../theme/ToggleButton";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";

const Header = () => {
  const path = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleUserClick = () => {
    // router.push("/profile");
  };

  return (
    <div className="flex justify-between items-center p-2.5">
      <div className="flex items-center">
        <h1
          className={`text-[24px] font-bold ${
            path === "/" ? "cursor-default" : "cursor-pointer"
          }`}
          onClick={() => {
            path !== "/" && router.push("/");
          }}
        >
          Logic Lab
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        {session ? (
          <div
            className="relative cursor-pointer group"
            onClick={handleUserClick}
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground group-hover:bg-primary/90 transition-colors">
              <User size={20} />
            </div>
          </div>
        ) : (
          <Button
            onClick={() => {
              path !== "/login" && router.push("/login");
            }}
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
