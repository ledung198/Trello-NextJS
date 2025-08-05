"use client";

import { Board } from "@prisma/client";
import { BoardCard } from "./board-card";
import { CreateBoard } from "./create-board";

interface BoardListProps {
  boards: Board[];
}

export const BoardList = ({ boards }: BoardListProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <CreateBoard />
        {boards.map((board) => (
          <BoardCard
            key={board.id}
            id={board.id}
            title={board.title}
            imageThumbUrl={board.imageThumbUrl}
          />
        ))}
      </div>
    </div>
  );
};