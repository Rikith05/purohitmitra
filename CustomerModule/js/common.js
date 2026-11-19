/**
 * Shared helpers, sample data (PM object) and common UI behaviour: sidebar toggle, toast, modal, tabs.
 * Vanilla JS, no frameworks.
 */

const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ----- Sample data (integrated with real asset paths and honoring exact schema) -----
const PM = {
  bookings: [
    {
      id: "PM25051510023",
      puja: "Satyanarayana Puja",
      purohit: "Pandit Narayan Shastri",
      purohitImg: "images/purohit_narayan.jpg",
      img: "images/puja_satyanarayana.jpg",
      date: "15 May 2025, Thu",
      time: "10:00 AM - 01:00 PM",
      addr: "H.No. 12-3-456, Lakshmi Nagar, Manikonda, Hyderabad",
      amt: 2100,
      pay: "Paid",
      status: "Confirmed",
      days: 2,
      tab: "upcoming",
      icon: "🪔",
    },
    {
      id: "PM25052510045",
      puja: "Griha Pravesh Puja",
      purohit: "Sri Venkatesh Dikshith",
      purohitImg: "images/purohit_venkatesh.jpg",
      img: "images/puja_griha_pravesh.jpg",
      date: "25 May 2025, Sun",
      time: "09:30 AM - 12:30 PM",
      addr: "H.No. 8-2-100/2, Jubilee Hills, Hyderabad",
      amt: 3500,
      pay: "Paid",
      status: "Confirmed",
      days: 12,
      tab: "upcoming",
      icon: "🏠",
    },
    {
      id: "PM25060510078",
      puja: "Homam / Havan",
      purohit: "Acharya Madhusudan",
      purohitImg: "images/purohit_madhusudan.jpg",
      img: "images/puja_homam.jpg",
      date: "05 Jun 2025, Thu",
      time: "06:00 AM - 08:00 AM",
      addr: "H.No. 10-1-22, Chandanagar, Hyderabad",
      amt: 2500,
      pay: "Partial",
      status: "Payment Pending",
      days: 21,
      tab: "upcoming",
      icon: "🔥",
    },
    {
      id: "PM25041009886",
      puja: "Griha Pravesh Puja",
      purohit: "Pandit Raghav Sharma",
      purohitImg: "images/purohit_raghav.jpg",
      img: "images/puja_griha_pravesh.jpg",
      date: "10 Apr 2025, Thu",
      time: "08:00 AM - 11:00 AM",
      addr: "H.No. 12-3-456, Lakshmi Nagar, Manikonda, Hyderabad",
      amt: 3000,
      pay: "Paid",
      status: "Completed",
      days: 0,
      tab: "completed",
      icon: "🏠",
    },
    {
      id: "PM24082707766",
      puja: "Ganesh Puja",
      purohit: "Pandit Suresh Shastri",
      purohitImg: "images/purohit_somashekar.jpg",
      img: "images/puja_ganesh.jpg",
      date: "27 Aug 2024, Tue",
      time: "08:00 AM - 10:00 AM",
      addr: "H.No. 8-2-100/3, Banjara Hills, Hyderabad",
      amt: 1500,
      pay: "Paid",
      status: "Completed",
      days: 0,
      tab: "completed",
      icon: "🐘",
    },
    {
      id: "PM25041800321",
      puja: "Griha Pravesh Puja",
      purohit: "Sri Venkatesh Dikshith",
      purohitImg: "images/purohit_venkatesh.jpg",
      img: "images/puja_griha_pravesh.jpg",
      date: "20 Apr 2025, Sun",
      time: "09:00 AM - 12:00 PM",
      addr: "Plot No. 45, Kukatpally, Hyderabad",
      amt: 1800,
      pay: "Refunded",
      status: "Cancelled",
      days: 0,
      tab: "cancelled",
      icon: "🏠",
    },
  ],
  payments: [
    {
      tid: "UPI512345678901",
      puja: "Satyanarayana Puja",
      sub: "Pandit Narayan Shastri · 15 May 2025",
      when: "12 May 2025, 11:20 AM",
      method: "UPI (GPay)",
      amt: 2100,
      status: "Success",
    },
    {
      tid: "TXN512345678902",
      puja: "Griha Pravesh Puja",
      sub: "Sri Venkatesh Dikshith · 25 May 2025",
      when: "20 May 2025, 10:15 AM",
      method: "UPI (PhonePe)",
      amt: 3500,
      status: "Success",
    },
    {
      tid: "TXN512345678903",
      puja: "Homam / Havan",
      sub: "Acharya Madhusudan · 05 Jun 2025",
      when: "25 May 2025, 07:45 PM",
      method: "Credit Card (VISA 4242)",
      amt: 2500,
      status: "Success",
    },
    {
      tid: "TXN512345678904",
      puja: "Ganesh Puja",
      sub: "Pandit Raghav Sharma · 10 Jun 2025",
      when: "08 Jun 2025, 09:10 AM",
      method: "UPI (Paytm)",
      amt: 1500,
      status: "Pending",
    },
    {
      tid: "RFN512345678905",
      puja: "Griha Pravesh Puja (Refund)",
      sub: "Cancelled on 18 Apr 2025",
      when: "19 Apr 2025, 02:30 PM",
      method: "UPI (GPay)",
      amt: 1800,
      status: "Refunded",
    },
  ],
  offers: [
    {
      t: "Flat 10% OFF on All Pujas",
      d: "Get 10% off on all puja bookings.",
      code: "PUJA10",
      till: "31 May 2025",
      min: 1000,
      s: "active",
      i: "％",
    },
    {
      t: "New User Offer – Flat ₹200 OFF",
      d: "Flat ₹200 OFF on your first puja booking.",
      code: "WELCOME200",
      till: "15 Jun 2025",
      min: 1500,
      s: "active",
      i: "🎁",
    },
    {
      t: "Festival Special – 15% OFF",
      d: "Celebrate festivals with 15% OFF on all bookings.",
      code: "FESTIVAL15",
      till: "30 Jun 2025",
      min: 2000,
      s: "active",
      i: "🪔",
    },
    {
      t: "Refer & Earn – ₹300 OFF",
      d: "Refer a friend and get ₹300 OFF on your next booking.",
      code: "REFER300",
      till: "30 Jun 2025",
      min: 1500,
      s: "active",
      i: "👥",
    },
    {
      t: "Summer Special Offer",
      d: "Flat 12% OFF on selected pujas.",
      code: "SUMMER12",
      till: "Starts 01 Jun 2025",
      min: 0,
      s: "upcoming",
      i: "🏡",
    },
    {
      t: "Ashadha Month Offer",
      d: "Special discounts on puja bookings.",
      code: "ASHADHA",
      till: "Starts 10 Jun 2025",
      min: 0,
      s: "upcoming",
      i: "🪔",
    },
  ],
  purohits: [
    {
      n: "Pandit Narayan Shastri",
      r: 4.9,
      rv: 128,
      exp: 15,
      lang: "Telugu, Sanskrit, Hindi",
      km: 2.5,
      e: "🧔",
      img: "images/purohit_narayan.jpg",
    },
    {
      n: "Sri Venkatesh Dikshith",
      r: 4.8,
      rv: 96,
      exp: 20,
      lang: "Telugu, Tamil, Sanskrit",
      km: 3.1,
      e: "👴",
      img: "images/purohit_venkatesh.jpg",
    },
    {
      n: "Pandit Raghav Sharma",
      r: 4.7,
      rv: 74,
      exp: 12,
      lang: "Hindi, Sanskrit, Kannada",
      km: 3.8,
      e: "🧑",
      img: "images/purohit_raghav.jpg",
    },
    {
      n: "Acharya Madhusudan",
      r: 4.9,
      rv: 153,
      exp: 18,
      lang: "Telugu, Hindi, Sanskrit",
      km: 4.2,
      e: "🧔",
      img: "images/purohit_madhusudan.jpg",
    },
    {
      n: "Pandit Somashekar",
      r: 4.9,
      rv: 210,
      exp: 25,
      lang: "Sanskrit, Telugu, Kannada",
      km: 4.5,
      e: "👨",
      img: "images/purohit_somashekar.jpg",
    },
    {
      n: "Pandit Gopal Krishna",
      r: 4.6,
      rv: 58,
      exp: 8,
      lang: "Telugu, Hindi",
      km: 5.0,
      e: "🧔",
      img: "images/purohit_gopalkrishna.jpg",
    },
  ],
  pujas: [
    {
      n: "Satyanarayana Puja",
      r: 4.9,
      bk: 256,
      d: "For prosperity, happiness and family well-being.",
      p: 2100,
      e: "🪔",
      img: "images/puja_satyanarayana.jpg",
    },
    {
      n: "Griha Pravesh Puja",
      r: 4.8,
      bk: 198,
      d: "Invite positivity and divine blessings to your new home.",
      p: 3500,
      e: "🏠",
      img: "images/puja_griha_pravesh.jpg",
    },
    {
      n: "Homam / Havan",
      r: 4.8,
      bk: 165,
      d: "For peace, health and removal of obstacles.",
      p: 2500,
      e: "🔥",
      img: "images/puja_homam.jpg",
    },
    {
      n: "Ganesh Puja",
      r: 4.9,
      bk: 312,
      d: "Invoke Lord Ganesha's blessings for new beginnings.",
      p: 1500,
      e: "🐘",
      img: "images/puja_ganesh.jpg",
    },
    {
      n: "Vivaha (Wedding) Puja",
      r: 4.9,
      bk: 142,
      d: "Sacred Vedic wedding rituals with authentic mantras.",
      p: 8000,
      e: "💍",
      img: "images/puja_wedding.jpg",
    },
    {
      n: "Navagraha Shanti Puja",
      r: 4.7,
      bk: 184,
      d: "Pacify planetary doshas and attract auspicious energies.",
      p: 2100,
      e: "🪐",
      img: "images/puja_navagraha.jpg",
    },
    {
      n: "Rudrabhishek Puja",
      r: 4.9,
      bk: 220,
      d: "Powerful Shiva abhishek for health and inner strength.",
      p: 2300,
      e: "🕉",
      img: "images/puja_rudrabhishek.jpg",
    },
  ],
  notifs: [
    {
      c: "bookings",
      t: "Booking Confirmed",
      m: "Satyanarayana Puja with Pandit Narayan Shastri on 15 May 2025 is confirmed.",
      w: "10 mins ago",
      u: 1,
      i: "📅",
    },
    {
      c: "payments",
      t: "Payment Successful",
      m: "Your payment of ₹2,100 for booking ID PM25051510023 was successful.",
      w: "12 mins ago",
      u: 1,
      i: "₹",
    },
    {
      c: "bookings",
      t: "Samagri Dispatched",
      m: "Your sacred Puja Samagri Kit for Griha Pravesh has been dispatched via courier.",
      w: "2 hours ago",
      u: 1,
      i: "📦",
    },
    {
      c: "offers",
      t: "Festive Season Discount",
      m: "Use code FESTIVE20 to get 20% off on all Homam and Shanti rituals.",
      w: "Yesterday, 7:00 PM",
      u: 0,
      i: "🎁",
    },
    {
      c: "bookings",
      t: "Upcoming Puja Reminder",
      m: "Don't forget! Your Griha Pravesh Puja is on 25 May 2025, 09:30 AM.",
      w: "Yesterday, 1:30 PM",
      u: 0,
      i: "🔔",
    },
    {
      c: "offers",
      t: "Rate your experience",
      m: "Please share your experience for your Havan booking on 05 Jun 2025.",
      w: "Yesterday, 11:00 AM",
      u: 0,
      i: "⭐",
    },
    {
      c: "system",
      t: "Profile updated successfully",
      m: "Your profile information has been updated successfully.",
      w: "13 May 2025, 6:45 PM",
      u: 0,
      i: "⚙️",
    },
  ],
  addresses: [
    {
      id: 1,
      label: "Home",
      type: "Home",
      line: "H.No. 12-3-456, Lakshmi Nagar, Manikonda, Hyderabad, Telangana - 500089",
      ph: "+91 98490 12345",
      def: true,
      i: "🏠",
    },
    {
      id: 2,
      label: "Office",
      type: "Work",
      line: "4th Floor, Srivin Tech Private Limited, Kothaguda, Hyderabad, Telangana - 500084",
      ph: "+91 98490 12345",
      def: false,
      i: "💼",
    },
    {
      id: 3,
      label: "Parents Home",
      type: "Home",
      line: "H.No. 8-2-100/3, Road No. 5, Banjara Hills, Hyderabad, Telangana - 500034",
      ph: "+91 98490 12345",
      def: false,
      i: "👪",
    },
    {
      id: 4,
      label: "Other",
      type: "Other",
      line: "Plot No. 45, Sai Enclave, Kukatpally, Hyderabad, Telangana - 500072",
      ph: "+91 98490 12345",
      def: false,
      i: "📍",
    },
  ],
  reviews: [
    {
      k: "purohit",
      n: "Pandit Narayan Shastri",
      s: 5,
      p: "Satyanarayana Puja",
      d: "15 May 2025",
      t: "Pandit Ji performed the puja with great devotion and explained each step beautifully. Very satisfied with the overall experience.",
      b: "PM25051510023",
      e: "🧔",
      img: "images/purohit_narayan.jpg",
    },
    {
      k: "purohit",
      n: "Sri Venkatesh Dikshith",
      s: 4.8,
      p: "Griha Pravesh Puja",
      d: "25 Apr 2025",
      t: "Very punctual and knowledgeable. Thorough Vastu and Navagraha homam followed. Highly recommend Sri Venkatesh Dikshith garu.",
      b: "PM25041009886",
      e: "👴",
      img: "images/purohit_venkatesh.jpg",
    },
    {
      k: "purohit",
      n: "Pandit Raghav Sharma",
      s: 4.7,
      p: "Ganesh Puja",
      d: "10 Mar 2025",
      t: "Authentic rituals. Arrived on time with all necessary items and conducted beautiful aarti.",
      b: "PM24082707766",
      e: "🧑",
      img: "images/purohit_raghav.jpg",
    },
    {
      k: "puja",
      n: "Homam / Havan",
      s: 5,
      p: "",
      d: "05 Jun 2025",
      t: "Excellent arrangement for Havan. Everything was organized perfectly. Will definitely book again.",
      b: "PM25060511245",
      e: "🔥",
      img: "images/puja_homam.jpg",
    },
    {
      k: "puja",
      n: "Ganesh Puja",
      s: 4,
      p: "",
      d: "27 Aug 2024",
      t: "Good experience and timely completion of puja. Thank you for making the puja so smooth.",
      b: "PM24082707766",
      e: "🐘",
      img: "images/puja_ganesh.jpg",
    },
  ],
  convos: [
    {
      n: "Pandit Narayan Shastri",
      t: "10:30 AM",
      u: 2,
      e: "🧔",
      img: "images/purohit_narayan.jpg",
      on: 1,
      m: [
        [
          "in",
          "Namaste Srinivas ji, Thank you for booking the Satyanarayana Puja. I have noted your booking details.",
          "10:30 AM",
        ],
        [
          "out",
          "Namaste Pandit ji, Thank you. Please let me know if you need any additional information.",
          "10:32 AM",
        ],
        [
          "in",
          "The details look good. Please keep the required items ready as per the list.",
          "10:34 AM",
        ],
        [
          "out",
          "Sure Pandit ji, we will arrange everything. Looking forward to the puja.",
          "10:35 AM",
        ],
        ["in", "Thank you. See you on the day of the puja. Have a great day!", "10:36 AM"],
      ],
    },
    {
      n: "Sri Venkatesh Dikshith",
      t: "Yesterday",
      u: 0,
      e: "👴",
      img: "images/purohit_venkatesh.jpg",
      on: 0,
      m: [
        [
          "in",
          "Namaste Srinivas garu, regarding Griha Pravesh puja, please ensure the east-facing entrance is clear.",
          "Yesterday",
        ],
        [
          "out",
          "Yes Guruji, we have made all arrangements according to your instructions.",
          "Yesterday",
        ],
      ],
    },
    {
      n: "PurohitMitra Support",
      t: "3 days ago",
      u: 1,
      e: "🎧",
      img: "images/logo.svg",
      on: 1,
      m: [
        [
          "in",
          "Welcome to PurohitMitra Support! How can we assist you with your puja booking today?",
          "3 days ago",
        ],
      ],
    },
    {
      n: "Pandit Raghav Sharma",
      t: "10 May",
      u: 0,
      e: "🧑",
      img: "images/purohit_raghav.jpg",
      on: 0,
      m: [["in", "Looking forward to performing the puja at your residence.", "10 May"]],
    },
    {
      n: "Acharya Madhusudan",
      t: "08 May",
      u: 0,
      e: "🧔",
      img: "images/purohit_madhusudan.jpg",
      on: 0,
      m: [["in", "Here is the list of sacred items required for the Homam ceremony.", "08 May"]],
    },
  ],
};


// ============================================================================
// PM Data Dual-Key Normalizer & Auto-Enrichment
// Guarantees zero "undefined" errors across any template or renderer
// ============================================================================
(function normalizePMData(pm) {
  if (!pm) return;
  if (typeof window !== "undefined") window.PM = pm;

  if (Array.isArray(pm.notifs)) {
    pm.notifs.forEach(n => {
      n.icon = n.icon || n.i || "🔔";
      n.i = n.i || n.icon;
      n.title = n.title || n.t || "Notification";
      n.t = n.t || n.title;
      n.message = n.message || n.m || "";
      n.m = n.m || n.message;
      n.time = n.time || n.when || n.w || "";
      n.w = n.w || n.time;
      n.when = n.when || n.time;
      n.category = n.category || n.c || "system";
      n.c = n.c || n.category;
      n.unread = n.unread !== undefined ? n.unread : (n.u !== undefined ? n.u : 0);
      n.u = n.u !== undefined ? n.u : n.unread;
    });
  }

  if (Array.isArray(pm.addresses)) {
    pm.addresses.forEach(a => {
      a.icon = a.icon || a.i || "🏠";
      a.i = a.i || a.icon;
      a.name = a.name || a.label || a.title || "Address";
      a.label = a.label || a.name;
      a.title = a.title || a.name;
      a.address = a.address || a.line || a.fullAddress || "";
      a.line = a.line || a.address;
      a.fullAddress = a.fullAddress || a.address;
      a.phone = a.phone || a.ph || "+91 98490 12345";
      a.ph = a.ph || a.phone;
      a.type = a.type || "Home";
      a.isDefault = a.isDefault !== undefined ? a.isDefault : Boolean(a.def);
      a.def = a.def !== undefined ? a.def : a.isDefault;
    });
  }

  if (Array.isArray(pm.offers)) {
    // Add additional festive/promo offers if not present
    const codes = pm.offers.map(o => o.code);
    if (!codes.includes("FESTIVE20")) {
      pm.offers.unshift({
        t: "20% OFF on Festive Pujas & Homams",
        d: "Celebrate festivals with 20% off on all Homam and Shanti rituals.",
        code: "FESTIVE20",
        till: "30 Jun 2025",
        min: 1500,
        s: "active",
        i: "🎁"
      });
    }
    if (!codes.includes("FIRSTPUJA")) {
      pm.offers.push({
        t: "First Puja Booking Discount",
        d: "Flat ₹300 OFF on your First Puja Booking.",
        code: "FIRSTPUJA",
        till: "15 Jun 2025",
        min: 1200,
        s: "active",
        i: "🪔"
      });
    }
    if (!codes.includes("GRIHAPRAVESH")) {
      pm.offers.push({
        t: "Griha Pravesh Package Special",
        d: "Flat ₹500 OFF on Griha Pravesh Packages.",
        code: "GRIHAPRAVESH",
        till: "31 Jul 2025",
        min: 2500,
        s: "active",
        i: "🏡"
      });
    }

    pm.offers.forEach(o => {
      o.icon = o.icon || o.i || "🎁";
      o.i = o.i || o.icon;
      o.title = o.title || o.t || "Special Offer";
      o.t = o.t || o.title;
      o.name = o.name || o.title;
      o.desc = o.desc || o.description || o.d || "";
      o.d = o.d || o.desc;
      o.description = o.description || o.desc;
      o.validTill = o.validTill || o.till || o.valid_till || "Limited Time";
      o.till = o.till || o.validTill;
      o.valid_till = o.valid_till || o.validTill;
      o.status = o.status || o.s || "active";
      o.s = o.s || o.status;
      o.min = o.min !== undefined ? o.min : (o.minPurchase || 0);
      o.minPurchase = o.minPurchase !== undefined ? o.minPurchase : o.min;
      o.code = o.code || "PUJA10";
    });
  }

  if (Array.isArray(pm.purohits)) {
    pm.purohits.forEach(p => {
      p.name = p.name || p.n || "Purohit";
      p.n = p.n || p.name;
      p.rating = p.rating !== undefined ? p.rating : (p.r !== undefined ? p.r : 4.8);
      p.r = p.r !== undefined ? p.r : p.rating;
      p.reviews = p.reviews !== undefined ? p.reviews : (p.rv !== undefined ? p.rv : 100);
      p.rv = p.rv !== undefined ? p.rv : p.reviews;
      p.experience = p.experience !== undefined ? p.experience : (p.exp !== undefined ? p.exp : 10);
      p.exp = p.exp !== undefined ? p.exp : p.experience;
      p.languages = p.languages || p.lang || "Telugu, Sanskrit, Hindi";
      p.lang = p.lang || p.languages;
      p.distance = p.distance !== undefined ? p.distance : (p.km !== undefined ? p.km : 3.0);
      p.km = p.km !== undefined ? p.km : p.distance;
      p.icon = p.icon || p.e || "🧔";
      p.e = p.e || p.icon;
      p.image = p.image || p.img || "";
      p.img = p.img || p.image;
    });
  }

  if (Array.isArray(pm.pujas)) {
    pm.pujas.forEach(u => {
      u.name = u.name || u.n || "Puja";
      u.n = u.n || u.name;
      u.rating = u.rating !== undefined ? u.rating : (u.r !== undefined ? u.r : 4.8);
      u.r = u.r !== undefined ? u.r : u.rating;
      u.bookings = u.bookings !== undefined ? u.bookings : (u.bk !== undefined ? u.bk : 100);
      u.bk = u.bk !== undefined ? u.bk : u.bookings;
      u.desc = u.desc || u.d || "";
      u.d = u.d || u.desc;
      u.price = u.price !== undefined ? u.price : (u.p !== undefined ? u.p : 1500);
      u.p = u.p !== undefined ? u.p : u.price;
      u.icon = u.icon || u.e || "🪔";
      u.e = u.e || u.icon;
      u.image = u.image || u.img || "";
      u.img = u.img || u.image;
    });
  }

  if (Array.isArray(pm.convos)) {
    pm.convos.forEach(c => {
      c.name = c.name || c.n || "Purohit";
      c.n = c.n || c.name;
      c.time = c.time || c.t || "10:30 AM";
      c.t = c.t || c.time;
      c.unread = c.unread !== undefined ? c.unread : (c.u !== undefined ? c.u : 0);
      c.u = c.u !== undefined ? c.u : c.unread;
      c.icon = c.icon || c.e || "🧔";
      c.e = c.e || c.icon;
      c.image = c.image || c.img || "";
      c.img = c.img || c.image;
      c.online = c.online !== undefined ? c.online : (c.on !== undefined ? c.on : 0);
      c.on = c.on !== undefined ? c.on : c.online;
      if (Array.isArray(c.m)) {
        c.m.forEach(msg => {
          if (Array.isArray(msg)) {
            msg.dir = msg[0];
            msg.w = msg[0];
            msg.text = msg[1];
            msg.t = msg[1];
            msg.message = msg[1];
            msg.time = msg[2];
          } else if (msg && typeof msg === "object") {
            msg[0] = msg.dir || msg.w || "in";
            msg[1] = msg.text || msg.t || msg.message || "";
            msg[2] = msg.time || "";
          }
        });
      }
    });
  }

  if (Array.isArray(pm.bookings)) {
    pm.bookings.forEach(b => {
      b.name = b.name || b.puja || "Puja Booking";
      b.puja = b.puja || b.name;
      b.image = b.image || b.img || "";
      b.img = b.img || b.image;
      b.icon = b.icon || "🪔";
    });
  }
})(PM);


// ----- Helpers -----
const inr = (n) => "₹ " + Number(n).toLocaleString("en-IN");
const stars = (n) => "★".repeat(Math.floor(n)) + (n % 1 ? "⯨" : "") + "☆".repeat(5 - Math.ceil(n));
const badge = (s) =>
  `<span class="badge ${{ Confirmed: "", "Payment Pending": "b-warn", Pending: "b-warn", Partial: "b-purple", Refunded: "b-purple", Cancelled: "b-red", Completed: "b-blue", Success: "", Paid: "" }[s] || ""}">${s}</span>`;
function toast(m) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = m;
  document.body.append(t);
  setTimeout(() => t.remove(), 2200);
}
function openModal(title, body, onOk, okLabel = "Save") {
  const bg = document.createElement("div");
  bg.className = "modal-bg";
  bg.innerHTML = `<div class="modal" role="dialog"><h2>${title}</h2><div>${body}</div><div class="acts"><button class="btn-o" data-x>Cancel</button>${onOk ? `<button class="btn" data-ok>${okLabel}</button>` : ""}</div></div>`;
  document.body.append(bg);
  const close = () => bg.remove();
  bg.onclick = (e) => {
    if (e.target === bg || e.target.dataset.x !== undefined) close();
  };
  if (onOk)
    $("[data-ok]", bg).onclick = () => {
      if (onOk(bg) !== false) close();
    };
  return bg;
}
function initTabs(sel, cb) {
  const box = $(sel);
  if (!box) return;
  $$("[data-tab]", box).forEach(
    (b) =>
      (b.onclick = () => {
        $$("[data-tab]", box).forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        cb(b.dataset.tab);
      }),
  );
}
function download(name, text) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
const esc = (s) =>
  String(s || "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

// ----- Common behaviour (runs on every page) -----
document.addEventListener("DOMContentLoaded", () => {
  // Auto-highlight active navigation item based on current URL
  const currentPath = (window.location && window.location.pathname ? window.location.pathname.split("/").pop() : "") || "dashboard.html";
  $$(".side nav a").forEach((a) => {
    const href = (a.getAttribute ? a.getAttribute("href") : a.href) || "";
    if (href === currentPath || (currentPath === "" && href === "dashboard.html")) {
      if (a.classList && a.classList.add) a.classList.add("active");
    } else {
      if (a.classList && a.classList.remove) a.classList.remove("active");
    }
  });

  const menuBtn = $(".menu-btn");
  if (menuBtn) {
    menuBtn.onclick = (e) => {
      e.stopPropagation();
      document.body.classList.toggle("nav-open");
    };
  }

  // Backdrop click to close drawer
  let backdrop = $(".side-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "side-backdrop";
    document.body.appendChild(backdrop);
  }
  backdrop.onclick = () => document.body.classList.remove("nav-open");

  // Close button inside sidebar
  const closeBtn = $(".side-close");
  if (closeBtn) {
    closeBtn.onclick = () => document.body.classList.remove("nav-open");
  }

  // Close when clicking any link inside sidebar
  $$(".side nav a").forEach((a) => {
    a.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
    });
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") document.body.classList.remove("nav-open");
  });

  const logout = $("#logout");
  if (logout) {
    logout.onclick = (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to log out?")) {
        toast("Logged out successfully");
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 500);
      }
    };
  }
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("switch") && e.target.dataset.msg)
      toast(e.target.dataset.msg + (e.target.checked ? " enabled" : " disabled"));
  });
});
