#!/usr/bin/env bash
# 웹폰트 원본(모두 SIL OFL 1.1)과 서브셋 도구(fonttools, brotli)를 가져옵니다.
# 이 샌드박스는 일반 인터넷이 막혀 있어 gh / git(GitHub 경유)으로만 받습니다.
# 결과물: tools/.cache/src-fonts/*.ttf, tools/.cache/fonttools, tools/.cache/pylib(brotli)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
CACHE="$ROOT/.cache"
F="$CACHE/src-fonts"
L="$ROOT/../assets/fonts/licenses"
mkdir -p "$F" "$L"
cd "$CACHE"

raw() { # <owner/repo> <path-in-repo> <output-file>
  gh api -H "Accept: application/vnd.github.raw" "repos/$1/contents/$2" > "$3"
}

# 1) 서브셋 도구
[ -d fonttools ] || git clone --depth 1 -q https://github.com/fonttools/fonttools.git
[ -d brotli ] || git clone --depth 1 -q https://github.com/google/brotli.git
# (pyenv shim이 rehash 경고로 0이 아닌 값을 돌려줄 수 있어 결과 파일로 성공 여부를 확인)
[ -f pylib/brotli.py ] || python3 -m pip install -q --no-build-isolation --target "$CACHE/pylib" ./brotli || true
[ -f pylib/brotli.py ] || { echo "brotli build failed" >&2; exit 1; }

# 2) 폰트 원본
raw orioncactus/pretendard packages/pretendard/dist/public/variable/PretendardVariable.ttf "$F/PretendardVariable.ttf"
raw google/fonts ofl/gowunbatang/GowunBatang-Regular.ttf "$F/GowunBatang-Regular.ttf"
raw google/fonts ofl/gowunbatang/GowunBatang-Bold.ttf "$F/GowunBatang-Bold.ttf"
raw google/fonts ofl/blackhansans/BlackHanSans-Regular.ttf "$F/BlackHanSans-Regular.ttf"
raw google/fonts "ofl/hahmlet/Hahmlet%5Bwght%5D.ttf" "$F/Hahmlet-VF.ttf"
raw google/fonts "ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf" "$F/CormorantGaramond-VF.ttf"
raw google/fonts "ofl/cormorantgaramond/CormorantGaramond-Italic%5Bwght%5D.ttf" "$F/CormorantGaramond-Italic-VF.ttf"
raw google/fonts "ofl/spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf" "$F/SpaceGrotesk-VF.ttf"

# 3) 라이선스 (OFL은 재배포 시 라이선스 동봉이 조건)
raw orioncactus/pretendard LICENSE "$L/Pretendard-OFL.txt"
for fam in gowunbatang blackhansans hahmlet cormorantgaramond spacegrotesk; do
  raw google/fonts "ofl/$fam/OFL.txt" "$L/$fam-OFL.txt"
done

ls -la "$F"
echo "done"
