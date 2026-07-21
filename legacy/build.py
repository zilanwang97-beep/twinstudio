#!/usr/bin/env python3
"""twinstudio 网站构建脚本

用法：在本目录运行  python3 build.py
作用：读取 template.html，把其中的 @@名称@@ 占位符替换为
     assets/ 目录下同名文件（svg/jpg）的 base64 data URI，
     输出单文件 index.html。

替换素材：直接覆盖 assets/ 里的同名文件后重新运行本脚本即可。
新增素材：在 template.html 里写 @@新名称@@，并在 assets/ 放入
         新名称.svg（或 image 开头的 .jpg）。
"""
import base64
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(HERE, "template.html")
ASSETS = os.path.join(HERE, "assets")
OUTPUT = os.path.join(HERE, "index.html")

MIME = {"svg": "image/svg+xml", "jpg": "image/jpeg",
        "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp"}


def datauri(name: str) -> str:
    # 依次尝试常见扩展名
    for ext in ("svg", "jpg", "jpeg", "png", "webp"):
        path = os.path.join(ASSETS, f"{name}.{ext}")
        if os.path.exists(path):
            with open(path, "rb") as f:
                b64 = base64.b64encode(f.read()).decode()
            return f"data:{MIME[ext]};base64,{b64}"
    sys.exit(f"错误：assets/ 里找不到素材 “{name}”（.svg/.jpg/.png）")


def main():
    with open(TEMPLATE, encoding="utf-8") as f:
        tpl = f.read()
    tokens = sorted(set(re.findall(r"@@(\w+)@@", tpl)))
    print(f"发现 {len(tokens)} 个素材占位符")
    for t in tokens:
        tpl = tpl.replace(f"@@{t}@@", datauri(t))
        print(f"  已嵌入 {t}")
    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(tpl)
    print(f"完成 → index.html（{os.path.getsize(OUTPUT)//1024} KB）")


if __name__ == "__main__":
    main()
