"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

import { List, Card } from "@prisma/client";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";
import { CardItem } from "./card-item";
import { updateListOrder } from "../_actions/update-list-order";
import { updateCardOrder } from "../_actions/update-card-order";

export type ListWithCards = List & {
  cards: Card[];
};

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAList = active.data.current?.type === "List";
    const isOverAList = over.data.current?.type === "List";

    if (!isActiveAList) return;

    // Im dropping a List over another List
    if (isActiveAList && isOverAList) {
      setOrderedData((lists) => {
        const activeIndex = lists.findIndex((list) => list.id === activeId);
        const overIndex = lists.findIndex((list) => list.id === overId);

        const reorderedLists = arrayMove(lists, activeIndex, overIndex).map(
          (item, index) => ({ ...item, order: index })
        );

        // Update database
        updateListOrder(reorderedLists, boardId);

        return reorderedLists;
      });
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === "Card";
    const isOverACard = over.data.current?.type === "Card";

    if (!isActiveACard) return;

    // Im dropping a Card over another Card
    if (isActiveACard && isOverACard) {
      setOrderedData((lists) => {
        const activeIndex = findCardIndex(lists, activeId as string);
        const overIndex = findCardIndex(lists, overId as string);

        if (activeIndex.listIndex !== overIndex.listIndex) {
          // Remove card from source list
          const activeList = lists[activeIndex.listIndex];
          const overList = lists[overIndex.listIndex];
          const activeCard = activeList.cards[activeIndex.cardIndex];

          activeList.cards.splice(activeIndex.cardIndex, 1);
          overList.cards.splice(overIndex.cardIndex, 0, {
            ...activeCard,
            listId: overList.id,
          });

          // Update orders
          activeList.cards.forEach((card, index) => {
            card.order = index;
          });
          overList.cards.forEach((card, index) => {
            card.order = index;
          });

          // Update database
          const allCards = lists.flatMap((list) =>
            list.cards.map((card) => ({
              id: card.id,
              title: card.title,
              order: card.order,
              listId: card.listId,
            }))
          );
          updateCardOrder(allCards, boardId);
        } else {
          // Same list reorder
          const list = lists[activeIndex.listIndex];
          const reorderedCards = arrayMove(
            list.cards,
            activeIndex.cardIndex,
            overIndex.cardIndex
          ).map((card, index) => ({ ...card, order: index }));

          list.cards = reorderedCards;

          // Update database
          const allCards = lists.flatMap((list) =>
            list.cards.map((card) => ({
              id: card.id,
              title: card.title,
              order: card.order,
              listId: card.listId,
            }))
          );
          updateCardOrder(allCards, boardId);
        }

        return [...lists];
      });
    }

    const isOverAList = over.data.current?.type === "List";

    // Im dropping a Card over a List
    if (isActiveACard && isOverAList) {
      setOrderedData((lists) => {
        const activeIndex = findCardIndex(lists, activeId as string);
        const overIndex = lists.findIndex((list) => list.id === overId);

        if (activeIndex.listIndex !== overIndex) {
          const activeList = lists[activeIndex.listIndex];
          const overList = lists[overIndex];
          const activeCard = activeList.cards[activeIndex.cardIndex];

          activeList.cards.splice(activeIndex.cardIndex, 1);
          overList.cards.push({
            ...activeCard,
            listId: overList.id,
          });

          // Update orders
          activeList.cards.forEach((card, index) => {
            card.order = index;
          });
          overList.cards.forEach((card, index) => {
            card.order = index;
          });

          // Update database
          const allCards = lists.flatMap((list) =>
            list.cards.map((card) => ({
              id: card.id,
              title: card.title,
              order: card.order,
              listId: card.listId,
            }))
          );
          updateCardOrder(allCards, boardId);
        }

        return [...lists];
      });
    }
  };

  const findCardIndex = (lists: ListWithCards[], cardId: string) => {
    for (let listIndex = 0; listIndex < lists.length; listIndex++) {
      const cardIndex = lists[listIndex].cards.findIndex(
        (card) => card.id === cardId
      );
      if (cardIndex !== -1) {
        return { listIndex, cardIndex };
      }
    }
    return { listIndex: -1, cardIndex: -1 };
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="flex gap-x-3 h-full">
        <SortableContext items={orderedData.map((list) => list.id)}>
          {orderedData.map((list, index) => (
            <ListItem key={list.id} index={index} data={list} />
          ))}
        </SortableContext>
        <ListForm />
        <div className="flex-shrink-0 w-1" />
      </div>
      {typeof window !== "undefined" &&
        createPortal(
          <DragOverlay>
            {activeId && (
              <div className="bg-white rounded-md shadow-md rotate-5">
                {orderedData
                  .find((list) => list.id === activeId)
                  ?.cards.find((card) => card.id === activeId) ? (
                  <CardItem
                    data={
                      orderedData
                        .flatMap((list) => list.cards)
                        .find((card) => card.id === activeId)!
                    }
                    index={0}
                  />
                ) : (
                  <ListItem
                    data={orderedData.find((list) => list.id === activeId)!}
                    index={0}
                  />
                )}
              </div>
            )}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
};