"""
Replace a baked-in "transparency" checkerboard with a clean studio backdrop.

The studio portrait was exported with the grey/white checkerboard painted into the pixels (no alpha
channel). This keys out near-neutral, bright pixels that are connected to the image border (so white
details inside the subject, e.g. a shirt logo, are kept), feathers the edge, and composites the subject
onto a soft blue-grey backdrop with a faint engineering grid. Output is 4:5 with added headroom.

Usage: python3 scripts/studio-backdrop.py <input.png> <output.png>
"""

import sys

import numpy as np
from PIL import Image, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
rgb = np.asarray(Image.open(src).convert("RGB")).astype(np.int16)
h, w, _ = rgb.shape

# 1. Candidate background: bright, colourless pixels (the checker squares are ~196–255 grey).
lo, hi = rgb.min(axis=2), rgb.max(axis=2)
candidate = (lo > 180) & ((hi - lo) < 14)

# 2. Seeds: the image border, plus any spot that looks like checkerboard — a dense mix of white
#    and light-grey squares within 24px. That catches enclosed pockets (e.g. between arm and body)
#    while solid white details such as a shirt logo don't match the pattern and are kept.
def window_fraction(m, r=12):
    s = np.pad(m.astype(np.int32), ((1, 0), (1, 0))).cumsum(0).cumsum(1)
    y0, y1 = np.clip(np.arange(h) - r, 0, h), np.clip(np.arange(h) + r + 1, 0, h)
    x0, x1 = np.clip(np.arange(w) - r, 0, w), np.clip(np.arange(w) + r + 1, 0, w)
    total = s[y1][:, x1] - s[y0][:, x1] - s[y1][:, x0] + s[y0][:, x0]
    area = (y1 - y0)[:, None] * (x1 - x0)[None, :]
    return total / area


white = candidate & (lo >= 245)
grey = candidate & (lo >= 190) & (hi <= 232)
# Judge the mix among the light pixels in the window, so narrow pockets next to the subject count.
cf = window_fraction(candidate)
ratio_w = window_fraction(white) / np.maximum(cf, 1e-6)
ratio_g = window_fraction(grey) / np.maximum(cf, 1e-6)
checker = candidate & (cf > 0.12) & (ratio_w > 0.25) & (ratio_g > 0.25)

bg = checker.copy()
bg[0, :] |= candidate[0, :]
bg[-1, :] |= candidate[-1, :]
bg[:, 0] |= candidate[:, 0]
bg[:, -1] |= candidate[:, -1]
while True:
    grown = bg.copy()
    grown[1:, :] |= bg[:-1, :]
    grown[:-1, :] |= bg[1:, :]
    grown[:, 1:] |= bg[:, :-1]
    grown[:, :-1] |= bg[:, 1:]
    grown &= candidate
    if (grown == bg).all():
        break
    bg = grown

# 3. Subject alpha: shrink 1px into the subject to drop anti-aliased checker fringe, then feather.
mask = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8))
mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.1))

# 4. Backdrop: radial light behind the head fading to cool blue-grey, plus a faint grid.
out_h = round(w * 5 / 4)  # 4:5 frame
headroom = 70
yy, xx = np.mgrid[0:out_h, 0:w].astype(np.float32)
cx, cy = w * 0.52, out_h * 0.28
d = np.sqrt(((xx - cx) / (w * 0.85)) ** 2 + ((yy - cy) / (out_h * 0.8)) ** 2).clip(0, 1)
top, edge = np.array([241, 245, 251], np.float32), np.array([176, 191, 214], np.float32)
backdrop = top * (1 - d[..., None] ** 1.4) + edge * (d[..., None] ** 1.4)
grid = ((xx % 64) < 1.5) | ((yy % 64) < 1.5)
backdrop[grid] = backdrop[grid] * 0.94 + np.array([37, 99, 235], np.float32) * 0.06
canvas = Image.fromarray(backdrop.clip(0, 255).astype(np.uint8), "RGB")

subject = Image.open(src).convert("RGB")
canvas.paste(subject, (0, headroom), mask)  # bottom is cropped by the 4:5 canvas
canvas.save(dst, optimize=True)
print(f"wrote {dst} ({w}x{out_h}); background pixels keyed: {bg.mean():.1%}")
