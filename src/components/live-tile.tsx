"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";

// The scene code stays off the home page until a tile is hovered or focused:
// the still picture under it is the same first frame, so it takes over
// without a seam, and then plays while the link is touched.
const SceneArt = lazy(() =>
  import("@/components/scene-art").then((m) => ({ default: m.SceneArt })),
);

export function LiveTile({ seed }: { seed: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const link = ref.current?.closest("a");
    if (!link) return;
    const wake = () => setLive(true);
    link.addEventListener("pointerenter", wake, { once: true });
    link.addEventListener("focus", wake, { once: true });
    return () => {
      link.removeEventListener("pointerenter", wake);
      link.removeEventListener("focus", wake);
    };
  }, []);

  return (
    <span ref={ref} className="absolute inset-0">
      {live && (
        <Suspense>
          <SceneArt seed={seed} crop />
        </Suspense>
      )}
    </span>
  );
}
