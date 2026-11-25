// ============================================================================
// PurohitMitra — Global Dynamic Favorites Engine (Synced with localStorage)
// ============================================================================
(function () {
  const DEFAULT_PUROHITS = [
    { n: 'Pandit Narayan Shastri', r: 4.9, rv: 128, exp: 15, lang: 'Telugu, Sanskrit, Hindi', km: 2.5, img: 'images/purohit_narayan.jpg' },
    { n: 'Sri Venkatesh Dikshith', r: 4.9, rv: 142, exp: 20, lang: 'Telugu, Tamil, Sanskrit, Hindi', km: 3.1, img: 'images/purohit_venkatesh.jpg' },
    { n: 'Pandit Raghav Sharma', r: 4.8, rv: 95, exp: 12, lang: 'Hindi, Sanskrit, Kannada', km: 4.2, img: 'images/purohit_raghav.jpg' }
  ];
  const DEFAULT_PUJAS = [
    { n: 'Griha Pravesh Puja', r: 4.8, bk: 192, p: 3500, d: 'Bring positivity and prosperity into your new home.', img: 'images/puja_griha_pravesh.jpg' },
    { n: 'Satyanarayana Puja', r: 4.9, bk: 236, p: 2100, d: 'For prosperity, happiness and family well-being.', img: 'images/puja_satyanarayana.jpg' },
    { n: 'Ganesh Puja', r: 4.8, bk: 174, p: 1500, d: 'Remove obstacles and invoke blessings of Lord Ganesha.', img: 'images/puja_ganesh.jpg' },
    { n: 'Navagraha Shanti Puja', r: 4.8, bk: 118, p: 3500, d: 'Balance planetary energies and bring harmony.', img: 'images/puja_navagraha.jpg' }
  ];

  function loadList(type) {
    const key = type === 'purohits' ? 'pm_fav_purohits' : 'pm_fav_pujas';
    const raw = localStorage.getItem(key);
    if (raw === null) {
      const def = type === 'purohits' ? DEFAULT_PUROHITS : DEFAULT_PUJAS;
      localStorage.setItem(key, JSON.stringify(def));
      return def.slice();
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveList(type, list) {
    const key = type === 'purohits' ? 'pm_fav_purohits' : 'pm_fav_pujas';
    localStorage.setItem(key, JSON.stringify(list));
  }

  window.pmGetFavorites = function (type) {
    return loadList(type);
  };

  window.pmIsFavorite = function (type, name) {
    const list = loadList(type);
    const target = (name || '').trim().toLowerCase();
    return list.some(x => (x.name || x.n || '').trim().toLowerCase() === target);
  };

  window.pmToggleFavorite = function (type, item) {
    const list = loadList(type);
    const target = (item.name || item.n || '').trim().toLowerCase();
    const idx = list.findIndex(x => (x.name || x.n || '').trim().toLowerCase() === target);
    let added = false;
    if (idx !== -1) {
      list.splice(idx, 1);
      added = false;
    } else {
      list.unshift({
        n: item.n || item.name,
        r: item.r || 4.8,
        rv: item.rv || 110,
        bk: item.bk || 120,
        exp: item.exp || 12,
        lang: item.lang || 'Telugu, Sanskrit, Hindi',
        km: item.km || 2.5,
        p: item.p || 2500,
        d: item.d || '',
        img: item.img || ''
      });
      added = true;
    }
    saveList(type, list);
    if (typeof window.pmToast === 'function') {
      window.pmToast(added ? `♥ Added "${item.n}" to Favorites` : `Removed "${item.n}" from Favorites`);
    }
    return added;
  };

  window.pmRemoveFavorite = function (type, name) {
    const list = loadList(type);
    const target = (name || '').trim().toLowerCase();
    const next = list.filter(x => (x.name || x.n || '').trim().toLowerCase() !== target);
    saveList(type, next);
  };

  function injectFavStyles() {
    if (document.getElementById('pmFavBtnCSS')) return;
    const st = document.createElement('style');
    st.id = 'pmFavBtnCSS';
    st.textContent = `
      .pm-card-fav-btn {
        position: absolute; top: 10px; right: 10px; z-index: 15;
        width: 32px; height: 32px; border-radius: 50%;
        border: 1px solid #fed7aa; background: rgba(255, 255, 255, 0.94);
        color: #78716c; font-size: 16px; line-height: 1;
        display: inline-flex; align-items: center; justify-content: center;
        cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.15s, background 0.15s;
      }
      .pm-card-fav-btn:hover { transform: scale(1.15); border-color: #ea580c; color: #ea580c; }
      .pm-card-fav-btn.on { color: #dc2626; border-color: #fca5a5; background: #fff1f2; }
    `;
    document.head.appendChild(st);
  }

  function attachHeartsToCards() {
    injectFavStyles();
    const cards = document.querySelectorAll('.card.pc, .card.prc, .g5 .card');
    cards.forEach(card => {
      if (card.querySelector('.pm-card-fav-btn')) return;
      const h3 = card.querySelector('h3');
      if (!h3) return;
      const name = h3.textContent.trim();
      const isPurohit = card.classList.contains('prc');
      const type = isPurohit ? 'purohits' : 'pujas';

      const imgEl = card.querySelector('img');
      const rawSrc = imgEl ? imgEl.getAttribute('src') : '';
      const cleanImg = rawSrc ? rawSrc.replace(/^\.\.\//, '') : '';

      const descEl = card.querySelector('.b p:not(.pr):not(.mu)');
      const priceMatch = (card.innerText || '').match(/₹\s*([\d,]+)/);
      const priceVal = priceMatch ? parseInt(priceMatch[1].replace(/,/g, ''), 10) : 2500;

      if (getComputedStyle(card).position === 'static') {
        card.style.position = 'relative';
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pm-card-fav-btn';
      const syncBtn = () => {
        const active = window.pmIsFavorite(type, name);
        btn.classList.toggle('on', active);
        btn.innerHTML = active ? '♥' : '♡';
        btn.title = active ? 'Remove from Favorites' : 'Add to Favorites';
      };
      syncBtn();

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.pmToggleFavorite(type, {
          n: name,
          img: cleanImg,
          d: descEl ? descEl.textContent.trim() : '',
          p: priceVal,
          exp: card.dataset.exp ? parseInt(card.dataset.exp, 10) : 12,
          lang: card.dataset.lang || 'Telugu, Sanskrit, Hindi'
        });
        syncBtn();
      });

      card.appendChild(btn);
    });
  }

  document.addEventListener('DOMContentLoaded', attachHeartsToCards);
})();
