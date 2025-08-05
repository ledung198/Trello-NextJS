"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

export async function createLabel(
  name: string,
  color: string,
  boardId: string
) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!name || name.trim().length === 0) {
    throw new Error("Name is required");
  }

  if (!color || !boardId) {
    throw new Error("Color and Board ID are required");
  }

  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        userId,
      },
    });

    if (!board) {
      throw new Error("Board not found");
    }

    const label = await db.label.create({
      data: {
        name: name.trim(),
        color,
        boardId,
      },
    });

    revalidatePath(`/board/${boardId}`);
    return label;
  } catch (error) {
    console.error("Error creating label:", error);
    throw new Error("Failed to create label");
  }
}