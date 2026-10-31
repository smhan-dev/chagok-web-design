"""페이지에 실제로 나오는 글자만 남겨 웹폰트를 woff2로 서브셋합니다.

한글 폰트 원본은 1–8MB이지만, 사이트에 쓰인 글자(수백 자)만 남기면 수십 KB로 줄어듭니다.
폰트마다 그 폰트를 쓰는 버전의 파일만 훑어 글자를 모으고, fonts.css도 함께 생성합니다.

사용법:  bash tools/fetch-fonts.sh   (최초 1회)
         python3 tools/subset_fonts.py
"""
from __future__ import annotations

import html
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CACHE = ROOT / "tools" / ".cache"
sys.path[:0] = [str(CACHE / "fonttools" / "Lib"), str(CACHE / "pylib")]

from fontTools import subset  # noqa: E402
from fontTools.ttLib import TTFont  # noqa: E402

SRC = CACHE / "src-fonts"
OUT = ROOT / "assets" / "fonts"
HUB = [ROOT / "index.html", ROOT / "hub.css"]

# 동적으로 바뀌는 숫자·입력값과 흔한 문장부호는 항상 포함
ALWAYS = "".join(chr(c) for c in range(0x20, 0x7F)) + "·—–“”‘’…₩×−→←°%"

# (원본 파일, 출력 파일, CSS family, style, 글자를 모을 폴더들)
FONTS = [
    ("PretendardVariable.ttf", "pretendard-vf.woff2", "Pretendard", "normal", ["v1-goyo", "v2-toktok", "v3-bamdasil"]),
    ("GowunBatang-Regular.ttf", "gowun-batang-400.woff2", "Gowun Batang", "normal", ["v1-goyo"]),
    ("GowunBatang-Bold.ttf", "gowun-batang-700.woff2", "Gowun Batang", "normal", ["v1-goyo"]),
    ("CormorantGaramond-Italic-VF.ttf", "cormorant-italic-vf.woff2", "Cormorant Garamond", "italic", ["v1-goyo"]),
    ("BlackHanSans-Regular.ttf", "black-han-sans-400.woff2", "Black Han Sans", "normal", ["v2-toktok"]),
    ("SpaceGrotesk-VF.ttf", "space-grotesk-vf.woff2", "Space Grotesk", "normal", ["v2-toktok"]),
    ("Hahmlet-VF.ttf", "hahmlet-vf.woff2", "Hahmlet", "normal", ["v3-bamdasil"]),
    ("CormorantGaramond-VF.ttf", "cormorant-vf.woff2", "Cormorant Garamond", "normal", ["v3-bamdasil"]),
]


def strip_comments(path: pathlib.Path, text: str) -> str:
    """주석 속 글자는 화면에 나오지 않으므로 서브셋에서 뺀다."""
    if path.suffix in {".css", ".js"}:
        text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    if path.suffix == ".js":
        text = re.sub(r"^\s*//.*$", "", text, flags=re.M)   # 줄 전체 주석
        text = re.sub(r"\s//\s.*$", "", text, flags=re.M)   # 코드 뒤 주석 (http:// 같은 문자열은 건드리지 않음)
    if path.suffix == ".html":
        text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    return text


def collect(dirs: list[str]) -> str:
    files = list(HUB)
    for d in dirs:
        files += [p for p in (ROOT / d).rglob("*") if p.suffix in {".html", ".css", ".js"}]
    text = "".join(strip_comments(p, p.read_text(encoding="utf-8")) for p in files if p.exists())
    return "".join(sorted(set(html.unescape(text) + ALWAYS)))


def weight_range(font: TTFont) -> str:
    if "fvar" in font:
        for axis in font["fvar"].axes:
            if axis.axisTag == "wght":
                return f"{int(axis.minValue)} {int(axis.maxValue)}"
    return str(font["OS/2"].usWeightClass)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    css = ["/* 자동 생성: tools/subset_fonts.py — 페이지에 쓰인 글자만 담은 서브셋 (SIL OFL 1.1, licenses/ 참고) */"]
    for src, out, family, style, dirs in FONTS:
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = ["*"]   # 커닝·합자 유지
        opts.hinting = False           # 웹에서는 힌팅을 빼 용량을 줄임
        opts.notdef_outline = True
        font = subset.load_font(str(SRC / src), opts)
        weights = weight_range(font)
        chars = collect(dirs)
        sub = subset.Subsetter(opts)
        sub.populate(text=chars)
        sub.subset(font)
        subset.save_font(font, str(OUT / out), opts)
        before = (SRC / src).stat().st_size / 1024
        after = (OUT / out).stat().st_size / 1024
        hangul = sum(1 for c in chars if "\uac00" <= c <= "\ud7a3")
        print(f"{out:30s} {before:8.0f}KB → {after:6.0f}KB  (한글 {hangul}자)")
        css.append(
            f'@font-face {{ font-family: "{family}"; src: url("{out}") format("woff2"); '
            f"font-weight: {weights}; font-style: {style}; font-display: swap; }}"
        )
    (OUT / "fonts.css").write_text("\n".join(css) + "\n", encoding="utf-8")
    print("fonts.css 생성 완료")


if __name__ == "__main__":
    main()
