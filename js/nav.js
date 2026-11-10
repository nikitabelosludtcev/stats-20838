(function () {
  const btn = document.querySelector("[data-nav-toggle]");
  if (btn) {
    btn.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
      btn.setAttribute("aria-expanded", document.body.classList.contains("nav-open") ? "true" : "false");
    });
  }
  document.querySelectorAll(".sidenav a").forEach(function (a) {
    a.addEventListener("click", function () {
      document.body.classList.remove("nav-open");
    });
  });
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".sidenav a").forEach(function (a) {
    const href = a.getAttribute("href") || "";
    if (href.endsWith(here) && here !== "") a.classList.add("active");
  });
})();
