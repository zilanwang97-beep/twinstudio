#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
一键更新产品列表: 扫描 images/ 文件夹, 自动重新生成 products-data.js

用法: 双击 update-products.command, 或在终端运行 python3 update-products.py

文件命名规则 (放进 images/ 即可):
  home-7.png                      → HOME SERIES, 名字为占位符, tag 用默认值
  home-9_NAP TIME_cushion.png     → 自动填好名字 NAP TIME 和 tag cushion
  前缀对应分类:
    product- / art-   → ART
    home-             → HOME SERIES
    accessary- / accessory- → ACCESSORY
    handcraft-        → HANDCRAFT
    apparel-          → APPAREL
    petgoods-         → PET GOODS

已在 products-data.js 里手动改过的名字/tag 会自动保留, 放心运行。
"""
import os, re, json

ROOT = os.path.dirname(os.path.abspath(__file__))
IMG_DIR = os.path.join(ROOT, "images")
DATA = os.path.join(ROOT, "products-data.js")

# 前缀 → (数组名, 默认tag)
GROUPS = {
    "product":   ("ART_PRODUCTS", "print"),
    "art":       ("ART_PRODUCTS", "print"),
    "home":      ("HOME_PRODUCTS", "cushion"),
    "accessary": ("ACCESSORY_PRODUCTS", "charm"),
    "accessory": ("ACCESSORY_PRODUCTS", "charm"),
    "handcraft": ("HANDCRAFT_PRODUCTS", "handcraft"),
    "apparel":   ("APPAREL_PRODUCTS", "apparel"),
    "petgoods":  ("PETGOODS_PRODUCTS", "pet goods"),
}
ARRAYS = ["ART_PRODUCTS","HOME_PRODUCTS","ACCESSORY_PRODUCTS",
          "HANDCRAFT_PRODUCTS","APPAREL_PRODUCTS","PETGOODS_PRODUCTS"]
EXTS = (".png",".jpg",".jpeg",".webp")

# ---- 读取现有 products-data.js, 保留手动填过的 name/tag ----
existing = {}
if os.path.exists(DATA):
    txt = open(DATA, encoding="utf-8").read()
    for m in re.finditer(r'\{\s*img:"([^"]+)"\s*,\s*name:"([^"]*)"\s*,\s*tag:"([^"]*)"\s*\}', txt):
        existing[m.group(1)] = (m.group(2), m.group(3))

# ---- 扫描 images/ ----
# 同一编号存在多种格式时按此优先级取一张
EXT_PRIORITY = {".png":0, ".webp":1, ".jpg":2, ".jpeg":3}
found = {}   # (数组名, 编号) → (优先级, 文件名, name部分, tag部分)
skipped = []
for f in sorted(os.listdir(IMG_DIR)):
    ext = os.path.splitext(f)[1].lower()
    if ext not in EXT_PRIORITY: continue
    m = re.match(r'([a-zA-Z]+)-(\d+)(?:_([^_]+)_([^_.]+))?\.\w+$', f)
    if not m:
        skipped.append(f); continue
    prefix, num = m.group(1).lower(), int(m.group(2))
    if prefix not in GROUPS:
        skipped.append(f); continue
    arr, _ = GROUPS[prefix]
    key = (arr, num)
    cand = (EXT_PRIORITY[ext], f, m.group(3), m.group(4))
    if key not in found or cand[0] < found[key][0]:
        found[key] = cand

groups = {a: [] for a in ARRAYS}
for (arr, num), (_, f, fname_name, fname_tag) in found.items():
    prefix = f.split("-")[0].lower()
    default_tag = GROUPS[prefix][1]
    img = f"images/{f}"
    if img in existing:
        name, tag = existing[img]
    else:
        name = fname_name or "PRODUCT NAME"
        tag  = fname_tag or default_tag
    groups[arr].append((num, img, name, tag))

# ---- 写 products-data.js ----
out = ['/* ============================================================',
       '   产品数据 —— 由 update-products.py 自动生成',
       '   ------------------------------------------------------------',
       '   可以直接编辑 name / tag, 再次运行脚本时会保留你的修改。',
       '   新增图片: 放进 images/ 后运行 update-products.command 即可。',
       '   ============================================================ */','']
for arr in ARRAYS:
    out.append(f"const {arr} = [")
    for num, img, name, tag in sorted(groups[arr]):
        out.append(f'  {{ img:{json.dumps(img)}, name:{json.dumps(name)}, tag:{json.dumps(tag)} }},')
    out.append("];\n")
open(DATA, "w", encoding="utf-8").write("\n".join(out))

for arr in ARRAYS:
    print(f"{arr}: {len(groups[arr])} 件")
if skipped:
    print("未识别(需要 前缀-数字.png 命名):", ", ".join(skipped[:10]))
print("完成! products-data.js 已更新, 刷新网页即可。")
