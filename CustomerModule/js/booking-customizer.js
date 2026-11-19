/**
 * PurohitMitra - Booking Date & Time Customizer
 * Interactive Calendar, Customizable Time Slots, Vedic Muhurtham Presets,
 * Real-time Booking Summary Sync, and Session Persistence across booking funnel.
 */

(function () {
  'use strict';

  // Format date helper: "25 May 2025, Sunday"
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function formatDateDisplay(d) {
    const day = d.getDate();
    const month = MONTH_NAMES[d.getMonth()];
    const year = d.getFullYear();
    const dayName = DAY_NAMES[d.getDay()];
    return `${day} ${month} ${year}, ${dayName}`;
  }

  function formatTime12(timeStr) {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    let h = parseInt(parts[0], 10);
    const m = parts[1] || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
  }

  // Vedic Muhurtham Presets
  const MUHURTHAM_PRESETS = [
    { name: 'Brahma Muhurtham', start: '05:30', end: '07:30', label: '🌅 Brahma Muhurtham (05:30 AM - 07:30 AM)' },
    { name: 'Pratah Kala', start: '07:30', end: '09:30', label: '☀️ Pratah Kala (07:30 AM - 09:30 AM)' },
    { name: 'Abhijit Muhurtham', start: '11:45', end: '13:15', label: '🕙 Abhijit Muhurtham (11:45 AM - 01:15 PM)' },
    { name: 'Sayankala', start: '17:00', end: '19:00', label: '🌇 Sayankala (05:00 PM - 07:00 PM)' },
    { name: 'Pradosha Kala', start: '19:00', end: '21:00', label: '🌙 Pradosha Kala (07:00 PM - 09:00 PM)' }
  ];

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    initPujaBooking();
    initPurohitBooking();
    syncSubsequentBookingPages();
  });

  // =========================================================================
  // 1. BOOK PUJA FLOW (book-puja.html)
  // =========================================================================
  function initPujaBooking() {
    const calEl = document.querySelector('.cal');
    const slots = document.querySelectorAll('.slot');
    if (!calEl && !slots.length) return;

    // Initial state: default 25 May 2025
    let currentYear = 2025;
    let currentMonth = 4; // May (0-indexed)
    let selectedDate = new Date(2025, 4, 25);
    let selectedTime = '8:00 AM - 10:00 AM';
    let isCustomTime = false;
    let customTimeDetail = '';

    // Check if previously stored in sessionStorage
    const savedDateStr = sessionStorage.getItem('pm_booking_date');
    const savedTimeStr = sessionStorage.getItem('pm_booking_time');
    if (savedDateStr) {
      const parsed = new Date(savedDateStr);
      if (!isNaN(parsed.getTime())) {
        selectedDate = parsed;
        currentYear = parsed.getFullYear();
        currentMonth = parsed.getMonth();
      }
    }
    if (savedTimeStr) {
      selectedTime = savedTimeStr;
    }

    // 1.A Enhance Calendar Header & Controls
    const calContainer = calEl.parentElement;
    if (calContainer) {
      // Replace static month title with interactive nav
      const existingTitle = calContainer.querySelector('b');
      if (existingTitle && !calContainer.querySelector('.cal-header-custom')) {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'cal-header-custom';
        headerDiv.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <button type="button" class="cal-nav-btn" id="calPrevBtn" style="background:#fff3ea;border:1px solid #e8590c;color:#e8590c;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;font-weight:bold;line-height:1;display:inline-flex;align-items:center;justify-content:center;transition:all .2s">‹</button>
            <b id="calMonthTitle" style="font-size:16px;color:#2c1810">${MONTH_NAMES[currentMonth]} ${currentYear}</b>
            <button type="button" class="cal-nav-btn" id="calNextBtn" style="background:#fff3ea;border:1px solid #e8590c;color:#e8590c;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;font-weight:bold;line-height:1;display:inline-flex;align-items:center;justify-content:center;transition:all .2s">›</button>
          </div>
        `;
        existingTitle.parentNode.replaceChild(headerDiv, existingTitle);

        // Bind nav buttons
        const prevBtn = document.getElementById('calPrevBtn');
        const nextBtn = document.getElementById('calNextBtn');
        if (prevBtn) {
          prevBtn.onclick = () => {
            currentMonth--;
            if (currentMonth < 0) {
              currentMonth = 11;
              currentYear--;
            }
            renderCalendar(currentYear, currentMonth);
          };
        }
        if (nextBtn) {
          nextBtn.onclick = () => {
            currentMonth++;
            if (currentMonth > 11) {
              currentMonth = 0;
              currentYear++;
            }
            renderCalendar(currentYear, currentMonth);
          };
        }
      }
    }

    // Calendar render function
    function renderCalendar(year, month) {
      const monthTitle = document.getElementById('calMonthTitle');
      if (monthTitle) {
        monthTitle.textContent = `${MONTH_NAMES[month]} ${year}`;
      }

      if (!calEl) return;
      calEl.innerHTML = '';

      // Day headers Mon -> Sun
      const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      dayHeaders.forEach(dh => {
        const span = document.createElement('span');
        span.className = 'h';
        span.textContent = dh;
        calEl.appendChild(span);
      });

      // First day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
      const firstDay = new Date(year, month, 1);
      let startingDay = firstDay.getDay() - 1; // 0 for Mon, 6 for Sun
      if (startingDay < 0) startingDay = 6;

      // Days in previous month
      const prevMonthLastDate = new Date(year, month, 0).getDate();
      for (let i = startingDay - 1; i >= 0; i--) {
        const span = document.createElement('span');
        span.className = 'x cal-cell-prev';
        span.textContent = prevMonthLastDate - i;
        span.style.cursor = 'default';
        calEl.appendChild(span);
      }

      // Days in current month
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const span = document.createElement('span');
        span.textContent = d;
        span.className = 'day-cell';
        span.style.cursor = 'pointer';
        span.style.transition = 'all .15s ease';
        span.setAttribute('tabindex', '0');
        span.setAttribute('role', 'button');
        span.setAttribute('aria-label', `${d} ${MONTH_NAMES[month]} ${year}`);

        // Check if selected
        if (
          selectedDate &&
          selectedDate.getFullYear() === year &&
          selectedDate.getMonth() === month &&
          selectedDate.getDate() === d
        ) {
          span.classList.add('d');
        }

        span.onclick = () => {
          selectedDate = new Date(year, month, d);
          calEl.querySelectorAll('.day-cell').forEach(c => c.classList.remove('d'));
          span.classList.add('d');
          updateBookingSummary();
        };

        span.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            span.click();
          }
        };

        calEl.appendChild(span);
      }

      // Trailing days for neat grid
      const totalRendered = startingDay + daysInMonth;
      const nextDays = (7 - (totalRendered % 7)) % 7;
      for (let n = 1; n <= nextDays; n++) {
        const span = document.createElement('span');
        span.className = 'x cal-cell-next';
        span.textContent = n;
        span.style.cursor = 'default';
        calEl.appendChild(span);
      }
    }

    // Initial calendar render
    renderCalendar(currentYear, currentMonth);

    // 1.B Enhance Time Slots & Add "Other (Custom Time)" Customizer
    const slotsContainer = slots[0]?.parentElement;
    if (slotsContainer) {
      // Build the Custom Time Customizer Box if not already injected
      let customBox = document.getElementById('customTimeBox');
      if (!customBox) {
        customBox = document.createElement('div');
        customBox.id = 'customTimeBox';
        customBox.style.display = 'none';
        customBox.style.background = '#fff8f3';
        customBox.style.border = '1px solid #ffd8a8';
        customBox.style.borderRadius = '8px';
        customBox.style.padding = '14px';
        customBox.style.marginTop = '10px';
        customBox.style.marginBottom = '12px';
        customBox.innerHTML = `
          <div style="font-weight:600;color:#c92a2a;font-size:13px;margin-bottom:8px;display:flex;align-items:center;gap:6px">
            <span>⚙️</span> Customize Puja Muhurtham / Timing
          </div>
          <p style="font-size:12px;color:#555;margin-bottom:10px;line-height:1.4">
            Select an auspicious Vedic Muhurtham below or set your custom preferred time recommended by your family astrologer / Purohit.
          </p>

          <!-- Quick Muhurtham Chips -->
          <div style="font-size:11px;font-weight:600;color:#777;text-transform:uppercase;margin-bottom:6px">Auspicious Vedic Muhurtham Presets</div>
          <div id="muhurthamChips" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
            ${MUHURTHAM_PRESETS.map((m, idx) => `
              <button type="button" class="muhurtham-chip" data-idx="${idx}" style="background:#fff;border:1px solid #ffd8a8;border-radius:16px;padding:5px 10px;font-size:12px;cursor:pointer;color:#333;transition:all .15s">
                ${m.label}
              </button>
            `).join('')}
          </div>

          <!-- Time Inputs -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div>
              <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;color:#333">Start Time</label>
              <input type="time" id="custStartTime" value="06:30" style="width:100%;padding:8px 10px;border:1px solid #ced4da;border-radius:6px;font-size:13px;box-sizing:border-box">
            </div>
            <div>
              <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;color:#333">End Time</label>
              <input type="time" id="custEndTime" value="09:30" style="width:100%;padding:8px 10px;border:1px solid #ced4da;border-radius:6px;font-size:13px;box-sizing:border-box">
            </div>
          </div>

          <!-- Custom Astrologer Note -->
          <div style="margin-bottom:12px">
            <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;color:#333">Astrologer / Muhurtham Note (Optional)</label>
            <input type="text" id="custMuhurthamNote" placeholder="e.g. As determined by family astrologer (Gotra Sankalpa at 6:45 AM)" style="width:100%;padding:8px 10px;border:1px solid #ced4da;border-radius:6px;font-size:12px;box-sizing:border-box">
          </div>

          <!-- Apply Button -->
          <div style="display:flex;align-items:center;justify-content:space-between">
            <span id="custTimeSummary" style="font-size:12px;color:#e8590c;font-weight:600">Selected: 06:30 AM - 09:30 AM</span>
            <button type="button" id="applyCustomTimeBtn" class="btn p" style="padding:6px 16px;font-size:12px;cursor:pointer;background:#e8590c;color:#fff;border:none;border-radius:6px;font-weight:600">
              ✓ Set This Custom Time
            </button>
          </div>
        `;
        slotsContainer.appendChild(customBox);

        // Bind Custom Time Events
        const startInput = document.getElementById('custStartTime');
        const endInput = document.getElementById('custEndTime');
        const noteInput = document.getElementById('custMuhurthamNote');
        const sumLabel = document.getElementById('custTimeSummary');
        const applyBtn = document.getElementById('applyCustomTimeBtn');

        function updateCustomSummaryText() {
          const s = formatTime12(startInput.value);
          const e = formatTime12(endInput.value);
          if (sumLabel) {
            sumLabel.textContent = `Selected: ${s} - ${e}`;
          }
        }

        if (startInput) startInput.onchange = updateCustomSummaryText;
        if (endInput) endInput.onchange = updateCustomSummaryText;

        // Muhurtham Chip Clicks
        const chips = customBox.querySelectorAll('.muhurtham-chip');
        chips.forEach(chip => {
          chip.onclick = () => {
            chips.forEach(c => {
              c.style.background = '#fff';
              c.style.borderColor = '#ffd8a8';
              c.style.color = '#333';
            });
            chip.style.background = '#e8590c';
            chip.style.borderColor = '#e8590c';
            chip.style.color = '#fff';

            const idx = parseInt(chip.dataset.idx, 10);
            const m = MUHURTHAM_PRESETS[idx];
            if (m) {
              startInput.value = m.start;
              endInput.value = m.end;
              noteInput.value = m.name + ' (Vedic Muhurtham)';
              updateCustomSummaryText();
            }
          };
        });

        // Apply Custom Time Button
        if (applyBtn) {
          applyBtn.onclick = () => {
            const s = formatTime12(startInput.value);
            const e = formatTime12(endInput.value);
            const note = noteInput.value.trim();
            isCustomTime = true;
            selectedTime = `${s} - ${e} (Custom Muhurtham)`;
            customTimeDetail = note ? `Note: ${note}` : '';

            // Update custom slot text
            const customSlot = Array.from(slots).find(sl => sl.textContent.includes('Other (Custom Time)') || sl.textContent.includes('Custom:'));
            if (customSlot) {
              customSlot.innerHTML = `✓ Custom: ${s} - ${e} <small style="display:block;color:var(--o);font-size:11px">${note || 'Auspicious Custom Time'}</small>`;
              customSlot.classList.add('on');
            }

            updateBookingSummary();
            showCustomToast(`Custom Puja Timing set to ${s} - ${e}`);
          };
        }
      }

      // Slot Click Handlers
      slots.forEach(slot => {
        slot.style.cursor = 'pointer';
        slot.onclick = () => {
          slots.forEach(s => s.classList.remove('on'));
          slot.classList.add('on');

          const isOther = slot.textContent.includes('Other (Custom Time)') || slot.textContent.includes('Custom:');
          if (isOther) {
            isCustomTime = true;
            customBox.style.display = 'block';
            customBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            // Update time if custom button already clicked, or trigger apply
            const startInput = document.getElementById('custStartTime');
            const endInput = document.getElementById('custEndTime');
            if (startInput && endInput) {
              const s = formatTime12(startInput.value);
              const e = formatTime12(endInput.value);
              selectedTime = `${s} - ${e} (Custom Muhurtham)`;
            }
          } else {
            isCustomTime = false;
            customBox.style.display = 'none';
            selectedTime = slot.textContent.trim();
          }

          updateBookingSummary();
        };
      });
    }

    // 1.C Real-time Booking Summary Sync
    function updateBookingSummary() {
      const dateDisplay = formatDateDisplay(selectedDate);
      const dateEl = document.getElementById('bkSummaryDate');
      const timeEl = document.getElementById('bkSummaryTime');
      if (dateEl) {
        dateEl.textContent = dateDisplay;
        dateEl.style.color = '#e8590c';
        dateEl.style.fontWeight = '600';
      }
      if (timeEl) {
        timeEl.textContent = selectedTime;
        timeEl.style.color = '#e8590c';
        timeEl.style.fontWeight = '600';
      }

      // Find Summary elements
      const summaryCards = document.querySelectorAll('.card');
      summaryCards.forEach(card => {
        const title = card.querySelector('h3');
        if (title && title.textContent.includes('Booking Summary')) {
          const kvs = card.querySelectorAll('.kv');
          kvs.forEach(kv => {
            const labelSpan = kv.children[0];
            const valueSpan = kv.children[1];
            if (!labelSpan || !valueSpan) return;

            const lbl = labelSpan.textContent.trim();
            if (lbl === 'Date') {
              valueSpan.textContent = dateDisplay;
              valueSpan.style.color = '#e8590c';
              valueSpan.style.fontWeight = '600';
            } else if (lbl === 'Time') {
              valueSpan.textContent = selectedTime;
              valueSpan.style.color = '#e8590c';
              valueSpan.style.fontWeight = '600';
            }
          });
        }
      });

      // Persist in sessionStorage
      sessionStorage.setItem('pm_booking_date', dateDisplay);
      sessionStorage.setItem('pm_booking_time', selectedTime);
      if (customTimeDetail) {
        sessionStorage.setItem('pm_booking_custom_notes', customTimeDetail);
      }
    }

    // Trigger initial summary sync
    updateBookingSummary();

    // 1.D Interactive Location & Members
    const locationRadios = document.querySelectorAll('input[name="loc_type"], .card p');
    locationRadios.forEach(p => {
      if (p.textContent.includes('◉ At Home') || p.textContent.includes('At Temple')) {
        p.style.cursor = 'pointer';
      }
    });

    const incBtn = document.querySelector('.btn-inc');
    const decBtn = document.querySelector('.btn-dec');
    const countVal = document.querySelector('.count-val');
    if (incBtn && decBtn && countVal) {
      let count = parseInt(countVal.textContent, 10) || 5;
      incBtn.onclick = () => {
        count++;
        countVal.textContent = count;
        sessionStorage.setItem('pm_booking_members', count + ' Members');
      };
      decBtn.onclick = () => {
        if (count > 1) {
          count--;
          countVal.textContent = count;
          sessionStorage.setItem('pm_booking_members', count + ' Members');
        }
      };
    }
  }

  // =========================================================================
  // 2. DIRECT PUROHIT BOOKING FLOW (book-purohit.html)
  // =========================================================================
  function initPurohitBooking() {
    const timeSelect = document.getElementById('pujaTime');
    const dateInput = document.querySelector('.f .in');
    if (!timeSelect) return;

    // Check if "Other (Custom Time)" option exists in dropdown
    let hasCustomOption = false;
    Array.from(timeSelect.options).forEach(opt => {
      if (opt.value === 'custom') hasCustomOption = true;
    });

    if (!hasCustomOption) {
      const customOpt = document.createElement('option');
      customOpt.value = 'custom';
      customOpt.textContent = '⚙️ Other (Custom Time)...';
      timeSelect.appendChild(customOpt);
    }

    // Build custom modal or inline time builder for Purohit booking
    let customBox = document.getElementById('purohitCustomTimeBox');
    if (!customBox && timeSelect.parentElement) {
      customBox = document.createElement('div');
      customBox.id = 'purohitCustomTimeBox';
      customBox.style.display = 'none';
      customBox.style.background = '#fff8f3';
      customBox.style.border = '1px solid #ffd8a8';
      customBox.style.borderRadius = '8px';
      customBox.style.padding = '12px';
      customBox.style.marginTop = '10px';
      customBox.innerHTML = `
        <div style="font-weight:600;color:#c92a2a;font-size:12px;margin-bottom:6px">⚙️ Custom Puja Time</div>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
          <input type="time" id="phCustStart" value="06:30" style="padding:6px;border:1px solid #ccc;border-radius:4px;font-size:12px">
          <span>to</span>
          <input type="time" id="phCustEnd" value="09:30" style="padding:6px;border:1px solid #ccc;border-radius:4px;font-size:12px">
          <button type="button" id="phCustApply" class="btn p" style="padding:6px 12px;font-size:12px;border:none;background:#e8590c;color:#fff;border-radius:4px;cursor:pointer">Apply</button>
        </div>
      `;
      timeSelect.parentElement.appendChild(customBox);

      const phCustApply = document.getElementById('phCustApply');
      if (phCustApply) {
        phCustApply.onclick = () => {
          const s = formatTime12(document.getElementById('phCustStart').value);
          const e = formatTime12(document.getElementById('phCustEnd').value);
          const customOpt = Array.from(timeSelect.options).find(o => o.value === 'custom');
          if (customOpt) {
            customOpt.textContent = `✓ Custom: ${s} - ${e}`;
            timeSelect.value = 'custom';
          }
          sessionStorage.setItem('pm_booking_time', `${s} - ${e} (Custom Muhurtham)`);
          showCustomToast(`Custom Time set: ${s} - ${e}`);
        };
      }
    }

    timeSelect.onchange = () => {
      if (timeSelect.value === 'custom') {
        if (customBox) customBox.style.display = 'block';
      } else {
        if (customBox) customBox.style.display = 'none';
        const optText = timeSelect.options[timeSelect.selectedIndex]?.text || '';
        sessionStorage.setItem('pm_booking_time', optText);
      }
    };
  }

  // =========================================================================
  // 3. SYNC SUBSEQUENT PAGES (choose-purohit, review, payment)
  // =========================================================================
  function syncSubsequentBookingPages() {
    const savedDate = sessionStorage.getItem('pm_booking_date');
    const savedTime = sessionStorage.getItem('pm_booking_time');
    if (!savedDate && !savedTime) return;

    // In Booking Summary .kv items
    const kvs = document.querySelectorAll('.kv');
    kvs.forEach(kv => {
      const labelSpan = kv.children[0];
      const valueSpan = kv.children[1];
      if (!labelSpan || !valueSpan) return;

      const lbl = labelSpan.textContent.trim();
      if (lbl === 'Date' && savedDate) {
        valueSpan.textContent = savedDate;
        valueSpan.style.color = '#e8590c';
        valueSpan.style.fontWeight = '600';
      } else if (lbl === 'Time' && savedTime) {
        valueSpan.textContent = savedTime;
        valueSpan.style.color = '#e8590c';
        valueSpan.style.fontWeight = '600';
      }
    });

    // In Review booking grid items (e.g. review-booking.html)
    const gridCols = document.querySelectorAll('.grid > div');
    gridCols.forEach(col => {
      const spanMu = col.querySelector('.mu');
      if (spanMu) {
        const txt = spanMu.textContent.trim();
        if (txt === 'Date' && savedDate) {
          col.innerHTML = `<span class="mu">Date</span><br><b style="color:#e8590c">${savedDate}</b>`;
        } else if (txt === 'Time' && savedTime) {
          col.innerHTML = `<span class="mu">Time</span><br><b style="color:#e8590c">${savedTime}</b>`;
        }
      }
    });
  }

  // Toast feedback helper
  function showCustomToast(msg) {
    let t = document.getElementById('pm-booking-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'pm-booking-toast';
      t.style.position = 'fixed';
      t.style.bottom = '24px';
      t.style.right = '24px';
      t.style.background = '#2c1810';
      t.style.color = '#fff';
      t.style.padding = '12px 20px';
      t.style.borderRadius = '8px';
      t.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
      t.style.zIndex = '99999';
      t.style.fontSize = '14px';
      t.style.fontWeight = '500';
      t.style.display = 'flex';
      t.style.alignItems = 'center';
      t.style.gap = '8px';
      t.style.transition = 'opacity .3s ease, transform .3s ease';
      document.body.appendChild(t);
    }
    t.innerHTML = `<span>🪔</span><span>${msg}</span>`;
    t.style.opacity = '1';
    t.style.transform = 'translateY(0)';
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(10px)';
    }, 3000);
  }

  window.PM_BookingCustomizer = {
    formatDateDisplay,
    formatTime12,
    MUHURTHAM_PRESETS
  };
})();
