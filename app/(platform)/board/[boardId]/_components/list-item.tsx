"use client";

import { useState, useRef, ElementRef } from "react";
import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ListWithCards } from "./list-container";
import { CardForm } from "./card-form";
import { CardItem } from "./card-item";

interface ListItemProps {
  data: ListWithCards;
  index: number;
}

export const ListItem = ({ data, index }: ListItemProps) => {
  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: data.id,
    data: {
      type: "List",
      list: data,
    },
    disabled: isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="shrink-0 h-full w-[272px] select-none bg-transparent border-2 border-rose-500 border-dashed rounded-md"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="shrink-0 h-full w-[272px] select-none"
    >
      <div
        {...attributes}
        {...listeners}
        className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
      >
        <div className="pt-2 px-2 text-sm font-medium flex justify-between items-start gap-x-2">
          <div className="w-full">
            <button
              onClick={enableEditing}
              className="font-medium text-sm px-2.5 py-1 h-7 w-full justify-start text-left"
            >
              {data.title}
            </button>
          </div>
        </div>
        <SortableContext items={data.cards.map((card) => card.id)}>
          <ol className="mx-1 px-1 py-0.5 flex flex-col gap-y-2">
            {data.cards.map((card, index) => (
              <CardItem index={index} key={card.id} data={card} />
            ))}
            <CardForm
              listId={data.id}
              ref={textareaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </ol>
        </SortableContext>
      </div>
    </div>
  );
};