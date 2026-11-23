"use client";

import { useState } from "react";

const PLACEHOLDER = "/images/project-placeholder.svg";

/**
 * Every project gets a thumbnail — a real uploaded image if the student
 * provided one, otherwise a generic branded "Provah" placeholder (not a
 * person avatar, since a project isn't a person).
 */
export function ProjectThumbnail({
  imageUrl,
  title,
}: {
  projectId?: string;
  imageUrl?: string;
  title: string;
}) {
  const [errored, setErrored] = useState(false);
  const src = !errored && imageUrl ? imageUrl : PLACEHOLDER;

  return (
    <div className="pv-border -m-5 mb-0 aspect-video overflow-hidden rounded-t-[17px] bg-[var(--color-surface)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={title}
        className="h-full w-full object-cover"
        onError={() => setErrored(true)}
      />
    </div>
  );
}
