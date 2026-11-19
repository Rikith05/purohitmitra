// PurohitMitra Main Interactive JS (Navigation, Search, Pagination, Modals, Location)

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
  }
}

function openPolicyModal(type) {
  let title = '';
  let content = '';

  if (type === 'cancellation') {
    title = 'Cancellation & Reschedule Policy';
    content = `
      <p>At PurohitMitra, we understand that spiritual schedules may need changes due to unforeseen circumstances. We offer fair and transparent cancellation terms:</p>
      <h4>Cancellation Refund Tiers</h4>
      <table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:13px">
        <thead>
          <tr style="background:#fff3ea;border-bottom:2px solid #e8590c">
            <th style="padding:8px 10px;text-align:left">Timing Before Puja</th>
            <th style="padding:8px 10px;text-align:left">Refund Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid #efe3d6">
            <td style="padding:8px 10px">More than 48 Hours</td>
            <td style="padding:8px 10px;color:#2f9e44;font-weight:600">100% Full Refund</td>
          </tr>
          <tr style="border-bottom:1px solid #efe3d6">
            <td style="padding:8px 10px">24 to 48 Hours</td>
            <td style="padding:8px 10px;font-weight:600">80% Refund</td>
          </tr>
          <tr style="border-bottom:1px solid #efe3d6">
            <td style="padding:8px 10px">12 to 24 Hours</td>
            <td style="padding:8px 10px;font-weight:600">50% Refund</td>
          </tr>
          <tr>
            <td style="padding:8px 10px">Less than 12 Hours</td>
            <td style="padding:8px 10px;color:#d32f2f">Dakshina allocated to Pandit; Samagri refunded if unsent</td>
          </tr>
        </tbody>
      </table>
      <h4>Free Rescheduling</h4>
      <p>You can reschedule your booking once at zero penalty if requested at least 24 hours before the designated muhurtham slot.</p>
    `;
  } else if (type === 'refund') {
    title = 'Refund Process & Timeline';
    content = `
      <h4>How Refunds Work</h4>
      <ul>
        <li>Refunds are initiated instantly upon cancellation approval.</li>
        <li>For UPI payments (GPay, PhonePe, Paytm): credited within 2 to 4 hours.</li>
        <li>For Debit/Credit Cards & Net Banking: processed via Razorpay within 3 to 5 business days.</li>
        <li>You will receive SMS and WhatsApp confirmation with reference UTR number.</li>
      </ul>
      <h4>Refund Support</h4>
      <p>Have questions about your refund? Reach out to <a href="mailto:support@purohitmitra.com" style="color:#e8590c">support@purohitmitra.com</a> or call +91 98765 43210.</p>
    `;
  } else if (type === 'privacy') {
    title = 'Privacy Policy';
    content = `
      <p>PurohitMitra is committed to protecting the privacy and sanctity of our devotees' personal and spiritual details in accordance with the Digital Personal Data Protection (DPDP) Act.</p>
      <h4>Information We Collect</h4>
      <ul>
        <li>Contact details (Name, Mobile, Email) for booking verification and updates.</li>
        <li>Ritual details (Gotram, Nakshatram, Rashi, Family members) exclusively for Sankalpa.</li>
        <li>Delivery addresses for verified Purohit visit and Samagri kits.</li>
      </ul>
      <h4>Security Guarantee</h4>
      <p>We do not sell, rent or share your religious or personal records with third-party advertisers. All communications between Purohits and Devotees are protected under strict confidentiality.</p>
    `;
  } else if (type === 'terms') {
    title = 'Terms & Conditions';
    content = `
      <p>Welcome to PurohitMitra. By using our platform, you agree to the following terms:</p>
      <h4>Platform Responsibility</h4>
      <ul>
        <li>PurohitMitra connects devotees with verified, traditional Purohits trained in authentic Vedic scriptures.</li>
        <li>All Purohits undergo rigorous background checks, credential verifications, and ritual assessments.</li>
        <li>Dakshina amounts displayed are transparent with no hidden demands at the ceremony.</li>
      </ul>
      <h4>Devotee Guidelines</h4>
      <ul>
        <li>Please ensure timely reception of the Purohit at the ceremony location.</li>
        <li>Devotees must maintain sacred decorum during the puja and havan rituals.</li>
      </ul>
    `;
  }

  showModal(title, content);
}

function openPurohitModal(type) {
  let title = '';
  let content = '';

  if (type === 'register') {
    title = 'Register as Verified Purohit';
    content = `
      <p style="margin-bottom:14px;color:#6f6560">Join over 500+ verified pandits across India. Connect with thousands of devotees and manage your schedule flexibly.</p>
      <form onsubmit="event.preventDefault(); alert('Application submitted successfully! Our verification team will contact you within 24 hours.'); closeModal();">
        <div class="form-group">
          <label>Full Name (as per Aadhaar)</label>
          <input type="text" placeholder="e.g. Pandit Sri Ramachandra Shastri" required />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label>Mobile Number (for OTP)</label>
            <input type="tel" placeholder="+91 98765 43210" required />
          </div>
          <div class="form-group">
            <label>Primary City</label>
            <select required>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Chennai">Chennai</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Pune">Pune</option>
            </select>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label>Vedic Tradition / Veda</label>
            <select required>
              <option value="Yajurveda">Krishna / Shukla Yajurveda</option>
              <option value="Rigveda">Rigveda</option>
              <option value="Samaveda">Samaveda</option>
              <option value="Atharvaveda">Atharvaveda</option>
              <option value="Smartha">Smartha Sampradaya</option>
              <option value="Vaishnava">Vaishnava / Pancharatra</option>
            </select>
          </div>
          <div class="form-group">
            <label>Years of Experience</label>
            <input type="number" min="1" max="60" placeholder="e.g. 15" required />
          </div>
        </div>
        <div class="form-group">
          <label>Languages Known</label>
          <input type="text" placeholder="e.g. Telugu, Sanskrit, Hindi, Tamil" required />
        </div>
        <button type="submit" class="btn p" style="width:100%;margin-top:8px">Submit Purohit Application →</button>
      </form>
    `;
  } else if (type === 'login') {
    title = 'Purohit Partner Login';
    content = `
      <p style="margin-bottom:14px;color:#6f6560">Access your scheduled bookings, devotee chat, and earnings dashboard.</p>
      <form onsubmit="event.preventDefault(); alert('OTP sent to registered mobile number!'); closeModal();">
        <div class="form-group">
          <label>Registered Mobile Number or Pandit ID</label>
          <input type="text" placeholder="e.g. 9876543210 or PM-1042" required />
        </div>
        <div class="form-group">
          <label>Security PIN or OTP</label>
          <input type="password" placeholder="Enter 4-digit PIN" required />
        </div>
        <button type="submit" class="btn p" style="width:100%;margin-top:8px">Login to Partner Portal</button>
        <p style="text-align:center;margin-top:12px;font-size:12px">
          New Pandit? <a href="#register" onclick="closeModal(); openPurohitModal('register');" style="color:#e8590c;font-weight:600">Register Here</a>
        </p>
      </form>
    `;
  } else if (type === 'guide') {
    title = 'Purohit Guide & Code of Conduct';
    content = `
      <h4>Vedic Standards & Shastra Compliance</h4>
      <ul>
        <li>All rituals must strictly adhere to authenticated Vedic scriptures and regional custom guidelines.</li>
        <li>Clear, audible mantra uccharana with shuddha swara.</li>
        <li>Explain the spiritual significance of main rituals (Sankalpa, Havan, Aarti) to family members.</li>
      </ul>
      <h4>Punctuality & Attire</h4>
      <ul>
        <li>Reach the venue 20-30 minutes prior to the sacred Muhurtham.</li>
        <li>Traditional, clean Vedic attire (Dhoti, Angavastram, Tripundra/Tilakam).</li>
      </ul>
      <h4>Dakshina Discipline</h4>
      <ul>
        <li>Never demand additional dakshina beyond the confirmed booking amount.</li>
        <li>Devotees may offer voluntary sambhavana or tambulam at their discretion.</li>
      </ul>
    `;
  }

  showModal(title, content);
}

function showModal(title, bodyHtml) {
  let overlay = document.getElementById('modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <h3 id="modal-title"></h3>
          <button class="modal-close" onclick="closeModal()" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body" id="modal-body"></div>
        <div class="modal-footer">
          <button class="btn s" onclick="closeModal()">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });
  }

  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  overlay.classList.add('open');
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});


// ===== Interactive Location Modal & Dropdown Handlers =====

function openLocationModal() {
  const currentLoc = (localStorage.getItem('pm_location') || 'Hyderabad').trim();
  const cities = ['Hyderabad', 'Bengaluru', 'Chennai', 'Mumbai', 'Delhi NCR', 'Pune', 'Visakhapatnam', 'Vijayawada'];
  
  const content = `
    <p style="color:var(--mu);margin-bottom:14px">Select your primary city for authentic local Purohit booking & Muhurtham calculations:</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      ${cities.map(c => `
        <button type="button" class="btn ${c === currentLoc ? 'p' : 'w'}" style="text-align:left;padding:10px 14px;border-radius:8px;font-weight:600;display:flex;justify-content:space-between;align-items:center" onclick="selectCity('${c}')">
          <span>📍 ${c}</span>
          ${c === currentLoc ? '<span>✓</span>' : ''}
        </button>
      `).join('')}
    </div>
    <div style="background:#fff3ea;border:1px solid #ffd8a8;border-radius:8px;padding:10px 14px;font-size:12px;color:#d9480f">
      ✨ <b>Tip:</b> Changing your location updates travel distances and nearby verified Purohits instantly.
    </div>
  `;
  showModal('Select Ceremony Location', content);
}

function selectCity(cityName) {
  localStorage.setItem('pm_location', cityName);
  document.querySelectorAll('.loc').forEach(el => {
    el.innerHTML = `📍 ${cityName} <span class="nav-caret">▾</span>`;
  });
  closeModal();
  if (typeof toast === 'function') {
    toast(`Location changed to ${cityName}`);
  }
}


// ===== 1. Home Search Handler =====

function handleHomeSearch() {
  const pujaInput = document.getElementById('homePujaInput');
  const locSelect = document.getElementById('homeLocSelect');
  const dateInput = document.getElementById('homeDateInput');
  
  const query = pujaInput ? pujaInput.value.trim() : '';
  const loc = locSelect ? locSelect.value : '';
  const date = dateInput ? dateInput.value : '';
  
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (loc) params.set('loc', loc);
  if (date) params.set('date', date);
  
  const target = 'pujas.html';
  window.location.href = params.toString() ? `${target}?${params.toString()}` : target;
}


// ===== 2. Puja Interactive Search, Multi-Filter & Dynamic Pagination =====

function initPujaSearchAndPagination() {
  const grid = document.querySelector('.grid.g3');
  const searchInput = document.getElementById('pujaSearchInput');
  const catSelect = document.getElementById('heroPujaCat');
  const countEl = document.querySelector('.head .mu:first-child');
  const paginationContainer = document.getElementById('pujaPagination');
  const sideCats = document.querySelectorAll('.filter-cat-list li, .filter-panel li[data-cat], aside.side li[data-cat], aside.side ul:first-of-type li');
  const priceRange = document.getElementById('priceRange');
  const priceRangeVal = document.getElementById('priceRangeVal');
  const durationInputs = document.querySelectorAll('input[name="duration"]');
  const locationInputs = document.querySelectorAll('input[name="location"]');
  const sortSelect = document.getElementById('sortPujas');
  
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.card.pc'));
  if (!cards.length) return;

  const pageSize = 6;
  let currentPage = 1;
  let activeCategory = '';
  let activeQuery = '';
  let activeMaxPrice = priceRange ? parseInt(priceRange.value, 10) : 50000;
  let activeDurations = [];
  let activeLocations = [];

  // Read URL parameters if present
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('q')) {
    activeQuery = urlParams.get('q').toLowerCase();
    if (searchInput) searchInput.value = urlParams.get('q');
  }
  if (urlParams.has('cat')) {
    activeCategory = urlParams.get('cat').toLowerCase();
    if (catSelect) catSelect.value = activeCategory;
    sideCats.forEach(el => {
      const cat = (el.dataset.cat || '').toLowerCase();
      el.classList.toggle('on', cat === activeCategory || (!activeCategory && cat === ''));
    });
  }

  function parseCardPrice(card) {
    if (card.dataset.price) {
      const p = parseInt(card.dataset.price, 10);
      if (!isNaN(p)) return p;
    }
    const prEl = card.querySelector('.pr');
    if (prEl) {
      const num = prEl.innerText.replace(/[^\d]/g, '');
      const p = parseInt(num, 10);
      if (!isNaN(p)) return p;
    }
    return 0;
  }

  function getMatchingCards() {
    let result = cards.filter(card => {
      const title = (card.querySelector('h3') || {}).innerText?.toLowerCase() || '';
      const desc = (card.querySelector('p') || {}).innerText?.toLowerCase() || '';
      const cardCat = (card.dataset.category || '').toLowerCase();
      const cardPrice = parseCardPrice(card);
      const cardDurations = (card.dataset.duration || '').toLowerCase().split(/\s+/).filter(Boolean);
      const cardLocations = (card.dataset.location || '').toLowerCase().split(/\s+/).filter(Boolean);
      
      const matchesQuery = !activeQuery || title.includes(activeQuery) || desc.includes(activeQuery);
      const matchesCat = !activeCategory || cardCat.includes(activeCategory);
      const matchesPrice = (cardPrice === 0) || (cardPrice <= activeMaxPrice);
      const matchesDuration = (activeDurations.length === 0) || 
        activeDurations.some(d => cardDurations.includes(d));
      const matchesLocation = (activeLocations.length === 0) || 
        activeLocations.some(l => cardLocations.includes(l));

      return matchesQuery && matchesCat && matchesPrice && matchesDuration && matchesLocation;
    });

    // Sorting
    const sortVal = sortSelect ? sortSelect.value : 'pop';
    if (sortVal === 'price-asc') {
      result.sort((a, b) => parseCardPrice(a) - parseCardPrice(b));
    } else if (sortVal === 'price-desc') {
      result.sort((a, b) => parseCardPrice(b) - parseCardPrice(a));
    }
    return result;
  }

  function renderPage() {
    const matching = getMatchingCards();
    const totalMatching = matching.length;
    const totalPages = Math.max(1, Math.ceil(totalMatching / pageSize));

    if (currentPage > totalPages) currentPage = 1;

    // Hide all cards first
    cards.forEach(c => c.style.display = 'none');

    // Show slice for current page and maintain sorted order in DOM
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, totalMatching);
    const visibleCards = matching.slice(startIdx, endIdx);
    visibleCards.forEach(c => {
      c.style.display = 'block';
      grid.appendChild(c);
    });

    // Update Showing text
    if (countEl) {
      if (totalMatching === 0) {
        countEl.textContent = 'Showing 0 Pujas';
      } else {
        countEl.textContent = `Showing ${startIdx + 1} - ${endIdx} of ${totalMatching} Pujas`;
      }
    }

    // Handle empty state notice
    let noMatchEl = document.getElementById('noPujaMatchNotice');
    if (totalMatching === 0) {
      if (!noMatchEl) {
        noMatchEl = document.createElement('div');
        noMatchEl.id = 'noPujaMatchNotice';
        noMatchEl.style.cssText = 'text-align:center;padding:40px 20px;grid-column:1/-1;color:var(--mu);background:#fff;border-radius:12px;border:1px dashed var(--bd)';
        noMatchEl.innerHTML = `
          <h3 style="color:var(--m);font-size:18px;margin-bottom:8px">No Pujas Found</h3>
          <p style="font-size:13px;margin-bottom:14px">We couldn't find any pujas matching your selected criteria.</p>
          <button type="button" class="btn p s" onclick="resetPujaFilters()">Reset All Filters</button>
        `;
        grid.appendChild(noMatchEl);
      }
      noMatchEl.style.display = 'block';
    } else if (noMatchEl) {
      noMatchEl.style.display = 'none';
    }

    // Render pagination buttons
    if (paginationContainer) {
      if (totalPages <= 1) {
        paginationContainer.style.display = totalMatching > 0 ? 'block' : 'none';
        paginationContainer.innerHTML = totalMatching > 0 ? `<span class="btn s p">1</span>` : '';
      } else {
        paginationContainer.style.display = 'block';
        let html = '';
        for (let i = 1; i <= totalPages; i++) {
          html += `<span class="btn s ${i === currentPage ? 'p' : ''}" style="cursor:pointer;margin:0 3px" onclick="setPujaPage(${i})">${i}</span> `;
        }
        if (currentPage < totalPages) {
          html += `<span class="btn s" style="cursor:pointer;margin:0 3px" onclick="setPujaPage(${currentPage + 1})" title="Next Page">›</span>`;
        }
        paginationContainer.innerHTML = html;
      }
    }
  }

  window.setPujaPage = function(page) {
    currentPage = page;
    renderPage();
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.resetPujaFilters = function() {
    activeQuery = '';
    activeCategory = '';
    activeMaxPrice = 50000;
    activeDurations = [];
    activeLocations = [];

    if (searchInput) searchInput.value = '';
    if (catSelect) catSelect.value = '';
    if (priceRange) priceRange.value = 50000;
    if (priceRangeVal) priceRangeVal.textContent = 'Up to ₹50,000+';

    durationInputs.forEach(chk => { chk.checked = false; });
    locationInputs.forEach(chk => { chk.checked = false; });

    sideCats.forEach(el => el.classList.remove('on'));
    const defaultCat = document.querySelector('.filter-cat-list li[data-cat=""], .side li[data-cat=""], .filter-panel li[data-cat=""]');
    if (defaultCat) defaultCat.classList.add('on');

    if (sortSelect) sortSelect.value = 'pop';

    currentPage = 1;
    renderPage();
  };

  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      activeQuery = e.target.value.trim().toLowerCase();
      currentPage = 1;
      renderPage();
    });
  }

  if (catSelect) {
    catSelect.addEventListener('change', function(e) {
      activeCategory = e.target.value.toLowerCase();
      sideCats.forEach(el => {
        const cat = (el.dataset.cat || '').toLowerCase();
        el.classList.toggle('on', cat === activeCategory || (!activeCategory && cat === ''));
      });
      currentPage = 1;
      renderPage();
    });
  }

  // Sidebar category clicks
  sideCats.forEach(li => {
    li.style.cursor = 'pointer';
    li.addEventListener('click', function() {
      sideCats.forEach(el => el.classList.remove('on'));
      this.classList.add('on');
      activeCategory = (this.dataset.cat || '').toLowerCase();
      if (catSelect) catSelect.value = activeCategory;
      currentPage = 1;
      renderPage();
    });
  });

  // Price range slider
  if (priceRange) {
    priceRange.addEventListener('input', function() {
      activeMaxPrice = parseInt(this.value, 10);
      if (priceRangeVal) {
        priceRangeVal.textContent = activeMaxPrice >= 50000 ? 'Up to ₹50,000+' : `Up to ₹${activeMaxPrice.toLocaleString('en-IN')}`;
      }
      currentPage = 1;
      renderPage();
    });
  }

  // Duration checkboxes
  durationInputs.forEach(chk => {
    chk.addEventListener('change', function() {
      activeDurations = Array.from(durationInputs).filter(c => c.checked).map(c => c.value);
      currentPage = 1;
      renderPage();
    });
  });

  // Location checkboxes
  locationInputs.forEach(chk => {
    chk.addEventListener('change', function() {
      activeLocations = Array.from(locationInputs).filter(c => c.checked).map(c => c.value);
      currentPage = 1;
      renderPage();
    });
  });

  // Sort dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      currentPage = 1;
      renderPage();
    });
  }

  renderPage();
}


// ===== 3. Purohit Interactive Search, Filter & Dynamic Pagination =====

function initPurohitSearchAndPagination() {
  const grid = document.querySelector('.grid.g3');
  const searchInput = document.getElementById('purohitSearchInput');
  const specSelect = document.getElementById('heroPurohitSpec');
  const countEl = document.querySelector('.head span:first-child');
  const paginationContainer = document.getElementById('purohitPagination');
  const specItems = document.querySelectorAll('#purohitSpecList li');
  const langItems = document.querySelectorAll('#purohitLangList li');

  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.card.prc'));
  if (!cards.length) return;

  const pageSize = 6;
  let currentPage = 1;
  let activeSpec = '';
  let activeLang = '';
  let activeQuery = '';

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('q')) {
    activeQuery = urlParams.get('q').toLowerCase();
    if (searchInput) searchInput.value = urlParams.get('q');
  }
  if (urlParams.has('spec')) {
    activeSpec = urlParams.get('spec').toLowerCase();
    if (specSelect) specSelect.value = activeSpec;
  }

  function getMatchingCards() {
    return cards.filter(card => {
      const name = (card.querySelector('h3') || {}).innerText?.toLowerCase() || '';
      const text = card.innerText?.toLowerCase() || '';
      const spec = (card.dataset.spec || '').toLowerCase();
      const lang = (card.dataset.lang || '').toLowerCase();

      const matchesQuery = !activeQuery || name.includes(activeQuery) || text.includes(activeQuery);
      const matchesSpec = !activeSpec || spec.includes(activeSpec);
      const matchesLang = !activeLang || lang.includes(activeLang);

      return matchesQuery && matchesSpec && matchesLang;
    });
  }

  function renderPage() {
    const matching = getMatchingCards();
    const totalMatching = matching.length;
    const totalPages = Math.max(1, Math.ceil(totalMatching / pageSize));

    if (currentPage > totalPages) currentPage = 1;

    cards.forEach(c => c.style.display = 'none');

    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, totalMatching);
    const visibleCards = matching.slice(startIdx, endIdx);
    visibleCards.forEach(c => c.style.display = 'block');

    if (countEl) {
      if (totalMatching === 0) {
        countEl.textContent = 'Showing 0 Purohits';
      } else {
        countEl.textContent = `Showing ${startIdx + 1} - ${endIdx} of ${totalMatching} Purohits`;
      }
    }

    let noMatchEl = document.getElementById('noPurohitMatchNotice');
    if (totalMatching === 0) {
      if (!noMatchEl) {
        noMatchEl = document.createElement('div');
        noMatchEl.id = 'noPurohitMatchNotice';
        noMatchEl.style.cssText = 'text-align:center;padding:40px 20px;grid-column:1/-1;color:var(--mu);background:#fff;border-radius:12px;border:1px dashed var(--bd)';
        noMatchEl.innerHTML = `
          <h3 style="color:var(--m);font-size:18px;margin-bottom:8px">No Purohits Found</h3>
          <p style="font-size:13px;margin-bottom:14px">We couldn't find any purohits matching your search criteria.</p>
          <button type="button" class="btn p s" onclick="resetPurohitFilters()">Show All Purohits</button>
        `;
        grid.appendChild(noMatchEl);
      }
      noMatchEl.style.display = 'block';
    } else if (noMatchEl) {
      noMatchEl.style.display = 'none';
    }

    if (paginationContainer) {
      if (totalPages <= 1) {
        paginationContainer.style.display = totalMatching > 0 ? 'block' : 'none';
        paginationContainer.innerHTML = `<span class="btn s p">1</span>`;
      } else {
        paginationContainer.style.display = 'block';
        let html = '';
        for (let i = 1; i <= totalPages; i++) {
          html += `<span class="btn s ${i === currentPage ? 'p' : ''}" style="cursor:pointer;margin:0 3px" onclick="setPurohitPage(${i})">${i}</span> `;
        }
        if (currentPage < totalPages) {
          html += `<span class="btn s" style="cursor:pointer;margin:0 3px" onclick="setPurohitPage(${currentPage + 1})" title="Next Page">›</span>`;
        }
        paginationContainer.innerHTML = html;
      }
    }
  }

  window.setPurohitPage = function(page) {
    currentPage = page;
    renderPage();
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.resetPurohitFilters = function() {
    activeQuery = '';
    activeSpec = '';
    activeLang = '';
    if (searchInput) searchInput.value = '';
    if (specSelect) specSelect.value = '';
    specItems.forEach(el => el.classList.remove('on'));
    if (specItems[0]) specItems[0].classList.add('on');
    langItems.forEach(el => el.classList.remove('on'));
    if (langItems[0]) langItems[0].classList.add('on');
    currentPage = 1;
    renderPage();
  };

  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      activeQuery = e.target.value.trim().toLowerCase();
      currentPage = 1;
      renderPage();
    });
  }

  if (specSelect) {
    specSelect.addEventListener('change', function(e) {
      activeSpec = e.target.value.toLowerCase();
      specItems.forEach(el => {
        const s = el.dataset.spec || '';
        el.classList.toggle('on', s === activeSpec || (!activeSpec && s === ''));
      });
      currentPage = 1;
      renderPage();
    });
  }

  specItems.forEach(li => {
    li.style.cursor = 'pointer';
    li.addEventListener('click', function() {
      specItems.forEach(el => el.classList.remove('on'));
      this.classList.add('on');
      activeSpec = (this.dataset.spec || '').toLowerCase();
      if (specSelect) specSelect.value = activeSpec;
      currentPage = 1;
      renderPage();
    });
  });

  langItems.forEach(li => {
    li.style.cursor = 'pointer';
    li.addEventListener('click', function() {
      langItems.forEach(el => el.classList.remove('on'));
      this.classList.add('on');
      activeLang = (this.dataset.lang || '').toLowerCase();
      currentPage = 1;
      renderPage();
    });
  });

  renderPage();
}


// ===== DOM Ready Initializations =====

document.addEventListener('DOMContentLoaded', function() {
  /* Pujas Dropdown Toggle */
  document.querySelectorAll('.has-drop').forEach(item => {
    const link = item.querySelector('a');
    if (link) {
      link.addEventListener('click', function(e) {
        // If clicking on mobile or toggling dropdown
        if (window.innerWidth <= 768) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    }
  });
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.has-drop')) {
      document.querySelectorAll('.has-drop.open').forEach(el => el.classList.remove('open'));
    }
  });

  // 1. Restore saved location
  const savedLoc = localStorage.getItem('pm_location');
  if (savedLoc) {
    document.querySelectorAll('.loc').forEach(el => {
      el.innerHTML = `📍 ${savedLoc} <span class="nav-caret">▾</span>`;
    });
  }

  // 2. Click on .loc opens location picker modal
  document.querySelectorAll('.loc').forEach(el => {
    el.style.cursor = 'pointer';
    el.title = 'Click to change location';
    el.addEventListener('click', function(e) {
      e.preventDefault();
      openLocationModal();
    });
  });

  // 3. Initialize Pujas search and pagination if on pujas page
  if (document.getElementById('pujaSearchInput') || document.getElementById('pujaPagination')) {
    initPujaSearchAndPagination();
  }

  // 4. Initialize Purohits search and pagination if on purohits page
  if (document.getElementById('purohitSearchInput') || document.getElementById('purohitPagination')) {
    initPurohitSearchAndPagination();
  }

  // 5. Payment breakdown toggle
  const togglePayDetails = document.getElementById('togglePaymentDetails');
  const payBreakdown = document.getElementById('paymentBreakdownBox');
  if (togglePayDetails && payBreakdown) {
    togglePayDetails.addEventListener('click', function(e) {
      e.preventDefault();
      if (payBreakdown.style.display === 'none' || !payBreakdown.style.display) {
        payBreakdown.style.display = 'block';
        togglePayDetails.innerHTML = 'Hide Details <span class="nav-caret" style="transform:rotate(180deg)">▾</span>';
      } else {
        payBreakdown.style.display = 'none';
        togglePayDetails.innerHTML = 'View Details <span class="nav-caret">▾</span>';
      }
    });
  }

  // 6. Sort Pujas handler
  const sortPujas = document.getElementById('sortPujas');
  if (sortPujas && typeof window.setPujaPage !== 'function') {
    sortPujas.addEventListener('change', function() {
      const val = this.value;
      const grid = document.querySelector('.grid.g3');
      if (!grid) return;
      const cards = Array.from(grid.querySelectorAll('.card.pc'));
      if (val === 'price-asc') {
        cards.sort((a, b) => {
          const pa = parseInt((a.querySelector('.pr') || {}).innerText?.replace(/[^\d]/g, '') || 0);
          const pb = parseInt((b.querySelector('.pr') || {}).innerText?.replace(/[^\d]/g, '') || 0);
          return pa - pb;
        });
      } else if (val === 'price-desc') {
        cards.sort((a, b) => {
          const pa = parseInt((a.querySelector('.pr') || {}).innerText?.replace(/[^\d]/g, '') || 0);
          const pb = parseInt((b.querySelector('.pr') || {}).innerText?.replace(/[^\d]/g, '') || 0);
          return pb - pa;
        });
      }
      cards.forEach(c => grid.appendChild(c));
      if (typeof window.setPujaPage === 'function') {
        window.setPujaPage(1);
      }
    });
  }

  // 7. Sort Purohits handler
  const sortPurohits = document.getElementById('sortPurohits');
  if (sortPurohits) {
    sortPurohits.addEventListener('change', function() {
      const val = this.value;
      const grid = document.querySelector('.grid.g3');
      if (!grid) return;
      const cards = Array.from(grid.querySelectorAll('.card.prc'));
      if (val === 'exp') {
        cards.sort((a, b) => {
          const ea = parseInt(a.innerText.match(/(\d+)\s*years/i)?.[1] || 0);
          const eb = parseInt(b.innerText.match(/(\d+)\s*years/i)?.[1] || 0);
          return eb - ea;
        });
      } else if (val === 'reviews') {
        cards.sort((a, b) => {
          const ra = parseInt(a.innerText.match(/(\d+)\s*reviews/i)?.[1] || 0);
          const rb = parseInt(b.innerText.match(/(\d+)\s*reviews/i)?.[1] || 0);
          return rb - ra;
        });
      }
      cards.forEach(c => grid.appendChild(c));
      if (typeof window.setPurohitPage === 'function') {
        window.setPurohitPage(1);
      }
    });
  }

  // 8. Family counter
  const cntBox = document.querySelector('.in-counter');
  if (cntBox) {
    const decBtn = cntBox.querySelector('.btn-dec');
    const incBtn = cntBox.querySelector('.btn-inc');
    const numEl = cntBox.querySelector('.count-val');
    if (decBtn && incBtn && numEl) {
      decBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let val = parseInt(numEl.textContent.trim()) || 5;
        if (val > 1) { numEl.textContent = val - 1; }
      });
      incBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let val = parseInt(numEl.textContent.trim()) || 5;
        numEl.textContent = val + 1;
      });
    }
  }
});


/* Delegated click for all .loc elements */
document.addEventListener('click', function(e) {
  const locEl = e.target.closest('.loc');
  if (locEl) {
    e.preventDefault();
    if (typeof openLocationModal === 'function') {
      openLocationModal();
    }
  }
});
