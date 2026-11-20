import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { ReactNode } from "react";

// Share images, drawn as the site is: one column of Inter on the dark ground,
// hierarchy from weight and the three ink tiers, never from colour. Sizes are
// the page's own at 2.5x, so at a feed's usual 480px they read at the page's
// 16px. Satori lays these out: every element with children is flex, and the
// card takes its rows as a list, since Satori boxes a fragment as one child.

// literal paths, so the build traces just these three files
const [regular, medium, avatar] = await Promise.all([
  readFile(path.join(process.cwd(), "src/assets/fonts/Inter-Regular.ttf")),
  readFile(path.join(process.cwd(), "src/assets/fonts/Inter-Medium.ttf")),
  readFile(path.join(process.cwd(), "src/assets/avatar.jpg")),
]);

const ground = "#161616";
const ink = "#f5f5f5";
const soft = "#b2b2b2";
const muted = "#818181";
const x = (px: number) => px * 2.5;

function card(rows: ReactNode[], justify: "center" | "space-between") {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: justify,
        gap: x(32),
        width: "100%",
        height: "100%",
        padding: `${x(36)}px ${x(40)}px`,
        background: ground,
        color: ink,
        fontFamily: "Inter",
        fontSize: x(16),
        lineHeight: 1.375,
      }}
    >
      {rows}
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}

// The home page's header: the avatar, then name over role.
function Author() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: x(12) }}>
      {/* biome-ignore lint/performance/noImgElement: drawn by next/og, not the browser */}
      <img
        src={`data:image/jpeg;base64,${avatar.toString("base64")}`}
        alt=""
        width={x(40)}
        height={x(40)}
        style={{
          borderRadius: 9999,
          border: "2px solid rgba(255,255,255,0.1)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontWeight: 500 }}>Luan Fabri</div>
        <div style={{ color: muted }}>Front-end engineer at Loopscape</div>
      </div>
    </div>
  );
}

// The home page's opening: its header, then the first line of the bio.
export function homeImage() {
  return card(
    [
      <Author key="author" />,
      <div
        key="bio"
        style={{
          color: soft,
          lineHeight: 1.625,
          maxWidth: x(400),
          textWrap: "pretty",
        }}
      >
        I build ERPs and multi-tenant platforms with React and Next.js: software
        people spend their whole workday in.
      </div>,
    ],
    "center",
  );
}

// A post as its page reads: where it sits, its title and when, and the
// author's footer. The title is the one step up in size, so it still leads
// at thumbnail size; it tightens and balances like any heading.
export function postImage({
  title,
  date,
  minutes,
}: {
  title: string;
  date: string;
  minutes: number;
}) {
  const fontSize = title.length > 44 ? x(24) : x(28);
  return card(
    [
      <div key="crumb" style={{ color: muted }}>
        Writing
      </div>,
      <div
        key="title"
        style={{ display: "flex", flexDirection: "column", gap: x(10) }}
      >
        <div
          style={{
            fontSize,
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: -fontSize * 0.02,
            maxWidth: x(420),
            textWrap: "balance",
          }}
        >
          {title}
        </div>
        <div style={{ color: muted }}>{`${date} · ${minutes} min read`}</div>
      </div>,
      <Author key="author" />,
    ],
    "space-between",
  );
}
