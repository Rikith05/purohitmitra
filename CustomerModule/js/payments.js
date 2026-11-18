/**
 * Payments history and Offers & Discounts pages.
 * Vanilla JS, no frameworks.
 */

document.addEventListener("DOMContentLoaded", () => {
  const pg = document.body.dataset.page;
  // ----- Page: payments -----
  if (pg === "payments") {
    let tab = "all",
      q = "";
    const P = PM.payments;
    $("#pStats").innerHTML = [
      ["💳", "Total Amount Paid", inr(28450), "View Summary", "all"],
      ["✅", "Successful Payments", 12, "View Transactions", "Success"],
      [
        "🕒",
        "Pending Payments",
        P.filter((p) => p.status === "Pending").length,
        "View Pending",
        "Pending",
      ],
      ["↩", "Refunded Amount", inr(2350), "View Refunds", "Refunded"],
    ]
      .map(
        (s) =>
          `<div class="card stat"><div class="ico">${s[0]}</div><div><small>${s[1]}</small><b>${s[2]}</b><a class="link" href="#" data-go="${s[4]}">${s[3]} →</a></div></div>`,
      )
      .join("");
    const draw = () => {
      const r = P.filter(
        (p) => (tab === "all" || p.status === tab) && (p.tid + p.puja).toLowerCase().includes(q),
      );
      $("#pBody").innerHTML = r.length
        ? r
            .map(
              (p) =>
                `<tr><td>${p.tid}</td><td><b>${p.puja}</b><br><span class="muted">${p.sub}</span></td><td>${p.when}</td><td>${p.method}</td><td>${inr(p.amt)}</td><td>${badge(p.status)}</td><td>${p.status === "Pending" ? "–" : `<button class="dl" data-t="${p.tid}">⬇</button>`}</td></tr>`,
            )
            .join("")
        : '<tr><td colspan="7" class="empty">No transactions found.</td></tr>';
      $("#pCount").textContent = `Showing ${r.length} of ${P.length} transactions`;
    };
    initTabs("#pTabs", (t) => {
      tab = t;
      draw();
    });
    $("#pSearch").oninput = (e) => {
      q = e.target.value.toLowerCase();
      draw();
    };
    $("#pStats").onclick = (e) => {
      const g = e.target.dataset.go;
      if (g) {
        e.preventDefault();
        $(`#pTabs [data-tab="${g}"]`).click();
      }
    };
    $("#pBody").onclick = (e) => {
      const t = e.target.dataset.t;
      if (t) {
        const p = P.find((x) => x.tid === t);
        download(
          "invoice-" + t + ".txt",
          `PurohitMitra Invoice\n${t}\n${p.puja}\n${inr(p.amt)} - ${p.status}\n${p.when}`,
        );
      }
    };
    draw();
  }
  // ----- Page: offers -----
  if (pg === "offers") {
    let tab = "all";
    const O = PM.offers;
    const draw = () => {
      const r = O.filter((o) => tab === "all" || o.s === tab);
      $("#oList").innerHTML =
        r
          .map(
            (
              o,
            ) => `<div class="off"><div class="oi">${o.i || '🎁'}</div><div class="grow"><h3>${o.t || ''}</h3><p class="muted">${o.d || ''}</p></div>
    <div class="cd" data-c="${o.code}"><b>${o.code}</b> ⧉<small>Tap to copy</small></div><div><small class="muted">${o.s === "upcoming" ? "" : "Valid Till"}</small><br><b>${o.till || ''}</b>${o.min ? `<br><small class="muted">Min. Purchase ${inr(o.min)}</small>` : ""}</div>
    ${o.s === "active" ? `<button class="btn" data-c="${o.code}">Apply Now</button>` : '<span class="badge b-warn">UPCOMING</span>'}</div>`,
          )
          .join("") || '<p class="empty">No offers.</p>';
      const tabAll = $("#oTabs [data-tab=all]");
      if (tabAll) tabAll.textContent = `All Offers (${O.length})`;
      const tabAct = $("#oTabs [data-tab=active]");
      if (tabAct) tabAct.textContent = `Active (${O.filter((o) => o.s === "active").length})`;
      const tabUp = $("#oTabs [data-tab=upcoming]");
      if (tabUp) tabUp.textContent = `Upcoming (${O.filter((o) => o.s === "upcoming").length})`;
    };
    const apply = (c) => {
      navigator.clipboard && navigator.clipboard.writeText(c);
      toast(`Code ${c} applied — use it at checkout`);
    };
    initTabs("#oTabs", (t) => {
      tab = t;
      draw();
    });
    $("#oList").onclick = (e) => {
      const c = e.target.closest("[data-c]")?.dataset.c;
      if (c) apply(c);
    };
    $("#promoBtn").onclick = () => {
      const c = $("#promo").value.trim().toUpperCase(),
        o = O.find((x) => x.code === c && x.s === "active");
      o ? apply(c) : toast("Invalid or inactive promo code");
    };
    $("#how").onclick = () =>
      openModal(
        "How to Use Offers",
        "<p>1. Copy a promo code.<br>2. Book a puja and open Review & Pay.<br>3. Enter the code to see the discount.</p>",
      );
    draw();
  }
});
