"use client";

import { useState, useRef, ElementRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createList } from "../_actions/create-list";

export const ListForm = () => {
  const params = useParams();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
    setTitle("");
  };

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = params.boardId as string;

    if (!title) {
      return;
    }

    setIsLoading(true);
    try {
      await createList(title, boardId);
      setTitle("");
      disableEditing();
      router.refresh();
    } catch (error) {
      console.error("Error creating list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <li className="shrink-0 h-full w-[272px] select-none">
        <form
          action={onSubmit}
          ref={formRef}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
        >
          <Input
            ref={inputRef}
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
            placeholder="Enter list title..."
            disabled={isLoading}
          />
          <div className="flex items-center gap-x-1">
            <Button
              type="submit"
              disabled={isLoading}
              size="sm"
            >
              Add list
            </Button>
            <Button
              onClick={disableEditing}
              size="sm"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <button
        onClick={enableEditing}
        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a list
      </button>
    </li>
  );
};