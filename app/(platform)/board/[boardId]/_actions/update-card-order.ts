"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

export async function updateCardOrder(
  items: { id: string; title: string; order: number; listId: string }[],
  boardId: string
) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    // Verify user has access to this board
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        userId,
      },
    });

    if (!board) {
      throw new Error("Board not found");
    }

    const transaction = items.map((card) =>
      db.card.update({
        where: {
          id: card.id,
          list: {
            board: {
              userId,
            },
          },
        },
        data: {
          order: card.order,
          listId: card.listId,
        },
      })
    );

    await db.$transaction(transaction);

    revalidatePath(`/board/${boardId}`);
  } catch (error) {
    console.error("Error updating card order:", error);
    throw new Error("Failed to update card order");
  }
}