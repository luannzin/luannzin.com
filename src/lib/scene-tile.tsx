import { ImageResponse } from "next/og";
import { createScene, RADIUS, renderer, START, viewOf } from "@/lib/scene";

// A scene as a still picture, built with the site: the first frame, one round
// dot a cell as the GPU draws it.
function still(
  seed: number,
  crop: boolean,
  cols: number,
  rows: number,
  width: number,
  headers?: HeadersInit,
) {
  const scene = createScene(seed);
  const frame = renderer(scene, cols, rows, viewOf(scene, crop))(START);
  const dots = [];
  for (let k = 0; k < cols * rows; k++) {
    const step = frame[k * 4 + 3];
    if (!step) continue;
    dots.push(
      <circle
        key={k}
        cx={(k % cols) + 0.5}
        cy={Math.floor(k / cols) + 0.5}
        r={RADIUS[step]}
        fill={`rgb(${frame[k * 4]},${frame[k * 4 + 1]},${frame[k * 4 + 2]})`}
      />,
    );
  }
  const height = (width * rows) / cols;
  return new ImageResponse(
    // biome-ignore lint/a11y/noSvgWithoutTitle: drawn into a PNG by next/og, never served as markup
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      width={width}
      height={height}
      style={{ background: scene.time.ground }}
    >
      {dots}
    </svg>,
    { width, height, headers },
  );
}

// A scene's home page tile, cropped round the landmark: 18 dots across, like
// the live tile, drawn at 3x its 44px. The live scene (`LiveTile`) only loads
// on hover or focus.
export function sceneTile(seed: number) {
  return still(seed, true, 18, 18, 132);
}

// The whole 2:1 scene, 240 dots across at 5px each (1200x600), for a picture
// shown outside the site.
export function sceneWide(seed: number, headers?: HeadersInit) {
  return still(seed, false, 240, 120, 1200, headers);
}
