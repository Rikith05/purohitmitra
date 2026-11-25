/**
 * Favorites, Notifications, My Reviews, Messages and Help & Support pages.
 * Vanilla JS, no frameworks.
 */

document.addEventListener("DOMContentLoaded", () => {
  const pg = document.body.dataset.page;

  // Helper for rendering clear, sharp avatar/thumb images with emoji fallback
  const renderThumb = (x, isRound = false) => {
    if (!x) return isRound ? '🧔' : '🪔';
    const fallback = x.icon || x.e || (isRound ? '🧔' : '🪔');
    const name = esc(x.name || x.n || '');
    const img = x.image || x.img;
    if (img) {
      return `<img src="${img}" alt="${name}" class="thumb-img" onerror="this.style.display='none';if(this.nextElementSibling){this.nextElementSibling.style.display='inline'}"><span style="display:none">${fallback}</span>`;
    }
    return fallback;
  };

  // ----- Page: favorites -----
  if (pg === "favorites") {
    let tab = "purohits",
      q = "";
    const getList = (t) => typeof window.pmGetFavorites === "function" ? window.pmGetFavorites(t) : (t === "purohits" ? PM.purohits : PM.pujas);
    const draw = () => {
      const pList = getList("purohits");
      const uList = getList("pujas");
      const nP = $("#nP");
      if (nP) nP.textContent = pList.length;
      const nU = $("#nU");
      if (nU) nU.textContent = uList.length;
      const L = tab === "purohits" ? pList : uList;
      const r = L.filter((x) => x.n.toLowerCase().includes(q));
      const fList = $("#fList");
      if (!fList) return;
      fList.innerHTML = r.length
        ? r
            .map((x) =>
              tab === "purohits"
                ? `<div class="fc"><div class="thumb round">${renderThumb(x, true)}</div><div><h3>${x.name || x.n || 'Purohit'}</h3><span class="star">★</span> ${x.rating || x.r || 4.8} (${x.reviews || x.rv || 100} Reviews)<p>${x.experience || x.exp || 10} Years Experience<br>Languages: ${x.languages || x.lang || 'Telugu, Sanskrit'}<br>📍 ${x.distance || x.km || 2.5} km away</p><div class="acts"><button class="btn-o" data-v="${x.name || x.n}">View Profile</button><button class="btn" data-b="${x.name || x.n}">Book Now</button></div></div><button class="heart" data-r="${x.name || x.n}" aria-label="Remove">♥</button></div>`
                : `<div class="fc"><div class="thumb">${renderThumb(x, false)}</div><div><h3>${x.name || x.n || 'Puja'}</h3><span class="star">★</span> ${x.rating || x.r || 4.8} (${x.bookings || x.bk || 100} Bookings)<p>${x.desc || x.d || ''}</p><span class="badge b-warn">Starts from ${inr(x.price || x.p || 1500)}</span><div class="acts"><button class="btn" data-b="${x.name || x.n}">Book Now</button></div></div><button class="heart" data-r="${x.name || x.n}" aria-label="Remove">♥</button></div>`,
            )
            .join("")
        : '<p class="empty">No favorites found.</p>';
    };
    initTabs("#fTabs", (t) => {
      tab = t;
      draw();
    });
    const fSearch = $("#fSearch");
    if (fSearch) {
      fSearch.oninput = (e) => {
        q = e.target.value.toLowerCase();
        draw();
      };
    }
    const fList = $("#fList");
    if (fList) {
      fList.onclick = (e) => {
        const d = e.target.dataset;
        if (d.r) {
          if (typeof window.pmRemoveFavorite === "function") {
            window.pmRemoveFavorite(tab, d.r);
          } else {
            const L = tab === "purohits" ? PM.purohits : PM.pujas;
            const idx = L.findIndex((x) => (x.name || x.n) === d.r);
            if (idx !== -1) L.splice(idx, 1);
          }
          draw();
          toast("Removed from favorites");
        }
        if (d.b) window.location.href = tab === "purohits" ? "book-purohit.html?purohit=" + encodeURIComponent(d.b) : "book-puja.html?puja=" + encodeURIComponent(d.b);
        if (d.v) window.location.href = "purohit-details.html?purohit=" + encodeURIComponent(d.v);
      };
    }
    draw();
  }

  // ----- Page: notifications -----
  if (pg === "notifications") {
    let tab = "all";
    const N = PM.notifs || [];
    try {
      const savedRead = JSON.parse(localStorage.getItem("pm_notifs_read_indices") || "null");
      if (Array.isArray(savedRead)) {
        savedRead.forEach((idx) => {
          if (N[idx]) { N[idx].u = 0; N[idx].unread = 0; }
        });
      }
    } catch (e) {}
    const persistNotifState = () => {
      const readIndices = [];
      let unreadCount = 0;
      N.forEach((n, idx) => {
        if (n.u || n.unread) unreadCount++;
        else readIndices.push(idx);
      });
      localStorage.setItem("pm_notifs_read_indices", JSON.stringify(readIndices));
      localStorage.setItem("pm_notif_unread", String(unreadCount));
      if (typeof window.pmSyncNotifBadges === "function") window.pmSyncNotifBadges();
    };
    const draw = () => {
      persistNotifState();
      const isUn = (n) => Boolean(n.u || n.unread);
      const un = N.filter(isUn).length;
      $$(".side em,.bell i").forEach((x) => {
        x.textContent = un;
        x.style.display = un ? "" : "none";
      });
      const lab = {
        all: "All",
        unread: "Unread",
        bookings: "Bookings",
        payments: "Payments",
        offers: "Offers",
        system: "System",
      };
      $$("#nTabs [data-tab]").forEach((b) => {
        const t = b.dataset.tab,
          c = t === "all" ? N.length : t === "unread" ? un : N.filter((n) => n.c === t).length;
        b.textContent = `${lab[t] || t} (${c})`;
      });
      const r = N.filter((n) => tab === "all" || (tab === "unread" ? isUn(n) : n.c === tab));
      const nList = $("#nList");
      if (nList) {
        nList.innerHTML =
          r
            .map(
              (n) =>
                `<div class="ni ${(n.u || n.unread) ? "unread" : ""}" data-i="${N.indexOf(n)}"><div class="ic">${n.icon || n.i || '🔔'}</div><div><h3>${n.title || n.t || 'Notification'}</h3><p class="muted">${n.message || n.m || ''}</p></div><small>${n.time || n.when || n.w || 'Just now'}</small>${(n.u || n.unread) ? '<span class="dot"></span>' : ""}</div>`,
            )
            .join("") || '<p class="empty">No notifications.</p>';
      }
    };
    initTabs("#nTabs", (t) => {
      tab = t;
      draw();
    });
    const markAll = $("#markAll");
    if (markAll) {
      markAll.onclick = () => {
        N.forEach((n) => { n.u = 0; n.unread = 0; });
        draw();
        toast("All notifications marked as read");
      };
    }
    const nList = $("#nList");
    if (nList) {
      nList.onclick = (e) => {
        const c = e.target.closest(".ni");
        if (c && c.dataset.i !== undefined) {
          N[+c.dataset.i].u = 0;
          N[+c.dataset.i].unread = 0;
          draw();
        }
      };
    }
    draw();
  }

  // ----- Page: my-reviews -----
  if (pg === "my-reviews") {
    let tab = "all",
      q = "";
    const R = PM.reviews || [];
    const draw = () => {
      const tabAll = $("#rTabs [data-tab=all]");
      if (tabAll) tabAll.innerHTML = `All Reviews (${R.length})`;
      const tabPrh = $("#rTabs [data-tab=purohit]");
      if (tabPrh) tabPrh.textContent = `Purohit Reviews (${R.filter((r) => r.k === "purohit").length})`;
      const tabPuj = $("#rTabs [data-tab=puja]");
      if (tabPuj) tabPuj.textContent = `Puja Reviews (${R.filter((r) => r.k === "puja").length})`;

      const r = R.filter(
        (x) => (tab === "all" || x.k === tab) && (x.n + x.t).toLowerCase().includes(q),
      );
      const rList = $("#rList");
      if (rList) {
        rList.innerHTML =
          r
            .map(
              (x) =>
                `<div class="rv"><div class="thumb ${x.k === "purohit" ? "round" : ""}">${renderThumb(x, x.k === "purohit")}</div><div><h3>${esc(x.n)} ${x.k === "purohit" ? '<span class="badge">✓ Verified</span>' : ""}</h3><div><span class="star">${stars(x.s)}</span> ${Number(x.s).toFixed(1)}</div><small class="muted">${x.p ? "🪔 " + x.p + " · " : ""}📅 ${x.d}</small><p>${esc(x.t)}</p></div><div class="id">Booking ID: ${x.b}<br><a class="btn-o inl" href="${x.k === "purohit" ? "favorites" : "my-bookings"}.html">${x.k === "purohit" ? "View Purohit Profile" : "View Puja Details"}</a></div></div>`,
            )
            .join("") || '<p class="empty">No reviews found.</p>';
      }
    };
    initTabs("#rTabs", (t) => {
      tab = t;
      draw();
    });
    const rSearch = $("#rSearch");
    if (rSearch) {
      rSearch.oninput = (e) => {
        q = e.target.value.toLowerCase();
        draw();
      };
    }
    const wr = $("#wr");
    if (wr) {
      wr.onclick = () => {
        let s = 0;
        const bg = openModal(
          "Write a Review",
          `<div class="fld"><label>Completed booking</label><select id="rb">${PM.bookings
            .filter((b) => b.tab === "completed")
            .map((b) => `<option value="${b.id}">${b.puja} – ${b.purohit}</option>`)
            .join(
              "",
            )}</select></div><div class="fld starpick" id="sp">${[1, 2, 3, 4, 5].map((i) => `<span data-s="${i}">★</span>`).join("")}</div><div class="fld"><label>Your review</label><textarea id="rt" rows="3"></textarea></div>`,
          (bg) => {
            const t = $("#rt", bg).value.trim();
            if (!s || t.length < 5) {
              toast("Add a rating and a short review");
              return false;
            }
            const b = PM.bookings.find((x) => x.id === $("#rb", bg).value);
            R.unshift({ k: "purohit", n: b ? b.purohit : "Purohit", s, p: b ? b.puja : "", d: "Today", t, b: b ? b.id : "PM25051510023", e: "🧔", img: b ? b.purohitImg : "" });
            draw();
            toast("Review submitted");
          },
          "Submit",
        );
        $("#sp", bg).onclick = (e) => {
          s = +e.target.dataset.s || s;
          $$("#sp span", bg).forEach((x, i) => x.classList.toggle("on", i < s));
        };
      };
    }
    draw();
  }

  // ----- Page: messages -----
  if (pg === "messages") {
    let cur = 0,
      q = "";
    const C = PM.convos || [];
    const list = () => {
      const cList = $("#cList");
      if (!cList) return;
      cList.innerHTML = C.filter((c) => (c.name || c.n || '').toLowerCase().includes(q))
        .map((c) => {
          const i = C.indexOf(c);
          const messages = c.messages || c.m || [];
          const lastMsg = messages.length ? messages[messages.length - 1] : ["in", "", ""];
          const lastText = Array.isArray(lastMsg) ? lastMsg[1] : (lastMsg.text || lastMsg.t || lastMsg.message || "");
          const lastTime = Array.isArray(lastMsg) ? lastMsg[2] : (lastMsg.time || lastMsg.t || c.time || c.t || "");
          const unreadCount = c.unread !== undefined ? c.unread : (c.u !== undefined ? c.u : 0);
          return `<div class="cv ${i === cur ? "active" : ""}" data-i="${i}"><div class="thumb round">${renderThumb(c, true)}</div><div><b>${c.name || c.n}</b><p>${esc(lastText)}</p></div><div class="tr"><small>${lastTime}</small>${unreadCount ? `<em>${unreadCount}</em>` : ""}</div></div>`;
        })
        .join("");
    };
    const chat = () => {
      if (!C.length) return;
      const c = C[cur] || C[0];
      c.u = 0;
      c.unread = 0;
      const chHead = $("#chHead");
      if (chHead) {
        chHead.innerHTML =
          `<b class="cname">${c.n}</b><br><small class="${c.on ? "on" : "off"}">● ${c.on ? "Online" : "Offline"}</small>`;
      }
      const msgs = $("#msgs");
      if (msgs) {
        const messageList = c.messages || c.m || [];
        msgs.innerHTML = messageList
          .map((m) => {
            const dir = Array.isArray(m) ? m[0] : (m.dir || m.w || "in");
            const text = Array.isArray(m) ? m[1] : (m.text || m.t || m.message || "");
            const time = Array.isArray(m) ? m[2] : (m.time || "");
            return `<div class="m ${dir}">${esc(text)}<small>${esc(time)}${dir === "out" ? " ✓✓" : ""}</small></div>`;
          })
          .join("");
        msgs.scrollTop = 1e5;
      }
      list();
    };
    const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const cList = $("#cList");
    if (cList) {
      cList.onclick = (e) => {
        const c = e.target.closest(".cv");
        if (c && c.dataset.i !== undefined) {
          cur = +c.dataset.i;
          chat();
        }
      };
    }
    const mSearch = $("#mSearch");
    if (mSearch) {
      mSearch.oninput = (e) => {
        q = e.target.value.toLowerCase();
        list();
      };
    }
    const attach = $("#attach");
    if (attach) {
      let fileIn = document.getElementById("pmMsgFileIn");
      if (!fileIn) {
        fileIn = document.createElement("input");
        fileIn.type = "file";
        fileIn.id = "pmMsgFileIn";
        fileIn.accept = "image/*,.pdf,.doc,.docx";
        fileIn.style.display = "none";
        document.body.appendChild(fileIn);
        fileIn.onchange = () => {
          if (fileIn.files && fileIn.files[0]) {
            const fname = fileIn.files[0].name;
            const c = C[cur] || C[0];
            c.m = c.m || [];
            c.m.push(["out", `📎 Attached: ${fname}`, now()]);
            fileIn.value = "";
            chat();
            toast(`Sent attachment: ${fname}`);
          }
        };
      }
      attach.onclick = () => fileIn.click();
    }
    const sendF = $("#sendF");
    if (sendF) {
      sendF.onsubmit = (e) => {
        e.preventDefault();
        const mIn = $("#mIn");
        const v = mIn ? mIn.value.trim() : "";
        if (!v) return;
        const c = C[cur] || C[0];
        c.m.push(["out", v, now()]);
        if (mIn) mIn.value = "";
        chat();
        setTimeout(() => {
          c.m.push(["in", "Thank you! We have received your query and will assist you shortly.", now()]);
          if (C[cur] === c) chat();
        }, 1200);
      };
    }
    chat();
  }

  // ----- Page: help-support -----
  if (pg === "help-support") {
    const T = [
      ["📅", "Bookings", "Manage bookings, reschedule, cancellations"],
      ["₹", "Payments & Refunds", "Payment methods, refunds and billing issues"],
      ["👤", "Purohits", "Find, select and connect with Purohits"],
      ["🎁", "Offers & Coupons", "Offers, discounts and promotions"],
      ["🛡", "Account & Security", "Profile settings, password and security"],
      ["⚙️", "General", "General questions about PurohitMitra"],
    ];
    const A = [
      [
        "How to book a Purohit for a puja?",
        "Search a puja or purohit, choose date, time and location, add add-ons, review and pay securely.",
      ],
      [
        "How to reschedule or cancel a booking?",
        "Open My Bookings, use the ⋮ menu on the booking and pick Reschedule or Cancel. Charges follow our policy.",
      ],
      ["What payment methods are accepted?", "UPI, cards, net banking and wallets."],
      [
        "How do refunds work?",
        "Eligible refunds reach your original payment method in 5–7 working days.",
      ],
      [
        "How to apply an offer or coupon?",
        "Enter the promo code at checkout or from the Offers page.",
      ],
      [
        "How to contact a Purohit after booking?",
        "Use Chat with Purohit on your booking or open Messages.",
      ],
    ];
    const G = [
      ["▶", "How to Book a Puja", "Step-by-step guide to book a puja", "Watch Video"],
      ["₹", "Payment & Refund Guide", "Everything about payments and refunds", "Read Guide"],
      ["📅", "Booking Policies", "Booking and cancellation policies", "Read Policy"],
      ["?", "Frequently Asked Questions", "Answers to common questions", "View FAQs"],
    ];
    const draw = (q) => {
      q = (q || "").toLowerCase();
      const topics = $("#topics");
      if (topics) {
        topics.innerHTML =
          T.filter((t) => (t[1] + t[2]).toLowerCase().includes(q))
            .map(
              (t) =>
                `<div class="tc" data-t="${t[1]}"><span>${t[0]}</span> <b>${t[1]}</b>${t[2]}<br><a class="link">View Articles →</a></div>`,
            )
            .join("") || '<p class="empty">No topics match.</p>';
      }
      const arts = $("#arts");
      if (arts) {
        arts.innerHTML =
          A.filter((a) => (a[0] + a[1]).toLowerCase().includes(q))
            .map((a) => `<div class="ar">${a[0]}<span>›</span></div><div class="ans">${a[1]}</div>`)
            .join("") || '<p class="empty">No articles match.</p>';
      }
    };
    const guides = $("#guides");
    if (guides) {
      guides.innerHTML = G.map(
        (g) =>
          `<div class="ar" data-g="${g[2]}"><span>${g[0]} <b>${g[1]}</b><br><small class="muted">${g[2]}</small></span><a class="link">${g[3]} →</a></div>`,
      ).join("");
    }
    const hq = $("#hq");
    if (hq) hq.oninput = (e) => draw(e.target.value);
    const hs = $("#hs");
    if (hs) hs.onclick = () => draw(hq ? hq.value : "");
    const arts = $("#arts");
    if (arts) {
      arts.onclick = (e) => {
        const a = e.target.closest(".ar");
        if (a) a.classList.toggle("open");
      };
    }
    const topics = $("#topics");
    if (topics) {
      topics.onclick = (e) => {
        const t = e.target.closest(".tc");
        if (t && hq) {
          hq.value = t.dataset.t.split(" ")[0];
          draw(hq.value);
        }
      };
    }
    if (guides) {
      guides.onclick = (e) => {
        const g = e.target.closest("[data-g]");
        if (g) toast("Opening: " + g.dataset.g + " (demo)");
      };
    }
    const cs = $("#cs");
    if (cs) {
      cs.onclick = () =>
        openModal(
          "Contact Support",
          '<div class="fld"><label>Subject</label><input id="ss"></div><div class="fld"><label>Message</label><textarea id="sm" rows="4"></textarea></div>',
          (bg) => {
            if (!$("#ss", bg).value.trim() || !$("#sm", bg).value.trim()) {
              toast("Fill subject and message");
              return false;
            }
            toast("Support ticket created");
          },
          "Submit",
        );
    }
    const em = $("#em");
    if (em) em.onclick = () => (location.href = "mailto:support@purohitmitra.com");
    const fb = $("#fb");
    if (fb) {
      fb.onclick = () =>
        openModal(
          "Give Feedback",
          '<textarea id="fbt" rows="4" placeholder="Tell us how we can improve"></textarea>',
          (bg) => {
            if (!$("#fbt", bg).value.trim()) {
              toast("Please write something");
              return false;
            }
            toast("Thanks for your feedback!");
          },
          "Send",
        );
    }
    draw();
  }
});
