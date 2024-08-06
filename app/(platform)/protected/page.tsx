"use client";
import React from "react";
// import { currentUser, auth } from "@clerk/nextjs/server";
// import { useAuth, useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

const ProtectedPage = () => {
  //   const { userId } = useAuth();
  //   const user = await currentUser();
  //   const { userId } = auth();
  return (
    <div>
      <UserButton />
    </div>
  );
};

export default ProtectedPage;
