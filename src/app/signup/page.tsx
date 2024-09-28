"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaSquareGithub } from "react-icons/fa6";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const signUpSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Required" })
    .max(20, { message: "Must be 20 characters or less" })
    .regex(/^[a-z0-9]+$/i, {
      message: "Username can only contain letters and numbers",
    }),
  email: z
    .string()
    .min(1, { message: "Required" })
    .email({ message: "Invalid email" }),
  password: z
    .string()
    .min(1, { message: "Required" })
    .min(8, { message: "Must be 8 characters or more" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Required" })
    .min(8, { message: "Must be 8 characters or more" }),
});

export default function SignUpPage() {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // handle submit
  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Password and confirm password not match ", {
        position: "top-center",
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }
    setLoading(true);
    await axios
      .post(`${domain}/api/signup`, {
        username: values.username,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.success === "true") {
          toast.success(response.data.message, {
            position: "top-center",
            style: {
              background: "#333",
              color: "#fff",
            },
          });
          router.push(`/login`);
        } else {
          toast.error(response.data.message, {
            position: "top-center",
            style: {
              background: "#333",
              color: "#fff",
            },
          });
        }
      })
      .catch((error) => {
        toast.error("Server is down please try again later", {
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
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
      <div className="flex justify-center items-center  min-h-[calc(100vh-60px)]  bg-gray-100 dark:bg-[rgba(13,17,23)]">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white ">
              Sign Up Page
            </h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    {/* <FormDescription> */}
                    {/* <Loader2 className="animate-spin" /> */}
                    {/* <span className="text-sm text-green-500"> */}
                    {/* Username is available */}
                    {/* </span> */}
                    {/* </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
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
              <FormField
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
          <div className="o-auth border-t border-solid border-gray-300 dark:border-gray-700 p-3">
            <p className="text-center mb-3">or Sign up with</p>
            <div className="flex justify-center gap-6 align-middle">
              <div
                onClick={handleGoogleLogin}
                className="h-11 flex cursor-pointer border border-solid bg-black text-white dark:bg-white dark:text-black px-6 py-1 rounded hover:dark:bg-gray-200"
              >
                <div className="mr-4 mt-1 h-fit">Google</div>
                <FcGoogle className="w-8 h-8 " />
              </div>
              <div
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
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 hover:text-blue-700">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
