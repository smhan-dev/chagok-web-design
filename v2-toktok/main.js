// 차곡 V2 · 톡톡 — 테스트 → 추천 → 담기 → 박스 고르기를 한 흐름으로 잇습니다.
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const fmt = n => Number(n).toLocaleString('ko-KR');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 받침 유무에 따라 조사를 고름: 녹차를 / 오미자를 / 홍차를 …
  const josa = (word, withBatchim, without) => {
    const c = word.charCodeAt(word.length - 1);
    const has = c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
    return word + (has ? withBatchim : without);
  };

  /* 차 데이터: 시간대·맛 점수(0–3)와 카페인 단계(0–3) */
  const TEAS = {
    first:  { name: '첫물 녹차', color: '#C8F169', price: 18000, brew: '70°C · 2분', caf: 2, time: { morning: 2, afternoon: 2, night: 0 }, taste: { nutty: 2, fruity: 0, deep: 0 } },
    matcha: { name: '제주 말차', color: '#5BC16B', price: 24000, brew: '80°C · 격불 30초', caf: 3, time: { morning: 3, afternoon: 1, night: 0 }, taste: { nutty: 1, fruity: 0, deep: 3 } },
    hwang:  { name: '잎새 황차', color: '#FFC53D', price: 20000, brew: '90°C · 3분', caf: 1, time: { morning: 0, afternoon: 2, night: 2 }, taste: { nutty: 3, fruity: 0, deep: 1 } },
    black:  { name: '보성 홍차', color: '#2F45FF', price: 19000, brew: '95°C · 3분', caf: 3, time: { morning: 3, afternoon: 2, night: 0 }, taste: { nutty: 0, fruity: 1, deep: 3 } },
    yuja:   { name: '유자 루이보스', color: '#FF9F1C', price: 16000, brew: '95°C · 5분', caf: 0, time: { morning: 0, afternoon: 1, night: 3 }, taste: { nutty: 1, fruity: 3, deep: 0 } },
    hibi:   { name: '히비스커스 오미자', color: '#FF5470', price: 16000, brew: '95°C · 5분 · 아이스 추천', caf: 0, time: { morning: 1, afternoon: 2, night: 2 }, taste: { nutty: 0, fruity: 3, deep: 0 } },
  };
  const CAF_LABEL = ['카페인 0', '카페인 낮음', '카페인 중간', '카페인 높음'];
  const SHORT = {
    time: { morning: '아침', afternoon: '오후', night: '밤' },
    taste: { nutty: '고소·구수', fruity: '상큼·새콤', deep: '진하고 쌉싸름' },
    caf: { yes: '카페인 OK', low: '카페인 조금', no: '카페인 0' },
  };
  // 질문마다 선택지는 3개 (Hick의 법칙: 선택지가 적을수록 결정이 빠르다)
  const QUESTIONS = [
    { key: 'time', q: '지금은 언제예요?', options: [
      { v: 'morning', t: '아침', s: '출근 전, 정신 차려야 해' },
      { v: 'afternoon', t: '오후', s: '점심 먹고 나른할 때' },
      { v: 'night', t: '밤', s: '씻고 누워서 쉴 때' },
    ] },
    { key: 'taste', q: '어떤 맛이 끌려요?', options: [
      { v: 'nutty', t: '고소·구수', s: '누룽지, 볶은 곡물 같은' },
      { v: 'fruity', t: '상큼·새콤', s: '과일이나 꽃 향기 같은' },
      { v: 'deep', t: '진하고 쌉싸름', s: '어른의 맛, 묵직하게' },
    ] },
    { key: 'caf', q: '카페인은 괜찮아요?', options: [
      { v: 'yes', t: '좋아요', s: '깨워 주면 고맙지' },
      { v: 'low', t: '조금만', s: '은은한 정도면 OK' },
      { v: 'no', t: '안 돼요', s: '잠 못 자요, 진짜로' },
    ] },
  ];

  /* ---------- 담기: 숫자 배지 + 토스트로 즉시 피드백 ---------- */
  let boxCount = 0;
  const toastEl = $('[data-toast]');
  let toastTimer;
  const toast = msg => {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2800);
  };
  const addToBox = id => {
    boxCount += 1;
    $$('[data-box-count]').forEach(el => {
      el.textContent = boxCount;
      el.classList.remove('bump');
      void el.offsetWidth; // 애니메이션 다시 시작
      el.classList.add('bump');
    });
    $('[data-box-link]').setAttribute('aria-label', `내 박스, ${boxCount}개 담김`);
    toast(`${josa(TEAS[id].name, '을', '를')} 박스에 담았어요 · 지금 ${boxCount}개`);
  };
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    addToBox(btn.dataset.add);
    if (btn.closest('.result')) {
      // 다음 단계로 자연스럽게 안내: 버튼을 '박스 고르기' 링크로 바꿈
      const next = document.createElement('a');
      next.className = 'btn btn-accent btn-lg';
      next.href = '#plans';
      next.textContent = '담았어요! 박스 고르러 가기 →';
      btn.replaceWith(next);
      next.focus();
      return;
    }
    btn.dataset.label ??= btn.textContent;
    btn.textContent = '담았어요!';
    btn.classList.add('is-done');
    clearTimeout(btn._t);
    btn._t = setTimeout(() => { btn.textContent = btn.dataset.label; btn.classList.remove('is-done'); }, 1600);
  });

  /* ---------- 취향 테스트 ---------- */
  const body = $('[data-quiz-body]');
  const stepEl = $('[data-quiz-step]');
  const bar = $('[data-quiz-bar]');
  const prog = $('[data-quiz-progress]');
  const answers = {};
  let index = 0;
  let busy = false;

  const setProgress = n => {
    bar.style.width = `${(n / QUESTIONS.length) * 100}%`;
    prog.setAttribute('aria-valuenow', String(n));
  };
  const animate = () => {
    if (reduceMotion) return;
    body.classList.remove('is-anim');
    void body.offsetWidth;
    body.classList.add('is-anim');
  };

  function renderQuestion(focus) {
    const q = QUESTIONS[index];
    stepEl.textContent = `${index + 1} / ${QUESTIONS.length}`;
    setProgress(index);
    body.innerHTML = `
      <div class="q" role="group" aria-labelledby="q-title">
        <h3 class="q-title" id="q-title" tabindex="-1">${q.q}</h3>
        <div class="q-options">
          ${q.options.map((o, k) => `
            <button type="button" class="opt" data-value="${o.v}" aria-pressed="${answers[q.key] === o.v}">
              <span class="opt-key" aria-hidden="true">${'ABC'[k]}</span>
              <span class="opt-t">${o.t}</span>
              <span class="opt-s">${o.s}</span>
            </button>`).join('')}
        </div>
      </div>
      <div class="q-nav">
        ${index > 0 ? '<button type="button" class="link-back" data-back>← 이전 질문</button>' : '<span></span>'}
        <span class="q-hint">고르면 바로 다음 질문으로 넘어가요</span>
      </div>`;
    animate();
    if (focus) $('#q-title').focus({ preventScroll: true });
  }

  function rank() {
    const ids = Object.keys(TEAS).filter(id => answers.caf !== 'no' || TEAS[id].caf === 0);
    const score = id => {
      const t = TEAS[id];
      const cafScore = answers.caf === 'yes' ? t.caf : answers.caf === 'low' ? 2 - Math.abs(t.caf - 1) : 0;
      return t.time[answers.time] + t.taste[answers.taste] * 1.5 + cafScore;
    };
    return ids.sort((a, b) => score(b) - score(a));
  }

  function renderResult() {
    const [bestId, altId] = rank();
    const t = TEAS[bestId];
    stepEl.textContent = '결과';
    setProgress(QUESTIONS.length);
    const eq = ['time', 'taste', 'caf'].map(k => `<span>${SHORT[k][answers[k]]}</span>`).join('<b aria-hidden="true">+</b>');
    body.innerHTML = `
      <div class="result">
        <div class="result-art" style="--tin:${t.color}">
          <div class="tin" style="--tin:${t.color}"><span class="tin-lid"></span><span class="tin-label">${t.name.replace(' ', '<br>')}</span></div>
        </div>
        <div class="result-copy">
          <p class="result-eq">${eq}</p>
          <p class="result-label">그래서 오늘 당신의 차는</p>
          <h3 class="result-name" id="result-name" tabindex="-1">${t.name}</h3>
          <ul class="result-facts"><li>${t.brew}</li><li>${CAF_LABEL[t.caf]}</li><li>${fmt(t.price)}원</li></ul>
          <div class="result-cta">
            <button type="button" class="btn btn-accent btn-lg" data-add="${bestId}">첫 박스에 담기</button>
            <button type="button" class="btn btn-lg" data-restart>다시 해 볼래요</button>
          </div>
          ${altId ? `<p class="result-alt">두 번째 추천은 <a href="#tea-${altId}">${TEAS[altId].name}</a></p>` : ''}
        </div>
      </div>`;
    animate();
    $('#result-name').focus({ preventScroll: true });
  }

  body.addEventListener('click', e => {
    const opt = e.target.closest('.opt');
    if (opt && !busy) {
      busy = true;
      answers[QUESTIONS[index].key] = opt.dataset.value;
      $$('.opt', body).forEach(o => o.setAttribute('aria-pressed', String(o === opt)));
      setTimeout(() => {
        busy = false;
        if (index < QUESTIONS.length - 1) { index += 1; renderQuestion(true); } else { renderResult(); }
      }, reduceMotion ? 0 : 240); // 선택이 눌린 모습을 잠깐 보여 준 뒤 넘어감
      return;
    }
    if (e.target.closest('[data-back]')) { index -= 1; renderQuestion(true); return; }
    if (e.target.closest('[data-restart]')) {
      Object.keys(answers).forEach(k => delete answers[k]);
      index = 0;
      renderQuestion(true);
    }
  });
  renderQuestion(false);

  /* ---------- 상품 필터 ---------- */
  const chips = $$('[data-filter]');
  const products = $$('[data-products] .product');
  const status = $('[data-filter-status]');
  chips.forEach(chip => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    let n = 0;
    products.forEach(p => {
      const on = f === 'all' || p.dataset.tags.split(' ').includes(f);
      p.hidden = !on;
      if (on) n += 1;
    });
    status.textContent = `${chip.textContent} · 차 ${n}개`;
  }));

  /* ---------- 박스 플랜: 고르는 즉시 가격 요약 갱신 ---------- */
  const form = $('[data-box-form]');
  const orig = $('[data-orig]');
  const first = $('[data-first]');
  const next = $('[data-next]');
  const update = () => {
    const price = Number(form.querySelector('input[name="size"]:checked').dataset.price);
    const freq = form.querySelector('input[name="freq"]:checked').value;
    orig.textContent = `${fmt(price)}원`;
    first.textContent = `${fmt(Math.round(price / 20) * 10)}원`;
    next.textContent = `다음 박스부터 ${freq === '1' ? '매달' : '2달마다'} ${fmt(price)}원 · 언제든 해지`;
  };
  form.addEventListener('change', update);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const size = form.querySelector('input[name="size"]:checked').value;
    toast(`${size} 박스로 시작해요! 첫 박스는 ${first.textContent}이에요.`);
  });
  update();
})();
