"use client";

import Link from "next/link";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface BoardCardProps {
  id: string;
  title: string;
  imageThumbUrl: string | null;
}

export const BoardCard = ({
  id,
  title,
  imageThumbUrl,
}: BoardCardProps) => {
  return (
    <Link
      href={`/board/${id}`}
      className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
      style={{
        backgroundImage: imageThumbUrl ? `url(${imageThumbUrl})` : undefined,
      }}
    >
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
      <p className="relative font-semibold text-white">
        {title}
      </p>
    </Link>
  );
};