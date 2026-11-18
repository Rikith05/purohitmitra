/**
 * My Profile, Saved Addresses and Settings pages.
 * Vanilla JS, no frameworks.
 */

document.addEventListener("DOMContentLoaded", () => {
  const pg = document.body.dataset.page,
    A = PM.addresses;
  const form = (a) =>
    `<div class="fld"><label>Label</label><input id="al" value="${esc(a.label || "")}"></div><div class="fld"><label>Type</label><select id="at">${["Home", "Work", "Other"].map((t) => `<option ${a.type === t ? "selected" : ""}>${t}</option>`).join("")}</select></div><div class="fld"><label>Full address</label><textarea id="ad" rows="3">${esc(a.line || "")}</textarea></div><div class="fld"><label>Phone</label><input id="ap" value="${esc(a.ph || "+91 ")}"></div>`;
  const readF = (bg, a) => {
    const l = $("#al", bg).value.trim(),
      d = $("#ad", bg).value.trim(),
      p = $("#ap", bg).value.trim();
    if (!l || d.length < 10 || p.length < 10) {
      toast("Fill label, full address and phone");
      return false;
    }
    a.label = l;
    a.type = $("#at", bg).value;
    a.line = d;
    a.ph = p;
    return true;
  };
  const icon = (t) => ({ Home: "🏠", Work: "💼", Other: "📍" })[t];
  // ----- Page: my-profile -----
  if (pg === "my-profile") {
    const inputs = $$("#pf input,#pf select"),
      sel = $$("#pf select");
    let snap;
    const edit = (on) => {
      inputs.forEach((i) => (i.tagName === "SELECT" ? (i.disabled = !on) : (i.readOnly = !on)));
      $("#saveRow").hidden = !on;
      if (on) {
        snap = inputs.map((i) => i.value);
        inputs[0].focus();
      }
    };
    $("#editP").onclick = () => edit(true);
    $("#cancel").onclick = () => {
      inputs.forEach((i, k) => (i.value = snap[k]));
      edit(false);
    };
    $("#save").onclick = () => {
      const n = $("[name=name]").value.trim(),
        m = $("[name=mail]").value;
      if (!n || !/^\S+@\S+\.\S+$/.test(m)) {
        toast("Enter a valid name and email");
        return;
      }
      $(".user b").textContent = n;
      edit(false);
      toast("Profile updated successfully");
    };
    $("#photo").onclick = () => toast("Photo upload needs a backend (demo)");
    $$("[data-ch]").forEach(
      (a) =>
        (a.onclick = () =>
          openModal(
            "Change " + a.dataset.ch,
            '<div class="fld"><label>New ' +
              a.dataset.ch +
              '</label><input id="nv" type="' +
              (a.dataset.ch === "password" ? "password" : "text") +
              '"></div>',
            (bg) => {
              if ($("#nv", bg).value.length < 4) {
                toast("Too short");
                return false;
              }
              toast(a.dataset.ch + " updated");
            },
          )),
    );
    const drawA = () => {
      $("#pAddr").innerHTML = A.slice(0, 2)
        .map(
          (a) =>
            `<div class="ad"><div><b>${a.label}${a.def ? " ⭐ (Default)" : ""}</b><br>${a.line}<br>📞 ${a.ph}</div><a class="link" href="saved-addresses.html">Edit</a></div>`,
        )
        .join("");
    };
    drawA();
  }
  // ----- Page: saved-addresses -----
  if (pg === "saved-addresses") {
    let tab = "all";
    const draw = () => {
      const r = A.filter((a) => tab === "all" || a.type === tab);
      ["all", "Home", "Work", "Other"].forEach((t) => {
        const b = $(`[data-tab=${t}]`);
        if (b) {
          b.textContent =
            (t === "all" ? "All Addresses" : t) +
            ` (${t === "all" ? A.length : A.filter((a) => a.type === t).length})`;
        }
      });
      const aList = $("#aList");
      if (aList) {
        aList.innerHTML =
          r
            .map(
              (a) =>
                `<div class="ac ${a.def ? "def" : ""}"><div class="top3"><div class="thumb">${a.i || '🏠'}</div><div><h3>${a.label || 'Address'} ${a.def ? '<span class="tagd">DEFAULT</span>' : ""}</h3><p class="muted">${a.line || ''}</p><p>📞 ${a.ph || ''}</p></div></div><div class="acts"><button data-a="edit" data-id="${a.id}">✎ Edit</button><button class="del" data-a="del" data-id="${a.id}">🗑 Delete</button><button class="gray" data-a="def" data-id="${a.id}">${a.def ? "✓ Default Address" : "○ Set as Default"}</button></div></div>`,
            )
            .join("") || '<p class="empty">No addresses.</p>';
      }
    };
    initTabs("#aTabs", (t) => {
      tab = t;
      draw();
    });
    $("#addA").onclick = () => {
      const a = {};
      openModal(
        "Add New Address",
        form(a),
        (bg) => {
          if (!readF(bg, a)) return false;
          a.id = Date.now();
          a.def = false;
          a.i = icon(a.type);
          A.push(a);
          draw();
          toast("Address added");
        },
        "Add",
      );
    };
    $("#aList").onclick = (e) => {
      const id = +e.target.dataset.id,
        a = A.find((x) => x.id === id);
      if (!a) return;
      const k = e.target.dataset.a;
      if (k === "edit")
        openModal("Edit Address", form(a), (bg) => {
          if (readF(bg, a)) {
            a.i = icon(a.type);
            draw();
            toast("Address updated");
          } else return false;
        });
      if (k === "del") {
        if (a.def) {
          toast("Set another address as default first");
          return;
        }
        if (confirm("Delete this address?")) {
          A.splice(A.indexOf(a), 1);
          draw();
          toast("Address deleted");
        }
      }
      if (k === "def") {
        A.forEach((x) => (x.def = false));
        a.def = true;
        draw();
        toast(a.label + " set as default");
      }
    };
    draw();
  }
  // ----- Page: settings -----
  if (pg === "settings") {
    const acc = [
      ["Full Name", "Srinivas Somisetti"],
      ["Mobile Number", "+91 98490 12345"],
      ["Email Address", "srinivas.somisetti@gmail.com"],
      ["Date of Birth", "15/08/1987"],
      ["Language Preference", "English"],
    ];
    const drawAcc = () => {
      $("#acc").innerHTML = acc
        .map(
          (r, i) =>
            `<div class="pr"><span class="muted">${r[0]}</span><b class="grow pl">${esc(r[1])}</b><button class="btn-o" data-i="${i}">✎ Edit</button></div>`,
        )
        .join("");
    };
    drawAcc();
    $("#acc").onclick = (e) => {
      const i = e.target.dataset.i;
      if (i === undefined) return;
      openModal("Edit " + acc[i][0], `<input id="v" value="${esc(acc[i][1])}">`, (bg) => {
        const v = $("#v", bg).value.trim();
        if (!v) {
          toast("Value required");
          return false;
        }
        acc[i][1] = v;
        drawAcc();
        toast(acc[i][0] + " updated");
      });
    };
    const ap = [
      ["Theme", ["Light", "Dark"]],
      ["Calendar Preference", ["Gregorian Calendar", "Telugu Panchangam"]],
      ["Time Format", ["12 Hour (AM/PM)", "24 Hour"]],
      ["Currency", ["INR (₹)"]],
    ];
    $("#appP").innerHTML = ap
      .map(
        (a) =>
          `<div class="pr"><span>${a[0]}</span><select data-n="${a[0]}">${a[1].map((o) => `<option>${o}</option>`).join("")}</select></div>`,
      )
      .join("");
    $("#appP").onchange = (e) => toast(e.target.dataset.n + " set to " + e.target.value);
    document.addEventListener("click", (e) => {
      const s = e.target.dataset.s;
      if (s) {
        e.preventDefault();
        openModal(s, '<p class="muted">This section is a frontend demo placeholder.</p>');
      }
    });
  }
});
