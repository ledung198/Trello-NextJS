import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ListContainer } from "./_components/list-container";

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

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      userId,
    },
  });

  if (!board) {
    redirect("/protected");
  }

  const lists = await db.list.findMany({
    where: {
      boardId: params.boardId,
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
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: board.imageFullUrl ? `url(${board.imageFullUrl})` : undefined,
        backgroundColor: board.imageFullUrl ? undefined : "#0079bf",
      }}
    >
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative pt-28 h-full">
        <div className="px-4">
          <div className="w-full mb-4">
            <div className="flex items-center gap-x-3">
              <h1 className="text-white text-lg font-semibold">
                {board.title}
              </h1>
            </div>
          </div>
          <ListContainer
            boardId={params.boardId}
            data={lists}
          />
        </div>
      </div>
    </div>
  );
};

export default BoardIdPage;