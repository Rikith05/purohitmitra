// ============================================================================
// PurohitMitra — Smart Search Engine (Fuzzy + Synonym + Live Autocomplete)
// ============================================================================
(function () {
  const SYNONYM_MAP = {
    'housewarming': ['griha', 'pravesh', 'vastu', 'new home'],
    'gruha': ['griha', 'pravesh', 'vastu'],
    'grih': ['griha', 'pravesh'],
    'vastu': ['griha', 'pravesh', 'shanti'],
    'ganpati': ['ganesh', 'ganapathi', 'vinayaka'],
    'ganapathi': ['ganesh', 'ganpati', 'vinayaka'],
    'vinayaka': ['ganesh', 'ganpati'],
    'marriage': ['vivaha', 'wedding', 'kalyanam', 'shaadi'],
    'shaadi': ['vivaha', 'wedding'],
    'kalyanam': ['vivaha', 'wedding'],
    'havan': ['homam', 'homa', 'yagna', 'agni'],
    'yagna': ['homam', 'homa', 'havan'],
    'planets': ['navagraha', 'shanti', 'dosha', 'shani'],
    'dosha': ['navagraha', 'shanti'],
    'shani': ['navagraha', 'shanti'],
    'health': ['mahamrityunjaya', 'rudra', 'shiva'],
    'shiva': ['rudrabhishek', 'mahamrityunjaya', 'rudra'],
    'abhishekam': ['rudrabhishek', 'shiva'],
    'naming': ['namakarana', 'baby', 'cradle'],
    'baby': ['namakarana', 'naming'],
    'ancestors': ['pitru', 'shraddha', 'tarpanam'],
    'shraddha': ['pitru', 'tarpanam'],
    'mata': ['devi', 'durga', 'lakshmi', 'navratri'],
    'lakshmi': ['devi', 'satyanarayana'],
    'durga': ['devi', 'navratri'],
    'vrata': ['satyanarayana', 'pooja'],
    'pandit': ['purohit', 'acharya', 'shastri', 'dikshith'],
    'priest': ['purohit', 'acharya', 'shastri']
  };

  const PUJA_INDEX = [
    { type: 'puja', title: 'Griha Pravesh Puja', cat: 'griha', price: '₹2,500', duration: '2 - 3 Hours', img: 'images/puja_griha_pravesh.jpg', url: 'puja-details.html?puja=Griha%20Pravesh%20Puja', tags: 'housewarming new home vastu gruha pravesham' },
    { type: 'puja', title: 'Satyanarayana Puja', cat: 'vrata', price: '₹2,100', duration: '2 Hours', img: 'images/puja_satyanarayana.jpg', url: 'puja-details.html?puja=Satyanarayana%20Puja', tags: 'vrata purnima prosperity family lakshmi narayana' },
    { type: 'puja', title: 'Ganesh Puja', cat: 'ganesh', price: '₹1,500', duration: '1 - 1.5 Hours', img: 'images/puja_ganesh.jpg', url: 'puja-details.html?puja=Ganesh%20Puja', tags: 'ganpati vinayaka chaturthi new beginning office' },
    { type: 'puja', title: 'Homam / Havan', cat: 'homa', price: '₹3,500', duration: '2 - 3 Hours', img: 'images/puja_homam.jpg', url: 'puja-details.html?puja=Homam%20%2F%20Havan', tags: 'agni fire ritual yagna sudarshana chandi' },
    { type: 'puja', title: 'Mahamrityunjaya Puja', cat: 'shanti', price: '₹5,100', duration: '3 - 4 Hours', img: 'images/puja_mahamrityunjaya.jpg', url: 'puja-details.html?puja=Mahamrityunjaya%20Puja', tags: 'health longevity shiva healing recovery' },
    { type: 'puja', title: 'Vivaha (Wedding) Puja', cat: 'samskara', price: '₹11,000', duration: '4+ Hours', img: 'images/puja_wedding.jpg', url: 'puja-details.html?puja=Vivaha%20(Wedding)%20Puja', tags: 'marriage kalyanam shaadi lagnam samskara' },
    { type: 'puja', title: 'Navagraha Shanti Puja', cat: 'shanti', price: '₹3,500', duration: '2 - 3 Hours', img: 'images/puja_navagraha.jpg', url: 'puja-details.html?puja=Navagraha%20Shanti%20Puja', tags: 'planets dosha shani rahu ketu astrology' },
    { type: 'puja', title: 'Namakarana Puja', cat: 'samskara', price: '₹2,100', duration: '1.5 Hours', img: 'images/puja_naming.jpg', url: 'puja-details.html?puja=Namakarana%20Puja', tags: 'baby naming ceremony cradle barasala' },
    { type: 'puja', title: 'Rudrabhishek Puja', cat: 'temple', price: '₹2,800', duration: '2 Hours', img: 'images/puja_rudrabhishek.jpg', url: 'puja-details.html?puja=Rudrabhishek%20Puja', tags: 'shiva abhishekam shravan mahashivratri' },
    { type: 'puja', title: 'Pitru Paksha Puja', cat: 'shanti', price: '₹2,500', duration: '2 Hours', img: 'images/puja_pitrupaksha.jpg', url: 'puja-details.html?puja=Pitru%20Paksha%20Puja', tags: 'ancestors shraddha tarpanam pithru' },
    { type: 'puja', title: 'Devi Puja', cat: 'temple', price: '₹2,500', duration: '2 Hours', img: 'images/puja_devi.jpg', url: 'puja-details.html?puja=Devi%20Puja', tags: 'durga lakshmi navratri mata lalitha' }
  ];

  const PUROHIT_INDEX = [
    { type: 'purohit', title: 'Sri Venkatesh Dikshith', sub: '20+ Yrs · Hyderabad · Griha & Homa', rating: '4.9', img: 'images/purohit_venkatesh.jpg', url: 'purohit-details.html?purohit=Sri%20Venkatesh%20Dikshith', tags: 'telugu tamil sanskrit hindi vedic griha satya homa' },
    { type: 'purohit', title: 'Pandit Narayan Shastri', sub: '15+ Yrs · Hyderabad · Griha & Vivaha', rating: '4.9', img: 'images/purohit_narayan.jpg', url: 'purohit-details.html?purohit=Pandit%20Narayan%20Shastri', tags: 'telugu sanskrit hindi vivaha griha wedding' },
    { type: 'purohit', title: 'Pandit Raghav Sharma', sub: '12+ Yrs · Bengaluru · Satyanarayana & Homa', rating: '4.8', img: 'images/purohit_raghav.jpg', url: 'purohit-details.html?purohit=Pandit%20Raghav%20Sharma', tags: 'hindi sanskrit kannada satya homa' },
    { type: 'purohit', title: 'Acharya Madhusudan', sub: '18+ Yrs · Hyderabad · Rudrabhishek & Homa', rating: '4.9', img: 'images/purohit_madhusudan.jpg', url: 'purohit-details.html?purohit=Acharya%20Madhusudan', tags: 'telugu hindi sanskrit rudra shiva homa' },
    { type: 'purohit', title: 'Pandit Somashekar', sub: '25+ Yrs · Bengaluru · Navagraha & Pitru', rating: '5.0', img: 'images/purohit_somashekar.jpg', url: 'purohit-details.html?purohit=Pandit%20Somashekar', tags: 'sanskrit telugu kannada hindi navagraha pitru' },
    { type: 'purohit', title: 'Pandit Gopal Krishna', sub: '8+ Yrs · Hyderabad · Griha & Satyanarayana', rating: '4.7', img: 'images/purohit_gopalkrishna.jpg', url: 'purohit-details.html?purohit=Pandit%20Gopal%20Krishna', tags: 'telugu hindi griha satya' }
  ];

  // Expand query tokens with synonyms
  function expandTokens(query) {
    const rawTokens = (query || '').toLowerCase().trim().split(/[\s,]+/).filter(Boolean);
    const expanded = [];
    rawTokens.forEach(tok => {
      const group = [tok];
      if (SYNONYM_MAP[tok]) {
        group.push(...SYNONYM_MAP[tok]);
      } else {
        Object.keys(SYNONYM_MAP).forEach(k => {
          if (k.startsWith(tok) && tok.length >= 3) {
            group.push(...SYNONYM_MAP[k]);
          }
        });
      }
      expanded.push([...new Set(group)]);
    });
    return expanded;
  }

  // Simple typo-tolerant subsequence / edit check for tokens >= 4 chars
  function fuzzyWordMatch(word, targetWord) {
    if (targetWord.includes(word)) return true;
    if (word.length < 4 || targetWord.length < 4) return false;
    if (Math.abs(word.length - targetWord.length) > 2) return false;
    let mismatches = 0;
    const minLen = Math.min(word.length, targetWord.length);
    for (let i = 0; i < minLen; i++) {
      if (word[i] !== targetWord[i]) mismatches++;
      if (mismatches > 2) return false;
    }
    return mismatches + Math.abs(word.length - targetWord.length) <= 2;
  }

  function smartMatchScore(query, searchableText, titleText) {
    if (!query || !query.trim()) return 1;
    const tokenGroups = expandTokens(query);
    if (!tokenGroups.length) return 1;

    const hay = (searchableText || '').toLowerCase();
    const title = (titleText || '').toLowerCase();
    const hayWords = hay.split(/[\s,/()-]+/).filter(Boolean);

    let totalScore = 0;
    for (const group of tokenGroups) {
      let groupMatched = false;
      let groupScore = 0;

      for (const variant of group) {
        if (title.startsWith(variant)) {
          groupMatched = true;
          groupScore = Math.max(groupScore, 10);
        } else if (title.includes(variant)) {
          groupMatched = true;
          groupScore = Math.max(groupScore, 7);
        } else if (hay.includes(variant)) {
          groupMatched = true;
          groupScore = Math.max(groupScore, 4);
        } else if (variant.length >= 4 && hayWords.some(w => fuzzyWordMatch(variant, w))) {
          groupMatched = true;
          groupScore = Math.max(groupScore, 2);
        }
      }
      if (!groupMatched) return 0;
      totalScore += groupScore;
    }
    return totalScore;
  }

  window.pmSmartMatch = function (query, searchableText, titleText) {
    return smartMatchScore(query, searchableText, titleText) > 0;
  };
  window.pmSmartScore = smartMatchScore;

  function getRecentSearches() {
    try { return JSON.parse(localStorage.getItem('pm_recent_searches') || '[]'); } catch (e) { return []; }
  }
  function saveRecentSearch(q) {
    const clean = (q || '').trim();
    if (!clean || clean.length < 2) return;
    let list = getRecentSearches().filter(x => x.toLowerCase() !== clean.toLowerCase());
    list.unshift(clean);
    localStorage.setItem('pm_recent_searches', JSON.stringify(list.slice(0, 5)));
  }
  window.pmSaveRecentSearch = saveRecentSearch;

  function injectSearchStyles() {
    if (document.getElementById('pmSearchEngineStyles')) return;
    const st = document.createElement('style');
    st.id = 'pmSearchEngineStyles';
    st.textContent = `
      .pm-search-wrap { position: relative; width: 100%; }
      .pm-search-clear {
        position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
        background: #f5efe8; border: none; border-radius: 50%; width: 20px; height: 20px;
        font-size: 11px; color: #78716c; cursor: pointer; display: none;
        align-items: center; justify-content: center; line-height: 1;
      }
      .pm-search-clear.show { display: inline-flex; }
      .pm-ac-dropdown {
        position: absolute; top: calc(100% + 6px); left: 0; right: 0; min-width: 310px;
        background: #ffffff; border: 1px solid #fed7aa; border-radius: 12px;
        box-shadow: 0 14px 36px rgba(28, 20, 14, 0.16); z-index: 99999;
        max-height: 380px; overflow-y: auto; display: none; text-align: left;
      }
      .pm-ac-dropdown.open { display: block; }
      .pm-ac-section {
        padding: 7px 14px 4px; font-size: 11px; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.05em; color: #8c827a; background: #fffaf5; border-bottom: 1px solid #fdf0e4;
      }
      .pm-ac-item {
        display: flex; align-items: center; gap: 10px; padding: 9px 14px;
        cursor: pointer; border-bottom: 1px solid #faf5f0; transition: background 0.12s;
        text-decoration: none; color: #2c1810;
      }
      .pm-ac-item:hover, .pm-ac-item.active { background: #fff3ea; }
      .pm-ac-item img {
        width: 38px; height: 38px; border-radius: 8px; object-fit: cover; flex-shrink: 0;
        border: 1px solid #efe3d6;
      }
      .pm-ac-item.purohit img { border-radius: 50%; }
      .pm-ac-meta { flex: 1; min-width: 0; }
      .pm-ac-title { font-size: 13.5px; font-weight: 600; color: #1c140e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .pm-ac-sub { font-size: 11.5px; color: #78716c; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .pm-ac-badge { font-size: 11.5px; font-weight: 700; color: #ea580c; white-space: nowrap; }
      .pm-ac-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 14px; }
      .pm-ac-chip {
        padding: 4px 10px; border-radius: 999px; background: #fff7ed; border: 1px solid #fed7aa;
        font-size: 12px; color: #9a3412; cursor: pointer; font-weight: 500;
      }
      .pm-ac-chip:hover { background: #ea580c; color: #fff; border-color: #ea580c; }
    `;
    document.head.appendChild(st);
  }

  function attachAutocomplete(inputId, mode) {
    const input = document.getElementById(inputId);
    if (!input || input.dataset.pmAcAttached) return;
    input.dataset.pmAcAttached = '1';
    injectSearchStyles();

    const wrap = document.createElement('div');
    wrap.className = 'pm-search-wrap';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'pm-search-clear';
    clearBtn.innerHTML = '✕';
    clearBtn.title = 'Clear search';
    wrap.appendChild(clearBtn);

    const drop = document.createElement('div');
    drop.className = 'pm-ac-dropdown';
    wrap.appendChild(drop);

    const inCustomerModule = window.location.pathname.includes('CustomerModule');
    const urlPrefix = inCustomerModule ? '' : '';

    let activeIdx = -1;

    function updateClearBtn() {
      clearBtn.classList.toggle('show', input.value.trim().length > 0);
    }

    function renderDropdown() {
      const q = input.value.trim();
      updateClearBtn();
      activeIdx = -1;

      if (!q) {
        const recent = getRecentSearches();
        const trending = ['Griha Pravesh', 'Satyanarayana', 'Ganesh Puja', 'Navagraha', 'Pandit Narayan'];
        let html = '';
        if (recent.length) {
          html += `<div class="pm-ac-section">Recent Searches</div><div class="pm-ac-chips">` +
            recent.map(r => `<span class="pm-ac-chip" data-fill="${r}">🕒 ${r}</span>`).join('') +
            `</div>`;
        }
        html += `<div class="pm-ac-section">Trending Searches</div><div class="pm-ac-chips">` +
          trending.map(t => `<span class="pm-ac-chip" data-fill="${t}">🔥 ${t}</span>`).join('') +
          `</div>`;
        drop.innerHTML = html;
        bindChipClicks();
        drop.classList.add('open');
        return;
      }

      const pujaHits = mode === 'purohits' ? [] : PUJA_INDEX
        .map(item => ({ item, score: smartMatchScore(q, `${item.title} ${item.cat} ${item.tags}`, item.title) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      const purohitHits = mode === 'pujas' ? [] : PUROHIT_INDEX
        .map(item => ({ item, score: smartMatchScore(q, `${item.title} ${item.sub} ${item.tags}`, item.title) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);

      if (!pujaHits.length && !purohitHits.length) {
        drop.innerHTML = `<div style="padding:14px;font-size:13px;color:#78716c;text-align:center">No direct matches for "<b>${q}</b>". Try <i>Griha Pravesh</i>, <i>Havan</i>, or <i>Satyanarayana</i>.</div>`;
        drop.classList.add('open');
        return;
      }

      let html = '';
      if (pujaHits.length) {
        html += `<div class="pm-ac-section">Pujas &amp; Rituals</div>`;
        html += pujaHits.map(({ item }) => `
          <a class="pm-ac-item" href="${urlPrefix}${item.url}" data-query="${item.title}">
            <img src="${urlPrefix}${item.img}" alt="${item.title}">
            <div class="pm-ac-meta">
              <div class="pm-ac-title">${item.title}</div>
              <div class="pm-ac-sub">🕐 ${item.duration}</div>
            </div>
            <span class="pm-ac-badge">${item.price}</span>
          </a>
        `).join('');
      }
      if (purohitHits.length) {
        html += `<div class="pm-ac-section">Verified Purohits</div>`;
        html += purohitHits.map(({ item }) => `
          <a class="pm-ac-item purohit" href="${urlPrefix}${item.url}" data-query="${item.title}">
            <img src="${urlPrefix}${item.img}" alt="${item.title}">
            <div class="pm-ac-meta">
              <div class="pm-ac-title">${item.title}</div>
              <div class="pm-ac-sub">${item.sub}</div>
            </div>
            <span class="pm-ac-badge">★ ${item.rating}</span>
          </a>
        `).join('');
      }

      drop.innerHTML = html;
      drop.querySelectorAll('.pm-ac-item').forEach(a => {
        a.addEventListener('mousedown', () => saveRecentSearch(a.dataset.query || q));
      });
      drop.classList.add('open');
    }

    function bindChipClicks() {
      drop.querySelectorAll('.pm-ac-chip').forEach(ch => {
        ch.addEventListener('mousedown', (e) => {
          e.preventDefault();
          input.value = ch.dataset.fill;
          saveRecentSearch(input.value);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          drop.classList.remove('open');
          if (mode === 'home' && typeof window.handleHomeSearch === 'function') {
            window.handleHomeSearch();
          }
        });
      });
    }

    clearBtn.addEventListener('click', () => {
      input.value = '';
      updateClearBtn();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
      renderDropdown();
    });

    input.addEventListener('focus', renderDropdown);
    input.addEventListener('input', renderDropdown);

    input.addEventListener('keydown', (e) => {
      const items = Array.from(drop.querySelectorAll('.pm-ac-item'));
      if (!drop.classList.contains('open') || !items.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIdx = (activeIdx + 1) % items.length;
        items.forEach((el, idx) => el.classList.toggle('active', idx === activeIdx));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIdx = (activeIdx - 1 + items.length) % items.length;
        items.forEach((el, idx) => el.classList.toggle('active', idx === activeIdx));
      } else if (e.key === 'Enter' && activeIdx >= 0 && items[activeIdx]) {
        e.preventDefault();
        items[activeIdx].click();
      } else if (e.key === 'Escape') {
        drop.classList.remove('open');
      }
    });

    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) drop.classList.remove('open');
    });

    updateClearBtn();
  }

  document.addEventListener('DOMContentLoaded', () => {
    attachAutocomplete('homePujaInput', 'home');
    attachAutocomplete('pujaSearchInput', 'pujas');
    attachAutocomplete('purohitSearchInput', 'purohits');

    // Default homeDateInput to tomorrow's real date if empty
    const homeDate = document.getElementById('homeDateInput');
    if (homeDate && !homeDate.value) {
      const t = new Date(Date.now() + 86400000);
      homeDate.min = new Date().toISOString().split('T')[0];
      homeDate.value = t.toISOString().split('T')[0];
    }
  });
})();
