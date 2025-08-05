import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "./_components/navbar";

const PlatformLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ClerkProvider>
      <div className="h-full">
        <Navbar />
        {children}
      </div>
    </ClerkProvider>
  );
};

export default PlatformLayout;
