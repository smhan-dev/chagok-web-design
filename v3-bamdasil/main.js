// 차곡 V3 · 밤다실 — 몰입(스크롤리텔링)과 실용(타이머·예약·장바구니)의 균형
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const fmt = n => Number(n).toLocaleString('ko-KR');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = reduceMotion ? 'auto' : 'smooth';
  const josa = (word, withBatchim, without) => {
    const c = word.charCodeAt(word.length - 1);
    const has = c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
    return word + (has ? withBatchim : without);
  };

  /* 1) 헤더: 히어로 위에서는 투명, 스크롤하면 반투명 면 */
  const header = $('[data-header]');
  const onScroll = () => header.classList.toggle('is-solid', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 2) 스크롤리텔링: 화면 가운데에 온 단계가 찻잔 색을 바꿈 */
  const visual = $('[data-ritual-visual]');
  const label = $('[data-ritual-label]');
  const steps = $$('.r-step');
  const LABELS = { 1: '95°', 2: '3:00', 3: '여운' };
  const setStep = step => {
    visual.dataset.step = step.dataset.step;
    label.textContent = LABELS[step.dataset.step];
    steps.forEach(s => s.classList.toggle('is-active', s === step));
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => en.isIntersecting && setStep(en.target)), { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(s => io.observe(s));
  } else {
    steps.forEach(s => s.classList.add('is-active'));
  }

  /* 3) 컬렉션 레일: 버튼·키보드·터치 모두로 넘기기 + 끝에 닿으면 버튼 비활성 */
  const rail = $('[data-rail]');
  const prev = $('[data-prev]');
  const next = $('[data-next]');
  const railBar = $('[data-rail-progress]');
  const stepSize = () => rail.querySelector('.t-card').getBoundingClientRect().width + (parseFloat(getComputedStyle(rail).columnGap) || 20);
  prev.addEventListener('click', () => rail.scrollBy({ left: -stepSize(), behavior }));
  next.addEventListener('click', () => rail.scrollBy({ left: stepSize(), behavior }));
  const updateRail = () => {
    const max = rail.scrollWidth - rail.clientWidth;
    prev.disabled = rail.scrollLeft <= 4;
    next.disabled = rail.scrollLeft >= max - 4;
    railBar.style.transform = `scaleX(${Math.min(1, (rail.scrollLeft + rail.clientWidth) / rail.scrollWidth)})`;
  };
  rail.addEventListener('scroll', () => requestAnimationFrame(updateRail), { passive: true });
  addEventListener('resize', updateRail);
  updateRail();

  /* 4) 우림 타이머: 남은 시간은 실제 시각으로 계산 (탭을 옮겨도 정확) */
  const timer = $('[data-timer]');
  const ring = $('[data-ring]');
  const timeEl = $('[data-timer-time]');
  const stateEl = $('[data-timer-state]');
  const toggleBtn = $('[data-timer-toggle]');
  const announce = $('[data-timer-announce]');
  const CIRC = 2 * Math.PI * 90;
  ring.style.strokeDasharray = String(CIRC);
  let total = 120;
  let left = 120;
  let running = false;
  let endAt = 0;
  let raf = 0;
  let teaName = '첫물 녹차';
  const clock = s => { const t = Math.ceil(s); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
  const human = s => (s >= 60 ? `${Math.floor(s / 60)}분${s % 60 ? ` ${s % 60}초` : ''}` : `${s}초`);
  const draw = () => {
    timeEl.textContent = clock(left);
    ring.style.strokeDashoffset = String(CIRC * (left / total)); // 우러날수록 금빛 고리가 차오름
  };
  const setState = (cls, btn, state) => {
    timer.classList.remove('is-running', 'is-done', 'is-paused');
    if (cls) timer.classList.add(cls);
    toggleBtn.textContent = btn;
    stateEl.textContent = state;
  };
  const finish = () => {
    running = false;
    left = 0;
    draw();
    setState('is-done', '한 번 더 우리기', '다 우러났어요. 찻잎을 건져 주세요');
    announce.textContent = `${josa(teaName, '이', '가')} 다 우러났습니다. 찻잎을 건져 주세요.`;
  };
  const tick = () => {
    left = Math.max(0, (endAt - performance.now()) / 1000);
    draw();
    if (left === 0) { finish(); return; }
    raf = requestAnimationFrame(tick);
  };
  const start = () => {
    if (left <= 0) left = total;
    endAt = performance.now() + left * 1000;
    running = true;
    setState('is-running', '잠시 멈춤', '우러나는 중…');
    announce.textContent = `${teaName}, ${human(Math.ceil(left))} 우리기를 시작합니다.`;
    raf = requestAnimationFrame(tick);
  };
  const pause = () => {
    running = false;
    cancelAnimationFrame(raf);
    setState('is-paused', '이어서 우리기', '잠시 멈췄어요');
  };
  const reset = () => {
    cancelAnimationFrame(raf);
    running = false;
    left = total;
    draw();
    setState('', '우리기 시작', '준비되면 시작하세요');
  };
  toggleBtn.addEventListener('click', () => (running ? pause() : start()));
  $('[data-timer-reset]').addEventListener('click', reset);
  $$('input[name="tea"]').forEach(radio => radio.addEventListener('change', () => {
    total = Number(radio.dataset.time);
    teaName = radio.nextElementSibling.textContent;
    $('[data-spec-temp]').textContent = `${radio.dataset.temp}°C`;
    $('[data-spec-time]').textContent = radio.value === 'matcha' ? '격불 30초' : human(total);
    $('[data-spec-amount]').textContent = radio.dataset.amount;
    reset();
  }));
  draw();

  /* 5) 장바구니: 네이티브 <dialog>로 포커스 가두기·Esc 닫기 */
  const dialog = $('#cart');
  const list = $('[data-cart-list]');
  const empty = $('[data-cart-empty]');
  const ship = $('[data-ship]');
  const checkout = $('[data-checkout]');
  const FREE = 50000;
  const cart = new Map();
  let opener = null;
  const render = () => {
    let sum = 0;
    let count = 0;
    list.innerHTML = [...cart].map(([id, it]) => {
      sum += it.price * it.qty;
      count += it.qty;
      return `
        <li class="cart-item" data-id="${id}">
          <div><h3>${it.name}</h3><p class="unit">${fmt(it.price)}원</p></div>
          <p class="line-total">${fmt(it.price * it.qty)}원</p>
          <div class="qty" role="group" aria-label="${it.name} 수량">
            <button type="button" class="icon-btn" data-dec aria-label="${it.name} 하나 빼기">−</button>
            <output>${it.qty}</output>
            <button type="button" class="icon-btn" data-inc aria-label="${it.name} 하나 더하기">+</button>
          </div>
          <button type="button" class="remove" data-remove>삭제</button>
        </li>`;
    }).join('');
    empty.hidden = cart.size > 0;
    list.hidden = cart.size === 0;
    $('[data-cart-total]').textContent = `${fmt(sum)}원`;
    $$('[data-cart-count]').forEach(el => { el.textContent = count; });
    checkout.disabled = cart.size === 0;
    // 목표 경사 효과: 무료 배송까지 남은 금액을 막대로 보여 줌
    const rest = FREE - sum;
    ship.classList.toggle('is-free', sum >= FREE);
    $('[data-ship-text]').textContent = sum === 0
      ? '50,000원 이상 주문하면 무료로 보내 드립니다.'
      : rest > 0 ? `${fmt(rest)}원 더 담으면 무료 배송입니다.` : '무료 배송으로 보내 드립니다.';
    $('[data-ship-bar]').style.width = `${Math.min(100, (sum / FREE) * 100)}%`;
  };
  const openCart = from => {
    opener = from || document.activeElement;
    render();
    if (!dialog.open) dialog.showModal();
  };
  dialog.addEventListener('close', () => { if (opener && opener.isConnected) opener.focus(); });
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); }); // 바깥(배경) 누르면 닫힘
  $$('[data-cart-open]').forEach(btn => btn.addEventListener('click', () => openCart(btn)));
  $('[data-cart-close]').addEventListener('click', () => dialog.close());
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (!add) return;
    const { id, name, price } = add.dataset;
    const it = cart.get(id) || { name, price: Number(price), qty: 0 };
    it.qty += 1;
    cart.set(id, it);
    openCart(add);
  });
  list.addEventListener('click', e => {
    const li = e.target.closest('.cart-item');
    if (!li) return;
    const id = li.dataset.id;
    const it = cart.get(id);
    const ctrl = e.target.closest('[data-inc]') ? 'data-inc' : e.target.closest('[data-dec]') ? 'data-dec' : null;
    if (ctrl === 'data-inc') it.qty += 1;
    else if (ctrl === 'data-dec') it.qty -= 1;
    else if (e.target.closest('[data-remove]')) it.qty = 0;
    else return;
    if (it.qty <= 0) cart.delete(id);
    render();
    // 다시 그린 뒤에도 키보드 포커스가 길을 잃지 않게
    const again = ctrl && list.querySelector(`[data-id="${id}"] [${ctrl}]`);
    (again || $('[data-cart-close]')).focus();
  });
  checkout.addEventListener('click', () => {
    checkout.textContent = '데모라서 결제는 여기까지예요';
    setTimeout(() => { checkout.textContent = '주문하기'; }, 2200);
  });
  render();

  /* 6) 다실 예약: 남은 자리만큼만 인원을 늘릴 수 있고, 버튼이 정확한 행동을 말함 */
  const form = $('[data-reserve]');
  const submit = $('[data-reserve-submit]');
  const out = $('[data-guests]');
  const minus = $('[data-minus]');
  const plus = $('[data-plus]');
  const hint = $('[data-reserve-hint]');
  let guests = 2;
  const updateReserve = () => {
    const slot = form.querySelector('input[name="slot"]:checked');
    const seats = slot ? Number(slot.dataset.seats) : 4;
    const max = Math.min(4, seats);
    guests = Math.min(Math.max(guests, 1), max);
    out.textContent = `${guests}명`;
    minus.disabled = guests <= 1;
    plus.disabled = guests >= max;
    hint.textContent = slot && seats < 4 ? `${slot.value}에는 ${seats}자리만 남아 있습니다.` : '최대 4명까지 함께 예약할 수 있습니다.';
    submit.disabled = !slot;
    submit.textContent = slot ? `오늘 ${slot.value} · ${guests}명 예약하기` : '시간을 먼저 골라 주세요';
  };
  form.addEventListener('change', updateReserve);
  minus.addEventListener('click', () => { guests -= 1; updateReserve(); });
  plus.addEventListener('click', () => { guests += 1; updateReserve(); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const slot = form.querySelector('input[name="slot"]:checked');
    if (!slot) return;
    $('[data-reserve-msg]').textContent = `예약되었습니다. 오늘 ${slot.value}, ${guests}명. 다실 문 앞에서 성함을 말씀해 주세요.`;
  });
  updateReserve();

  /* 7) 스크롤 등장 */
  const items = $$('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-in'));
  } else {
    items.forEach(el => {
      const group = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
      el.style.transitionDelay = `${group.indexOf(el) * 110}ms`;
    });
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    items.forEach(el => io.observe(el));
  }
})();
