# 좋은 웹사이트 디자인이란 무엇인가 — 리서치 노트

> 이 문서는 세 버전(V1 고요 · V2 톡톡 · V3 밤다실)을 만들기 전에 정리한 기준과, 그 기준을 실제로 어디에 적용했는지를 함께 기록합니다. 출처는 문서 끝에 모았습니다.

## 0. 정의

이 작업에서 쓴 정의는 다음과 같습니다.

**좋은 웹사이트는 방문자가 ① 여기가 무엇을 하는 곳인지 몇 초 안에 알고, ② 원하는 행동을 망설임 없이 끝내고, ③ 그 과정을 기분 좋게 기억하는 사이트입니다. 그리고 이 경험이 시력, 손의 움직임, 기기, 네트워크 속도와 상관없이 모두에게 열려 있어야 합니다.**

예쁜 것은 ③에 속하지만 ①, ②를 대신하지 못합니다. 아름다운 디자인은 사람들이 작은 불편을 너그럽게 넘기게 만들지만, 같은 이유로 사용성 테스트에서 문제를 가리기도 합니다([Laws of UX — 심미적 사용성 효과](https://lawsofux.com/aesthetic-usability-effect/)). 그래서 이 프로젝트는 "보기 좋게"보다 "목표 → 위계 → 색 → 글자 → 상호작용 → 검증" 순서로 결정했습니다.

## 1. 위계: 한 화면, 하나의 목표

- 페이지마다 **가장 중요한 행동 하나**를 먼저 정합니다. V1은 "월 구독 시작", V2는 "1분 취향 테스트", V3는 "컬렉션 보기 / 다실 예약"입니다.
- 그 행동이 가장 먼저 보이도록 **크기 → 색 → 여백 → 위치** 순서로 위계를 줍니다. 크기가 가장 강하고, 색은 그다음입니다.
- 같은 페이지에서 주 CTA는 같은 색, 같은 모양으로 반복합니다. 보조 행동(“그냥 구경할래요”, “차 컬렉션 보기”)은 테두리만 있거나 텍스트 링크라서 주 CTA와 경쟁하지 않습니다.

## 2. 색: 역할로 설계하기

### 2-1. 네 가지 역할

| 역할 | 하는 일 | 쓰는 곳 | 흔한 실수 |
|---|---|---|---|
| **키 컬러** (Key) | 브랜드를 알아보게 하는 색 | 로고, 제목, 선택 상태, 큰 구획 | 모든 버튼에 키 컬러를 써서 강조가 사라짐 |
| **보조 컬러** (Supporting) | 키 컬러를 거들어 화면에 리듬을 줌 | 태그, 카드 면, 일러스트, 구획 배경 | 보조 색을 글자색으로 써서 대비 부족 |
| **바탕 컬러** (Base) | 화면 대부분을 채우는 면 | 페이지 배경, 카드 | 순백·순흑을 그대로 써서 눈이 피로함 |
| **포인트 컬러** (Accent) | "여기를 누르세요"라는 신호 | 주 CTA, 진행 막대, 배지 | 장식에도 써서 신호가 약해짐 |

포인트 컬러를 주 CTA에만 아껴 쓰는 이유는 **폰 레스토프 효과(고립 효과)** 입니다. 비슷한 것들 사이에서 혼자 다른 것이 가장 잘 기억되고, 가장 먼저 눈에 들어옵니다.

### 2-2. 60-30-10 비율

지배색 60%, 보조색 30%, 강조색 10%로 나누면 위계가 자연스럽게 생긴다는 경험칙입니다([WP Mayor](https://wpmayor.com/the-60-30-10-rule-made-our-website-designs-infinitely-better/)). 강조색은 CTA처럼 핵심 요소에만 아껴 씁니다([LogRocket](https://blog.logrocket.com/ux-design/60-30-10-rule)). 다만 정확한 공식이라기보다 출발점입니다([Mockitt](https://mockitt.com/ui-ux-design/60-30-10-color-rule.html)).

이 프로젝트는 네 역할을 이렇게 대응시켰습니다.

```
바탕 60  ·  키 + 보조 30  ·  포인트 10
```

| 버전 | 바탕 | 키 | 보조 | 포인트 |
|---|---|---|---|---|
| V1 고요 | 한지 `#F4EFE6` 60% | 송엽 `#2F4B3C` 22% | 이끼 세이지 `#A9B59F` 8% | 감 `#B8512A` 10% |
| V2 톡톡 | 오트밀크 `#FFF5E8` 60% | 히비스커스 `#FF5470` 18% | 말차 라임 `#C8F169` 12% | 코발트 `#2F45FF` 10% |
| V3 밤다실 | 밤먹 `#0E1110` 60% | 청자 `#8EC5B0` 14% | 심청 `#2C4A40` 16% | 금박 `#D9B26F` 10% |

(비율은 화면 면적 기준의 설계 목표치이며, 픽셀 단위로 측정한 값은 아닙니다.)

### 2-3. 색을 고르는 순서 (이번 작업에서 쓴 절차)

1. **이야기에서 키 컬러를 뽑는다.** 녹차 잎(송엽), 히비스커스 꽃(핑크), 고려청자(청자). 색에 이유가 있으면 나머지 결정이 쉬워집니다.
2. **키 컬러와 온도가 맞는 바탕을 고른다.** 순백 대신 따뜻한 한지색·오트밀크색, 순흑 대신 녹빛이 도는 먹색.
3. **보조 컬러는 키의 이웃 색이나 같은 색의 다른 명도로.** V1은 같은 녹색 계열의 세이지, V3는 청자를 어둡게 내린 심청. V2만 의도적으로 고채도 라임을 썼습니다.
4. **포인트 컬러는 키와 대비되게.** 색상(보색 쪽)이나 온도(차가움↔따뜻함)가 반대여야 고립 효과가 생깁니다. 송엽(차가운 녹색) ↔ 감(따뜻한 주황), 핑크·라임 ↔ 코발트, 청자(차가움) ↔ 금박(따뜻함).
5. **글자색을 정한다.** 본문은 거의 검정(먹 `#1F2420`, `#141414`)이나 아이보리(`#ECE6D8`), 보조 글자는 한 단계 옅게.
6. **대비를 계산해서 검증한다.** 감에 맞으면 끝내지 않고 숫자로 확인합니다(아래 2-4).
7. **상태 색을 정한다.** hover, focus, 선택, 비활성. 포커스 링은 배경과 3:1 이상이어야 합니다.

### 2-4. 대비 기준 (WCAG 2.2 AA)

- 일반 글자는 배경과 **4.5:1** 이상, 큰 글자(약 24px, 굵게는 약 18.66px 이상)는 **3:1** 이상이어야 합니다([W3C SC 1.4.3](https://w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [LambdaTest](https://www.lambdatest.com/blog/color-contrast-accessibility/)).
- 버튼 테두리, 입력칸, 아이콘처럼 알아봐야 하는 UI 부분도 **3:1**이 기준입니다([DEV Community](https://dev.to/chille87/color-contrast-requirements-wcag-20-21-22-and-the-ada-3gci)).

**이번 작업에서 실제로 걸린 문제와 해결**

- V1의 감빛 `#B8512A`는 버튼 면으로는 흰 글자와 4.94:1로 통과하지만, 한지 그늘(`#EBE4D6`) 위의 작은 번호 글자로 쓰면 기준선에 가까워집니다. 그래서 **글자용 감빛 `#9C4322`를 따로 두었습니다**(5.12:1). 같은 역할의 색도 "면용"과 "글자용"을 나누는 것이 실무에서 흔한 해법입니다.
- V2의 히비스커스 핑크 위 흰 글자는 3.1:1이라 본문으로는 실패합니다. 그래서 **핑크 면 위에는 검정 글자만** 씁니다(5.93:1).
- V1 푸터의 반투명 글자는 투명도를 0.5에서 0.62로 올려 5.27:1을 확보했습니다.

`node tools/contrast.mjs`가 각 `style.css`의 `:root` 토큰을 직접 읽어 계산하므로, CSS를 고치면 검사도 함께 바뀝니다. 결과: 필수 조합 30개 전부 통과 → [contrast-report.md](contrast-report.md)

### 2-5. 다크 모드 (V3)

- **순수한 검정 대신 짙은 회색**을 바탕으로 쓰면 깊이와 높이를 표현할 여지가 생깁니다([Material Design](https://m2.material.io/design/color/dark-theme.html)). V3의 바탕은 녹빛 먹색 `#0E1110`입니다.
- 어두운 화면에서는 그림자가 잘 보이지 않으므로 **높은 면일수록 밝게** 칠해 높이를 표현하고, 강조색의 채도를 낮춰 번져 보이지 않게 합니다([SuperDesign](https://superdesign.dev/styles/dark-mode)). V3의 카드는 `#141917` → `#1B221F`로 한 단계씩 밝아집니다.
- 밝은 글자는 어두운 바탕에서 실제보다 굵어 보입니다. V3 본문은 Pretendard 350(일반보다 가벼움), 제목은 함렛 250–300으로 한 단계씩 낮췄고, 글자색은 순백 대신 아이보리를 썼습니다.
- 사용자는 다크 모드를 앱별이 아니라 기기 설정 단위로 생각하는 경향이 있습니다([NN/g](https://www.nngroup.com/articles/dark-mode-users-issues/)). V3는 "다크 모드 지원"이 아니라 **브랜드 자체가 어두운 장면**이라는 콘셉트이므로 `color-scheme: dark`를 고정했습니다.

## 3. 타이포그래피 — 한글에서 특히 중요한 것

- **단어 단위 줄바꿈**: CSS 기본값은 한글을 글자 단위로 끊습니다. `word-break: keep-all`은 한중일 텍스트에서 단어 중간 줄바꿈을 막아 줍니다([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/word-break), [WebReference](https://webreference.com/css/properties/word-break/)). 긴 URL이 넘치지 않도록 `overflow-wrap: break-word`를 함께 둡니다.
- **행간**: 한글은 네모난 글자가 빽빽해 라틴 문자보다 넓은 행간이 편합니다. 실무 관행대로 본문 1.65–1.8(V2 1.65, V1·V3 1.8), 큰 제목은 1.0–1.3을 썼습니다.
- **자간**: 큰 한글 제목은 기본 자간이 벌어져 보여 `-0.01em ~ -0.03em`으로 좁혔습니다.
- **줄 끝 정리**: 제목은 `text-wrap: balance`, 본문은 `text-wrap: pretty`로 한 단어만 덩그러니 남는 줄을 줄였습니다.
- **서체 조합은 역할로**: 표정을 만드는 제목 서체 하나 + 읽기 편한 본문 서체(Pretendard) + 숫자·영문 보조 서체. 세 버전 모두 본문은 Pretendard로 같고, **제목 서체만 바꿔도 인상이 크게 달라진다**는 점을 비교할 수 있습니다.

| 버전 | 제목 | 본문 | 숫자·영문 |
|---|---|---|---|
| V1 | 고운바탕 (문학적인 명조) | Pretendard 400 | Cormorant Garamond Italic |
| V2 | 검은고딕 (Black Han Sans) | Pretendard 500 | Space Grotesk |
| V3 | 함렛 250–300 (가는 현대 명조) | Pretendard 350 | Cormorant Garamond |

- **폰트 용량**: 한글 폰트는 완성형 11,172자를 담아 파일이 큽니다. `tools/subset_fonts.py`가 페이지에 실제로 나오는 글자만 남깁니다.

| 폰트 | 원본 | 서브셋(woff2) |
|---|---:|---:|
| Pretendard Variable (한글 549자) | 6,581KB | 134KB |
| 고운바탕 Regular | 8,236KB | 67KB |
| 함렛 Variable | 3,476KB | 176KB |
| 검은고딕 | 975KB | 23KB |

  대가: 나중에 문구를 바꾸면 스크립트를 다시 돌려야 합니다. 사용자가 글을 입력하는 서비스라면 이 방식 대신 유니코드 범위로 나눈 동적 서브셋을 써야 합니다.

## 4. UX 법칙 — 이번 작업에 쓴 것

| 법칙 | 뜻 | 적용한 곳 |
|---|---|---|
| **제이콥의 법칙** | 사람들은 이미 익숙한 다른 사이트처럼 동작하길 기대한다([Laws of UX](https://lawsofux.com/)) | 로고는 왼쪽 위, 장바구니는 오른쪽 위, FAQ는 펼침 목록. 세 버전 모두 같은 정보 구조 |
| **힉의 법칙** | 선택지가 많을수록 결정이 느려진다 | V2 퀴즈는 질문당 선택지 3개, 필터 칩은 4개, 박스 크기는 S·M·L |
| **피츠의 법칙** | 누를 곳은 크고 가까울수록 빠르다. 터치 타깃은 44pt/48dp 정도를 권장([Idealogic](https://idealogic.io/blog/psychology-behind-ui-ux-design-5-principles-you-should-know)) | 주 CTA 48–64px, V2 모바일은 엄지가 닿는 하단에 핵심 행동 고정 |
| **폰 레스토프 효과** | 혼자 다른 것이 기억된다 | 포인트 색은 주 CTA에만, 추천 플랜·추천 선물은 하나만 강조 |
| **목표 경사 효과** | 목표에 가까워질수록 더 열심히 한다 | V2 퀴즈 진행 막대, V3 무료 배송까지 남은 금액 막대 |
| **피크-엔드 법칙** | 경험은 가장 강렬한 순간과 마지막으로 기억된다 | V2 퀴즈 결과 공개, V3 타이머가 끝나는 순간의 색 변화 |
| **도허티 임계** | 400ms 안에 반응하면 흐름이 끊기지 않는다 | 누르는 즉시 버튼 상태·배지·토스트가 바뀜. 퀴즈는 선택 모습을 0.24초 보여 준 뒤 다음 질문으로 |
| **심미적 사용성 효과** | 보기 좋은 디자인은 쓰기 쉽다고 느껴진다 | 그래서 더더욱 대비·포커스·키보드 조작을 숫자로 검증 |

## 5. 접근성 체크리스트 (세 버전 공통)

- [x] 본문 4.5:1, 큰 글자·UI 3:1 대비 (자동 검사)
- [x] 누를 곳은 최소 24×24px([W3C SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)), 실제로는 대부분 44px 이상
- [x] `본문으로 바로가기` 링크, 모든 상호작용 요소에 보이는 포커스 링
- [x] 네이티브 요소 우선: 펼침은 `<details>`, 결제 주기·박스 크기·예약 시간은 `<input type="radio">`, 장바구니는 `<dialog>`(포커스 가두기와 Esc 닫기를 브라우저가 처리)
- [x] 필터 결과 개수, 타이머 시작·종료, 예약 완료는 `aria-live`로 화면 낭독기에도 알림
- [x] 장식 그림은 `aria-hidden`, 약도처럼 정보가 있는 그림은 `role="img"`와 설명
- [x] `prefers-reduced-motion`이면 애니메이션·부드러운 스크롤을 끔
- [x] 점진적 향상: JS가 없어도 모든 내용과 링크가 보이도록, 숨김 애니메이션은 `.js` 클래스가 있을 때만 적용
- [x] 오류 메시지는 무엇이 틀렸고 어떻게 고치는지까지 ("예: name@example.com")

## 6. 성능

- 목표는 Core Web Vitals의 "좋음" 기준: **LCP 2.5초 이하, INP 200ms 이하, CLS 0.1 이하**, 실제 방문의 75번째 백분위 기준([web.dev](https://web.dev/articles/defining-core-web-vitals-thresholds), [corewebvitals.io](https://www.corewebvitals.io/core-web-vitals)).
- 큰 히어로 이미지를 쓴다면 압축하고 크기를 명시해 레이아웃 밀림을 막아야 합니다([Grafdom](https://www.grafdom.com/newsroom/trends-of-web-design/)). 이 프로젝트는 **사진을 한 장도 쓰지 않고** 찻사발, 틴 케이스, 찻잔을 CSS 그라디언트와 SVG로 그렸습니다.
- 페이지 무게(압축 전): HTML 17–21KB, CSS 24–27KB, JS 4.6–11.4KB, 프레임워크 없음.
- 페이지별 폰트: V1 약 290KB, V2 약 176KB, V3 약 350KB. 중요한 폰트는 `preload`, 모두 `font-display: swap`.
- 한계: 실제 사용자 데이터로 측정한 수치가 아닙니다. 배포 후 PageSpeed Insights나 CrUX로 확인해야 합니다.

## 7. 2026 트렌드 — 취한 것과 거른 것

올해 자주 언급되는 흐름은 거의 보이지 않는 UI, 자연에서 영감을 받은 디자인, 촉감이 느껴지는 질감, 벤토 그리드, 브루탈리즘, 스크롤리텔링, 움직이는 타이포그래피입니다([Bubble](https://bubble.io/blog/web-design-trends/)). 탐험하듯 둘러보는 비선형 레이아웃([Figma](https://www.figma.com/resource-library/web-design-trends/)), 개성 있는 비주얼의 귀환과 접근성 우선 사고([Envato](https://elements.envato.com/learn/web-design-trends)), 향수와 자연, 물리적 세계와 디지털의 경계 흐리기([Wix](https://wix.com/blog/web-design-trends))도 꼽힙니다.

| 트렌드 | 어디에 | 거른 부분 |
|---|---|---|
| 자연 영감 · 촉감 | V1 한지 질감 노이즈, 찻잎 SVG, 낙관 | 질감은 불투명도 5% 이하로. 글자 대비를 해치지 않게 |
| 네오 브루탈리즘 · 움직이는 글자 | V2 먹선과 하드 섀도, 흐르는 띠, 도는 배지 | 테두리 2.5px, 그림자 방향 하나로 규칙 통일. 띠는 마우스를 올리면 멈추고 움직임 줄이기 설정에서 꺼짐 |
| 스크롤리텔링 · 몰입형 다크 | V3 고정된 찻잔이 단계마다 우러남 | 스크롤을 가로채지 않음. 네이티브 스크롤 + `position: sticky`만 사용 |
| 거의 보이지 않는 UI | V3 투명 헤더, 얇은 선 | 투명 헤더는 스크롤하면 반투명 면이 생겨 글자가 읽히게 |

트렌드는 수단입니다. 기준은 늘 "이 브랜드의 목표 행동을 돕는가, 모두가 쓸 수 있는가"였습니다.

## 8. 세 버전 요약

| | V1 고요 | V2 톡톡 | V3 밤다실 |
|---|---|---|---|
| 철학 | 덜어내기 | 촉감과 놀이 | 몰입과 여운 |
| 대상 | 퇴근 후 쉼을 찾는 30–40대 | 차가 처음인 20대 | 선물을 고르는 30–40대 |
| 핵심 전환 | 월 구독 | 퀴즈 → 첫 박스 | 선물 세트, 다실 예약 |
| 대표 UX | 숨는 헤더 + 읽기 진행 막대, 필터, 결제 주기 전환 | 3문항 퀴즈, 즉시 피드백 토스트, 하단 고정 바 | 스크롤리텔링, 우림 타이머, 서랍형 장바구니, 좌석 예약 |

자세한 비교와 스크린숏은 [비교 허브(index.html)](../index.html)에 있습니다.

## 9. 검증한 것과 하지 못한 것

**검증함**
- 색 대비: 필수 조합 30개 자동 계산, 전부 WCAG 2.2 AA 통과
- Playwright(Chromium)로 1440px 데스크톱, 390px 모바일 렌더링 확인: 콘솔 오류 0건, 가로 넘침 0px
- 동작 확인: V1 필터와 결제 주기 전환, V2 퀴즈(밤 + 상큼 + 카페인 없음 → 유자 루이보스)와 담기 토스트, V3 스크롤리텔링 3단계, 타이머, 장바구니(Esc로 닫으면 누른 버튼으로 포커스 복귀), 예약(22:00은 1자리라 인원 + 버튼 비활성)

**하지 못함**
- Safari, Firefox, 실제 iOS·Android 기기 확인
- VoiceOver, NVDA 같은 실제 화면 낭독기 테스트
- 실제 사용자 대상 사용성 테스트, A/B 테스트
- 실제 사용자 데이터로 Core Web Vitals 측정

## 출처

- Bubble, [Web Design Trends 2026](https://bubble.io/blog/web-design-trends/)
- Figma, [Top Web Design Trends for 2026](https://www.figma.com/resource-library/web-design-trends/)
- Envato, [Web design trends](https://elements.envato.com/learn/web-design-trends)
- Wix, [The Biggest Web Design Trends of 2026](https://wix.com/blog/web-design-trends)
- Grafdom, [Web Design Trends for 2026](https://www.grafdom.com/newsroom/trends-of-web-design/)
- WP Mayor, [The 60/30/10 Rule in Web Design](https://wpmayor.com/the-60-30-10-rule-made-our-website-designs-infinitely-better/)
- LogRocket, [The 60-30-10 rule](https://blog.logrocket.com/ux-design/60-30-10-rule)
- Mockitt, [60-30-10 Color Rule](https://mockitt.com/ui-ux-design/60-30-10-color-rule.html)
- W3C, [Understanding SC 1.4.3 Contrast (Minimum)](https://w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- W3C, [Understanding SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- LambdaTest, [Color Contrast Accessibility](https://www.lambdatest.com/blog/color-contrast-accessibility/)
- DEV Community, [Color Contrast Requirements: WCAG 2.0, 2.1, 2.2](https://dev.to/chille87/color-contrast-requirements-wcag-20-21-22-and-the-ada-3gci)
- Material Design, [Dark theme](https://m2.material.io/design/color/dark-theme.html)
- SuperDesign, [Dark Mode UI](https://superdesign.dev/styles/dark-mode)
- Nielsen Norman Group, [Dark Mode: How Users Think About It](https://www.nngroup.com/articles/dark-mode-users-issues/)
- Laws of UX, [lawsofux.com](https://lawsofux.com/), [Aesthetic-Usability Effect](https://lawsofux.com/aesthetic-usability-effect/)
- Idealogic, [Psychology behind UI/UX design](https://idealogic.io/blog/psychology-behind-ui-ux-design-5-principles-you-should-know)
- MDN, [word-break](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/word-break)
- WebReference, [The CSS word-break Property](https://webreference.com/css/properties/word-break/)
- web.dev, [How the Core Web Vitals thresholds were defined](https://web.dev/articles/defining-core-web-vitals-thresholds)
- corewebvitals.io, [What Are the Core Web Vitals?](https://www.corewebvitals.io/core-web-vitals)

*출처의 내용은 라이선스 준수를 위해 요약하고 다시 썼습니다. (Content was rephrased for compliance with licensing restrictions.)*
