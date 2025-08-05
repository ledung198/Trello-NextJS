"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

export async function createCard(title: string, listId: string, boardId: string) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!title || title.trim().length === 0) {
    throw new Error("Title is required");
  }

  if (!listId || !boardId) {
    throw new Error("List ID and Board ID are required");
  }

  try {
    const list = await db.list.findUnique({
      where: {
        id: listId,
        board: {
          userId,
        },
      },
    });

    if (!list) {
      throw new Error("List not found");
    }

    const lastCard = await db.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    const card = await db.card.create({
      data: {
        title: title.trim(),
        listId,
        order: newOrder,
      },
    });

    revalidatePath(`/board/${boardId}`);
    return card;
  } catch (error) {
    console.error("Error creating card:", error);
    throw new Error("Failed to create card");
  }
}