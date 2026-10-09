// Draws a scene's frame as dots. On the GPU, one triangle covers the canvas
// and every pixel works out which cell it is in, reads that cell's colour and
// dot size from a texture, and how far it is from the cell's middle: every
// dot is round and smooth-edged at any size, and a frame costs one upload
// however many there are. Without WebGL, the dots are filled on a 2D canvas,
// fewer and larger.

import { type Frame, RADIUS } from "@/lib/scene";

const VERTEX = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT = `
precision highp float;
uniform sampler2D uCells; // a texel a cell: its colour, and its dot size in alpha
uniform vec2 uGrid; // cells across and down
uniform vec2 uSize; // the canvas, in pixels
uniform vec3 uRadius; // the three dot sizes, in pixels
uniform vec3 uGround;

void main() {
  vec2 at = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y) / uSize * uGrid;
  vec2 cell = floor(at);
  vec4 c = texture2D(uCells, (cell + 0.5) / uGrid);
  float step = c.a * 255.0;
  float r = step < 0.5 ? 0.0 : step < 1.5 ? uRadius.x : step < 2.5 ? uRadius.y : uRadius.z;
  float d = length((at - cell - 0.5) * uSize / uGrid);
  // a pixel's worth of edge, so a dot stays round down to a pixel across
  gl_FragColor = vec4(mix(uGround, c.rgb, clamp(r - d + 0.5, 0.0, 1.0)), 1.0);
}`;

export type Dots = {
  // GPU dots stay crisp at a few pixels a cell; 2D ones need more room
  fine: boolean;
  draw: (frame: Frame, cols: number, rows: number, ground: string) => void;
};

// One painter a canvas, kept for as long as the canvas: a new scene in the
// same frame draws through the same context.
const painters = new WeakMap<HTMLCanvasElement, Dots>();

export function dots(canvas: HTMLCanvasElement): Dots {
  let painter = painters.get(canvas);
  if (!painter) {
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      // the melt reads this canvas between frames
      preserveDrawingBuffer: true,
    });
    painter = gl ? gpu(canvas, gl) : flat(canvas);
    painters.set(canvas, painter);
  }
  return painter;
}

const rgb = (hex: string) =>
  [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255);

function gpu(canvas: HTMLCanvasElement, gl: WebGLRenderingContext): Dots {
  let last: Parameters<Dots["draw"]> | null = null;
  let u: Record<string, WebGLUniformLocation | null> = {};

  // Everything the context holds, built again if the browser takes it away.
  const init = () => {
    const shader = (type: number, source: string) => {
      const s = gl.createShader(type) as WebGLShader;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, shader(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL's useProgram, not a React hook
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    // one texel a cell, read exactly: no filtering, no mipmaps, no wrapping
    for (const [k, v] of [
      [gl.TEXTURE_MIN_FILTER, gl.NEAREST],
      [gl.TEXTURE_MAG_FILTER, gl.NEAREST],
      [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
      [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
    ])
      gl.texParameteri(gl.TEXTURE_2D, k, v);
    u = Object.fromEntries(
      ["uGrid", "uSize", "uRadius", "uGround"].map((name) => [
        name,
        gl.getUniformLocation(program, name),
      ]),
    );
  };

  const draw: Dots["draw"] = (frame, cols, rows, ground) => {
    last = [frame, cols, rows, ground];
    if (gl.isContextLost()) return;
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      cols,
      rows,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      frame,
    );
    // the canvas may have been resized, or the scene changed, since the last
    const { width, height } = canvas;
    const cell = Math.min(width / cols, height / rows);
    gl.viewport(0, 0, width, height);
    gl.uniform2f(u.uGrid, cols, rows);
    gl.uniform2f(u.uSize, width, height);
    gl.uniform3f(
      u.uRadius,
      RADIUS[1] * cell,
      RADIUS[2] * cell,
      RADIUS[3] * cell,
    );
    gl.uniform3fv(u.uGround, rgb(ground));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  canvas.addEventListener("webglcontextlost", (event) =>
    event.preventDefault(),
  );
  canvas.addEventListener("webglcontextrestored", () => {
    init();
    if (last) draw(...last);
  });
  init();
  return { fine: true, draw };
}

function flat(canvas: HTMLCanvasElement): Dots {
  const ctx = canvas.getContext("2d");
  return {
    fine: false,
    draw: (frame, cols, rows, ground) => {
      if (!ctx) return;
      const cw = canvas.width / cols;
      const ch = canvas.height / rows;
      const size = Math.min(cw, ch);
      ctx.fillStyle = ground;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // dots grouped by colour, six bits a channel, each group filled at once
      const groups = new Map<number, number[]>();
      for (let k = 0; k < cols * rows; k++) {
        if (!frame[k * 4 + 3]) continue;
        const key =
          ((frame[k * 4] >> 2) << 12) |
          ((frame[k * 4 + 1] >> 2) << 6) |
          (frame[k * 4 + 2] >> 2);
        const group = groups.get(key);
        if (group) group.push(k);
        else groups.set(key, [k]);
      }
      for (const [key, cells] of groups) {
        ctx.fillStyle = `rgb(${((key >> 12) & 63) << 2} ${((key >> 6) & 63) << 2} ${(key & 63) << 2})`;
        ctx.beginPath();
        for (const k of cells) {
          const c = k % cols;
          const r = (k - c) / cols;
          const x = (c + 0.5) * cw;
          const y = (r + 0.5) * ch;
          const radius = RADIUS[frame[k * 4 + 3]] * size;
          ctx.moveTo(x + radius, y);
          ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    },
  };
}
