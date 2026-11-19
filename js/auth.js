/**
 * PurohitMitra Unified Authentication & Drawer Navigation System
 * Handles:
 * 1. Public-first display (Home, Pujas, Purohits, How It Works, About Us, Help) before login
 * 2. Static phone + OTP sign-in (Phone: 987654321 / 9876543210, OTP: 1234)
 * 3. Customer registration (basic details) & Purohit registration (extended details) & Purohit sign-in
 * 4. Auth gating for booking actions & customer module
 * 5. Slide-out drawer navigation (minimized on public pages, accessible via ☰ Menu)
 * 6. Session synchronization between public pages and CustomerModule
 */

(function () {
  'use strict';

  const isCustomerModule = window.location.pathname.includes('/CustomerModule/') || 
                           window.location.pathname.endsWith('/CustomerModule') ||
                           document.body.hasAttribute('data-page');

  const assetPrefix = isCustomerModule ? '' : 'CustomerModule/';
  const rootPrefix = isCustomerModule ? '../' : '';

  // --------------------------------------------------------------------------
  // Helper: Toast notification
  // --------------------------------------------------------------------------
  window.pmToast = function (msg, isError = false) {
    let t = document.getElementById('pm-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'pm-toast';
      t.style.cssText = `
        position: fixed;
        bottom: 28px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: ${isError ? '#c92a2a' : '#2b1b17'};
        color: #fff;
        padding: 12px 24px;
        border-radius: 999px;
        font-size: 13.5px;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 100000;
        opacity: 0;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      document.body.appendChild(t);
    }
    t.style.background = isError ? '#c92a2a' : '#2b1b17';
    t.innerHTML = msg;
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(window._pmToastTimer);
    window._pmToastTimer = setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(-50%) translateY(15px)';
    }, 3200);
  };

  // --------------------------------------------------------------------------
  // Auth state checks
  // --------------------------------------------------------------------------
  window.pmIsLoggedIn = function () {
    return localStorage.getItem('pm_logged_in') === 'true';
  };

  window.pmGetUser = function () {
    return {
      name: localStorage.getItem('pm_user_name') || 'Srinivas Somisetti',
      phone: localStorage.getItem('pm_user_phone') || '+91 98490 12345',
      role: localStorage.getItem('pm_user_role') || 'customer',
      city: localStorage.getItem('pm_location') || 'Hyderabad'
    };
  };

  // --------------------------------------------------------------------------
  // Inject Drawer CSS & Backdrop into DOM
  // --------------------------------------------------------------------------
  function injectAuthStyles() {
    if (document.getElementById('pm-auth-styles')) return;
    const style = document.createElement('style');
    style.id = 'pm-auth-styles';
    style.textContent = `
      /* Slide-out drawer on public pages (minimized by default) */
      .pm-drawer-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(2px);
        z-index: 99990;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
      }
      body.drawer-open .pm-drawer-backdrop {
        opacity: 1;
        pointer-events: auto;
      }
      .pm-drawer {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 290px;
        max-width: 85vw;
        background: #fff;
        box-shadow: 4px 0 24px rgba(0,0,0,0.2);
        z-index: 99995;
        transform: translateX(-100%);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }
      body.drawer-open .pm-drawer {
        transform: translateX(0);
      }
      .pm-drawer-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 20px;
        background: #fff8f3;
        border-bottom: 1px solid #efe3d6;
      }
      .pm-drawer-close {
        background: none;
        border: none;
        font-size: 24px;
        color: #7a1631;
        cursor: pointer;
        line-height: 1;
        padding: 4px;
      }
      .pm-drawer-user {
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        background: #faf7f4;
        border-bottom: 1px solid #efe3d6;
      }
      .pm-drawer-user .av {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid #e8590c;
        flex-shrink: 0;
      }
      .pm-drawer-user .av img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .pm-drawer-nav {
        padding: 12px 14px;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .pm-drawer-section-label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        color: #8c827a;
        padding: 10px 12px 4px;
        letter-spacing: 0.5px;
      }
      .pm-drawer-nav a {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        color: #2b1b17;
        text-decoration: none;
        border-radius: 8px;
        font-size: 13.5px;
        font-weight: 500;
        transition: background 0.15s, color 0.15s;
      }
      .pm-drawer-nav a:hover {
        background: #fff3ea;
        color: #e8590c;
      }
      .pm-drawer-nav a.active {
        background: #e8590c;
        color: #fff;
      }
      .pm-drawer-nav a em {
        margin-left: auto;
        background: #e8590c;
        color: #fff;
        font-style: normal;
        font-size: 11px;
        padding: 2px 7px;
        border-radius: 10px;
        font-weight: 700;
      }

      /* Header User Pill & Menu Button */
      .pm-menu-btn {
        background: #fff3ea;
        border: 1px solid #f0d5c0;
        color: #e8590c;
        padding: 7px 12px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: all 0.15s;
      }
      .pm-menu-btn:hover {
        background: #e8590c;
        color: #fff;
      }
      .pm-user-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 4px 12px 4px 6px;
        background: #fff;
        border: 1px solid #efe3d6;
        border-radius: 999px;
        color: #2b1b17;
        text-decoration: none;
        font-weight: 600;
        font-size: 13px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        transition: all 0.15s;
      }
      .pm-user-pill:hover {
        border-color: #e8590c;
        box-shadow: 0 2px 8px rgba(232,89,12,0.15);
      }
      .pm-user-pill .av {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        overflow: hidden;
      }
      .pm-user-pill .av img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .pm-bell-link {
        position: relative;
        text-decoration: none;
        font-size: 18px;
        line-height: 1;
        padding: 4px 6px;
      }
      .pm-bell-link i {
        position: absolute;
        top: -4px;
        right: -2px;
        background: #c92a2a;
        color: #fff;
        font-size: 10px;
        font-style: normal;
        padding: 1px 5px;
        border-radius: 10px;
        font-weight: 700;
      }

      /* Auth Modal Styles */
      .pm-auth-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.65);
        backdrop-filter: blur(3px);
        z-index: 100000;
        display: none;
        justify-content: center;
        align-items: center;
        padding: 16px;
      }
      .pm-auth-overlay.open {
        display: flex;
      }
      .pm-auth-box {
        background: #fff;
        border-radius: 16px;
        max-width: 480px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        animation: pmModalIn 0.22s ease-out;
      }
      @keyframes pmModalIn {
        from { opacity: 0; transform: translateY(16px) scale(0.97); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .pm-auth-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 22px;
        background: #fff8f3;
        border-bottom: 1px solid #efe3d6;
        border-radius: 16px 16px 0 0;
      }
      .pm-auth-head h3 {
        margin: 0;
        color: #7a1631;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 19px;
      }
      .pm-auth-body {
        padding: 22px;
      }
      .pm-auth-hint {
        background: #fff3ea;
        border: 1px dashed #f0b98a;
        border-radius: 10px;
        padding: 12px 14px;
        margin-bottom: 18px;
        font-size: 12.5px;
        color: #7a1631;
        line-height: 1.5;
      }
      .pm-auth-hint b {
        color: #e8590c;
      }
      .pm-form-row {
        margin-bottom: 14px;
      }
      .pm-form-row label {
        display: block;
        font-size: 12.5px;
        font-weight: 600;
        margin-bottom: 5px;
        color: #2b1b17;
      }
      .pm-form-row input, .pm-form-row select {
        width: 100%;
        padding: 11px 13px;
        border: 1px solid #d4c5b9;
        border-radius: 8px;
        font-size: 13.5px;
        outline: none;
        transition: border-color 0.15s, box-shadow 0.15s;
        box-sizing: border-box;
      }
      .pm-form-row input:focus, .pm-form-row select:focus {
        border-color: #e8590c;
        box-shadow: 0 0 0 3px rgba(232,89,12,0.18);
      }
      .pm-auth-btn {
        width: 100%;
        padding: 12px;
        background: #e8590c;
        color: #fff;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s;
        margin-top: 6px;
      }
      .pm-auth-btn:hover {
        background: #d94a08;
      }
      .pm-auth-divider {
        display: flex;
        align-items: center;
        margin: 20px 0 16px;
        color: #8c827a;
        font-size: 12px;
      }
      .pm-auth-divider::before, .pm-auth-divider::after {
        content: "";
        flex: 1;
        border-bottom: 1px solid #efe3d6;
      }
      .pm-auth-divider span {
        padding: 0 10px;
      }
      .pm-auth-alt-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
      }
      .pm-auth-alt-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 9px 12px;
        border: 1px solid #d4c5b9;
        background: #faf7f4;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        color: #2b1b17;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.15s;
      }
      .pm-auth-alt-btn:hover {
        border-color: #e8590c;
        color: #e8590c;
        background: #fff3ea;
      }
    `;
    document.head.appendChild(style);
  }

  // --------------------------------------------------------------------------
  // Drawer markup & behavior (Minimized by default, opened via Menu button)
  // --------------------------------------------------------------------------
  function ensureDrawer() {
    if (document.getElementById('pm-drawer-root')) return;

    const drawerWrap = document.createElement('div');
    drawerWrap.id = 'pm-drawer-root';
    drawerWrap.innerHTML = `
      <div class="pm-drawer-backdrop" onclick="window.pmCloseDrawer()"></div>
      <aside class="pm-drawer" aria-label="Devotee Navigation Drawer">
        <div class="pm-drawer-head">
          <div style="display:flex;align-items:center;gap:8px">
            <img src="${rootPrefix}images/logo.svg" alt="PurohitMitra" width="28" height="28" />
            <b style="color:#7a1631;font-size:16px">PurohitMitra</b>
          </div>
          <button class="pm-drawer-close" onclick="window.pmCloseDrawer()" title="Close Drawer" aria-label="Close">✕</button>
        </div>
        <div class="pm-drawer-user">
          <div class="av">
            <img src="${rootPrefix}images/avatar_user.jpg" alt="Srinivas Somisetti" />
          </div>
          <div>
            <b id="pmDrawerUserName" style="display:block;font-size:14px;color:#2b1b17">Srinivas Somisetti</b>
            <small style="color:#8c827a;font-size:12px">📍 Hyderabad · Devotee</small>
          </div>
        </div>
        <nav class="pm-drawer-nav">
          <div class="pm-drawer-section-label">Devotee Portal</div>
          <a href="${rootPrefix}CustomerModule/dashboard.html"><span>🏠</span> Dashboard</a>
          <a href="${rootPrefix}CustomerModule/my-bookings.html"><span>📅</span> My Bookings</a>
          <a href="${rootPrefix}CustomerModule/payments.html"><span>💳</span> Payments</a>
          <a href="${rootPrefix}CustomerModule/offers.html"><span>🏷️</span> Offers</a>
          <a href="${rootPrefix}CustomerModule/favorites.html"><span>♡</span> Favorites</a>
          <a href="${rootPrefix}CustomerModule/notifications.html"><span>🔔</span> Notifications <em>3</em></a>
          <a href="${rootPrefix}CustomerModule/my-profile.html"><span>👤</span> My Profile</a>
          <a href="${rootPrefix}CustomerModule/saved-addresses.html"><span>📍</span> Saved Addresses</a>
          <a href="${rootPrefix}CustomerModule/my-reviews.html"><span>⭐</span> My Reviews</a>
          <a href="${rootPrefix}CustomerModule/messages.html"><span>✉️</span> Messages</a>
          <a href="${rootPrefix}CustomerModule/help-support.html"><span>❓</span> Help & Support</a>
          <a href="${rootPrefix}CustomerModule/settings.html"><span>⚙️</span> Settings</a>

          <div class="pm-drawer-section-label" style="margin-top:12px">Explore Services</div>
          <a href="${rootPrefix}pujas.html"><span>🪔</span> Pujas & Rituals</a>
          <a href="${rootPrefix}purohits.html"><span>🧔</span> Verified Purohits</a>
          <a href="${rootPrefix}how-it-works.html"><span>ℹ️</span> How It Works</a>
          <a href="${rootPrefix}about.html"><span>📖</span> About Us</a>

          <div style="border-top:1px solid #efe3d6;margin:12px 0 6px"></div>
          <a href="javascript:void(0)" onclick="window.pmLogout()" style="color:#c92a2a"><span>⎋</span> Logout</a>
        </nav>
      </aside>
    `;
    document.body.appendChild(drawerWrap);
  }

  window.pmToggleDrawer = function () {
    ensureDrawer();
    document.body.classList.toggle('drawer-open');
  };

  window.pmCloseDrawer = function () {
    document.body.classList.remove('drawer-open');
  };

  // --------------------------------------------------------------------------
  // Auth Modal (Phone + OTP, Register as Customer, Register as Purohit, Sign In as Purohit)
  // --------------------------------------------------------------------------
  function ensureAuthModal() {
    if (document.getElementById('pm-auth-modal-root')) return;

    const modalWrap = document.createElement('div');
    modalWrap.id = 'pm-auth-modal-root';
    modalWrap.innerHTML = `
      <div class="pm-auth-overlay" id="pmAuthOverlay" onclick="if(event.target===this) window.pmCloseAuthModal()">
        <div class="pm-auth-box">
          <div class="pm-auth-head">
            <h3 id="pmAuthTitle">Sign In to PurohitMitra</h3>
            <button class="pm-drawer-close" onclick="window.pmCloseAuthModal()" aria-label="Close">✕</button>
          </div>
          <div class="pm-auth-body" id="pmAuthBody">
            <!-- Dynamic Form Views rendered here -->
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalWrap);
  }

  window.pmOpenAuthModal = function (mode = 'signin', redirectTarget = '') {
    ensureAuthModal();
    if (redirectTarget) {
      sessionStorage.setItem('pm_redirect_after_login', redirectTarget);
    }
    const overlay = document.getElementById('pmAuthOverlay');
    const titleEl = document.getElementById('pmAuthTitle');
    const bodyEl = document.getElementById('pmAuthBody');
    if (!overlay || !bodyEl) return;

    if (mode === 'signin') {
      titleEl.textContent = 'Sign In to PurohitMitra';
      bodyEl.innerHTML = `
        <div class="pm-auth-hint">
          <b>🔑 Static Sign-In Credentials:</b><br>
          Phone Number: <b>987654321</b> (or <b>9876543210</b>)<br>
          One-Time Password (OTP): <b>1234</b>
        </div>
        <form id="pmSignInForm" onsubmit="event.preventDefault(); window.pmHandleSignIn();">
          <div class="pm-form-row">
            <label>Mobile Number</label>
            <input type="tel" id="pmInPhone" placeholder="Enter mobile number (e.g. 987654321)" value="987654321" required autocomplete="tel" />
          </div>
          <div class="pm-form-row">
            <label>OTP (One-Time Password)</label>
            <input type="password" id="pmInOtp" placeholder="Enter 4-digit OTP (e.g. 1234)" value="1234" maxlength="6" required autocomplete="one-time-code" />
          </div>
          <button type="submit" class="pm-auth-btn">Sign In →</button>
        </form>

        <div class="pm-auth-divider">
          <span>Or choose an option below</span>
        </div>

        <div class="pm-auth-alt-grid">
          <button type="button" class="pm-auth-alt-btn" onclick="window.pmOpenAuthModal('register-customer')">
            <span>👤</span> Register as Customer
          </button>
          <button type="button" class="pm-auth-alt-btn" onclick="window.pmOpenAuthModal('register-purohit')">
            <span>🪔</span> Register as Purohit
          </button>
          <button type="button" class="pm-auth-alt-btn" onclick="window.pmOpenAuthModal('signin-purohit')">
            <span>🧔</span> Sign In as Purohit
          </button>
        </div>
      `;
    } else if (mode === 'register-customer') {
      titleEl.textContent = 'Register as Customer';
      bodyEl.innerHTML = `
        <p style="font-size:13px;color:#8c827a;margin-top:0;margin-bottom:14px">
          Enter your basic details to create your Devotee account and start booking verified Vedic ceremonies.
        </p>
        <form id="pmRegCustForm" onsubmit="event.preventDefault(); window.pmHandleRegisterCustomer();">
          <div class="pm-form-row">
            <label>Full Name</label>
            <input type="text" id="pmRegName" placeholder="e.g. Srinivas Somisetti" value="Srinivas Somisetti" required />
          </div>
          <div class="pm-form-row">
            <label>Mobile Number</label>
            <input type="tel" id="pmRegPhone" placeholder="10-digit mobile number" value="9876543210" required />
          </div>
          <div class="pm-form-row">
            <label>Email Address</label>
            <input type="email" id="pmRegEmail" placeholder="e.g. srinivas@example.com" value="srinivas@purohitmitra.com" required />
          </div>
          <div class="pm-form-row">
            <label>City / Location</label>
            <select id="pmRegCity">
              <option value="Hyderabad" selected>📍 Hyderabad</option>
              <option value="Bengaluru">📍 Bengaluru</option>
              <option value="Chennai">📍 Chennai</option>
              <option value="Mumbai">📍 Mumbai</option>
              <option value="Delhi NCR">📍 Delhi NCR</option>
            </select>
          </div>
          <button type="submit" class="pm-auth-btn">Register & Sign In →</button>
        </form>
        <div style="text-align:center;margin-top:14px;font-size:13px">
          Already have an account? <a href="javascript:void(0)" onclick="window.pmOpenAuthModal('signin')" style="color:#e8590c;font-weight:600">Sign In</a>
        </div>
      `;
    } else if (mode === 'register-purohit') {
      titleEl.textContent = 'Register as Verified Purohit';
      bodyEl.innerHTML = `
        <p style="font-size:13px;color:#8c827a;margin-top:0;margin-bottom:14px">
          Join India's leading panel of Vedic scholars. Please provide your extended credentials for council verification.
        </p>
        <form id="pmRegPrhForm" onsubmit="event.preventDefault(); window.pmHandleRegisterPurohit();">
          <div class="pm-form-row">
            <label>Full Vedic Name & Title</label>
            <input type="text" id="pmPrhName" placeholder="e.g. Acharya Madhusudan Shastri" required />
          </div>
          <div class="pm-form-row">
            <label>Mobile Number</label>
            <input type="tel" id="pmPrhPhone" placeholder="Mobile number" required />
          </div>
          <div class="pm-form-row">
            <label>City & Primary Service Areas</label>
            <input type="text" id="pmPrhLoc" placeholder="e.g. Hyderabad - Kukatpally, Madhapur" required />
          </div>
          <div class="pm-form-row">
            <label>Vedic Tradition / Shakha</label>
            <select id="pmPrhVeda">
              <option value="Krishna Yajurveda">Krishna Yajurveda</option>
              <option value="Rigveda">Rigveda</option>
              <option value="Shukla Yajurveda">Shukla Yajurveda</option>
              <option value="Samaveda">Samaveda</option>
              <option value="Atharvaveda">Atharvaveda</option>
            </select>
          </div>
          <div class="pm-form-row">
            <label>Years of Vedic Experience</label>
            <select id="pmPrhExp">
              <option value="5-10 Years">5 - 10 Years</option>
              <option value="10-15 Years">10 - 15 Years</option>
              <option value="15-20 Years" selected>15 - 20 Years</option>
              <option value="20+ Years">20+ Years</option>
            </select>
          </div>
          <div class="pm-form-row">
            <label>Languages Known</label>
            <input type="text" id="pmPrhLang" placeholder="e.g. Telugu, Sanskrit, Hindi, Tamil" required />
          </div>
          <div class="pm-form-row">
            <label>Veda Pathashala / Certifications</label>
            <input type="text" id="pmPrhCert" placeholder="e.g. TTD Veda Pathashala / Veda Bhashya Acharya" required />
          </div>
          <button type="submit" class="pm-auth-btn">Submit Purohit Application →</button>
        </form>
        <div style="text-align:center;margin-top:14px;font-size:13px">
          Already registered? <a href="javascript:void(0)" onclick="window.pmOpenAuthModal('signin-purohit')" style="color:#e8590c;font-weight:600">Sign In as Purohit</a>
        </div>
      `;
    } else if (mode === 'signin-purohit') {
      titleEl.textContent = 'Purohit Sign In';
      bodyEl.innerHTML = `
        <div class="pm-auth-hint">
          <b>🧔 Purohit Portal Access:</b><br>
          Enter your registered Purohit mobile number to receive your OTP.<br>
          Demo Pandit Phone: <b>987654321</b> | OTP: <b>1234</b>
        </div>
        <form id="pmPrhSignInForm" onsubmit="event.preventDefault(); window.pmHandleSignIn(true);">
          <div class="pm-form-row">
            <label>Purohit Registered Mobile Number</label>
            <input type="tel" id="pmInPhone" placeholder="Enter mobile number" value="987654321" required />
          </div>
          <div class="pm-form-row">
            <label>OTP (One-Time Password)</label>
            <input type="password" id="pmInOtp" placeholder="Enter 4-digit OTP" value="1234" required />
          </div>
          <button type="submit" class="pm-auth-btn">Sign In as Purohit →</button>
        </form>
        <div style="text-align:center;margin-top:14px;font-size:13px;display:flex;justify-content:center;gap:14px">
          <a href="javascript:void(0)" onclick="window.pmOpenAuthModal('signin')" style="color:#e8590c;font-weight:600">Customer Sign In</a>
          <span style="color:#8c827a">•</span>
          <a href="javascript:void(0)" onclick="window.pmOpenAuthModal('register-purohit')" style="color:#e8590c;font-weight:600">Register as Purohit</a>
        </div>
      `;
    }

    overlay.classList.add('open');
  };

  window.pmCloseAuthModal = function () {
    const overlay = document.getElementById('pmAuthOverlay');
    if (overlay) overlay.classList.remove('open');
    if (isCustomerModule && !window.pmIsLoggedIn()) {
      const pageName = window.location.pathname.split('/').pop();
      const publicCustomerPages = ['help-support.html', 'about.html', 'how-it-works.html', 'pujas.html', 'purohits.html', 'puja-details.html', 'purohit-details.html'];
      if (!publicCustomerPages.includes(pageName)) {
        window.location.href = rootPrefix + 'index.html';
      }
    }
  };

  // --------------------------------------------------------------------------
  // Handle Login submission
  // --------------------------------------------------------------------------
  window.pmHandleSignIn = function (isPurohit = false) {
    const phoneInput = document.getElementById('pmInPhone');
    const otpInput = document.getElementById('pmInOtp');
    if (!phoneInput || !otpInput) return;

    const rawPhone = phoneInput.value.replace(/\D/g, '');
    const otp = otpInput.value.trim();

    // Verification check: accept 987654321, 9876543210 or any phone with OTP 1234
    const validOtp = otp === '1234';
    const isStaticPhone = rawPhone.endsWith('987654321') || rawPhone.endsWith('9876543210') || rawPhone === '9849012345';

    if (!validOtp) {
      window.pmToast('Invalid OTP! Please enter 1234.', true);
      return;
    }

    if (!rawPhone || rawPhone.length < 8) {
      window.pmToast('Please enter a valid phone number.', true);
      return;
    }

    // Persist login state
    const userName = isPurohit ? 'Acharya Madhusudan' : 'Srinivas Somisetti';
    const role = isPurohit ? 'purohit' : 'customer';

    localStorage.setItem('pm_logged_in', 'true');
    localStorage.setItem('pm_user_name', userName);
    localStorage.setItem('pm_user_phone', phoneInput.value.trim());
    localStorage.setItem('pm_user_role', role);

    window.pmCloseAuthModal();
    window.pmToast(`✓ Welcome back, ${userName}!`);

    // Check redirect
    const redirectTarget = sessionStorage.getItem('pm_redirect_after_login');
    sessionStorage.removeItem('pm_redirect_after_login');

    if (redirectTarget) {
      window.location.href = redirectTarget;
    } else {
      // Refresh current page navigation state smoothly
      
    // Ensure sidebar / drawer is minimized by default when accessing public & header pages
    document.body.classList.remove('nav-open', 'drawer-open');
    document.querySelectorAll('.topnav a, header nav a, .wrap.nav a').forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('nav-open', 'drawer-open');
      });
    });

    updateNavigationForAuth();
    }
  };

  window.pmHandleRegisterCustomer = function () {
    const name = (document.getElementById('pmRegName') || {}).value || 'Srinivas Somisetti';
    const phone = (document.getElementById('pmRegPhone') || {}).value || '9876543210';
    const city = (document.getElementById('pmRegCity') || {}).value || 'Hyderabad';

    localStorage.setItem('pm_logged_in', 'true');
    localStorage.setItem('pm_user_name', name);
    localStorage.setItem('pm_user_phone', phone);
    localStorage.setItem('pm_user_role', 'customer');
    localStorage.setItem('pm_location', city);

    window.pmCloseAuthModal();
    window.pmToast(`✓ Registration successful! Welcome to PurohitMitra, ${name}.`);

    const redirectTarget = sessionStorage.getItem('pm_redirect_after_login');
    sessionStorage.removeItem('pm_redirect_after_login');

    if (redirectTarget) {
      window.location.href = redirectTarget;
    } else {
      updateNavigationForAuth();
    }
  };

  window.pmHandleRegisterPurohit = function () {
    const name = (document.getElementById('pmPrhName') || {}).value || 'Pandit Ji';
    window.pmCloseAuthModal();
    window.pmToast(`✓ Application submitted for ${name}! Our Vedic Council will verify your documents within 24-48 hours.`);
  };

  window.pmLogout = function () {
    localStorage.removeItem('pm_logged_in');
    localStorage.removeItem('pm_user_role');
    window.pmToast('You have been signed out.');
    window.location.href = rootPrefix + 'index.html';
  };

  // --------------------------------------------------------------------------
  // Update Header & Navigation based on Login Status
  // --------------------------------------------------------------------------
  function updateNavigationForAuth() {
    const loggedIn = window.pmIsLoggedIn();
    const user = window.pmGetUser();

    // 1. Update public page header
    const topNav = document.querySelector('header .wrap.nav');
    if (topNav) {
      // Find Login / Sign Up buttons
      const loginBtn = topNav.querySelector('a.btn.s.mo, a[href*="dashboard.html"]');
      const signUpBtn = topNav.querySelector('a.btn.s.m, a[href*="my-profile.html"]');
      const locSpan = topNav.querySelector('.loc');

      if (loggedIn) {
        // User is logged in: show Menu button, User pill, bell icon
        let menuBtn = topNav.querySelector('.pm-menu-btn');
        if (!menuBtn) {
          menuBtn = document.createElement('button');
          menuBtn.className = 'pm-menu-btn';
          menuBtn.innerHTML = `☰ <span>Menu</span>`;
          menuBtn.title = 'Open Devotee Portal Drawer';
          menuBtn.onclick = window.pmToggleDrawer;
          topNav.insertBefore(menuBtn, topNav.firstChild);
        }

        // Hide or replace Login & Sign Up
        if (loginBtn) loginBtn.style.display = 'none';
        if (signUpBtn) signUpBtn.style.display = 'none';

        // Add Bell and User pill if not present
        let userArea = topNav.querySelector('.pm-header-user-area');
        if (!userArea) {
          userArea = document.createElement('div');
          userArea.className = 'pm-header-user-area';
          userArea.style.cssText = 'display:inline-flex;align-items:center;gap:12px;margin-left:auto';
          userArea.innerHTML = `
            <a href="${rootPrefix}CustomerModule/notifications.html" class="pm-bell-link" title="Notifications">
              🔔<i>3</i>
            </a>
            <a href="${rootPrefix}CustomerModule/my-profile.html" class="pm-user-pill" title="My Profile">
              <span class="av"><img src="${rootPrefix}images/avatar_user.jpg" alt="${user.name}"></span>
              <span>${user.name}</span>
            </a>
            <a href="javascript:void(0)" onclick="window.pmLogout()" style="color:#c92a2a;text-decoration:none;font-size:12px;font-weight:600;padding:6px 8px;border-radius:6px;background:#fff3ea" title="Sign Out">Sign Out</a>
          `;
          topNav.appendChild(userArea);
        } else {
          userArea.style.display = 'inline-flex';
        }
      } else {
        // Unauthenticated view
        const menuBtn = topNav.querySelector('.pm-menu-btn');
        if (menuBtn) menuBtn.remove();
        const userArea = topNav.querySelector('.pm-header-user-area');
        if (userArea) userArea.style.display = 'none';

        if (loginBtn) {
          loginBtn.style.display = '';
          loginBtn.href = 'javascript:void(0)';
          loginBtn.onclick = (e) => { e.preventDefault(); window.pmOpenAuthModal('signin'); };
        }
        if (signUpBtn) {
          signUpBtn.style.display = '';
          signUpBtn.href = 'javascript:void(0)';
          signUpBtn.onclick = (e) => { e.preventDefault(); window.pmOpenAuthModal('register-customer'); };
        }
      }
    }

    
    // 2. Update CustomerModule header (header.top)
    const cmTop = document.querySelector('header.top');
    if (cmTop) {
      const spArea = cmTop.querySelector('.sp');
      if (spArea) {
        if (loggedIn) {
          // Ensure user name reflects user
          const userLink = spArea.querySelector('.user');
          if (userLink) {
            userLink.style.display = 'inline-flex';
            const userNameEl = userLink.querySelector('b');
            if (userNameEl) userNameEl.textContent = user.name;
          }
          const bell = spArea.querySelector('.bell');
          if (bell) bell.style.display = 'inline-flex';

          // Clean Sign Out button in CustomerModule
          let signOutBtn = spArea.querySelector('.pm-cm-signout');
          if (!signOutBtn) {
            signOutBtn = document.createElement('a');
            signOutBtn.className = 'pm-cm-signout';
            signOutBtn.href = 'javascript:void(0)';
            signOutBtn.onclick = window.pmLogout;
            signOutBtn.textContent = 'Sign Out';
            signOutBtn.style.cssText = 'color:#c92a2a;text-decoration:none;font-size:12px;font-weight:600;padding:6px 10px;border-radius:6px;background:#fff3ea;white-space:nowrap;margin-left:4px';
            spArea.appendChild(signOutBtn);
          } else {
            signOutBtn.style.display = 'inline-block';
          }
          const authButtons = spArea.querySelector('.pm-cm-auth-btns');
          if (authButtons) authButtons.style.display = 'none';
        } else {
          // NOT logged in on a CustomerModule page
          const pageName = window.location.pathname.split('/').pop();
          if (pageName === 'help-support.html') {
            window.location.href = '../help.html';
            return;
          }
          if (pageName === 'about.html' || pageName === 'how-it-works.html') {
            window.location.href = '../' + pageName;
            return;
          }

          // Hide private elements
          const bell = spArea.querySelector('.bell');
          const userLink = spArea.querySelector('.user');
          const signOutBtn = spArea.querySelector('.pm-cm-signout');
          if (bell) bell.style.display = 'none';
          if (userLink) userLink.style.display = 'none';
          if (signOutBtn) signOutBtn.style.display = 'none';

          // Show Login & Sign Up
          let authButtons = spArea.querySelector('.pm-cm-auth-btns');
          if (!authButtons) {
            authButtons = document.createElement('div');
            authButtons.className = 'pm-cm-auth-btns';
            authButtons.style.cssText = 'display:inline-flex;align-items:center;gap:8px';
            authButtons.innerHTML = `
              <a class="btn s mo" href="javascript:void(0)" onclick="window.pmOpenAuthModal('signin')" style="padding:6px 14px;font-size:13px;border-radius:6px;background:#fff;border:1px solid #e8590c;color:#e8590c;text-decoration:none;font-weight:600">Login</a>
              <a class="btn s m" href="javascript:void(0)" onclick="window.pmOpenAuthModal('register-customer')" style="padding:6px 14px;font-size:13px;border-radius:6px;background:#e8590c;color:#fff;text-decoration:none;font-weight:600">Sign Up</a>
            `;
            spArea.appendChild(authButtons);
          } else {
            authButtons.style.display = 'inline-flex';
          }
        }
      }
    }
  
    // 2. Intercept Booking Actions on Public Pages if Not Logged In
    if (!loggedIn) {
      document.querySelectorAll('a, button').forEach(el => {
        const text = (el.innerText || '').trim().toLowerCase();
        const href = (el.getAttribute('href') || '').toLowerCase();
        const isBookingAction = text.includes('book now') || 
                                text.includes('book a puja') || 
                                text.includes('book puja') || 
                                text.includes('book purohit') ||
                                href.includes('book-puja.html') ||
                                href.includes('book-purohit.html') ||
                                href.includes('choose-purohit.html') ||
                                href.includes('payment.html');
        
        if (isBookingAction) {
          el.addEventListener('click', function (e) {
            if (!window.pmIsLoggedIn()) {
              e.preventDefault();
              e.stopPropagation();
              const target = el.getAttribute('href') || '';
              window.pmOpenAuthModal('signin', target);
            }
          }, true);
        }
      });
    }

    // 3. Update Drawer user info if present
    const drawerUserName = document.getElementById('pmDrawerUserName');
    if (drawerUserName) drawerUserName.textContent = user.name;
  }

  // --------------------------------------------------------------------------
  // DOMContentLoaded initialization
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    injectAuthStyles();
    ensureDrawer();
    ensureAuthModal();
    updateNavigationForAuth();

    
    // If on a private customer page while unauthenticated, open the Auth Modal immediately
    if (isCustomerModule && !window.pmIsLoggedIn()) {
      const pageName = window.location.pathname.split('/').pop();
      const publicCustomerPages = ['help-support.html', 'about.html', 'how-it-works.html', 'pujas.html', 'purohits.html', 'puja-details.html', 'purohit-details.html'];
      if (!publicCustomerPages.includes(pageName)) {
        setTimeout(() => {
          window.pmOpenAuthModal('signin');
        }, 150);
      }
    }

    // Check if redirect query exists (e.g. ?auth=required)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'required' && !window.pmIsLoggedIn()) {
      window.pmOpenAuthModal('signin');
    }
  });

})();
