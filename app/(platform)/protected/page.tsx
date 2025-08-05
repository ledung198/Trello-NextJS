import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { BoardList } from "./_components/board-list";

const ProtectedPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const boards = await db.board.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full mb-20">
      <div className="px-2 md:px-4">
        <div className="mb-2">
          <h1 className="text-2xl font-semibold text-neutral-700">
            Your Boards
          </h1>
        </div>
        <BoardList boards={boards} />
      </div>
    </div>
  );
};

export default ProtectedPage;
