(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.getElementById("header");
  const progressBar = document.querySelector(".progress__bar");
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobile-menu");

  /* ------------------------------------------------------------------
     Header state + reading progress
     ------------------------------------------------------------------ */
  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 40);

    if (progressBar) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(y / scrollable, 1) : 0;
      progressBar.style.transform = `scaleX(${ratio})`;
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ------------------------------------------------------------------
     Number counters
     ------------------------------------------------------------------ */
  const counters = document.querySelectorAll("[data-count]");
  const formatNumber = (value) => Math.round(value).toLocaleString("ja-JP");

  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    if (Number.isNaN(target)) return;

    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1600;

    if (reduceMotion) {
      el.textContent = prefix + formatNumber(target) + suffix;
      return;
    }

    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + formatNumber(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (counters.length) {
    if ("IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runCounter(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((el) => counterObserver.observe(el));
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ------------------------------------------------------------------
     FAQ accordion
     ------------------------------------------------------------------ */
  const accButtons = Array.from(document.querySelectorAll(".acc-btn"));

  const closePanel = (btn) => {
    btn.setAttribute("aria-expanded", "false");
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (panel) panel.style.maxHeight = "0px";
  };

  accButtons.forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      accButtons.forEach((other) => {
        if (other !== btn && other.getAttribute("aria-expanded") === "true") {
          closePanel(other);
        }
      });

      if (isOpen) {
        closePanel(btn);
      } else {
        btn.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  const refreshOpenPanels = () => {
    accButtons.forEach((btn) => {
      if (btn.getAttribute("aria-expanded") === "true") {
        const panel = document.getElementById(btn.getAttribute("aria-controls"));
        if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  };
  window.addEventListener("resize", refreshOpenPanels);

  /* ------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------ */
  let menuOpen = false;

  const setMenu = (open) => {
    if (!menuBtn || !mobileMenu) return;
    menuOpen = open;
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    mobileMenu.setAttribute("aria-hidden", String(!open));
    if (open) {
      mobileMenu.removeAttribute("inert");
    } else {
      mobileMenu.setAttribute("inert", "");
    }
  };

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => setMenu(!menuOpen));
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuOpen) setMenu(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 980 && menuOpen) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------
     Active nav item
     ------------------------------------------------------------------ */
  const navLinks = Array.from(document.querySelectorAll(".nav a"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-42% 0px -50% 0px" }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ------------------------------------------------------------------
     Subtle hero parallax
     ------------------------------------------------------------------ */
  const hero = document.querySelector(".hero");
  const heroSvg = document.querySelector(".hero__svg");
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (hero && heroSvg && finePointer && !reduceMotion) {
    let frame = null;
    let targetX = 0;
    let targetY = 0;

    hero.addEventListener("mousemove", (event) => {
      const rect = hero.getBoundingClientRect();
      targetX = (event.clientX - rect.left) / rect.width - 0.5;
      targetY = (event.clientY - rect.top) / rect.height - 0.5;

      if (frame) return;
      frame = requestAnimationFrame(() => {
        heroSvg.style.transform = `translate3d(${targetX * -14}px, ${targetY * -10}px, 0) scale(1.02)`;
        frame = null;
      });
    });

    hero.addEventListener("mouseleave", () => {
      heroSvg.style.transform = "";
    });
  }
})();
