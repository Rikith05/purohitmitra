// ============================================================================
// PurohitMitra — Dual-Banner Offers Carousel (Home & Public Home Page)
// ============================================================================
(function () {
  const OFFERS = [
    {
      tag: 'FESTIVE SEASON SPECIAL',
      title: 'Up to 20% OFF',
      sub: 'On all Homam, Navagraha & Griha Pravesh Pujas',
      code: 'FESTIVE20',
      strip: '🪔 Verified Vedic Purohits · Authentic Samagri Included',
      bg: 'linear-gradient(135deg, #7a1631 0%, #c2410c 55%, #ea580c 100%)',
      accent: '#fde68a',
      emoji: '🔥',
      href: 'pujas.html?cat=homa'
    },
    {
      tag: 'LIVE NOW · LIMITED PERIOD',
      title: 'Flat ₹500 OFF',
      sub: 'Instant discount on Griha Pravesh & Vastu Shanti bookings',
      code: 'GRHP500',
      strip: '🏦 UPI · HDFC · ICICI · SBI Cards — 10% Instant Cashback*',
      bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)',
      accent: '#86efac',
      emoji: '🏡',
      href: 'book-puja.html?puja=Griha%20Pravesh%20Puja'
    },
    {
      tag: 'WELCOME DEVOTEE OFFER',
      title: 'FREE Samagri Kit',
      sub: 'Worth ₹799 complimentary on Satyanarayana & Ganesh Pujas',
      code: 'SAMAGRI0',
      strip: '✨ 100% Pure Cow Ghee, Kalash, Mango Leaves & Puja Essentials',
      bg: 'linear-gradient(135deg, #064e3b 0%, #047857 55%, #10b981 100%)',
      accent: '#fef08a',
      emoji: '🪔',
      href: 'pujas.html?cat=vrata'
    },
    {
      tag: 'AUSPICIOUS MUHURTHAM',
      title: 'Flat 15% OFF',
      sub: 'Book Vivaha, Namakarana & Family Samskara Ceremonies',
      code: 'SAMSKARA15',
      strip: '📜 Complete Vedic Vidhi · Multi-Language Acharya Support',
      bg: 'linear-gradient(135deg, #7c2d12 0%, #b45309 55%, #f59e0b 100%)',
      accent: '#fff7ed',
      emoji: '💍',
      href: 'pujas.html?cat=samskara'
    },
    {
      tag: 'SHRAVANA & SHIVA SPECIAL',
      title: '25% OFF Rudrabhishek',
      sub: 'Sacred Ekadash Rudrabhishek at Home or Temple',
      code: 'SHIVA25',
      strip: '🔱 Rudraksha Prasadam + Bilva Patra Kit Included',
      bg: 'linear-gradient(135deg, #3b0764 0%, #6b21a8 55%, #9333ea 100%)',
      accent: '#fde68a',
      emoji: '🕉️',
      href: 'puja-details.html?puja=Rudrabhishek%20Puja'
    },
    {
      tag: 'BANK & WALLET PARTNER',
      title: '10% Instant Discount',
      sub: 'Extra savings on UPI, RuPay & Credit Card EMI bookings',
      code: 'PMUPI10',
      strip: '💳 ICICI Bank · IndusInd · HDFC · PhonePe · GPay Instant Off*',
      bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)',
      accent: '#38bdf8',
      emoji: '💳',
      href: 'offers.html'
    }
  ];

  function injectStyles() {
    if (document.getElementById('pmOffersCarouselCSS')) return;
    const st = document.createElement('style');
    st.id = 'pmOffersCarouselCSS';
    st.textContent = `
      .pm-oc-section { position: relative; margin: 18px 0 24px; }
      .pm-oc-head {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 12px;
      }
      .pm-oc-head h2 {
        margin: 0; font-family: 'Playfair Display', Georgia, serif;
        font-size: 20px; color: #1c140e;
      }
      .pm-oc-head a {
        font-size: 13px; font-weight: 600; color: #ea580c; text-decoration: none;
      }
      .pm-oc-viewport { position: relative; overflow: hidden; border-radius: 16px; }
      .pm-oc-track {
        display: flex; gap: 16px; transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .pm-oc-card {
        flex: 0 0 calc(50% - 8px); min-height: 200px; border-radius: 16px;
        padding: 20px 38px 14px 44px; color: #ffffff; position: relative; overflow: hidden;
        display: flex; flex-direction: column; justify-content: space-between;
        box-sizing: border-box; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        cursor: pointer; transition: transform 0.2s ease;
      }
      .pm-oc-card:hover { transform: translateY(-2px); }
      @media (max-width: 780px) {
        .pm-oc-card { flex: 0 0 100%; }
      }
      .pm-oc-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
      .pm-oc-tag {
        display: inline-block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em;
        padding: 4px 10px; border-radius: 999px; background: rgba(255,255,255,0.18);
        backdrop-filter: blur(4px); color: #fff; margin-bottom: 8px;
      }
      .pm-oc-title {
        font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 800;
        line-height: 1.15; margin: 0 0 6px;
      }
      .pm-oc-sub { font-size: 13px; opacity: 0.92; margin: 0 0 12px; max-width: 85%; line-height: 1.4; }
      .pm-oc-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
      .pm-oc-code {
        background: rgba(255,255,255,0.2); border: 1px dashed rgba(255,255,255,0.65);
        padding: 5px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;
        color: #fff; cursor: pointer;
      }
      .pm-oc-code:hover { background: rgba(255,255,255,0.32); }
      .pm-oc-cta {
        background: #ffffff; color: #1c140e; padding: 6px 14px; border-radius: 8px;
        font-size: 12.5px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center;
      }
      .pm-oc-emoji {
        font-size: 52px; line-height: 1; opacity: 0.9; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.25));
        user-select: none;
      }
      .pm-oc-strip {
        background: rgba(255, 255, 255, 0.95); color: #1c140e; border-radius: 8px;
        padding: 6px 12px; font-size: 11.5px; font-weight: 600;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .pm-oc-arrow {
        position: absolute; top: 50%; transform: translateY(-50%);
        width: 36px; height: 36px; border-radius: 50%; border: 1px solid #fed7aa;
        background: rgba(255,255,255,0.95); color: #1c140e; font-size: 18px; font-weight: 700;
        cursor: pointer; z-index: 5; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.14); transition: all 0.15s;
      }
      .pm-oc-arrow:hover { background: #ea580c; color: #fff; border-color: #ea580c; }
      .pm-oc-prev { left: 6px; }
      .pm-oc-next { right: 6px; }
      .pm-oc-dots {
        display: flex; justify-content: center; align-items: center; gap: 6px; margin-top: 12px;
      }
      .pm-oc-dot {
        width: 7px; height: 7px; border-radius: 999px; background: #d6d3d1;
        border: none; padding: 0; cursor: pointer; transition: all 0.25s ease;
      }
      .pm-oc-dot.active { width: 22px; background: #334155; }
    `;
    document.head.appendChild(st);
  }

  function mountCarousel() {
    const mount = document.getElementById('pmOffersCarouselMount');
    if (!mount) return;
    injectStyles();

    const inCM = window.location.pathname.includes('CustomerModule');
    const resolveHref = (h) => {
      if (h === 'offers.html') return inCM ? 'offers.html' : 'CustomerModule/offers.html';
      return h;
    };

    mount.innerHTML = `
      <section class="pm-oc-section" aria-label="Featured Offers">
        <div class="pm-oc-head">
          <h2>🎁 Festive &amp; Exclusive Offers</h2>
          <a href="${resolveHref('offers.html')}">View All Offers →</a>
        </div>
        <div class="pm-oc-viewport" id="pmOcViewport">
          <button type="button" class="pm-oc-arrow pm-oc-prev" id="pmOcPrev" aria-label="Previous offers">‹</button>
          <div class="pm-oc-track" id="pmOcTrack">
            ${OFFERS.map((o) => `
              <div class="pm-oc-card" style="background:${o.bg}" data-href="${resolveHref(o.href)}">
                <div class="pm-oc-top">
                  <div>
                    <span class="pm-oc-tag">${o.tag}</span>
                    <h3 class="pm-oc-title" style="color:${o.accent}">${o.title}</h3>
                    <p class="pm-oc-sub">${o.sub}</p>
                    <div class="pm-oc-actions">
                      <span class="pm-oc-code" data-code="${o.code}" title="Click to copy code">Code: ${o.code} 📋</span>
                      <a class="pm-oc-cta" href="${resolveHref(o.href)}">Book Now →</a>
                    </div>
                  </div>
                  <div class="pm-oc-emoji">${o.emoji}</div>
                </div>
                <div class="pm-oc-strip">${o.strip}</div>
              </div>
            `).join('')}
          </div>
          <button type="button" class="pm-oc-arrow pm-oc-next" id="pmOcNext" aria-label="Next offers">›</button>
        </div>
        <div class="pm-oc-dots" id="pmOcDots"></div>
      </section>
    `;

    const track = document.getElementById('pmOcTrack');
    const dotsWrap = document.getElementById('pmOcDots');
    const prevBtn = document.getElementById('pmOcPrev');
    const nextBtn = document.getElementById('pmOcNext');
    const viewport = document.getElementById('pmOcViewport');

    let index = 0;
    let timer = null;

    const perView = () => (window.innerWidth <= 780 ? 1 : 2);
    const maxIndex = () => Math.max(0, OFFERS.length - perView());

    function renderDots() {
      const totalStops = maxIndex() + 1;
      dotsWrap.innerHTML = Array.from({ length: totalStops }, (_, i) =>
        `<button type="button" class="pm-oc-dot ${i === index ? 'active' : ''}" data-i="${i}" aria-label="Slide ${i + 1}"></button>`
      ).join('');
      dotsWrap.querySelectorAll('.pm-oc-dot').forEach(btn => {
        btn.addEventListener('click', () => {
          index = parseInt(btn.dataset.i, 10);
          update();
        });
      });
    }

    function update() {
      const m = maxIndex();
      if (index > m) index = 0;
      if (index < 0) index = m;
      const card = track.querySelector('.pm-oc-card');
      const gap = 16;
      const step = card ? (card.getBoundingClientRect().width + gap) : 0;
      track.style.transform = `translateX(-${index * step}px)`;
      dotsWrap.querySelectorAll('.pm-oc-dot').forEach((d, i) => d.classList.toggle('active', i === index));
    }

    prevBtn.addEventListener('click', () => { index = index <= 0 ? maxIndex() : index - 1; update(); });
    nextBtn.addEventListener('click', () => { index = index >= maxIndex() ? 0 : index + 1; update(); });

    // Copy promo code
    track.querySelectorAll('.pm-oc-code').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = el.dataset.code;
        if (navigator.clipboard) navigator.clipboard.writeText(code).catch(() => {});
        localStorage.setItem('pm_applied_coupon', code);
        if (typeof window.pmToast === 'function') window.pmToast(`✓ Promo code ${code} copied & ready!`);
      });
    });

    // Card click navigates unless clicking code
    track.querySelectorAll('.pm-oc-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.pm-oc-code') || e.target.closest('a')) return;
        window.location.href = card.dataset.href;
      });
    });

    const startAuto = () => {
      stopAuto();
      timer = setInterval(() => { index = index >= maxIndex() ? 0 : index + 1; update(); }, 4500);
    };
    const stopAuto = () => { if (timer) clearInterval(timer); };

    viewport.addEventListener('mouseenter', stopAuto);
    viewport.addEventListener('mouseleave', startAuto);
    window.addEventListener('resize', () => { renderDots(); update(); });

    renderDots();
    update();
    startAuto();
  }

  document.addEventListener('DOMContentLoaded', mountCarousel);
})();
