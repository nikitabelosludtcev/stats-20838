(function () {
  function norm(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(",", ".");
  }

  function accepted(input) {
    return (input.dataset.accept || "")
      .split("|")
      .map(norm)
      .filter(Boolean);
  }

  function markOption(label, kind) {
    label.classList.remove("good", "bad");
    if (kind) label.classList.add(kind);
  }

  function show(box, ok, html) {
    box.classList.add("show", ok ? "ok" : "bad");
    box.classList.remove(ok ? "bad" : "ok");
    box.innerHTML = html;
  }

  function record(card, ok) {
    const page = document.body.dataset.page || location.pathname;
    const id = card.dataset.qid || "q";
    const key = "stats20838-progress";
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    const slot = data[page] || { correct: 0, tried: 0, items: {} };
    if (!slot.items[id]) slot.tried += 1;
    if (ok && !slot.items[id]) slot.correct += 1;
    slot.items[id] = ok || slot.items[id] === true;
    data[page] = slot;
    localStorage.setItem(key, JSON.stringify(data));
  }

  document.querySelectorAll("[data-quiz]").forEach(function (card) {
    const button = card.querySelector("[data-check]");
    const box = card.querySelector(".feedback");
    if (!button || !box) return;
    button.addEventListener("click", function () {
      const why = card.dataset.why || "";
      const kind = card.dataset.kind;
      if (kind === "mcq") {
        const picked = card.querySelector("input[type=radio]:checked");
        const answer = card.dataset.answer;
        card.querySelectorAll("label.opt").forEach(function (label) {
          const input = label.querySelector("input");
          markOption(label, "");
          if (input && input.value === answer) markOption(label, "good");
          else if (input && picked && input === picked && input.value !== answer) markOption(label, "bad");
        });
        const ok = !!(picked && picked.value === answer);
        const rightLabel = card.querySelector('input[value="' + answer + '"]');
        const rightText = rightLabel ? rightLabel.parentElement.textContent.trim() : answer;
        show(
          box,
          ok,
          (ok ? "Correct. " : "Not yet. The right answer is: <b>" + rightText + "</b>. ") + why
        );
        record(card, ok);
        return;
      }
      const fields = card.querySelectorAll("[data-accept]");
      let ok = true;
      const misses = [];
      fields.forEach(function (input) {
        const good = accepted(input).indexOf(norm(input.value)) !== -1;
        input.style.borderColor = good ? "#1d6b3a" : "#8f2d3a";
        if (!good) {
          ok = false;
          misses.push("<b>" + (input.dataset.label || "field") + "</b>: " + input.dataset.accept.split("|")[0]);
        }
      });
      show(
        box,
        ok,
        ok
          ? "Correct. " + why
          : "Not quite. Expected: " + misses.join("; ") + ". " + why
      );
      record(card, ok);
    });
  });

  document.querySelectorAll("[data-reveal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const scope = document.querySelector(btn.dataset.reveal) || document;
      scope.querySelectorAll(".hidden-sol").forEach(function (el) {
        el.style.display = "block";
      });
      scope.querySelectorAll("details.solution").forEach(function (el) {
        el.open = true;
      });
    });
  });
})();
