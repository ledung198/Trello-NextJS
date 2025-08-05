"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

export async function createList(title: string, boardId: string) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!title || title.trim().length === 0) {
    throw new Error("Title is required");
  }

  if (!boardId) {
    throw new Error("Board ID is required");
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

    const lastList = await db.list.findFirst({
      where: { boardId: boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    const list = await db.list.create({
      data: {
        title: title.trim(),
        boardId,
        order: newOrder,
      },
    });

    revalidatePath(`/board/${boardId}`);
    return list;
  } catch (error) {
    console.error("Error creating list:", error);
    throw new Error("Failed to create list");
  }
}