#!/usr/bin/env python3
"""
Generate simple professional icons as PNG for PPTX slides.
Creates clean, geometric icons at 274x274px (matching Camilla benchmark).
"""

import os
from PIL import Image, ImageDraw, ImageFont

ICON_SIZE = 274
ICON_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'icons')

# Colors
NAVY = (0x1B, 0x2A, 0x4A)
GOLD = (0xB8, 0x86, 0x0B)
WHITE = (0xFF, 0xFF, 0xFF)
LIGHT_GRAY = (0xE8, 0xE4, 0xDA)
DARK_GRAY = (0x3A, 0x3A, 0x3A)

def ensure_icon_dir():
    os.makedirs(ICON_DIR, exist_ok=True)

def _draw_circle_icon(draw, symbol, bg_color=NAVY, fg_color=WHITE):
    """Draw a circle with a centered symbol."""
    pad = 20
    draw.ellipse([pad, pad, ICON_SIZE-pad, ICON_SIZE-pad], fill=bg_color)
    # Draw symbol as text (Unicode)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/SFNSMono.ttf", 80)
    except:
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 80)
        except:
            font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), symbol, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (ICON_SIZE - tw) // 2
    y = (ICON_SIZE - th) // 2 - 10
    draw.text((x, y), symbol, fill=fg_color, font=font)

def _draw_chevron_icon(draw, bg_color=LIGHT_GRAY, arrow_color=DARK_GRAY):
    """Draw a chevron/arrow pointing right."""
    pad = 30
    points = [
        (pad, pad),
        (ICON_SIZE - pad - 40, pad),
        (ICON_SIZE - pad, ICON_SIZE // 2),
        (ICON_SIZE - pad - 40, ICON_SIZE - pad),
        (pad, ICON_SIZE - pad),
        (pad + 40, ICON_SIZE // 2),
    ]
    draw.polygon(points, fill=bg_color, outline=arrow_color)

def create_icon(name, symbol="*", style="circle", bg_color=None):
    """Create and save an icon PNG. Returns the file path."""
    ensure_icon_dir()
    filepath = os.path.join(ICON_DIR, f"{name}.png")

    if os.path.exists(filepath):
        return filepath

    img = Image.new('RGBA', (ICON_SIZE, ICON_SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if style == "circle":
        _draw_circle_icon(draw, symbol, bg_color or NAVY)
    elif style == "chevron":
        _draw_chevron_icon(draw, bg_color or LIGHT_GRAY)
    elif style == "square":
        pad = 20
        draw.rounded_rectangle([pad, pad, ICON_SIZE-pad, ICON_SIZE-pad],
                               radius=20, fill=bg_color or NAVY)
        _draw_circle_icon(draw, symbol, bg_color or NAVY)

    img.save(filepath, 'PNG')
    return filepath

# Pre-defined icon set for methodology/declaration presentations
ICON_SET = {
    'methodology': ('M', 'circle', NAVY),
    'evidence': ('E', 'circle', GOLD),
    'impact': ('!', 'circle', NAVY),
    'validation': ('\u2713', 'circle', GOLD),  # checkmark
    'research': ('R', 'circle', NAVY),
    'analysis': ('A', 'circle', NAVY),
    'strategy': ('S', 'circle', GOLD),
    'timeline': ('T', 'circle', NAVY),
    'metrics': ('#', 'circle', GOLD),
    'arrow_right': ('>', 'chevron', LIGHT_GRAY),
    'process': ('P', 'circle', NAVY),
    'innovation': ('i', 'circle', GOLD),
    'leadership': ('L', 'circle', NAVY),
    'compliance': ('C', 'circle', NAVY),
    'growth': ('\u2191', 'circle', GOLD),  # up arrow
    'target': ('\u25CE', 'circle', NAVY),  # bullseye
    'star': ('\u2605', 'circle', GOLD),    # star
    'shield': ('\u25C6', 'circle', NAVY),  # diamond
}

def get_icon(name):
    """Get or create an icon by name. Returns file path."""
    if name in ICON_SET:
        symbol, style, color = ICON_SET[name]
        return create_icon(name, symbol, style, color)
    # Fallback: generic circle
    return create_icon(name, name[0].upper(), 'circle', NAVY)

def generate_all_icons():
    """Pre-generate all icons in the set."""
    ensure_icon_dir()
    for name in ICON_SET:
        path = get_icon(name)
        print(f"  {name}: {path}")
    return ICON_DIR

if __name__ == "__main__":
    print("Generating icon set...")
    generate_all_icons()
    print(f"Done. Icons in: {ICON_DIR}")
