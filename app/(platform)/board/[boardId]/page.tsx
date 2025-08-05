import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { ListContainer } from "./_components/list-container";
import { RealtimeCollaboration } from "./_components/realtime-collaboration";

interface BoardIdPageProps {
  params: {
    boardId: string;
  };
}

const BoardIdPage = async ({
  params,
}: BoardIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const lists = await db.list.findMany({
    where: {
      boardId: params.boardId,
      board: {
        userId,
      },
    },
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer
        boardId={params.boardId}
        data={lists}
      />
      <RealtimeCollaboration />
    </div>
  );
};

export default BoardIdPage;