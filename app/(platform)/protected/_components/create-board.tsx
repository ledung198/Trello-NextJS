"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBoard } from "../_actions/create-board";
import { useRouter } from "next/navigation";

export const CreateBoard = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const board = await createBoard(title);
      if (board) {
        router.push(`/board/${board.id}`);
      }
    } catch (error) {
      console.error("Error creating board:", error);
    } finally {
      setIsLoading(false);
      setTitle("");
      setIsCreating(false);
    }
  };

  if (isCreating) {
    return (
      <form onSubmit={onSubmit} className="aspect-video relative">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter board title..."
          className="h-full border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          autoFocus
          onBlur={() => {
            if (!title.trim()) {
              setIsCreating(false);
            }
          }}
          disabled={isLoading}
        />
        <div className="absolute bottom-2 right-2">
          <Button type="submit" size="sm" disabled={isLoading}>
            Create
          </Button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsCreating(true)}
      className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
    >
      <Plus className="h-4 w-4" />
      <p className="text-sm">Create new board</p>
    </button>
  );
};