"use client";

import { List, Card } from "@prisma/client";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";

export type ListWithCards = List & {
  cards: Card[];
};

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

export const ListContainer = ({
  data,
  boardId,
}: ListContainerProps) => {
  return (
    <ol className="flex gap-x-3 h-full">
      {data.map((list, index) => (
        <ListItem
          key={list.id}
          index={index}
          data={list}
        />
      ))}
      <ListForm />
      <div className="flex-shrink-0 w-1" />
    </ol>
  );
};