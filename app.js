/* ═══════════════════════════════════════════
   Smart Farmers And Food Ltd — app logic
   Cart → WhatsApp order. No backend needed.
   ═══════════════════════════════════════════ */
(function () {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NGN = n => '₦' + Math.round(n).toLocaleString('en-NG');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  const live = () => PRODUCTS.filter(p => !p.hidden);

  const KEY  = { cart:'sf_cart_v1', me:'sf_me_v1', last:'sf_last_v1' };
  const load = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  let cart   = load(KEY.cart, []);
  let filter = 'All';
  let query  = '';

  /* ── WhatsApp helper ───────────────────── */
  const waLink = txt => `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(txt)}`;
  function openWA(txt) { window.open(waLink(txt), '_blank', 'noopener'); }

  /* ── toast ─────────────────────────────── */
  let tT;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(tT); tT = setTimeout(() => t.classList.remove('show'), 2200);
  }

  /* ═══ RENDER: products ═══ */
  function unitOf(p, i) { return p.units[Math.min(i || 0, p.units.length - 1)]; }

  function cardHTML(p) {
    const u = p.units[0];
    const tags = (p.tags || []).map((t, i) =>
      `<span class="tag${i ? ' alt' : ''}">${esc(t)}</span>`).join('');
    const opts = p.units.map((x, i) =>
      `<option value="${i}">${esc(x.label)}</option>`).join('');
    return `
    <article class="card pcard" data-id="${p.id}">
      <div class="pc-media">
        <img src="${p.img}" alt="${esc(p.name)}" width="380" height="380" loading="lazy" decoding="async">
        <div class="pc-tags">${tags}</div>
        ${p.stock === false ? '<div class="pc-out">Out of stock</div>' : ''}
      </div>
      <div class="pc-body">
        <p class="pc-cat">${esc(p.category)}</p>
        <h3 class="pc-name">${esc(p.name)}</h3>
        <p class="pc-blurb">${esc(p.blurb || '')}</p>
        ${p.units.length > 1
          ? `<select class="pc-sel" aria-label="Choose size for ${esc(p.name)}">${opts}</select>`
          : ''}
        <div class="pc-foot">
          <div class="pc-price" data-price>${NGN(u.price)}<small data-unit>${esc(u.label)}</small></div>
          <button class="pc-add" aria-label="Add ${esc(p.name)} to basket" ${p.stock === false ? 'disabled' : ''}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </div>
    </article>`;
  }

  function renderGrid() {
    const list = live().filter(p => {
      const okCat = filter === 'All' || p.category === filter;
      const q = query.trim().toLowerCase();
      const okQ = !q || (p.name + ' ' + p.category + ' ' + (p.blurb || '')).toLowerCase().includes(q);
      return okCat && okQ;
    });
    $('#grid').innerHTML = list.map(cardHTML).join('');
    $('#empty').hidden = list.length > 0;
  }

  function renderChips() {
    const cats = ['All', ...new Set(live().map(p => p.category))];
    $('#chips').innerHTML = cats.map(c =>
      `<button class="chip" role="tab" aria-selected="${c === filter}" data-cat="${esc(c)}">${esc(c)}</button>`
    ).join('');
  }

  /* ═══ RENDER: plans / reviews / faq / footer ═══ */
  function renderPlans() {
    if (typeof PLANS === 'undefined' || !PLANS.length) { $('#plans').remove(); return; }
    $('#plansGrid').innerHTML = PLANS.map(pl => `
      <div class="plan${pl.popular ? ' pop' : ''}">
        ${pl.popular ? '<span class="plan-flag">Most popular</span>' : ''}
        <h3>${esc(pl.name)}</h3>
        <p class="plan-note">${esc(pl.note || '')}</p>
        <p class="plan-price">${pl.price ? NGN(pl.price) : 'Custom'}<span> / ${esc(pl.per)}</span></p>
        <ul>${pl.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
        <button class="btn btn-primary btn-block" data-plan="${esc(pl.name)}">
          ${pl.price ? 'Start this plan' : 'Request a quote'}
        </button>
      </div>`).join('');
  }

  function renderReviews() {
    $('#reviewsGrid').innerHTML = REVIEWS.map(r => `
      <figure class="rev">
        <div class="stars" aria-label="${r.stars} out of 5">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
        <blockquote><p>“${esc(r.text)}”</p></blockquote>
        <figcaption class="rev-who">
          <span class="av">${esc(r.name.trim()[0])}</span>
          <span><b>${esc(r.name)}</b><small>${esc(r.area)}</small></span>
        </figcaption>
      </figure>`).join('');
  }

  function renderFaq() {
    $('#faqList').innerHTML = FAQS.map(f => `
      <details class="qa"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('');
    $('#ldFaq').textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: FAQS.map(f => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    });
  }

  function renderProductSchema() {
    $('#ldProducts').textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'ItemList',
      itemListElement: live().map((p, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: {
          '@type': 'Product', name: p.name, description: p.blurb,
          image: location.origin + '/' + p.img, category: p.category,
          brand: { '@type': 'Brand', name: SHOP.shortName },
          offers: {
            '@type': 'AggregateOffer', priceCurrency: 'NGN',
            lowPrice: Math.min(...p.units.map(u => u.price)),
            highPrice: Math.max(...p.units.map(u => u.price)),
            offerCount: p.units.length,
            availability: p.stock === false
              ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock'
          }
        }
      }))
    });
  }

  function renderFooter() {
    $('#yr').textContent = new Date().getFullYear();

    $('#ftCats').innerHTML = [...new Set(live().map(p => p.category))]
      .map(c => `<li><a href="#shop" data-cat-link="${esc(c)}">${esc(c)}</a></li>`).join('');

    const I = {
      tel:  'M4 4h5l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v5a16 16 0 0 1-16-16z',
      mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
      clock:'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
      pin:  'M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12zM12 12.5a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z'
    };
    const ic = k => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${I[k]}"/></svg>`;
    const rows = [
      ['tel',   `<a href="tel:${SHOP.phone}">${ic('tel')}${esc(SHOP.phone)}</a>`],
      ['mail',  `<a href="mailto:${SHOP.email}">${ic('mail')}${esc(SHOP.email)}</a>`],
      ['clock', `<span>${ic('clock')}${esc(SHOP.hours)}</span>`],
      ['pin',   `<span>${ic('pin')}${esc(SHOP.city)}, Nigeria</span>`]
    ];
    $('#ftContact').innerHTML = rows.map(([, h]) => `<li>${h}</li>`).join('');
    $('#contactRows').innerHTML = rows.map(([, h]) => h).join('');

    const socs = [];
    if (SHOP.whatsapp) socs.push(['WhatsApp', waLink('Hello Smart Farmers!'), 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z']);
    if (SHOP.instagram) socs.push(['Instagram', 'https://instagram.com/' + SHOP.instagram, 'M4 4h16v16H4zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z']);
    if (SHOP.facebook)  socs.push(['Facebook', 'https://facebook.com/' + SHOP.facebook, 'M14 8h3V5h-3a4 4 0 0 0-4 4v2H8v3h2v6h3v-6h3l1-3h-4V9a1 1 0 0 1 1-1z']);
    if (SHOP.twitter)   socs.push(['X', 'https://x.com/' + SHOP.twitter, 'M4 4l16 16M20 4L4 20']);
    $('#socials').innerHTML = socs.map(([n, u, d]) =>
      `<a href="${u}" target="_blank" rel="noopener" aria-label="${n}"><svg viewBox="0 0 24 24"><path d="${d}"/></svg></a>`
    ).join('');
  }

  /* ═══ CART ═══ */
  function findProd(id) { return PRODUCTS.find(p => p.id === id); }

  function addToCart(id, unitIdx, qty = 1) {
    const p = findProd(id); if (!p || p.stock === false) return;
    const u = unitOf(p, unitIdx);
    const line = cart.find(c => c.id === id && c.unit === u.label);
    if (line) line.qty += qty;
    else cart.push({ id, unit: u.label, price: u.price, qty });
    persist();
    toast(`${p.name} added`);
  }

  function setQty(i, d) {
    cart[i].qty += d;
    if (cart[i].qty < 1) cart.splice(i, 1);
    persist();
  }

  function persist() { save(KEY.cart, cart); renderCart(); }

  const subTotal = () => cart.reduce((s, c) => s + c.price * c.qty, 0);
  const count    = () => cart.reduce((s, c) => s + c.qty, 0);

  function shipFee() {
    const sel = $('#areaSel');
    const a = SHOP.areas[sel && sel.value ? +sel.value : 0];
    if (!a) return 0;
    if (SHOP.freeDeliveryFrom && subTotal() >= SHOP.freeDeliveryFrom) return 0;
    return a.fee || 0;
  }

  function renderCart() {
    const n = count(), sub = subTotal();

    // header + mobile bar
    const cc = $('#cartCount');
    cc.textContent = n; cc.hidden = n === 0;
    $('#drCount').textContent = n;
    const mb = $('#mobar');
    mb.dataset.show = n > 0 ? 'true' : 'false';
    mb.hidden = n === 0;
    document.body.classList.toggle('has-mobar', n > 0);
    $('#mbCount').textContent = n;
    $('#mbTotal').textContent = NGN(sub);

    $('#drEmpty').hidden = n > 0;
    $('#drDeliv').hidden = n === 0;
    $('#drFt').hidden    = n === 0;

    $('#drItems').innerHTML = cart.map((c, i) => {
      const p = findProd(c.id) || {};
      return `
      <li class="ci">
        <img src="${p.img || ''}" alt="" width="66" height="66" loading="lazy">
        <div>
          <p class="ci-n">${esc(p.name || c.id)}</p>
          <p class="ci-u">${esc(c.unit)}</p>
          <p class="ci-p">${NGN(c.price * c.qty)}</p>
        </div>
        <div class="ci-r">
          <span class="qty">
            <button data-q="-1" data-i="${i}" aria-label="Reduce quantity">−</button>
            <b>${c.qty}</b>
            <button data-q="1" data-i="${i}" aria-label="Increase quantity">+</button>
          </span>
          <button class="ci-x" data-rm="${i}">Remove</button>
        </div>
      </li>`;
    }).join('');

    const ship = shipFee();
    $('#tSub').textContent   = NGN(sub);
    $('#tShip').textContent  = ship === 0 ? (sub >= SHOP.freeDeliveryFrom ? 'Free' : 'We confirm') : NGN(ship);
    $('#tTotal').textContent = NGN(sub + ship);

    const fl = $('#freeLine');
    const gap = SHOP.freeDeliveryFrom - sub;
    if (SHOP.freeDeliveryFrom && gap > 0 && n > 0) {
      fl.hidden = false;
      fl.textContent = `Add ${NGN(gap)} more for free delivery`;
    } else if (SHOP.freeDeliveryFrom && n > 0) {
      fl.hidden = false; fl.textContent = '✓ You have free delivery';
    } else fl.hidden = true;
  }

  /* ═══ CHECKOUT → WhatsApp ═══ */
  function checkout() {
    if (!cart.length) return;
    const sub = subTotal();
    if (SHOP.minOrder && sub < SHOP.minOrder) {
      toast(`Minimum order is ${NGN(SHOP.minOrder)}`); return;
    }
    const name = $('#custName').value.trim();
    const phone = $('#custPhone').value.trim();
    const addr = $('#custAddr').value.trim();
    if (!name || !phone || !addr) {
      toast('Please add your name, phone and address');
      (!name ? $('#custName') : !phone ? $('#custPhone') : $('#custAddr')).focus();
      return;
    }
    const area = SHOP.areas[+$('#areaSel').value] || SHOP.areas[0];
    const ship = shipFee();
    const note = $('#custNote').value.trim();

    save(KEY.me, { name, phone, addr, area: $('#areaSel').value });
    save(KEY.last, JSON.parse(JSON.stringify(cart)));

    const L = [];
    L.push('*NEW ORDER — Smart Farmers*', '');
    cart.forEach((c, i) => {
      const p = findProd(c.id) || {};
      L.push(`${i + 1}. *${p.name || c.id}*`);
      L.push(`    ${c.unit}  ×${c.qty}  =  ${NGN(c.price * c.qty)}`);
    });
    L.push('', '——————————————');
    L.push(`Items:  ${NGN(sub)}`);
    L.push(`Delivery (${area.name}):  ${ship === 0 ? (sub >= SHOP.freeDeliveryFrom ? 'Free' : 'to confirm') : NGN(ship)}`);
    L.push(`*TOTAL:  ${NGN(sub + ship)}*`);
    L.push('——————————————', '');
    L.push(`*Name:* ${name}`);
    L.push(`*Phone:* ${phone}`);
    L.push(`*Area:* ${area.name}`);
    L.push(`*Address:* ${addr}`);
    if (note) L.push(`*Note:* ${note}`);
    L.push('', 'Sent from smartfarmers.vercel.app');

    openWA(L.join('\n'));
    toast('Opening WhatsApp…');
  }

  /* ═══ REORDER ═══ */
  function initReorder() {
    const last = load(KEY.last, null);
    const btn = $('#reorderBtn');
    if (last && last.length) {
      btn.hidden = false;
      btn.addEventListener('click', () => {
        const snap = load(KEY.last, []);
        if (!snap.length) { toast('No previous order yet'); return; }
        cart = JSON.parse(JSON.stringify(snap));
        persist();
        openDrawer();
        toast('Your last order is back in the basket');
      });
    }
  }

  function prefillMe() {
    const me = load(KEY.me, null); if (!me) return;
    $('#custName').value = me.name || '';
    $('#custPhone').value = me.phone || '';
    $('#custAddr').value = me.addr || '';
    if (me.area != null) $('#areaSel').value = me.area;
  }

  /* ═══ DRAWER / SEARCH ═══ */
  function openDrawer() {
    $('#drawer').classList.add('open');
    $('#drawer').setAttribute('aria-hidden', 'false');
    $('#scrim').hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    $('#drawer').classList.remove('open');
    $('#drawer').setAttribute('aria-hidden', 'true');
    $('#scrim').hidden = true;
    document.body.style.overflow = '';
  }
  function openSearch() {
    $('#searchlay').hidden = false;
    $('#slInput').value = ''; slRender('');
    setTimeout(() => $('#slInput').focus(), 40);
    document.body.style.overflow = 'hidden';
  }
  function closeSearch() {
    $('#searchlay').hidden = true;
    document.body.style.overflow = '';
  }
  function slRender(q) {
    q = q.trim().toLowerCase();
    const list = q
      ? live().filter(p => (p.name + ' ' + p.category + ' ' + (p.blurb || '')).toLowerCase().includes(q))
      : live().slice(0, 5);
    $('#slRes').innerHTML = list.length
      ? list.map(p => `
        <button class="sr" data-goto="${p.id}">
          <img src="${p.img}" alt="" width="48" height="48" loading="lazy">
          <span><span class="sr-n">${esc(p.name)}</span><br><span class="sr-c">${esc(p.category)}</span></span>
          <span class="sr-p">from ${NGN(Math.min(...p.units.map(u => u.price)))}</span>
        </button>`).join('')
      : `<p class="sl-none">No match for “${esc(q)}”. Try “garri”, “beans” or “oil”.</p>`;
  }

  /* ═══ EVENTS ═══ */
  function wire() {
    // generic WhatsApp links
    document.addEventListener('click', e => {
      const w = e.target.closest('[data-wa]');
      if (w) { e.preventDefault(); openWA(w.dataset.wa); }
    });

    // product grid: size change + add
    $('#grid').addEventListener('change', e => {
      const sel = e.target.closest('.pc-sel'); if (!sel) return;
      const card = sel.closest('.pcard');
      const p = findProd(card.dataset.id);
      const u = unitOf(p, +sel.value);
      card.querySelector('[data-price]').firstChild.textContent = NGN(u.price);
      card.querySelector('[data-unit]').textContent = u.label;
    });
    $('#grid').addEventListener('click', e => {
      const b = e.target.closest('.pc-add'); if (!b || b.disabled) return;
      const card = b.closest('.pcard');
      const sel = card.querySelector('.pc-sel');
      addToCart(card.dataset.id, sel ? +sel.value : 0);
      b.classList.add('done');
      b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>';
      setTimeout(() => {
        b.classList.remove('done');
        b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
      }, 1100);
    });

    // category chips
    $('#chips').addEventListener('click', e => {
      const c = e.target.closest('.chip'); if (!c) return;
      filter = c.dataset.cat; renderChips(); renderGrid();
    });
    $('#searchInput').addEventListener('input', e => { query = e.target.value; renderGrid(); });
    $('#clearFilters').addEventListener('click', () => {
      filter = 'All'; query = ''; $('#searchInput').value = '';
      renderChips(); renderGrid();
    });
    document.addEventListener('click', e => {
      const l = e.target.closest('[data-cat-link]'); if (!l) return;
      filter = l.dataset.catLink; query = ''; $('#searchInput').value = '';
      renderChips(); renderGrid();
    });

    // cart drawer
    $('#cartOpen').addEventListener('click', openDrawer);
    $('#mobar').addEventListener('click', openDrawer);
    $('#cartClose').addEventListener('click', closeDrawer);
    $('#scrim').addEventListener('click', closeDrawer);
    $('#drShop').addEventListener('click', () => {
      closeDrawer(); $('#shop').scrollIntoView({ behavior: 'smooth' });
    });
    $('#drItems').addEventListener('click', e => {
      const q = e.target.closest('[data-q]');
      if (q) return setQty(+q.dataset.i, +q.dataset.q);
      const r = e.target.closest('[data-rm]');
      if (r) { cart.splice(+r.dataset.rm, 1); persist(); }
    });
    $('#checkout').addEventListener('click', checkout);

    // search overlay
    $('#searchOpen').addEventListener('click', openSearch);
    $('#slClose').addEventListener('click', closeSearch);
    $('#slInput').addEventListener('input', e => slRender(e.target.value));
    $('#searchlay').addEventListener('click', e => { if (e.target.id === 'searchlay') closeSearch(); });
    $('#slRes').addEventListener('click', e => {
      const b = e.target.closest('[data-goto]'); if (!b) return;
      closeSearch();
      filter = 'All'; query = ''; $('#searchInput').value = '';
      renderChips(); renderGrid();
      const card = $(`.pcard[data-id="${b.dataset.goto}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.transition = 'box-shadow .4s';
        card.style.boxShadow = '0 0 0 3px var(--grn)';
        setTimeout(() => card.style.boxShadow = '', 1600);
      }
    });

    // keyboard
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeDrawer(); closeSearch(); }
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openSearch(); }
    });

    // burger
    $('#burger').addEventListener('click', () => {
      const b = $('#burger'), open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!open));
      $('#nav').classList.toggle('open', !open);
    });
    $$('#nav a').forEach(a => a.addEventListener('click', () => {
      $('#nav').classList.remove('open');
      $('#burger').setAttribute('aria-expanded', 'false');
    }));

    // header shadow
    const onScroll = () => $('#hdr').classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    // plans → WhatsApp
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-plan]'); if (!b) return;
      const pl = PLANS.find(p => p.name === b.dataset.plan);
      const L = [`*Monthly food plan — ${pl.name}*`, ''];
      if (pl.price) L.push(`Price: ${NGN(pl.price)} / ${pl.per}`, '');
      L.push('Includes:', ...pl.items.map(i => `• ${i}`), '');
      L.push('Hello Smart Farmers, I would like to start this plan. Please tell me the next step.');
      openWA(L.join('\n'));
    });

    // bulk form → WhatsApp
    $('#bulkForm').addEventListener('submit', e => {
      e.preventDefault();
      const f = new FormData(e.target);
      openWA([
        '*BULK / WHOLESALE ENQUIRY*', '',
        `*Business:* ${f.get('biz')}`,
        `*Contact:* ${f.get('who')}`,
        `*Area:* ${f.get('area')}`,
        `*Needs:* ${f.get('need')}`, '',
        'Please send me a wholesale quote.'
      ].join('\n'));
      toast('Opening WhatsApp…');
      e.target.reset();
    });

    // delivery area recalculates total
    $('#areaSel').addEventListener('change', renderCart);
    ['#custName', '#custPhone', '#custAddr'].forEach(s =>
      $(s).addEventListener('input', () => $(s).style.borderColor = ''));
  }

  /* ═══ PWA ═══ */
  function pwa() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () =>
        navigator.serviceWorker.register('sw.js').catch(() => {}));
    }
    let prompt = null;
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault(); prompt = e; $('#installBtn').hidden = false;
    });
    $('#installBtn').addEventListener('click', async () => {
      if (!prompt) return;
      prompt.prompt(); await prompt.userChoice;
      prompt = null; $('#installBtn').hidden = true;
    });
  }

  /* ═══ BOOT ═══ */
  function init() {
    // delivery areas
    $('#areaSel').innerHTML = SHOP.areas.map((a, i) =>
      `<option value="${i}">${esc(a.name)}${a.fee ? ' — ' + NGN(a.fee) : ''}</option>`).join('');

    renderChips(); renderGrid(); renderPlans(); renderReviews();
    renderFaq(); renderProductSchema(); renderFooter();
    prefillMe(); initReorder(); wire(); renderCart(); pwa();

    // reveal on scroll
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.style.opacity = 1; en.target.style.transform = 'none'; io.unobserve(en.target); }
    }), { threshold: .08, rootMargin: '0px 0px -40px' });
    // Never animate the shop list or its controls — people are trying to tap those.
    const SKIP = '#grid, .shop-bar, #empty, .note';
    $$('.sec > .wrap > *, .strip-i').forEach((el, i) => {
      if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
      if (el.matches(SKIP)) return;
      el.style.cssText += 'opacity:0;transform:translateY(12px);transition:opacity .45s ease,transform .45s ease;transition-delay:' + (i % 4) * 50 + 'ms';
      io.observe(el);
    });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
