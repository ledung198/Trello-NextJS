"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

export async function updateListOrder(
  items: { id: string; title: string; order: number }[],
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

    const transaction = items.map((list) =>
      db.list.update({
        where: {
          id: list.id,
          board: {
            userId,
          },
        },
        data: {
          order: list.order,
        },
      })
    );

    await db.$transaction(transaction);

    revalidatePath(`/board/${boardId}`);
  } catch (error) {
    console.error("Error updating list order:", error);
    throw new Error("Failed to update list order");
  }
}