// 차곡 V1 · 고요 — 점진적 향상: JS가 없어도 모든 내용과 링크는 그대로 동작합니다.
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = n => Number(n).toLocaleString('ko-KR');

  /* 1) 헤더: 아래로 읽을 땐 비켜 주고, 위로 올리면 다시 나타남 + 읽기 진행 막대 */
  const header = $('[data-header]');
  const bar = $('[data-progress]');
  const navList = $('#nav-list');
  let lastY = scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    header.classList.toggle('is-scrolled', y > 8);
    const hide = y > lastY && y > 320 && !navList.classList.contains('is-open');
    header.classList.toggle('is-hidden', hide);
    lastY = y;
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

  /* 2) 모바일 메뉴: aria-expanded로 상태를 알리고 Esc로 닫힘 */
  const toggle = $('[data-nav-toggle]');
  const setNav = open => {
    toggle.setAttribute('aria-expanded', String(open));
    navList.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setNav(toggle.getAttribute('aria-expanded') !== 'true'));
  navList.addEventListener('click', e => { if (e.target.closest('a')) setNav(false); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && navList.classList.contains('is-open')) { setNav(false); toggle.focus(); }
  });

  /* 3) 차 필터: 토글 버튼(aria-pressed) + 결과 개수는 aria-live로 알림 */
  const chips = $$('[data-filter]');
  const teas = $$('[data-tea-list] .tea');
  const count = $('[data-tea-count]');
  const names = { green: '녹차', aged: '발효차', blend: '블렌드' };
  chips.forEach(chip => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    let shown = 0;
    teas.forEach(t => {
      const on = f === 'all' || t.dataset.type === f;
      t.hidden = !on;
      if (on) shown += 1;
    });
    count.textContent = f === 'all'
      ? '여섯 가지 차를 모두 보고 있습니다.'
      : `${names[f]} ${shown}가지를 보고 있습니다.`;
  }));

  /* 4) 결제 주기: 1년 결제면 월 환산가와 총액을 함께 보여 줌 */
  $$('input[name="billing"]').forEach(radio => radio.addEventListener('change', () => {
    const yearly = radio.checked && radio.value === 'yearly';
    $$('[data-price]').forEach(p => {
      p.textContent = fmt(yearly ? p.dataset.yearly : p.dataset.monthly);
      p.closest('.plan').querySelector('[data-price-note]').textContent = yearly
        ? `1년 ${fmt(p.dataset.yearlyTotal)}원 한 번에 결제 · 2개월 무료`
        : '매달 결제 · 해지 위약금 없음';
    });
  }));

  /* 5) 스크롤 등장: 같은 묶음 안에서는 살짝 시차를 둠 */
  const items = $$('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-in'));
  } else {
    items.forEach(el => {
      const group = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
      el.style.transitionDelay = `${group.indexOf(el) * 90}ms`;
    });
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    items.forEach(el => io.observe(el));
  }

  /* 6) 뉴스레터: 오류는 무엇이 틀렸고 어떻게 고치는지까지 알려 줌 */
  const form = $('[data-newsletter]');
  const msg = $('[data-newsletter-msg]');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.elements.email;
    if (!input.validity.valid) {
      input.setAttribute('aria-invalid', 'true');
      msg.textContent = '이메일 주소를 다시 확인해 주세요. 예: name@example.com';
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');
    msg.textContent = '고맙습니다. 첫 편지는 12월 1일, 겨울 차 소식과 함께 도착합니다.';
    form.reset();
  });
})();
