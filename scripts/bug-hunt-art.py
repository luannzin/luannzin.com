"""Draws every pixel of Bug hunt, the Lab's platformer, into one atlas.

    python scripts/bug-hunt-art.py [preview-dir]

Writes public/lab/bug-hunt/atlas.png, public/lab/bug-hunt/tile.png (the home
row's tile) and src/lib/bug-hunt/atlas.json: where each animation sits in the
atlas, its anchor, and the flat colours the game paints itself (particles,
the HUD's bars, the sky). Output is deterministic; rerun it after any change
and commit the three files with it. With a preview dir it also writes the
atlas there at 2x, on the game's black.

The look: line art on black, after Tomb of the Mask and the white-on-black
wizard games. Every mass is a black fill closed by a 1px line in its own
colour, and a mass in front draws its line over the one behind it, so the
parts of a body read without any shading. Texture and depth are ordered
dither (a 4x4 Bayer matrix), never a gradient: the curls, the bugs' shells,
the floor's bricks fading into the dark, the door's light. Colour is a few
flat neons, one per kind of thing: white for the world and the hero, rosé
for his special, green and cyan for the bugs, yellow for the way out.
"""

from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT_PNG = ROOT / "public/lab/bug-hunt/atlas.png"
OUT_TILE = ROOT / "public/lab/bug-hunt/tile.png"
OUT_JSON = ROOT / "src/lib/bug-hunt/atlas.json"

RGBA = tuple[int, int, int, int]
CLEAR: RGBA = (0, 0, 0, 0)
N4 = ((0, 1), (1, 0), (-1, 0), (0, -1))


def rgb(hex_: str) -> RGBA:
    return (int(hex_[1:3], 16), int(hex_[3:5], 16), int(hex_[5:7], 16), 255)


def hexa(colour: RGBA) -> str:
    return "#{:02x}{:02x}{:02x}".format(*colour[:3])


# --- palette: black, white, a few neons ------------------------------------

SKY = rgb("#050507")  # the canvas, and every fill
INK = rgb("#f4f1ea")  # the world's line and the hero's
GREY = rgb("#8a8794")  # the far side of a body, the floor's bricks
DIM = rgb("#45434e")
ROSE = rgb("#ff5ca8")
ROSE_HOT = rgb("#ffc7e1")
ROSE_DEEP = rgb("#9c2468")
AUBURN = rgb("#e08a55")  # his hair: the one warm line on him
GREEN = rgb("#8dff5a")
GREEN_DEEP = rgb("#2f8a2a")
CYAN = rgb("#56eaff")
CYAN_DEEP = rgb("#1b7d94")
MAGENTA = rgb("#e23cff")
YELLOW = rgb("#ffee00")
YELLOW_DEEP = rgb("#7a6f00")
RED = rgb("#ff3348")
VIOLET = rgb("#6c4dff")
VIOLET_DEEP = rgb("#2a1c70")

BAYER = ((0, 8, 2, 10), (12, 4, 14, 6), (3, 11, 1, 9), (15, 7, 13, 5))


def lit(x: int, y: int, density: float) -> bool:
    """Ordered dither: is this pixel on at `density` (0 to 1)?"""
    return BAYER[y % 4][x % 4] < density * 16


class Mat:
    """A mass's line colour, and its fill: black, or a dither of `fill` over
    black at `density`."""

    def __init__(self, line: RGBA, fill: RGBA = SKY, density: float = 0.0,
                 shade: RGBA | None = None):
        self.line, self.fill, self.density = line, fill, density
        # the fill just inside its right and lower line: the side the light
        # from the upper left doesn't reach
        self.shade = shade


# black clothes: his outline round a black fill, a band of shade inside it
HOODIE = Mat(INK, shade=DIM)
HOODIE_FAR = Mat(GREY)
SKIN = Mat(INK)
SKIN_FAR = Mat(GREY)
HAIR = Mat(AUBURN)
SHOE = Mat(INK, INK, 1.0)
SHOE_FAR = Mat(GREY, GREY, 1.0)
LAPTOP = Mat(INK)
SCREEN = Mat(ROSE, ROSE, 1.0)

SHELL = Mat(GREEN, GREEN_DEEP, 0.5)
CHITIN = Mat(GREEN)
CHITIN_FAR = Mat(GREEN_DEEP)
WING = Mat(CYAN, CYAN_DEEP, 0.5)
WING_FAR = Mat(CYAN_DEEP, CYAN_DEEP, 0.25)
MOTH = Mat(CYAN)

GEAR = Mat(INK)
GEAR_DOTTED = Mat(INK, GREY, 0.5)

# --- painting ------------------------------------------------------------------


class Sprite:
    """A frame as masses: each fill is one blob, drawn over the ones before."""

    def __init__(self, w: int, h: int):
        self.w, self.h = w, h
        self.cells: dict[tuple[int, int], tuple[Mat, int]] = {}
        self.marks: dict[tuple[int, int], RGBA] = {}
        self.n = 0

    def fill(self, pts, mat: Mat) -> None:
        self.n += 1
        for x, y in pts:
            x, y = round(x), round(y)
            if 0 <= x < self.w and 0 <= y < self.h:
                self.cells[(x, y)] = (mat, self.n)

    def mark(self, pts, colour: RGBA) -> None:
        """Flat detail on top of the line art: eyes, a drawstring, an LED."""
        for x, y in pts:
            if 0 <= x < self.w and 0 <= y < self.h:
                self.marks[(x, y)] = colour

    def mirrored(self) -> "Sprite":
        out = Sprite(self.w, self.h)
        out.n = self.n
        out.cells = {(self.w - 1 - x, y): v for (x, y), v in self.cells.items()}
        out.marks = {(self.w - 1 - x, y): v for (x, y), v in self.marks.items()}
        return out


def render(sp: Sprite, flash: bool = False) -> Image.Image:
    """A pixel is line where its mass ends: next to nothing, or next to a mass
    drawn before it (behind it). A mass drawn after (in front) owns the line
    between them. Everything else is fill. A flash is the whole silhouette in
    its line colour, the frame a hit lands on."""
    img = Image.new("RGBA", (sp.w, sp.h), CLEAR)
    px = img.load()
    def is_edge(x: int, y: int, blob: int) -> bool:
        for dx, dy in N4:
            near = sp.cells.get((x + dx, y + dy))
            if near is None or near[1] < blob:
                return True
        return False

    for (x, y), (mat, blob) in sp.cells.items():
        if flash or is_edge(x, y, blob):
            px[x, y] = mat.line
        elif mat.shade and any(
                sp.cells.get(n, (None, -1))[1] == blob and is_edge(*n, blob)
                for n in ((x + 1, y), (x, y + 1))):
            px[x, y] = mat.shade
        elif mat.density and lit(x, y, mat.density):
            px[x, y] = mat.fill
        else:
            px[x, y] = SKY
    for (x, y), colour in sp.marks.items():
        px[x, y] = INK if flash else colour
    return img


def paint(w: int, h: int, cells: dict[tuple[int, int], RGBA]) -> Image.Image:
    img = Image.new("RGBA", (w, h), CLEAR)
    px = img.load()
    for (x, y), c in cells.items():
        if 0 <= x < w and 0 <= y < h:
            px[x, y] = c
    return img


# --- geometry ----------------------------------------------------------------


def line(x0, y0, x1, y1) -> list[tuple[int, int]]:
    x0, y0, x1, y1 = round(x0), round(y0), round(x1), round(y1)
    dx, dy = abs(x1 - x0), -abs(y1 - y0)
    sx, sy = (1 if x0 < x1 else -1), (1 if y0 < y1 else -1)
    err, pts = dx + dy, []
    while True:
        pts.append((x0, y0))
        if (x0, y0) == (x1, y1):
            return pts
        e2 = 2 * err
        if e2 >= dy:
            err += dy
            x0 += sx
        if e2 <= dx:
            err += dx
            y0 += sy


def brush(pts, size: int) -> set[tuple[int, int]]:
    o = (size - 1) // 2
    return {(x - o + i, y - o + j) for x, y in pts
            for i in range(size) for j in range(size)}


def polyline(points, size: int) -> set[tuple[int, int]]:
    pts: list[tuple[int, int]] = []
    for a, b in zip(points, points[1:]):
        pts += line(*a, *b)
    return brush(pts, size)


def ellipse(cx: float, cy: float, rx: float, ry: float) -> set[tuple[int, int]]:
    return {(x, y)
            for x in range(math.floor(cx - rx) - 1, math.ceil(cx + rx) + 2)
            for y in range(math.floor(cy - ry) - 1, math.ceil(cy + ry) + 2)
            if ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1.0}


def disc(cx: float, cy: float, r: float) -> set[tuple[int, int]]:
    return ellipse(cx, cy, r, r)


def rect(x: int, y: int, w: int, h: int) -> set[tuple[int, int]]:
    return {(x + i, y + j) for i in range(w) for j in range(h)}


def bend(a, b, length: float, toward: float):
    """The joint between `a` and `b` for a two-segment limb of `length`,
    pushed to the side `toward` (+1 forward, -1 back) when it folds."""
    (ax, ay), (bx, by) = a, b
    dx, dy = bx - ax, by - ay
    d = math.hypot(dx, dy) or 1.0
    mx, my = (ax + bx) / 2, (ay + by) / 2
    if d >= length:
        return mx, my
    off = math.sqrt((length / 2) ** 2 - (d / 2) ** 2)
    nx, ny = -dy / d, dx / d
    if nx * toward < 0 or (nx == 0 and ny * toward > 0):
        nx, ny = -nx, -ny
    return mx + nx * off, my + ny * off


# --- the hero ----------------------------------------------------------------

PW, PH = 28, 40
FOOT = 38  # the row his soles stand on


def capsule(a, b, ra: float, rb: float) -> set[tuple[int, int]]:
    """A limb segment: every pixel within a radius that tapers from `ra` at
    `a` to `rb` at `b`. Tapered segments are what make a leg read as a leg
    rather than as a stroke of a fixed-width brush."""
    (ax, ay), (bx, by) = a, b
    dx, dy = bx - ax, by - ay
    span = dx * dx + dy * dy or 1e-9
    r = max(ra, rb)
    pts = set()
    for x in range(math.floor(min(ax, bx) - r) - 1, math.ceil(max(ax, bx) + r) + 2):
        for y in range(math.floor(min(ay, by) - r) - 1, math.ceil(max(ay, by) + r) + 2):
            t = max(0.0, min(1.0, ((x - ax) * dx + (y - ay) * dy) / span))
            px, py = ax + t * dx, ay + t * dy
            rad = ra + (rb - ra) * t
            if (x - px) ** 2 + (y - py) ** 2 <= rad * rad:
                pts.add((x, y))
    return pts


def curls(sp: Sprite, circles, mat: Mat) -> None:
    """Hair as one mass whose line is bumpy where each curl bulges out, with
    each curl's own upper-left arc drawn inside it: a row of C shapes, all lit
    from the same side, which is what reads as curly at this size."""
    mass: set[tuple[int, int]] = set()
    discs = [disc(cx, cy, r) for cx, cy, r in circles]
    for d in discs:
        mass |= d
    sp.fill(mass, mat)
    for (cx, cy, r), d in zip(circles, discs):
        for x, y in d:
            if (x - 1, y) in d and (x, y - 1) in d:
                continue
            if x > cx + 0.3 or y > cy + 0.3:
                continue
            inner = all(n in mass for n in ((x - 1, y), (x, y - 1), (x + 1, y), (x, y + 1)))
            if inner:
                sp.marks[(x, y)] = mat.line


def hero(p: dict) -> Sprite:
    """Luan, facing right: curly auburn hair, a black hoodie and black cargo
    pants, white sneakers, a chain and an earbud.

    `p` is the pose. `dy` lowers everything above the hips and `crouch` the
    hips themselves; `lean` tips the upper body; hands and ankles sit where
    the pose puts them, and elbows and knees fall out of `bend`. The far
    limbs are drawn first, in grey, so the near ones cross them in white.
    """
    s = Sprite(PW, PH)
    crouch = p.get("crouch", 0)
    dy = p.get("dy", 0) + crouch
    lean = p.get("lean", 0)
    hip_y = 27 + crouch
    near_sh, far_sh = (16 + lean, 18 + dy), (11 + lean, 18 + dy)

    def arm(shoulder, hand, near, fist=False):
        elbow = bend(shoulder, hand, 10.0, -1)
        mat = HOODIE if near else HOODIE_FAR
        s.fill(capsule(shoulder, elbow, 1.7, 1.5) | capsule(elbow, hand, 1.5, 1.3), mat)
        s.fill(disc(hand[0], hand[1], 1.9 if fist else 1.4), SKIN if near else SKIN_FAR)

    def leg(hip, ankle, near):
        knee = bend(hip, ankle, 10.4, 1)
        mat = HOODIE if near else HOODIE_FAR
        s.fill(capsule(hip, knee, 2.2, 1.8) | capsule(knee, ankle, 1.8, 1.4), mat)
        if near:  # the cargo pocket, on the thigh
            kx, ky = round((hip[0] + knee[0]) / 2) + 1, round((hip[1] + knee[1]) / 2)
            s.mark({(kx - 1, ky), (kx, ky), (kx + 1, ky), (kx - 1, ky + 1),
                    (kx + 1, ky + 1)}, GREY)
        ax, ay = round(ankle[0]), round(ankle[1])
        toe = p.get("toe", 1)
        shoe = rect(ax - 1, ay, 3, 1) | rect(ax - 2, ay + 1, 5 + toe, 1) | rect(ax - 2, ay + 2, 6 + toe, 1)
        s.fill(shoe, SHOE if near else SHOE_FAR)
        s.mark({(x, ay + 2) for x in range(ax - 1, ax + 4 + toe)}, GREY if near else DIM)

    arm(far_sh, p["back"], False)
    leg((12, hip_y), p["far"], False)
    leg((15, hip_y), p["near"], True)

    # the hoodie and the hips are one mass, so one line goes round them
    bx, by = 9 + lean, 16 + dy
    body = (rect(bx + 2, by, 6, 1) | rect(bx + 1, by + 1, 8, 1) | rect(bx, by + 2, 10, 7)
            | rect(bx + 1, by + 9, 9, 2) | rect(10, hip_y - 1, 8, 2)
            | disc(bx + 1.6, by + 1.2, 2.0))
    s.fill(body, HOODIE)
    s.mark({(x, by + 9) for x in range(bx + 2, bx + 9)}, GREY)  # the hem
    s.mark({(bx + 4, by + 5), (bx + 5, by + 5), (bx + 6, by + 5), (bx + 7, by + 5),
            (bx + 3, by + 6), (bx + 3, by + 7), (bx + 8, by + 6)}, GREY)  # the pocket
    s.mark({(bx + 6, by + 2), (bx + 6, by + 3), (bx + 8, by + 2), (bx + 8, by + 3),
            (bx + 8, by + 4)}, ROSE)  # the drawstrings
    s.mark({(bx + 3, by + 1), (bx + 4, by + 2), (bx + 5, by + 2)}, GREY)  # the chain

    hx, hy = 6 + lean, dy + 1
    head = ellipse(hx + 7.5, hy + 9.0, 4.4, 4.9)
    head -= {(x, y) for x, y in head if x < hx + 6 and y > hy + 11}  # jaw tucks in
    head |= {(hx + 12, hy + 8), (hx + 12, hy + 9), (hx + 11, hy + 12), (hx + 10, hy + 13)}
    s.fill(head, SKIN)
    s.fill(disc(hx + 5.2, hy + 9.4, 1.3), SKIN)  # the ear
    s.mark({(hx + 5, hy + 9)}, GREY)  # the earbud

    curls(s, [(hx + 3.2, hy + 3.4, 2.4), (hx + 6.0, hy + 2.2, 2.6),
              (hx + 9.2, hy + 2.6, 2.4), (hx + 11.4, hy + 4.4, 1.7),
              (hx + 1.8, hy + 6.2, 2.2), (hx + 2.2, hy + 9.0, 1.7),
              (hx + 8.0, hy + 5.2, 1.5), (hx + 10.3, hy + 5.6, 1.3)], HAIR)

    face = p.get("face", "smirk")
    if face == "wince":
        s.mark({(hx + 8, hy + 8), (hx + 9, hy + 8), (hx + 11, hy + 8)}, INK)
    else:
        s.mark({(hx + 8, hy + 7), (hx + 9, hy + 7), (hx + 11, hy + 7)}, INK)  # brows
        s.mark({(hx + 9, hy + 8), (hx + 9, hy + 9), (hx + 11, hy + 8),
                (hx + 11, hy + 9)}, INK)  # eyes
    if face == "shout":
        s.mark({(hx + 9, hy + 11), (hx + 10, hy + 11), (hx + 9, hy + 12),
                (hx + 10, hy + 12)}, INK)
    else:
        s.mark({(hx + 9, hy + 11), (hx + 10, hy + 11), (hx + 11, hy + 10)}, INK)  # smirk

    if p.get("laptop"):
        # held open at the chest, hinge away from him, its screen lit at him
        lx, ly = 16 + lean, 25 + dy
        s.fill(rect(lx, ly, 10, 2), LAPTOP)
        s.fill(capsule((lx + 9, ly - 1), (lx + 8, ly - 8), 1.0, 1.0), LAPTOP)
        s.mark({(x - 1, y) for x, y in line(lx + 9, ly - 1, lx + 8, ly - 7)}, ROSE)
    arm(near_sh, p["front"], True, p.get("fist", False))
    if p.get("kick"):
        leg((15, hip_y), p["kick"], True)
    return s


STAND = {"front": (17, 27), "back": (11, 27), "near": (16, FOOT - 2),
         "far": (11, FOOT - 2)}


def pose(**kw) -> dict:
    return {**STAND, **kw}


def run_cycle() -> list[dict]:
    # ankle offsets from the hips through a stride, with the opposite arm
    stride = [(5, 0), (2, -1), (-2, -3), (-5, -1), (-3, 0), (2, -4)]
    frames = []
    for i in range(6):
        nx, ny = stride[i]
        fx, fy = stride[(i + 3) % 6]
        frames.append(pose(
            dy=1 if i in (1, 4) else 0,
            lean=1,
            near=(15 + nx, FOOT - 2 + ny),
            far=(12 + fx, FOOT - 2 + fy),
            front=(17 - nx, 26),
            back=(12 - fx, 26),
        ))
    return frames


CROUCH = 7
LOW = {"crouch": CROUCH, "near": (19, FOOT - 2), "far": (10, FOOT - 2),
       "front": (20, 29), "back": (14, 30)}

HERO = {
    "idle": [pose(), pose(dy=1)],
    "run": run_cycle(),
    "jump": [pose(near=(19, 32), far=(12, 35), front=(22, 22), back=(6, 21))],
    "fall": [pose(near=(18, 36), far=(11, 34), front=(23, 19), back=(6, 18))],
    # three punches, aimed: up over his head, straight ahead, down at the floor
    "up": [
        pose(lean=1, front=(22, 10), back=(10, 25), near=(18, FOOT - 3),
             far=(12, FOOT - 2), fist=True, face="shout"),
        pose(lean=1, front=(21, 14), back=(11, 26), near=(18, FOOT - 2), fist=True),
    ],
    "mid": [
        pose(lean=1, front=(27, 22), back=(11, 25), near=(19, FOOT - 2),
             far=(10, FOOT - 2), fist=True),
        pose(front=(21, 23), back=(13, 26), near=(18, FOOT - 2), fist=True),
    ],
    "low": [
        pose(dy=2, lean=2, front=(26, 32), back=(11, 27), near=(20, FOOT - 2),
             far=(9, FOOT - 2), fist=True),
        pose(dy=1, lean=1, front=(21, 29), back=(12, 27), near=(19, FOOT - 2),
             far=(10, FOOT - 2), fist=True),
    ],
    "crouch": [pose(**LOW)],
    # from the crouch, the near leg sweeps out low
    "kick": [
        pose(**{**LOW, "near": (20, FOOT - 5)}),
        pose(**{**LOW, "near": (13, FOOT - 2), "kick": (26, FOOT - 3), "lean": -1}),
        pose(**{**LOW, "near": (19, FOOT - 3)}),
    ],
    "throw": [
        pose(lean=-1, front=(7, 21), back=(15, 27), near=(18, FOOT - 2)),
        pose(lean=1, front=(26, 21), back=(10, 26), near=(19, FOOT - 2)),
    ],
    "hurt": [pose(lean=-2, front=(23, 21), back=(5, 20), face="wince")],
    "code": [
        pose(laptop=True, front=(19, 24), back=(22, 23)),
        pose(laptop=True, front=(20, 23), back=(19, 24)),
    ],
    "charge": [pose(dy=1, front=(11, 27), back=(10, 28), near=(19, FOOT - 2),
                    far=(9, FOOT - 2), face="shout", fist=True)],
    "fire": [pose(lean=2, front=(26, 22), back=(25, 23), near=(20, FOOT - 2),
                  far=(8, FOOT - 2), face="shout")],
}


# --- the bugs ----------------------------------------------------------------

CW, CH = 18, 12  # the crawler: a beetle on six legs, the ground's bug


def crawler(frame: int) -> Sprite:
    """Walks right on legs that swap each frame; the shell bobs with them."""
    s = Sprite(CW, CH)
    bob = frame % 2
    swing = 1 if frame < 2 else -1
    for i, x in enumerate((5, 9, 13)):
        o = swing if i % 2 else -swing
        s.fill(line(x, 7, x + o, 10), CHITIN_FAR)
    s.fill(ellipse(8.5, 7.5, 6, 1.5), CHITIN)  # belly
    s.fill({(x, y) for x, y in ellipse(8, 5 + bob, 6.5, 4.4) if y <= 6 + bob}, SHELL)
    s.fill(disc(14.4, 6.2 + bob, 2.2), CHITIN)  # head
    s.fill(line(15, 4 + bob, 17, 1 + bob), CHITIN)  # antenna
    for i, x in enumerate((4, 8, 12)):
        o = -swing if i % 2 else swing
        s.fill(line(x, 8, x + o, 10), CHITIN)
    s.mark(line(8, 2 + bob, 9, 6 + bob), GREEN)  # the split between its wings
    s.mark({(15, 5 + bob)}, MAGENTA)
    return s


FW, FH = 16, 16  # the flyer: a moth that bobs through the air


def flyer(frame: int) -> Sprite:
    s = Sprite(FW, FH)
    up = (2.5, 5.5, 9.5)[frame]
    s.fill(ellipse(5.5, up - 0.5, 4, 2.2), WING_FAR)
    for x in (7, 9):
        s.fill(line(x, 10, x - 1, 13), MOTH)  # legs
    s.fill(ellipse(3.6, 9.0, 2.6, 1.9), MOTH)  # abdomen
    s.fill(disc(7.2, 8.4, 2.3), MOTH)  # thorax
    s.fill(disc(10.4, 7.6, 1.7), MOTH)  # head
    s.fill(line(11, 9, 13, 11), MOTH)  # proboscis
    s.mark({(11, 7)}, MAGENTA)
    s.fill(ellipse(6.5, up + 0.5, 4.5, 2.4), WING)
    return s


# --- things he throws ----------------------------------------------------------

TW = 14


def mouse() -> Sprite:
    s = Sprite(TW, TW)
    s.fill({(x, y) for x, y in ellipse(7, 8, 5, 3.2) if y <= 8} | rect(2, 9, 10, 1), GEAR)
    s.fill(line(12, 9, 13, 10), GEAR)  # the cord
    s.mark({(8, 6), (8, 7)}, INK)  # the buttons' split
    s.mark({(9, 6)}, ROSE)  # the wheel
    return s


def keyboard() -> Sprite:
    s = Sprite(TW, TW)
    s.fill(rect(1, 5, 12, 5), GEAR_DOTTED)
    s.mark({(2, 6), (3, 6)}, ROSE)  # esc
    return s


def headphones() -> Sprite:
    s = Sprite(TW, TW)
    s.fill({(x, y) for x, y in ellipse(7, 8, 5.5, 5.5) if y <= 8} -
           ellipse(7, 8.5, 3.6, 3.6), GEAR)
    s.fill(rect(1, 7, 3, 5), GEAR)
    s.fill(rect(10, 7, 3, 5), GEAR)
    s.mark({(2, 9), (2, 10), (11, 9), (11, 10)}, ROSE)
    return s


def spin(img: Image.Image) -> list[Image.Image]:
    # quarter turns are lossless on the grid; anything finer is not
    return [img, img.transpose(Image.Transpose.ROTATE_270),
            img.transpose(Image.Transpose.ROTATE_180),
            img.transpose(Image.Transpose.ROTATE_90)]


# --- effects -------------------------------------------------------------------
# Bursts are particles the game throws itself; these are the shapes it can't.


def impact(frame: int) -> Image.Image:
    """A punch landing: a white star, then its four points flying apart."""
    cells: dict[tuple[int, int], RGBA] = {}
    if frame == 0:
        for p in rect(4, 7, 8, 1) | rect(7, 4, 1, 8) | {(5, 5), (9, 5), (5, 9), (9, 9)}:
            cells[p] = INK
        cells[(7, 7)] = YELLOW
    else:
        d = 4 if frame == 1 else 6
        for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            for k in range(2 if frame == 1 else 1):
                cells[(7 + dx * (d + k), 7 + dy * (d + k))] = INK if frame == 1 else GREY
    return paint(15, 15, cells)


def check() -> Sprite:
    s = Sprite(9, 8)
    s.fill(polyline([(1, 4), (3, 6), (7, 1)], 2), Mat(GREEN))
    return s


def dust(frame: int) -> Image.Image:
    cells: dict[tuple[int, int], RGBA] = {}
    spread, density = (2, 4, 6)[frame], (0.6, 0.35, 0.15)[frame]
    for cx in (6 - spread, 6 + spread):
        for x, y in disc(cx + 0.5, 3, 2.2 - frame * 0.4):
            if lit(x, y, density):
                cells[(x, y)] = INK
    return paint(13, 6, cells)


def orb(frame: int) -> Image.Image:
    """The charge between his hands: a hot core, a rosé ring, a dither halo."""
    radius = (2.6, 3.6, 4.6)[frame]
    cells: dict[tuple[int, int], RGBA] = {}
    for x, y in disc(7, 7, radius + 2.4):
        if lit(x + frame, y, 0.3):
            cells[(x, y)] = ROSE_DEEP
    for p in disc(7, 7, radius):
        cells[p] = ROSE
    for p in disc(7, 7, radius - 1.4):
        cells[p] = ROSE_HOT
    return paint(15, 15, cells)


BEAM_H = 22


def beam(piece: str, frame: int) -> Image.Image:
    """The rosé beam: a hot core, a solid band, then a dithered edge that
    crawls a pixel per frame, so it reads as moving without a gradient."""
    core = (2.6, 3.6, 3.1)[frame]
    w = {"start": 12, "body": 16, "end": 10}[piece]
    cells: dict[tuple[int, int], RGBA] = {}
    mid = (BEAM_H - 1) / 2
    for x in range(w):
        reach = 1.0
        if piece == "start":
            reach = 0.55 + 0.45 * x / (w - 1)
        if piece == "end":
            reach = math.sqrt(max(0.0, 1 - (x / w) ** 2))
        for y in range(BEAM_H):
            d = abs(y - mid)
            if d <= core * reach:
                cells[(x, y)] = ROSE_HOT
            elif d <= (core + 2.5) * reach:
                cells[(x, y)] = ROSE
            elif d <= (core + 5.5) * reach and lit(x + frame, y, 0.5 - (d - core - 2.5) / 8):
                cells[(x, y)] = ROSE_DEEP
    if piece == "start":
        for x, y in disc(4, mid, 6.5 + frame % 2):
            if (x, y) not in cells and lit(x, y + frame, 0.5):
                cells[(x, y)] = ROSE
        for p in disc(4, mid, 3.5):
            cells[p] = ROSE_HOT
    return paint(w, BEAM_H, cells)


# --- the world: floor, decks, the door ----------------------------------------

T = 16
DEPTHS = 4  # how many rows down the bricks take to fade out


def ground(depth: int, up: bool, left: bool, right: bool) -> Image.Image:
    """One cell of floor, `depth` rows under the surface. The surface is a
    thick white line; the bricks under it are grey lines that thin out, in
    dither, the deeper they go; an open side is a white wall line."""
    cells: dict[tuple[int, int], RGBA] = {}
    fade = (1.0, 0.55, 0.28, 0.12)[min(depth, DEPTHS - 1)]
    tone = GREY if depth == 0 else DIM
    top = 3 if up else 0
    for y in range(T):
        for x in range(T):
            course = (y + 1) // 6  # course seams at rows 5 and 11
            seam_y = (y + 1) % 6 == 0
            seam_x = (x + (4 if course % 2 else 0)) % 8 == 0
            if y >= top and (seam_y or seam_x) and lit(x, y, fade):
                cells[(x, y)] = tone
    if up:
        for x in range(T):
            cells[(x, 0)] = INK
            cells[(x, 1)] = INK
            cells.pop((x, 2), None)
    for open_, x in ((left, 0), (right, T - 1)):
        if open_:
            for y in range(T):
                cells[(x, y)] = INK
            cells.pop((1 if x == 0 else T - 2, 2), None)
    if up and left:
        cells.pop((0, 0))
    if up and right:
        cells.pop((T - 1, 0))
    img = Image.new("RGBA", (T, T), SKY)
    img.alpha_composite(paint(T, T, cells))
    return img


def catwalk(left: bool, right: bool) -> Image.Image:
    """A one-way platform, in Tomb of the Mask's violet: a double rail with
    a dithered deck between, open underneath."""
    cells: dict[tuple[int, int], RGBA] = {}
    for x in range(T):
        cells[(x, 0)] = VIOLET
        cells[(x, 4)] = VIOLET
        for y in (1, 2, 3):
            cells[(x, y)] = VIOLET_DEEP if lit(x, y, 0.5) else SKY
        if x % 8 == 3:
            cells[(x, 5)] = VIOLET_DEEP  # bolts under it
    for open_, x in ((left, 0), (right, T - 1)):
        if open_:
            for y in range(5):
                cells[(x, y)] = VIOLET
            cells.pop((x, 0))
            cells.pop((x, 4))
    return paint(T, 6, cells)


DW, DH = 26, 40


def door(open_: bool) -> Image.Image:
    """The exit. Shut: a grey frame and a red X. Open: yellow, with its light
    falling out of it in dither and an arrow lit over it."""
    cells: dict[tuple[int, int], RGBA] = {}
    frame = YELLOW if open_ else GREY
    x0, x1, y0, y1 = 4, 21, 12, DH - 1
    for y in range(y0, y1 + 1):
        cells[(x0, y)] = frame
        cells[(x1, y)] = frame
    for x in range(x0, x1 + 1):
        cells[(x, y0)] = frame
    for y in range(y0 + 2, y1 + 1):  # the inner jamb
        cells[(x0 + 2, y)] = frame if open_ else DIM
        cells[(x1 - 2, y)] = frame if open_ else DIM
    for x in range(x0 + 2, x1 - 1):
        cells[(x, y0 + 2)] = frame if open_ else DIM
    if open_:
        for y in range(y0 + 3, y1 + 1):
            for x in range(x0 + 3, x1 - 2):
                if lit(x, y, 0.15 + 0.6 * (y - y0) / (y1 - y0)):
                    cells[(x, y)] = YELLOW_DEEP if y < y1 - 6 else YELLOW
    else:
        for i in range(5):
            cells[(10 + i, 24 + i)] = RED
            cells[(14 - i, 24 + i)] = RED
    # the sign
    for x in range(7, 19):
        cells[(x, 2)] = frame
        cells[(x, 8)] = frame
    for y in range(2, 9):
        cells[(7, y)] = frame
        cells[(18, y)] = frame
    arrow = {(10, 5), (11, 5), (12, 5), (13, 5), (14, 5), (13, 4), (13, 6), (12, 3), (12, 7)}
    for p in arrow:
        cells[p] = YELLOW if open_ else DIM
    for y in (9, 10, 11):
        cells[(12, y)] = frame
        cells[(13, y)] = frame
    return paint(DW, DH, cells)


# --- the room behind: dim, far, mostly dark ----------------------------------

BW, BH = 256, 192


def backdrop(frame: int) -> Image.Image:
    """Far racks as violet outlines with dithered faces and a few LEDs, a
    sky of dots and crosses that twinkle between the two frames, and dotted
    horizon lines, as in Tomb of the Mask's title."""
    cells: dict[tuple[int, int], RGBA] = {}
    seed = 7
    for i in range(70):  # stars
        seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF
        x, y = seed % BW, (seed >> 8) % 110
        if (i + frame) % 7 == 0:
            continue
        cells[(x, y)] = VIOLET if i % 3 else DIM
        if i % 9 == 0:
            for d in (-1, 1):
                cells[((x + d) % BW, y)] = VIOLET_DEEP
                cells[(x, y + d)] = VIOLET_DEEP
    for i, x0 in enumerate(range(10, BW, 50)):
        w, top = 26, 70 + (i % 3) * 10
        for y in range(top, BH):
            cells[(x0, y)] = VIOLET_DEEP
            cells[(x0 + w, y)] = VIOLET_DEEP
            for x in range(x0 + 1, x0 + w):
                if lit(x, y, 0.07):
                    cells[(x, y)] = VIOLET_DEEP
        for x in range(x0, x0 + w + 1):
            cells[(x, top)] = VIOLET_DEEP
        for k, y in enumerate(range(top + 6, BH, 8)):
            for x in range(x0 + 3, x0 + w - 2, 2):
                cells[(x, y)] = VIOLET_DEEP
            on = (i * 5 + k * 3 + frame * 7) % 4
            if on:
                cells[(x0 + w - 4, y - 3)] = (MAGENTA, CYAN, VIOLET)[on - 1]
    for y, gap in ((150, 3), (158, 5), (168, 7)):  # dotted horizon
        for x in range(0, BW, gap):
            cells[(x, y)] = VIOLET_DEEP
    return paint(BW, BH, cells)


# --- HUD -----------------------------------------------------------------------

HEART_MAP = (".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X...")
DIGITS = {
    "0": ("###", "#.#", "#.#", "#.#", "###"),
    "1": (".#.", "##.", ".#.", ".#.", "###"),
    "2": ("###", "..#", "###", "#..", "###"),
    "3": ("###", "..#", ".##", "..#", "###"),
    "4": ("#.#", "#.#", "###", "..#", "..#"),
    "5": ("###", "#..", "###", "..#", "###"),
    "6": ("###", "#..", "###", "#.#", "###"),
    "7": ("###", "..#", ".#.", ".#.", ".#."),
    "8": ("###", "#.#", "###", "#.#", "###"),
    "9": ("###", "#.#", "###", "..#", "###"),
}


def from_map(rows, mat: Mat, w: int, h: int, at=(1, 1)) -> Sprite:
    s = Sprite(w, h)
    s.fill({(at[0] + x, at[1] + y) for y, row in enumerate(rows)
            for x, ch in enumerate(row) if ch != "."}, mat)
    return s


def heart(full: bool) -> Image.Image:
    return render(from_map(HEART_MAP, Mat(RED, RED, 1.0) if full else Mat(DIM), 9, 8))


def digit(ch: str, colour: RGBA) -> Image.Image:
    return paint(4, 5, {(x, y): colour for y, row in enumerate(DIGITS[ch])
                        for x, c in enumerate(row) if c == "#"})


def icon_bug() -> Image.Image:
    s = Sprite(10, 8)
    s.fill({(x, y) for x, y in ellipse(4, 4, 3.4, 2.6) if y <= 5}, SHELL)
    s.fill(disc(7.4, 4.6, 1.4), CHITIN)
    s.fill({(2, 6), (4, 6), (6, 6)}, CHITIN)
    return render(s)


def icon_laptop() -> Image.Image:
    s = Sprite(11, 9)
    s.fill(rect(2, 1, 7, 5), LAPTOP)
    s.mark(rect(4, 3, 3, 1), ROSE)
    s.fill(rect(1, 6, 9, 2), LAPTOP)
    return render(s)


def icon_exit() -> Image.Image:
    s = Sprite(11, 9)
    s.fill(rect(1, 1, 9, 7), Mat(YELLOW))
    s.mark({(3, 4), (4, 4), (5, 4), (6, 4), (6, 3), (6, 5), (7, 4)}, YELLOW)
    return render(s)


def pointer(colour: RGBA) -> Image.Image:
    pts = {(0, y) for y in range(7)} | {(1, y) for y in range(1, 6)} | \
          {(2, y) for y in range(2, 5)} | {(3, 3)}
    return paint(4, 7, {p: colour for p in pts})


# --- packing and output ------------------------------------------------------

ATLAS_W = 512


def build():
    anims: dict[str, list[Image.Image]] = {}
    anchors: dict[str, tuple[int, int]] = {}
    for name, poses in HERO.items():
        sprites = [hero(p) for p in poses]
        anims[f"hero-{name}-r"] = [render(s) for s in sprites]
        anims[f"hero-{name}-l"] = [render(s.mirrored()) for s in sprites]
        anchors[f"hero-{name}-r"] = (13, FOOT + 1)
        anchors[f"hero-{name}-l"] = (PW - 1 - 13, FOOT + 1)
    # the frame a hit lands on: his silhouette, solid
    for side, flip in (("r", False), ("l", True)):
        sp = hero(HERO["hurt"][0])
        anims[f"hero-hurt-hit-{side}"] = [render(sp.mirrored() if flip else sp, flash=True)]
        anchors[f"hero-hurt-hit-{side}"] = anchors[f"hero-hurt-{side}"]
    for kind, make, frames, foot in (("crawler", crawler, 4, 11),
                                     ("flyer", flyer, 3, 8)):
        sprites = [make(i) for i in range(frames)]
        w = sprites[0].w
        for side, flip in (("r", False), ("l", True)):
            row = [s.mirrored() if flip else s for s in sprites]
            anims[f"{kind}-{side}"] = [render(s) for s in row]
            anims[f"{kind}-hit-{side}"] = [render(row[0], flash=True)]
            anchors[f"{kind}-{side}"] = anchors[f"{kind}-hit-{side}"] = (w // 2, foot)
    for name, make in (("mouse", mouse), ("keyboard", keyboard),
                       ("headphones", headphones)):
        anims[name] = spin(render(make()))
    anims["impact"] = [impact(i) for i in range(3)]
    anims["check"] = [render(check())]
    anims["dust"] = [dust(i) for i in range(3)]
    anchors["dust"] = (6, 5)
    anims["orb"] = [orb(i) for i in range(3)]
    for piece in ("start", "body", "end"):
        anims[f"beam-{piece}"] = [beam(piece, i) for i in range(3)]
    # floor cells: depth * 8 + open sides (up 4, left 2, right 1)
    anims["ground"] = [ground(d, bool(m & 4), bool(m & 2), bool(m & 1))
                       for d in range(DEPTHS) for m in range(8)]
    anims["catwalk"] = [catwalk(left, right) for left, right in
                        ((True, False), (False, False), (False, True), (True, True))]
    anims["door"] = [door(False), door(True)]
    anchors["door"] = (12, DH - 1)
    anims["backdrop"] = [backdrop(0), backdrop(1)]
    anims["heart"] = [heart(True), heart(False)]
    anims["digits"] = [digit(str(i), INK) for i in range(10)]
    anims["digits-red"] = [digit(str(i), RED) for i in range(10)]
    anims["icon-bug"] = [icon_bug()]
    anims["icon-laptop"] = [icon_laptop()]
    anims["icon-exit"] = [icon_exit()]
    anims["pointer-r"] = [pointer(YELLOW)]
    anims["pointer-l"] = [pointer(YELLOW).transpose(Image.Transpose.FLIP_LEFT_RIGHT)]
    return anims, anchors


def pack(anims: dict[str, list[Image.Image]]):
    """Shelves, tallest strips first; each animation one horizontal strip."""
    places: dict[str, dict] = {}
    x = y = shelf = 0
    for name in sorted(anims, key=lambda k: (-anims[k][0].height, k)):
        w, h = anims[name][0].size
        n = len(anims[name])
        if x + w * n > ATLAS_W:
            x, y, shelf = 0, y + shelf, 0
        places[name] = {"x": x, "y": y, "w": w, "h": h, "n": n}
        x += w * n
        shelf = max(shelf, h)
    atlas = Image.new("RGBA", (ATLAS_W, y + shelf), CLEAR)
    for name, at in places.items():
        for i, frame in enumerate(anims[name]):
            atlas.paste(frame, (at["x"] + i * at["w"], at["y"]))
    return atlas, places


def main() -> None:
    anims, anchors = build()
    atlas, places = pack(anims)
    for name, (ax, ay) in anchors.items():
        places[name]["ax"], places[name]["ay"] = ax, ay
    colours = {
        "sky": hexa(SKY),
        "ink": hexa(INK),
        "grey": hexa(GREY),
        "rose": [hexa(ROSE_DEEP), hexa(ROSE), hexa(ROSE_HOT)],
        "green": [hexa(GREEN_DEEP), hexa(GREEN)],
        "cyan": [hexa(CYAN_DEEP), hexa(CYAN)],
        "magenta": hexa(MAGENTA),
        "yellow": hexa(YELLOW),
        "red": hexa(RED),
        "dim": hexa(DIM),
        "rain": hexa(VIOLET_DEEP),
    }
    OUT_PNG.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(OUT_PNG, optimize=True)
    # Biome's own layout, so `biome check` passes on a fresh run: objects
    # expanded, short arrays on one line
    text = json.dumps({"anims": dict(sorted(places.items())), "colours": colours},
                      indent=2)
    text = re.sub(r"\[\s+([^\[\]{}]*?)\s+\]",
                  lambda m: "[" + ", ".join(v.strip() for v in m.group(1).split(",")) + "]",
                  text)
    OUT_JSON.write_text(text + "\n", encoding="utf-8", newline="\n")
    tile = Image.new("RGBA", (22, 22), SKY)
    tile.alpha_composite(anims["hero-idle-r"][0].crop((3, 0, 25, 22)))
    tile.save(OUT_TILE, optimize=True)

    if len(sys.argv) > 1:
        preview = Path(sys.argv[1])
        preview.mkdir(parents=True, exist_ok=True)
        sheet = Image.new("RGBA", atlas.size, SKY)
        sheet.alpha_composite(atlas)
        sheet.resize((sheet.width * 2, sheet.height * 2), Image.NEAREST).save(
            preview / "atlas.png")


if __name__ == "__main__":
    main()
