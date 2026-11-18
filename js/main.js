// PurohitMitra Main Interactive JS (Navigation, Modals, Location, Quick Actions)

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
              <option value="Delhi">Delhi NCR</option>
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
    el.innerHTML = `📍 ${cityName} ⌄`;
  });
  closeModal();
  if (typeof toast === 'function') {
    toast(`Location changed to ${cityName}`);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // 1. Restore saved location if any
  const savedLoc = localStorage.getItem('pm_location');
  if (savedLoc) {
    document.querySelectorAll('.loc').forEach(el => {
      el.innerHTML = `📍 ${savedLoc} ⌄`;
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

  // 3. Payment breakdown view details toggle
  const togglePayDetails = document.getElementById('togglePaymentDetails');
  const payBreakdown = document.getElementById('paymentBreakdownBox');
  if (togglePayDetails && payBreakdown) {
    togglePayDetails.addEventListener('click', function(e) {
      e.preventDefault();
      if (payBreakdown.style.display === 'none' || !payBreakdown.style.display) {
        payBreakdown.style.display = 'block';
        togglePayDetails.innerHTML = 'Hide Details ⌃';
      } else {
        payBreakdown.style.display = 'none';
        togglePayDetails.innerHTML = 'View Details ⌄';
      }
    });
  }

  // 4. Sort Pujas handler
  const sortPujas = document.getElementById('sortPujas');
  if (sortPujas) {
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
    });
  }

  // 5. Sort Purohits handler
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
    });
  }

  // 6. Choose Purohit filter pills handlers
  const filterLang = document.getElementById('filterLang');
  const filterExp = document.getElementById('filterExp');
  const filterSort = document.getElementById('filterSort');
  if (filterLang || filterExp || filterSort) {
    const purohitItems = Array.from(document.querySelectorAll('.sel'));
    
    function applyPurohitFilters() {
      const lVal = filterLang ? filterLang.value.toLowerCase() : '';
      const eVal = filterExp ? parseInt(filterExp.value || 0) : 0;
      
      purohitItems.forEach(item => {
        const text = item.innerText.toLowerCase();
        let match = true;
        if (lVal && !text.includes(lVal)) match = false;
        if (eVal) {
          const expMatch = item.innerText.match(/(\d+)\s*years/i);
          const exp = expMatch ? parseInt(expMatch[1]) : 0;
          if (exp < eVal) match = false;
        }
        item.style.display = match ? 'flex' : 'none';
      });
    }

    if (filterLang) filterLang.addEventListener('change', applyPurohitFilters);
    if (filterExp) filterExp.addEventListener('change', applyPurohitFilters);
  }

  // 7. Family member count increment/decrement
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
