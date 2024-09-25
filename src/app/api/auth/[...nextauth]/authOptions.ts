import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/db/dbConnect";
import bcrypt from "bcryptjs";
import User from "@/models/UserModel";

type loginType = {
  identifier: string;
  password: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      async profile(profile, tokens) {
        await dbConnect();
        try {
          const existingUser = await User.findOne({
            email: profile.email,
          });
          if (existingUser) return existingUser;
          const user = await User.create({
            email: profile.email,
            username: profile.login + Date.now().toString(),
            profilePic: profile.avatar_url,
            isVerified: true,
            password: profile.login,
            otp: generateOTP(),
            otpExpiry: generateOTPExpiryTime(),
          });
          return Promise.resolve(user) as any;
        } catch (err) {
          return Promise.reject(err) as any;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      async profile(profile, tokens) {
        await dbConnect();
        try {
          const existingUser = await User.findOne({
            email: profile.email,
          });
          if (existingUser) return existingUser;
          const user = await User.create({
            email: profile.email,
            username: profile.name.replace(/\s/g, "") + Date.now().toString(),
            profilePic: profile.picture,
            isVerified: true,
            password: profile.name.replace(/\s/g, ""),
            otp: generateOTP(),
            otpExpiry: generateOTPExpiryTime(),
          });
          return Promise.resolve(user) as any;
        } catch (err) {
          return Promise.reject(err) as any;
        }
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: loginType | undefined): Promise<any> {
        await dbConnect();
        try {
          if (!credentials?.identifier || !credentials?.password) {
            throw new Error("Username and password are required");
          }
          const existingUser = await User.findOne({
            $or: [
              { email: credentials?.identifier },
              { username: credentials?.identifier },
            ],
          });

          if (!existingUser) {
            throw new Error("User not found");
          }
          if (!existingUser.isVerified) {
            throw new Error(
              "User is not verified. Please verify your email before login.",
            );
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            existingUser.password,
          );
          if (!isPasswordCorrect) {
            throw new Error("Invalid credentials");
          }
          return existingUser;
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.email = user.email;
        token.image = user?.image;
      }
      // console.log(token);
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.image = token.image;
      }
      return session;
    },
  },
};

// Generate OTP Function

const generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// Generate OTP Expiry Time

const generateOTPExpiryTime = () => {
  const currentTime = new Date();
  const expiryTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
  return expiryTime;
};
