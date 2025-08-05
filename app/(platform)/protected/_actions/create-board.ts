"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

export async function createBoard(title: string) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!title || title.trim().length === 0) {
    throw new Error("Title is required");
  }

  try {
    const board = await db.board.create({
      data: {
        title: title.trim(),
        userId,
      },
    });

    revalidatePath("/protected");
    return board;
  } catch (error) {
    console.error("Error creating board:", error);
    throw new Error("Failed to create board");
  }
}