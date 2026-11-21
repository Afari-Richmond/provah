"use client";

import { useState } from "react";
import { getAvatarUrl } from "@/lib/avatar";

/**
 * Every project gets a thumbnail — a real uploaded image if the student
 * provided one, otherwise a deterministic placeholder seeded by the
 * project's own id (same default-image approach used for profile avatars,
 * so an unfilled image slot always looks the same whether it's a person
 * or a project).
 */
export function ProjectThumbnail({
  projectId,
  imageUrl,
  title,
}: {
  projectId: string;
  imageUrl?: string;
  title: string;
}) {
  const [errored, setErrored] = useState(false);
  const src = !errored && imageUrl ? imageUrl : getAvatarUrl(projectId, 480);

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
