import { SignOutButton, SignUpButton } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <div>
      <SignUpButton />
      <hr />
      <SignOutButton />
    </div>
  );
};

export default page;
