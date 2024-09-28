"use client";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaSquareGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const signInSchema = z.object({
  identifier: z.string().min(1, { message: "Required" }),
  password: z.string().min(1, { message: "Required" }),
});

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setLoading(true);
    const response = await signIn("credentials", {
      identifier: values.identifier,
      password: values.password,
      redirect: false,
    });
    // console.log("RESPONSE " + response);
    // console.log(response);
    if (response?.error) {
      // console.log(response.error);
      let error = response.error;
      error = error.replace("Error:", "");
      toast.error(error, {
        position: "top-center",
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      setLoading(false);

      return;
    }

    router.push("/");
    setLoading(false);
  }

  async function handleGithubLogin() {
    const response = await signIn("github", {
      callbackUrl: "/",
      redirect: true,
    });
    if (response?.error) {
      console.log("ERROR IS " + response.error);
      console.log(response.error);
    }
  }

  async function handleGoogleLogin() {
    const response = await signIn("google", {
      callbackUrl: "/",
      redirect: true,
    });
    if (response?.error) {
      console.log("ERROR IS " + response.error);
      console.log(response.error);
    }
  }

  return (
    <>
      <div className="flex justify-center items-center  min-h-[calc(100vh-60px)]  bg-gray-100  dark:bg-[rgba(13,17,23)]">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Login Page!
            </h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Username or Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Link
                  // TODO: Create forgot password Page

                  className="text-blue-500 hover:text-blue-700"
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button
                className="w-full hover:dark:bg-gray-200"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
          <div className="o-auth border-t border-solid border-gray-300 dark:border-gray-700 p-3">
            <p className="text-center mb-3">or Login with</p>
            <div className="flex justify-center gap-6 align-middle">
              <div
                // TODO: Add google login

                onClick={handleGoogleLogin}
                className="h-11 flex cursor-pointer border border-solid bg-black text-white dark:bg-white dark:text-black px-6 py-1 rounded  hover:dark:bg-gray-200"
              >
                <div className="mr-4 mt-1 h-fit">Google</div>
                <FcGoogle className="w-8 h-8" />
              </div>
              <div
                // TODO: Add github login
                onClick={handleGithubLogin}
                className="h-11 flex cursor-pointer border border-solid bg-black text-white dark:bg-white dark:text-black px-6 py-1 rounded hover:dark:bg-gray-200"
              >
                <div className="mr-4 mt-1 h-fit">Github</div>
                <FaSquareGithub className="w-8 h-8 cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <p>
              Dont have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-500 hover:text-blue-700"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
