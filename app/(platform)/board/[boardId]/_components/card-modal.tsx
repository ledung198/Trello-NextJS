"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, List, Checklist, ChecklistItem, Comment, Attachment } from "@prisma/client";
import { Calendar, Clock, User, MessageSquare, Paperclip, CheckSquare, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type CardWithDetails = Card & {
  list: List;
  checklists: (Checklist & {
    items: ChecklistItem[];
  })[];
  comments: Comment[];
  attachments: Attachment[];
};

interface CardModalProps {
  data?: CardWithDetails;
  isOpen: boolean;
  onClose: () => void;
}

export const CardModal = ({
  data,
  isOpen,
  onClose,
}: CardModalProps) => {
  const params = useParams();
  const [title, setTitle] = useState(data?.title || "");
  const [description, setDescription] = useState(data?.description || "");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  if (!data) {
    return null;
  }

  const onTitleSubmit = () => {
    // TODO: Implement title update
    setIsEditingTitle(false);
  };

  const onDescriptionSubmit = () => {
    // TODO: Implement description update
    setIsEditingDescription(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-start gap-x-3 mb-6">
            <div className="flex-1">
              {isEditingTitle ? (
                <form onSubmit={onTitleSubmit} className="flex-1">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="font-semibold text-lg px-1 text-neutral-700 bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    onBlur={onTitleSubmit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onTitleSubmit();
                      }
                    }}
                    autoFocus
                  />
                </form>
              ) : (
                <div
                  onClick={() => setIsEditingTitle(true)}
                  className="font-semibold text-lg px-1 text-neutral-700 cursor-pointer hover:bg-neutral-200 rounded"
                >
                  {data.title}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                in list <span className="underline">{data.list.title}</span>
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
            <div className="col-span-3">
              {/* Description */}
              <div className="flex items-start gap-x-3 w-full mb-6">
                <div className="w-full">
                  <div className="flex items-center gap-x-2 mb-2">
                    <div className="w-7 h-7 bg-neutral-200 rounded-sm flex items-center justify-center">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold text-neutral-700">
                      Description
                    </h3>
                  </div>
                  {isEditingDescription ? (
                    <form onSubmit={onDescriptionSubmit} className="space-y-2">
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a more detailed description..."
                        className="w-full"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex items-center gap-x-2">
                        <Button type="submit" size="sm">
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditingDescription(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div
                      onClick={() => setIsEditingDescription(true)}
                      className="min-h-[78px] px-3 py-2 text-sm border border-transparent rounded-md cursor-pointer hover:border-neutral-200 hover:bg-neutral-50"
                    >
                      {data.description || "Add a more detailed description..."}
                    </div>
                  )}
                </div>
              </div>

              {/* Checklists */}
              {data.checklists.map((checklist) => (
                <div key={checklist.id} className="flex items-start gap-x-3 w-full mb-6">
                  <div className="w-full">
                    <div className="flex items-center gap-x-2 mb-2">
                      <div className="w-7 h-7 bg-neutral-200 rounded-sm flex items-center justify-center">
                        <CheckSquare className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold text-neutral-700">
                        {checklist.title}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {checklist.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-x-2">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            className="rounded"
                            onChange={() => {
                              // TODO: Toggle checklist item
                            }}
                          />
                          <span className={`text-sm ${item.completed ? 'line-through text-neutral-500' : ''}`}>
                            {item.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Comments */}
              <div className="flex items-start gap-x-3 w-full">
                <div className="w-full">
                  <div className="flex items-center gap-x-2 mb-2">
                    <div className="w-7 h-7 bg-neutral-200 rounded-sm flex items-center justify-center">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold text-neutral-700">
                      Activity
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {data.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-x-2">
                        <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-white border rounded-md p-3">
                            <p className="text-sm">{comment.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-x-2">
                      <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Write a comment..."
                          className="resize-none"
                          rows={2}
                        />
                        <Button size="sm" className="mt-2">
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-1">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-neutral-700 uppercase">
                  Add to card
                </p>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Members
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <div className="h-4 w-4 mr-2 bg-green-500 rounded-sm" />
                  Labels
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Checklist
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Dates
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attachment
                </Button>

                <Separator className="my-2" />

                <p className="text-xs font-semibold text-neutral-700 uppercase">
                  Actions
                </p>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Move
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Copy
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-rose-600">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};