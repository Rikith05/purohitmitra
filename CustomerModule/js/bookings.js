/**
 * My Bookings list (filter, search, actions) and Booking Details page.
 * Vanilla JS, no frameworks.
 */

document.addEventListener("DOMContentLoaded", () => {
  const pg = document.body.dataset.page;
  const cancel = (id) => {
    if (confirm("Cancel this booking? Charges may apply as per policy.")) {
      const b = PM.bookings.find((x) => x.id === id);
      b.tab = "cancelled";
      b.status = "Cancelled";
      toast("Booking cancelled");
      return true;
    }
  };
  const policy = () =>
    openModal(
      "Cancellation Policy",
      "<p>• More than 48 hours before puja: Full refund<br>• 24–48 hours: 10% charges<br>• Less than 24 hours: 30% charges<br>• Same day: No refund</p>",
    );
  // ----- Page: my-bookings -----
  if (pg === "my-bookings") {
    let tab = "upcoming",
      q = "",
      d = "all";
    const list = $("#bkList");
    const draw = () => {
      ["upcoming", "completed", "cancelled"].forEach(
        (t) => ($(`[data-tab=${t}] b`).textContent = PM.bookings.filter((b) => b.tab === t).length),
      );
      const rows = PM.bookings.filter(
        (b) =>
          b.tab === tab &&
          (b.puja + b.purohit + b.id).toLowerCase().includes(q) &&
          (d === "all" || b.days <= +d),
      );
      list.innerHTML = rows.length
        ? rows
            .map(
              (b) => `<div class="bkc"><div class="thumb" style="overflow:hidden">${b.img ? `<img src="${b.img}" alt="${b.puja}" style="width:100%;height:100%;object-fit:cover">` : b.icon}</div>
    <div><h3>${b.puja}</h3><span class="muted">${b.purohit}</span><br>📅 ${b.date} · 🕒 ${b.time}<br>📍 ${b.addr}</div>
    <div><small>Booking ID</small><b>${b.id}</b><small>Amount</small><b>${inr(b.amt)}</b><small>Payment Status</small>${badge(b.pay)}</div>
    <div>Status ${badge(b.status)}${b.days ? `<br>📅 ${b.days} days to go` : ""}<div class="acts"><a class="btn-o" href="booking-details.html?id=${b.id}">View Details</a>${b.pay === "Paid" || b.tab !== "upcoming" ? (b.tab === "upcoming" ? '<a class="btn" href="messages.html">Chat with Purohit</a>' : "") : `<button class="btn" data-a="pay" data-id="${b.id}">Pay Now</button>`}</div></div>
    ${b.tab === "upcoming" ? `<div class="menu"><button aria-label="More">⋮</button><ul><li data-a="resch" data-id="${b.id}">Reschedule</li><li data-a="cancel" data-id="${b.id}" class="red">Cancel Booking</li><li data-a="inv" data-id="${b.id}">Download Invoice</li></ul></div>` : ""}</div>`,
            )
            .join("")
        : '<p class="empty">No bookings found.</p>';
    };
    initTabs("#bTabs", (t) => {
      tab = t;
      draw();
    });
    $("#bSearch").oninput = (e) => {
      q = e.target.value.toLowerCase();
      draw();
    };
    $("#bDate").onchange = (e) => {
      d = e.target.value;
      draw();
    };
    $("#policy").onclick = policy;
    list.onclick = (e) => {
      const m = e.target.closest(".menu>button");
      if (m) {
        const o = m.parentElement.classList.contains("open");
        $$(".menu").forEach((x) => x.classList.remove("open"));
        if (!o) m.parentElement.classList.add("open");
        return;
      }
      const a = e.target.dataset.a,
        id = e.target.dataset.id;
      $$(".menu").forEach((x) => x.classList.remove("open"));
      if (!a) return;
      if (a === "cancel" && cancel(id)) draw();
      if (a === "resch")
        openModal(
          "Reschedule Booking",
          '<div class="fld"><label>New date</label><input type="date" id="nd"></div>',
          (bg) => {
            if (!$("#nd", bg).value) {
              toast("Pick a date");
              return false;
            }
            toast("Reschedule request sent");
          },
        );
      if (a === "inv") {
        const b = PM.bookings.find((x) => x.id === id);
        download(
          "invoice-" + id + ".txt",
          `PurohitMitra Invoice\nBooking: ${id}\n${b.puja} - ${b.purohit}\nAmount: ${inr(b.amt)} (${b.pay})`,
        );
      }
      if (a === "pay") {
        PM.bookings.find((x) => x.id === id).pay = "Paid";
        PM.bookings.find((x) => x.id === id).status = "Confirmed";
        toast("Payment successful (demo)");
        draw();
      }
    };
    draw();
  }
  // ----- Page: booking-details -----
  if (pg === "booking-details") {
    const id = new URLSearchParams(location.search).get("id"),
      b = PM.bookings.find((x) => x.id === id) || PM.bookings[0],
      p = PM.purohits.find((x) => x.n === b.purohit) || PM.purohits[0];
    const steps = [
        "Booking Confirmed",
        "Payment Successful",
        "Purohit Assigned",
        "Puja Date",
        "Puja Completed",
      ],
      at = b.tab === "completed" ? 5 : 3;
    $("#bdWrap").innerHTML =
      `<div class="full row end">${badge(b.status)}<span class="badge b-grey">Booking ID: ${b.id}</span></div>
  <section class="card top2"><div class="thumb" style="overflow:hidden">${b.img ? `<img src="${b.img}" alt="${b.puja}" style="width:100%;height:100%;object-fit:cover">` : b.icon}</div><div class="grow"><h2>${b.puja}</h2><p>${b.purohit}</p><p>📅 ${b.date}<br>🕒 ${b.time}<br>📍 ${b.addr}</p></div><button class="btn-o" id="edit">✎ Edit Booking</button></section>
  <section class="card top2"><div class="thumb round">${p.img ? `<img src="${p.img}" alt="${p.n}" class="thumb-img">` : (p.e || '🧔')}</div><div><h2>${p.n}</h2><p><span class="star">★</span> ${p.r} (${p.rv} Reviews)<br>${p.exp} Years Experience<br>Languages: ${p.lang}</p><a class="btn-o" href="favorites.html">View Profile</a></div></section>
  <section class="card"><h2>Puja & Address Details</h2><div class="kv"><span>Description</span>For prosperity, happiness and family well-being.</div><div class="kv"><span>Duration</span>3 Hours (Approx.)</div><div class="kv"><span>Samagri</span>Purohit will bring the required samagri</div><div class="kv"><span>Dakshina</span>${inr(b.amt)}</div><div class="kv"><span>Address</span>${b.addr}</div><div class="kv"><span>Landmark</span>Near More Supermarket</div></section>
  <section class="card"><h2>Payment Information</h2><div class="kv"><span>Status</span>${badge(b.pay)}</div><div class="kv"><span>Method</span>UPI</div><div class="kv"><span>Transaction ID</span>UPI512345678901</div><div class="kv"><span>Amount</span>${inr(b.amt)}</div><button class="btn-o" id="inv">⬇ Download Invoice</button></section>
  <section class="card full"><h2>Booking Timeline</h2><br><div class="tl">${steps.map((s, i) => `<div class="${i < at - 1 ? "done" : i === at - 1 ? "now" : ""}"><i>${i < at - 1 ? "✓" : "●"}</i><b>${s}</b></div>`).join("")}</div></section>
  <section class="card full"><h2>Quick Actions</h2><br><div class="qa2"><button data-a="chat"><span>💬</span>Chat with Purohit</button><button data-a="resch"><span>📅</span>Reschedule</button><button data-a="cancel"><span>❌</span>Cancel Booking</button><button data-a="cal"><span>🗓️</span>Save to Calendar</button><button data-a="share"><span>🔗</span>Share Booking</button><button data-a="help"><span>🎧</span>Contact Support</button></div></section>
  <div class="note full"><div><b>Need to make changes?</b><p>You can reschedule or cancel your booking as per our cancellation policy.</p></div><button class="btn-o" id="policy">View Cancellation Policy</button></div>`;
    $("#policy").onclick = policy;
    $("#edit").onclick = () => toast("Edit request sent to support");
    $("#inv").onclick = () =>
      download(
        "invoice-" + b.id + ".txt",
        `PurohitMitra Invoice\n${b.id}\n${b.puja}\n${inr(b.amt)}`,
      );
    $(".qa2").onclick = (e) => {
      const a = e.target.closest("button")?.dataset.a;
      if (!a) return;
      if (a === "chat") location.href = "messages.html";
      if (a === "help") location.href = "help-support.html";
      if (a === "cancel" && cancel(b.id)) location.href = "my-bookings.html";
      if (a === "resch") toast("Reschedule request sent");
      if (a === "cal") toast("Event saved to calendar (demo)");
      if (a === "share") {
        navigator.clipboard && navigator.clipboard.writeText(location.href);
        toast("Booking link copied");
      }
    };
  }
});
