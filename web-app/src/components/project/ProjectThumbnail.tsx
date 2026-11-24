"use client";

import { useState } from "react";

/**
 * Every project gets a thumbnail — a real uploaded image if the student
 * provided one, otherwise a plain white card with the Provah logo (not a
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
  const hasImage = !errored && !!imageUrl;

  return (
    <div className="pv-border -m-5 mb-0 flex aspect-video items-center justify-center overflow-hidden rounded-t-[17px] bg-white">
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/images/provah-logo.png" alt="Provah" className="h-9 w-auto opacity-80" />
      )}
    </div>
  );
}
