"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function AuthModal({ open, onOpenChange }: AuthDialogProps) {
  const handleSignIn = async (provider: "google" | "github" | "email") => {
    try {
      await signIn(provider);
      toast.success("Redirecting to sign in...", {
        description: `Using ${provider === "github" ? "GitHub" : "Email"}`,
      });
    } catch (err) {
      toast.error("Authentication failed", {
        description: "Something went wrong.Try again",
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Sign in to AIMagix
          </DialogTitle>
        </DialogHeader>
        <div className=" text-sm text-gray-500 px-2 pb-2 text-center">
          Please sign in to generate and save AI images
        </div>
        <DialogFooter className="flex flex-col gap-2">
          <div className="w-full gap-2 flex flex-col">
            <Button
              onClick={() => {
                signIn("google");
                onOpenChange(false);
              }}
              className="w-full bg-black cursor-pointer hover:bg-gray-900 text-white  flex gap-2 items-center justify-center"
            >
              <FaGoogle className="h-4 w-4" />
              Sign in with Google
            </Button>
            <Button
              onClick={() => {
                signIn("github");
                onOpenChange(false);
              }}
              className="w-full bg-black cursor-pointer hover:bg-gray-900 text-white  flex gap-2 items-center justify-center"
            >
              <FaGithub className="h-4 w-4" />
              Sign in with GitHub
            </Button>
            <Button
              onClick={() => {
                signIn("email");
                onOpenChange(false);
              }}
              className=" cursor-pointer bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white flex items-center gap-2 w-full"
            >
              <BiLogoGmail className="h-4 w-4 " />
              Sign in with Email
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
