// The melt between two scenes, after the "melt" transition in React Bits'
// Morph Slider (reactbits.dev/components/morph-slider), rewritten for one
// canvas and no dependencies. For the length of a throw of the die, a WebGL
// canvas lies over the art: it holds a snapshot of the old scene and the live
// canvas of the new one, warps both through a field of noise and lets the new
// one break through where the noise is lowest, splitting colour a little at
// the height of it. Its last frame is the new scene exactly, so it can go
// without a seam.

const VERTEX = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT = `
precision highp float;
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform float uProgress;
uniform float uWarp; // 0 under reduced motion: a plain crossfade
uniform vec2 uSeed;
varying vec2 vUv;

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}
// red one way, blue the other: a lens bending light at the seams
vec3 split(sampler2D t, vec2 uv, float k) {
  return vec3(
    texture2D(t, uv + vec2(k, 0.0)).r,
    texture2D(t, uv).g,
    texture2D(t, uv - vec2(k, 0.0)).b
  );
}

void main() {
  float p = uProgress;
  float swell = sin(p * 3.14159265) * uWarp;
  // the art is twice as wide as it is tall: keep the noise round
  vec2 q = vUv * vec2(2.0, 1.0) * 1.6 + uSeed;
  float n = fbm(q);
  vec2 g = vec2(n, fbm(q * 1.7 + 4.0)) - 0.5;
  // the old scene is pulled away as the new one settles into place
  vec2 from = vUv + g * 0.3 * p * uWarp;
  vec2 to = vUv - g * 0.3 * (1.0 - p) * uWarp;
  float m = uWarp > 0.5 ? smoothstep(n - 0.15, n + 0.15, p * 1.3 - 0.15) : p;
  gl_FragColor = vec4(
    mix(split(uFrom, from, swell * 0.006), split(uTo, to, swell * 0.006), m),
    1.0
  );
}`;

export type Melt = {
  running: boolean;
  // its frame as it stands, to melt onward from when the die is thrown again
  capture: () => HTMLCanvasElement;
  stop: () => void;
};

// One melt held at whatever point it is drawn at: the Lab moves it by hand.
export type MeltLayer = {
  canvas: HTMLCanvasElement;
  draw: (progress: number) => void;
  remove: () => void;
};

// power2.inOut, as in the original
export const ease = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - (2 - 2 * t) ** 2 / 2;
export const MELT_MS = 1100;

// Lays the melt over `host`, from what `from` shows now to whatever `live`
// shows as it plays, and plays it. Null when WebGL is out of reach: the scene
// just swaps.
export function melt(
  host: HTMLElement,
  from: HTMLCanvasElement,
  live: HTMLCanvasElement,
  seed: number,
  still: boolean,
): Melt | null {
  const layer = meltLayer(host, from, live, seed, still);
  if (!layer) return null;
  const duration = still ? 350 : MELT_MS;
  const start = performance.now();
  let p = 0;
  const state: Melt = {
    running: true,
    capture: () => {
      layer.draw(p);
      return layer.canvas;
    },
    stop: () => {
      if (!state.running) return;
      state.running = false;
      cancelAnimationFrame(frame);
      layer.remove();
    },
  };
  let frame = requestAnimationFrame(function tick(now) {
    p = ease(Math.min(1, (now - start) / duration));
    layer.draw(p);
    if (p < 1) frame = requestAnimationFrame(tick);
    else state.stop();
  });
  return state;
}

// The melt's canvas over `host`, showing the old scene until it is drawn on.
export function meltLayer(
  host: HTMLElement,
  from: HTMLCanvasElement,
  live: HTMLCanvasElement,
  seed: number,
  still: boolean,
): MeltLayer | null {
  const canvas = document.createElement("canvas");
  canvas.width = live.width;
  canvas.height = live.height;
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
  if (!gl) return null;

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
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL's useProgram, not a React hook
  gl.useProgram(program);

  // one triangle that covers the whole canvas
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const texture = (unit: number, name: string, image: HTMLCanvasElement) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    // the art is any size: no mipmaps, no wrapping
    for (const [k, v] of [
      [gl.TEXTURE_MIN_FILTER, gl.LINEAR],
      [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
      [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
      [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
    ])
      gl.texParameteri(gl.TEXTURE_2D, k, v);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(gl.getUniformLocation(program, name), unit);
  };
  texture(0, "uFrom", from);
  texture(1, "uTo", live);
  gl.uniform1f(gl.getUniformLocation(program, "uWarp"), still ? 0 : 1);
  gl.uniform2f(
    gl.getUniformLocation(program, "uSeed"),
    (seed % 997) / 31,
    (seed % 991) / 29,
  );
  const progress = gl.getUniformLocation(program, "uProgress");
  gl.viewport(0, 0, canvas.width, canvas.height);

  const draw = (p: number) => {
    // the new scene keeps moving underneath: take its latest frame
    gl.activeTexture(gl.TEXTURE1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, live);
    gl.uniform1f(progress, p);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  // The first frame goes up before the new scene is drawn underneath, so the
  // old one never blinks away.
  host.append(canvas);
  draw(0);
  return {
    canvas,
    draw,
    remove: () => {
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
