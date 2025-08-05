"use client";

import { Plus, Brain, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <Button
          asChild
          size="sm"
          className="rounded-sm hidden md:block h-auto py-1.5 px-2"
        >
          <Link href="/protected">
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Link>
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <AINavButton />
        <CollaborationButton />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30,
              }
            }
          }}
        />
      </div>
    </nav>
  );
};

const AINavButton = () => {
  const params = useParams();
  
  if (!params.boardId) return null;

  return (
    <Button
      asChild
      size="sm"
      variant="ghost"
      className="rounded-sm h-auto py-1.5 px-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
    >
      <Link href={`/board/${params.boardId}/ai`}>
        <Brain className="h-4 w-4 mr-2" />
        AI Assistant
      </Link>
    </Button>
  );
};

const CollaborationButton = () => {
  return (
    <Button
      size="sm"
      variant="ghost"
      className="rounded-sm h-auto py-1.5 px-2"
    >
      <Users className="h-4 w-4 mr-2" />
      <span className="hidden md:inline">Collaborate</span>
    </Button>
  );
};