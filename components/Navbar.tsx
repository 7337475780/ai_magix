import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="h-16 items-center flex  border w-full">
      <div className="flex ">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/images/favicon.png"
            width={52}
            style={{ width: "52px", height: "auto" }}
            height={52}
            alt="logo"
          />
          <span className="text-xl">AIMagix</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
