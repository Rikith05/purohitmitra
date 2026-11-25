// ============================================================================
// PurohitMitra — Interactive Map & Geolocation Picker (Dynamic, Zero-Static)
// ============================================================================
(function () {
  const CITY_DATA = {
    'Hyderabad': {
      lat: 17.4435, lng: 78.3772, state: 'Telangana', pincode: '500081',
      areas: [
        { name: 'Hitech City', lat: 17.4435, lng: 78.3772, pin: '500081', addr: 'Cyber Towers Road, Hitech City, Hyderabad' },
        { name: 'Jubilee Hills', lat: 17.4326, lng: 78.4071, pin: '500033', addr: 'Road No. 36, Jubilee Hills, Hyderabad' },
        { name: 'Banjara Hills', lat: 17.4156, lng: 78.4347, pin: '500034', addr: 'Road No. 12, Banjara Hills, Hyderabad' },
        { name: 'Gachibowli', lat: 17.4401, lng: 78.3489, pin: '500032', addr: 'Financial District Rd, Gachibowli, Hyderabad' },
        { name: 'Madhapur', lat: 17.4486, lng: 78.3908, pin: '500081', addr: 'Ayyappa Society, Madhapur, Hyderabad' },
        { name: 'Secunderabad', lat: 17.4399, lng: 78.4983, pin: '500003', addr: 'SD Road, Secunderabad, Hyderabad' }
      ]
    },
    'Bengaluru': {
      lat: 12.9716, lng: 77.5946, state: 'Karnataka', pincode: '560001',
      areas: [
        { name: 'Indiranagar', lat: 12.9784, lng: 77.6408, pin: '560038', addr: '100 Feet Road, Indiranagar, Bengaluru' },
        { name: 'Koramangala', lat: 12.9352, lng: 77.6245, pin: '560034', addr: '80 Feet Road, Koramangala, Bengaluru' },
        { name: 'Jayanagar', lat: 12.9250, lng: 77.5938, pin: '560041', addr: '4th Block, Jayanagar, Bengaluru' },
        { name: 'Whitefield', lat: 12.9698, lng: 77.7500, pin: '560066', addr: 'ITPL Main Rd, Whitefield, Bengaluru' }
      ]
    },
    'Chennai': {
      lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu', pincode: '600001',
      areas: [
        { name: 'Mylapore', lat: 13.0368, lng: 80.2676, pin: '600004', addr: 'Kapaleeshwarar Sannadhi St, Mylapore, Chennai' },
        { name: 'T. Nagar', lat: 13.0418, lng: 80.2341, pin: '600017', addr: 'Usman Road, T. Nagar, Chennai' },
        { name: 'Adyar', lat: 13.0012, lng: 80.2565, pin: '600020', addr: 'LB Road, Adyar, Chennai' }
      ]
    },
    'Mumbai': {
      lat: 19.0760, lng: 72.8777, state: 'Maharashtra', pincode: '400001',
      areas: [
        { name: 'Bandra West', lat: 19.0596, lng: 72.8295, pin: '400050', addr: 'Linking Road, Bandra West, Mumbai' },
        { name: 'Andheri West', lat: 19.1136, lng: 72.8697, pin: '400053', addr: 'Veera Desai Rd, Andheri West, Mumbai' },
        { name: 'Dadar', lat: 19.0178, lng: 72.8478, pin: '400028', addr: 'Shivaji Park, Dadar, Mumbai' }
      ]
    },
    'Delhi NCR': {
      lat: 28.6139, lng: 77.2090, state: 'Delhi', pincode: '110001',
      areas: [
        { name: 'Connaught Place', lat: 28.6315, lng: 77.2167, pin: '110001', addr: 'Outer Circle, Connaught Place, New Delhi' },
        { name: 'South Extension', lat: 28.5679, lng: 77.2226, pin: '110049', addr: 'Ring Road, South Extension, New Delhi' },
        { name: 'Gurugram DLF', lat: 28.4950, lng: 77.0895, pin: '122002', addr: 'DLF Cyber City, Gurugram, Delhi NCR' }
      ]
    },
    'Pune': {
      lat: 18.5204, lng: 73.8567, state: 'Maharashtra', pincode: '411001',
      areas: [
        { name: 'Kothrud', lat: 18.5074, lng: 73.8077, pin: '411038', addr: 'Paud Road, Kothrud, Pune' },
        { name: 'Baner', lat: 18.5590, lng: 73.7868, pin: '411045', addr: 'Baner Road, Baner, Pune' }
      ]
    },
    'Visakhapatnam': {
      lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh', pincode: '530001',
      areas: [
        { name: 'MVP Colony', lat: 17.7413, lng: 83.3340, pin: '530017', addr: 'Sector 4, MVP Colony, Visakhapatnam' },
        { name: 'Beach Road', lat: 17.7143, lng: 83.3235, pin: '530002', addr: 'RK Beach Road, Visakhapatnam' }
      ]
    },
    'Vijayawada': {
      lat: 16.5062, lng: 80.6480, state: 'Andhra Pradesh', pincode: '520001',
      areas: [
        { name: 'Benz Circle', lat: 16.4998, lng: 80.6561, pin: '520010', addr: 'MG Road, Benz Circle, Vijayawada' },
        { name: 'Indrakeeladri', lat: 16.5150, lng: 80.6061, pin: '520001', addr: 'Temple Road, Indrakeeladri, Vijayawada' }
      ]
    }
  };

  let activeCallback = null;
  let currentSelection = {
    city: localStorage.getItem('pm_location') || 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    address: 'Plot 123, Sai Residency, Hitech City, Hyderabad',
    lat: 17.4435,
    lng: 78.3772
  };

  function buildOsmIframeUrl(lat, lng) {
    const d = 0.015;
    const bbox = `${(lng - d).toFixed(5)},${(lat - d).toFixed(5)},${(lng + d).toFixed(5)},${(lat + d).toFixed(5)}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(5)},${lng.toFixed(5)}`;
  }

  function injectMapStyles() {
    if (document.getElementById('pmMapStyles')) return;
    const st = document.createElement('style');
    st.id = 'pmMapStyles';
    st.textContent = `
      .pm-map-overlay {
        position: fixed; inset: 0; background: rgba(28, 20, 14, 0.58);
        backdrop-filter: blur(4px); z-index: 100000;
        display: none; align-items: center; justify-content: center; padding: 16px;
      }
      .pm-map-overlay.open { display: flex; }
      .pm-map-modal {
        background: #fff; border-radius: 16px; max-width: 720px; width: 100%;
        border: 1px solid #fed7aa; box-shadow: 0 24px 64px rgba(0,0,0,0.22);
        overflow: hidden; animation: pmMapIn 0.2s ease;
      }
      @keyframes pmMapIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      .pm-map-head {
        display: flex; align-items: center; justify-content: space-between;
        padding: 16px 22px; background: #fffaf5; border-bottom: 1px solid #fed7aa;
      }
      .pm-map-head h3 { margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 20px; color: #1c140e; }
      .pm-map-close {
        background: #fff; border: 1px solid #fed7aa; border-radius: 8px;
        width: 32px; height: 32px; cursor: pointer; font-size: 16px; color: #78716c;
      }
      .pm-map-body { padding: 18px 22px; }
      .pm-map-controls { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
      .pm-map-controls input, .pm-map-controls select {
        border: 1px solid #e7e5e4; border-radius: 8px; padding: 9px 12px; font-size: 13px;
      }
      .pm-map-areas { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
      .pm-area-chip {
        padding: 5px 11px; border-radius: 999px; border: 1px solid #fed7aa;
        background: #fffaf5; color: #2c1810; font-size: 12px; font-weight: 500;
        cursor: pointer; transition: all 0.15s;
      }
      .pm-area-chip.on, .pm-area-chip:hover {
        background: #ea580c; color: #fff; border-color: #ea580c;
      }
      .pm-map-frame-wrap {
        position: relative; width: 100%; height: 270px; border-radius: 12px;
        overflow: hidden; border: 1px solid #fed7aa; background: #f8f4ef;
      }
      .pm-map-frame-wrap iframe { width: 100%; height: 100%; border: 0; }
      .pm-map-coords {
        margin-top: 10px; padding: 10px 14px; border-radius: 8px;
        background: #fffaf5; border: 1px solid #fed7aa; font-size: 12.5px; color: #44372e;
        display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;
      }
      .pm-map-foot {
        padding: 14px 22px; border-top: 1px solid #efe3d6; background: #fff;
        display: flex; justify-content: flex-end; gap: 10px;
      }
    `;
    document.head.appendChild(st);
  }

  function ensureMapModal() {
    injectMapStyles();
    if (document.getElementById('pmMapOverlay')) return;
    const div = document.createElement('div');
    div.id = 'pmMapOverlay';
    div.className = 'pm-map-overlay';
    div.innerHTML = `
      <div class="pm-map-modal" role="dialog" aria-modal="true" aria-label="Select Location on Map">
        <div class="pm-map-head">
          <h3>📍 Select Puja Location on Map</h3>
          <button type="button" class="pm-map-close" id="pmMapCloseBtn" aria-label="Close">✕</button>
        </div>
        <div class="pm-map-body">
          <div class="pm-map-controls">
            <select id="pmMapCitySelect" style="min-width:140px;font-weight:600">
              ${Object.keys(CITY_DATA).map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
            <input type="text" id="pmMapSearchInput" placeholder="Search landmark, street or area..." style="flex:1;min-width:180px" />
            <button type="button" id="pmMapGpsBtn" class="btn s mo" style="white-space:nowrap;cursor:pointer">🎯 Use My GPS</button>
          </div>
          <div class="pm-map-areas" id="pmMapAreas"></div>
          <div class="pm-map-frame-wrap">
            <iframe id="pmMapIframe" title="Interactive Puja Location Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
          <div class="pm-map-coords">
            <span id="pmMapSelectedText">📍 Loading map...</span>
            <span id="pmMapLatLng" style="color:#78716c;font-family:monospace;font-size:11.5px"></span>
          </div>
        </div>
        <div class="pm-map-foot">
          <button type="button" class="btn mo" id="pmMapCancelBtn" style="cursor:pointer">Cancel</button>
          <button type="button" class="btn p" id="pmMapConfirmBtn" style="border:none;cursor:pointer">Confirm Map Location</button>
        </div>
      </div>
    `;
    document.body.appendChild(div);

    const citySel = document.getElementById('pmMapCitySelect');
    const searchIn = document.getElementById('pmMapSearchInput');
    const gpsBtn = document.getElementById('pmMapGpsBtn');
    const closeBtn = document.getElementById('pmMapCloseBtn');
    const cancelBtn = document.getElementById('pmMapCancelBtn');
    const confirmBtn = document.getElementById('pmMapConfirmBtn');

    function renderCityAreas(cityName) {
      const info = CITY_DATA[cityName] || CITY_DATA['Hyderabad'];
      const areasEl = document.getElementById('pmMapAreas');
      areasEl.innerHTML = info.areas.map((a, idx) =>
        `<button type="button" class="pm-area-chip ${idx === 0 ? 'on' : ''}" data-idx="${idx}">${a.name}</button>`
      ).join('');
      areasEl.querySelectorAll('.pm-area-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          areasEl.querySelectorAll('.pm-area-chip').forEach(b => b.classList.remove('on'));
          btn.classList.add('on');
          const area = info.areas[parseInt(btn.dataset.idx, 10)];
          updatePreview(cityName, info.state, area.pin, area.addr, area.lat, area.lng);
        });
      });
      const first = info.areas[0];
      updatePreview(cityName, info.state, first.pin, first.addr, first.lat, first.lng);
    }

    function updatePreview(city, state, pin, addr, lat, lng) {
      currentSelection = { city, state, pincode: pin, address: addr, lat, lng };
      document.getElementById('pmMapIframe').src = buildOsmIframeUrl(lat, lng);
      document.getElementById('pmMapSelectedText').innerHTML = `<b>Selected:</b> ${addr} (${pin})`;
      document.getElementById('pmMapLatLng').textContent = `GPS: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
    }

    citySel.addEventListener('change', () => renderCityAreas(citySel.value));

    searchIn.addEventListener('input', () => {
      const val = searchIn.value.trim();
      if (!val) return;
      const info = CITY_DATA[citySel.value] || CITY_DATA['Hyderabad'];
      currentSelection.address = `${val}, ${citySel.value}`;
      document.getElementById('pmMapSelectedText').innerHTML = `<b>Selected:</b> ${currentSelection.address} (${currentSelection.pincode})`;
    });

    gpsBtn.addEventListener('click', () => {
      window.pmDetectCurrentLocation((loc) => {
        if (CITY_DATA[loc.city]) {
          citySel.value = loc.city;
        }
        updatePreview(loc.city, loc.state, loc.pincode, loc.address, loc.lat, loc.lng);
      });
    });

    const closeModal = () => div.classList.remove('open');
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    div.addEventListener('click', (e) => { if (e.target === div) closeModal(); });

    confirmBtn.addEventListener('click', () => {
      closeModal();
      if (typeof activeCallback === 'function') {
        activeCallback({ ...currentSelection });
      }
      if (typeof window.pmToast === 'function') {
        window.pmToast(`📍 Location set: ${currentSelection.address}`);
      }
    });

    renderCityAreas(currentSelection.city in CITY_DATA ? currentSelection.city : 'Hyderabad');
  }

  window.pmOpenMapPicker = function (initialCity, callback) {
    ensureMapModal();
    activeCallback = callback;
    const citySel = document.getElementById('pmMapCitySelect');
    const targetCity = (initialCity && CITY_DATA[initialCity]) ? initialCity : (localStorage.getItem('pm_location') || 'Hyderabad');
    if (citySel && CITY_DATA[targetCity]) {
      citySel.value = targetCity;
      citySel.dispatchEvent(new Event('change'));
    }
    document.getElementById('pmMapOverlay').classList.add('open');
  };

  window.pmDetectCurrentLocation = function (callback) {
    const fallbackCity = localStorage.getItem('pm_location') || 'Hyderabad';
    const info = CITY_DATA[fallbackCity] || CITY_DATA['Hyderabad'];
    const fallbackArea = info.areas[0];

    const applyFallback = (lat, lng, note) => {
      const res = {
        city: fallbackCity,
        state: info.state,
        pincode: fallbackArea.pin,
        address: fallbackArea.addr,
        lat: lat || fallbackArea.lat,
        lng: lng || fallbackArea.lng
      };
      if (typeof window.pmToast === 'function' && note) window.pmToast(note);
      if (typeof callback === 'function') callback(res);
    };

    if (!navigator.geolocation) {
      applyFallback(null, null, `📍 Using ${fallbackCity} area coordinates`);
      return;
    }

    if (typeof window.pmToast === 'function') window.pmToast('🎯 Detecting your current GPS location...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await resp.json();
          const addr = data.address || {};
          const city = addr.city || addr.town || addr.state_district || fallbackCity;
          const state = addr.state || info.state;
          const pincode = addr.postcode || fallbackArea.pin;
          const display = [addr.house_number, addr.road, addr.suburb || addr.neighbourhood, city].filter(Boolean).join(', ') || data.display_name || fallbackArea.addr;
          if (typeof callback === 'function') {
            callback({ city, state, pincode, address: display, lat, lng });
          }
          if (typeof window.pmToast === 'function') window.pmToast(`✓ GPS Location detected: ${city}`);
        } catch (e) {
          applyFallback(lat, lng, `✓ GPS Coordinates captured (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
        }
      },
      () => {
        applyFallback(null, null, `📍 GPS permission unavailable; selected ${fallbackArea.name}, ${fallbackCity}`);
      },
      { timeout: 6000 }
    );
  };

  window.PM_CITY_DATA = CITY_DATA;
})();
