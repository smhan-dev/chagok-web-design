// WCAG 2.2 대비 검사기
// 각 버전 style.css의 :root 색 토큰을 직접 읽어서, 실제로 쓰이는 전경/배경 조합의 대비를 계산합니다.
// 사용법: node tools/contrast.mjs   → docs/contrast-report.md 생성, 실패가 있으면 종료 코드 1
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// 기준: 본문 4.5:1 (1.4.3), 24px 이상 큰 글자 3:1, UI 요소·그래픽 3:1 (1.4.11)
const RULE = { text: 4.5, large: 3, ui: 3, deco: 0 };
const RULE_LABEL = { text: '본문 4.5', large: '큰 글자 3.0', ui: '비텍스트 3.0', deco: '장식(기준 없음)' };

const VERSIONS = [
  {
    name: 'V1 고요 (Editorial Calm)', css: 'v1-goyo/style.css',
    pairs: [
      ['본문', '--ink', '--base', 'text'],
      ['보조 글자', '--ink-2', '--base', 'text'],
      ['보조 글자 · 한지 그늘 구획', '--ink-2', '--base-2', 'text'],
      ['키 컬러 제목·로고', '--key', '--base', 'text'],
      ['주 CTA 글자', '--on-accent', '--accent', 'text'],
      ['선택된 칩 · CTA 밴드', '--on-key', '--key', 'text'],
      ['감빛 작은 글자 (번호)', '--accent-text', '--base', 'text'],
      ['감빛 작은 글자 · 한지 그늘', '--accent-text', '--base-2', 'text'],
      ['포인트 면 (낙관·진행 막대)', '--accent', '--base', 'ui'],
      ['푸터 보조 글자', 'rgba(244,239,230,.64)', '--key-deep', 'text'],
      ['푸터 입력칸 안내 글자', 'rgba(244,239,230,.62)', '--key-deep', 'text'],
      ['보조 컬러 (점·장식)', '--support', '--base', 'deco'],
    ],
  },
  {
    name: 'V2 톡톡 (Pop Brutal)', css: 'v2-toktok/style.css',
    pairs: [
      ['본문', '--ink', '--base', 'text'],
      ['보조 글자', '--ink-2', '--base', 'text'],
      ['보조 글자 · 흰 카드', '--ink-2', '--white', 'text'],
      ['핑크 면 위 글자', '--on-key', '--key', 'text'],
      ['라임 면 위 글자', '--ink', '--support', 'text'],
      ['라임 면 위 보조 글자', '--ink-2', '--support', 'text'],
      ['주 CTA 글자 (코발트)', '--on-accent', '--accent', 'text'],
      ['검정 띠 위 라임 글자', '--support', '--ink', 'text'],
      ['검정 띠 위 핑크 글자 (큰 글자)', '--key', '--ink', 'large'],
      ['먹선 테두리', '--ink', '--base', 'ui'],
    ],
  },
  {
    name: 'V3 밤다실 (Noir Premium)', css: 'v3-bamdasil/style.css',
    pairs: [
      ['본문', '--ink', '--base', 'text'],
      ['보조 글자', '--ink-2', '--base', 'text'],
      ['보조 글자 · 카드 면', '--ink-2', '--surface-2', 'text'],
      ['청자 키 글자 (키커·라벨)', '--key', '--base', 'text'],
      ['청자 키 글자 · 카드 면', '--key', '--surface-2', 'text'],
      ['금박 가격', '--accent', '--surface-1', 'text'],
      ['주 CTA 글자 (금박 버튼)', '--on-accent', '--accent', 'text'],
      ['선택된 칩 (심청 면)', '--ink', '--support', 'text'],
      ['타이머 고리', '--accent', '--surface-1', 'ui'],
      ['얇은 선 (장식)', '--line', '--base', 'deco'],
    ],
  },
];

const parseColor = v => {
  v = v.trim();
  let m = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = [...h].map(c => c + c).join('');
    return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).concat(1);
  }
  m = v.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const [r, g, b, a = '1'] = m[1].split(',').map(s => s.trim());
    return [Number(r), Number(g), Number(b), Number(a)];
  }
  throw new Error(`알 수 없는 색: ${v}`);
};
const tokens = css => {
  const root = css.match(/:root\s*{([\s\S]*?)}/)[1];
  const map = {};
  for (const [, name, value] of root.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) map[name] = value.split('/*')[0].trim();
  return map;
};
const resolve = (map, ref) => {
  let v = ref.startsWith('--') ? map[ref] : ref;
  while (v && v.startsWith('var(')) v = map[v.slice(4, -1).trim()];
  if (!v) throw new Error(`토큰 없음: ${ref}`);
  return parseColor(v);
};
const blend = ([r, g, b, a], [br, bg, bb]) => [r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb * (1 - a)];
const lum = rgb => {
  const [r, g, b] = rgb.map(c => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (fg, bg) => {
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
};
const hex = rgb => `#${rgb.slice(0, 3).map(c => Math.round(c).toString(16).padStart(2, '0')).join('').toUpperCase()}`;

let failed = 0;
const out = [
  '# 색 대비 검사 결과 (WCAG 2.2)',
  '',
  '`node tools/contrast.mjs`가 각 버전의 `style.css`에서 `:root` 색 토큰을 직접 읽어 계산한 결과입니다. 반투명 색은 배경 위에 합성한 뒤 계산했습니다.',
  '',
  '- 본문 글자: 4.5:1 이상 (SC 1.4.3)',
  '- 24px 이상(굵게는 18.66px 이상) 큰 글자: 3:1 이상',
  '- 버튼 테두리·아이콘·진행 막대 같은 비텍스트 요소: 3:1 이상 (SC 1.4.11)',
  '',
];
for (const v of VERSIONS) {
  const map = tokens(readFileSync(join(ROOT, v.css), 'utf8'));
  out.push(`## ${v.name}`, '', '| 쓰임 | 전경 | 배경 | 대비 | 기준 | 결과 |', '|---|---|---|---:|---|:---:|');
  console.log(`\n${v.name}`);
  for (const [label, fgRef, bgRef, kind] of v.pairs) {
    const bg = resolve(map, bgRef);
    const fgRaw = resolve(map, fgRef);
    const fg = fgRaw[3] < 1 ? blend(fgRaw, bg) : fgRaw.slice(0, 3);
    const r = ratio(fg, bg.slice(0, 3));
    const pass = r >= RULE[kind];
    if (kind !== 'deco' && !pass) failed += 1;
    const mark = kind === 'deco' ? '참고' : pass ? '✅' : '❌';
    const fgLabel = fgRaw[3] < 1 ? `${fgRef.startsWith('--') ? `\`${fgRef}\`` : fgRef} → ${hex(fg)}` : `\`${fgRef.startsWith('--') ? fgRef : hex(fg)}\` ${hex(fg)}`;
    out.push(`| ${label} | ${fgLabel} | \`${bgRef}\` ${hex(bg)} | ${r.toFixed(2)}:1 | ${RULE_LABEL[kind]} | ${mark} |`);
    console.log(`  ${mark}  ${r.toFixed(2).padStart(5)}:1  ${label}`);
  }
  out.push('');
}
out.push(failed ? `**실패 ${failed}건**` : '**모든 필수 조합 통과** (장식용 조합은 기준 적용 대상이 아님)', '');
mkdirSync(join(ROOT, 'docs'), { recursive: true });
writeFileSync(join(ROOT, 'docs/contrast-report.md'), out.join('\n'));
console.log(failed ? `\n실패 ${failed}건` : '\n모든 필수 조합 통과');
process.exit(failed ? 1 : 0);
