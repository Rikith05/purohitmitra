/**
 * Dashboard: stats, upcoming bookings, recommendations and notifications.
 * Vanilla JS, no frameworks.
 */

document.addEventListener("DOMContentLoaded", () => {
  const B = PM.bookings || [],
    up = B.filter((b) => b.tab === "upcoming"),
    done = B.filter((b) => b.tab === "completed");

  const stats = $("#stats");
  if (stats) {
    stats.innerHTML = [
      ["📅", "Upcoming Bookings", up.length, "View Details", "my-bookings.html"],
      ["✅", "Completed Pujas", done.length + 6, "View History", "my-bookings.html"],
      ["💳", "Total Spent", inr(28450).replace("₹ ", "₹"), "View Payments", "payments.html"],
      ["⭐", "Reward Points", 320, "View Rewards", "offers.html"],
    ]
      .map(
        (s) =>
          `<div class="card stat"><div class="ico">${s[0]}</div><div><small>${s[1]}</small><b>${s[2]}</b><a class="link" href="${s[4]}">${s[3]} →</a></div></div>`,
      )
      .join("");
  }

  const upList = $("#upList");
  if (upList) {
    upList.innerHTML = up
      .slice(0, 2)
      .map(
        (b) =>
          `<div class="bk"><div class="thumb">${b.img ? `<img src="${b.img}" alt="${b.puja}" class="thumb-img">` : (b.icon || '🪔')}</div><div><b>${b.puja}</b><br>${b.purohit}<br>📅 ${b.date} · ${b.time}<br>📍 ${b.addr}</div><div>${badge(b.status)}<br><br><a class="btn-o" href="booking-details.html?id=${b.id}">View Details</a></div></div>`,
      )
      .join("");
  }

  const recList = $("#recList");
  if (recList) {
    recList.innerHTML = (PM.pujas || [])
      .slice(0, 3)
      .map(
        (p) =>
          `<div class="rec"><div class="thumb">${p.img ? `<img src="${p.img}" alt="${p.n}" class="thumb-img">` : (p.e || '🪔')}</div><b>${p.n}</b><br><span class="muted">${(p.d || '').slice(0, 24)}…</span><br>${inr(p.p)} onwards<button class="btn" data-book="${p.n}">Book Now</button></div>`,
      )
      .join("");
    recList.onclick = (e) => {
      const b = e.target.dataset.book;
      if (b) {
        window.location.href = "book-puja.html?puja=" + encodeURIComponent(b);
      }
    };
  }

  const dNotif = $("#dNotif");
  if (dNotif) {
    dNotif.innerHTML = (PM.notifs || [])
      .slice(0, 3)
      .map(
        (n) =>
          `<div class="nt"><span>${n.icon || n.i || '🔔'}</span><div><b>${n.title || n.t || 'Notification'}</b><br><small>${n.time || n.when || n.w || 'Just now'}</small></div></div>`,
      )
      .join("");
  }

  const dCode = $("#dCode");
  if (dCode) {
    dCode.onclick = () => {
      navigator.clipboard && navigator.clipboard.writeText("GRHP10");
      toast("Code GRHP10 copied");
    };
  }
});
