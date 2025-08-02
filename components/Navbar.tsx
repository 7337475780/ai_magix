"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import AuthModal from "./AuthModal";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { BiLogOut } from "react-icons/bi";

const Navbar = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed Out", {
      description: "You have been logged out",
    });
  };

  return (
    <div className="h-16 items-center flex justify-between px-4 border w-full">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/favicon.png"
          width={40}
          height={40}
          alt="logo"
          className="w-10 h-auto"
        />
        <span className="text-xl font-semibold">AIMagix</span>
      </Link>

      {session ? (
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={session.user?.image || ""}
              alt={`${session.user?.name}'s avatar`}
            />
            <AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <Button
            className="border-gray-300 hover:bg-red-50 bg-red-600 text-white  cursor-pointer hover:text-red-600 flex items-center gap-1 transition-colors"
            size="sm"
            onClick={handleSignOut}
          >
            <BiLogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      ) : (
        <Button
          className="bg-gradient-to-r from-purple-500 cursor-pointer to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-sm"
          onClick={() => setOpen(true)}
        >
          Sign In
        </Button>
      )}

      <AuthModal open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default Navbar;
