"use strict";

// Navigation and a single animation-frame scroll update.
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-navigation");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const mobile = matchMedia("(max-width: 700px)");
const lightbox = document.querySelector("#lightbox");
const navLinks = [...navigation.querySelectorAll("a")];
const sections = [
  ...new Set(navLinks.map((link) => document.querySelector(link.hash))),
].sort((a, b) =>
  a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
);
const progress = document.querySelector(".scroll-progress");
const backToTop = document.querySelector(".back-to-top");
const invitation = document.querySelector(".celebration-cta");
const invitationImage = invitation.querySelector("img");

function syncScrollLock() {
  document.body.classList.toggle(
    "locked",
    header.classList.contains("menu-open") || lightbox.open,
  );
}
function setMenu(open, restoreFocus = false) {
  header.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
  document.querySelector("main").inert = open;
  document.querySelector("footer").inert = open;
  backToTop.inert = open;
  syncScrollLock();
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener("click", () =>
  setMenu(!header.classList.contains("menu-open")),
);
navLinks.forEach((link) =>
  link.addEventListener("click", () => setMenu(false)),
);
header.querySelector(".brand").addEventListener("click", () => setMenu(false));
mobile.addEventListener("change", () => {
  if (!mobile.matches) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (!header.classList.contains("menu-open")) return;
  if (event.key === "Escape") setMenu(false, true);
  if (event.key === "Tab") {
    const focusable = [header.querySelector(".brand"), menuButton, ...navLinks];
    const first = focusable[0],
      last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
let scrollPending = false;
function updateScroll() {
  header.classList.toggle("scrolled", scrollY > 30);
  backToTop.classList.toggle("visible", scrollY > 650);
  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${maxScroll > 0 ? scrollY / maxScroll : 0})`;
  // Restrict the gentle image movement to a visible desktop section.
  const invitationRect = invitation.getBoundingClientRect();
  if (
    !reducedMotion.matches &&
    !mobile.matches &&
    invitationRect.top < innerHeight &&
    invitationRect.bottom > 0
  ) {
    const offset = Math.max(
      -30,
      Math.min(
        30,
        (innerHeight / 2 - invitationRect.top - invitationRect.height / 2) *
          0.07,
      ),
    );
    invitationImage.style.transform = `translateY(${offset}px)`;
  } else if (reducedMotion.matches || mobile.matches) {
    invitationImage.style.transform = "none";
  }
  let current = sections[0];
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= 160) current = section;
  });
  navLinks.forEach((link) => {
    if (link.hash === `#${current.id}`)
      link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  scrollPending = false;
}
addEventListener(
  "scroll",
  () => {
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(updateScroll);
    }
  },
  { passive: true },
);
addEventListener("resize", updateScroll);
updateScroll();
document.querySelector("#year").textContent = new Date().getFullYear();

// One-time reveals; content remains visible without IntersectionObserver.
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  document.body.classList.add("reveal-ready");
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  document
    .querySelectorAll("[data-reveal]")
    .forEach((element) => observer.observe(element));
  document
    .querySelectorAll(".services-grid, .why-grid, .process-list")
    .forEach((group) => {
      [...group.children].forEach((child, index) =>
        child.style.setProperty("--delay", `${(index % 3) * 70}ms`),
      );
    });
}

// Filtered gallery with native dialog focus trapping and keyboard navigation.
const galleryItems = [...document.querySelectorAll(".gallery-item")];
let visibleItems = galleryItems;
let imageIndex = 0;
let galleryOpener;
const lightboxImage = document.querySelector("#lightbox-img");
function showImage(index) {
  imageIndex = (index + visibleItems.length) % visibleItems.length;
  const item = visibleItems[imageIndex];
  const image = item.querySelector("img");
  lightboxImage.src = image.getAttribute("src");
  lightboxImage.alt = image.alt;
  document.querySelector("#lightbox-caption").textContent =
    item.querySelector("strong").textContent;
  document.querySelector("#lightbox-count").textContent =
    `${imageIndex + 1} / ${visibleItems.length}`;
  document.querySelector("#lightbox-prev").disabled = visibleItems.length < 2;
  document.querySelector("#lightbox-next").disabled = visibleItems.length < 2;
}
document.querySelectorAll("[data-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((filter) => {
      filter.classList.toggle("active", filter === button);
      filter.setAttribute("aria-pressed", String(filter === button));
    });
    galleryItems.forEach((item) => {
      item.hidden =
        button.dataset.filter !== "all" &&
        item.dataset.category !== button.dataset.filter;
    });
    visibleItems = galleryItems.filter((item) => !item.hidden);
    document
      .querySelector(".gallery-grid")
      .classList.toggle("filtered", button.dataset.filter !== "all");
    updateScroll();
  }),
);
galleryItems.forEach((item) =>
  item.addEventListener("click", () => {
    galleryOpener = item;
    showImage(visibleItems.indexOf(item));
    lightbox.showModal();
    syncScrollLock();
    document.querySelector("#lightbox-close").focus();
  }),
);
document
  .querySelector("#lightbox-close")
  .addEventListener("click", () => lightbox.close());
document
  .querySelector("#lightbox-prev")
  .addEventListener("click", () => showImage(imageIndex - 1));
document
  .querySelector("#lightbox-next")
  .addEventListener("click", () => showImage(imageIndex + 1));
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    const controls = [...lightbox.querySelectorAll("button:not(:disabled)")];
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showImage(imageIndex + (event.key === "ArrowLeft" ? -1 : 1));
  }
});
lightbox.addEventListener("click", (event) => {
  if (
    event.target === lightbox ||
    event.target.classList.contains("lightbox-stage")
  )
    lightbox.close();
});
lightbox.addEventListener("close", () => {
  syncScrollLock();
  galleryOpener?.focus();
});
let touchStart = null;
lightboxImage.addEventListener(
  "touchstart",
  (event) => {
    touchStart = event.changedTouches[0].clientX;
  },
  { passive: true },
);
lightboxImage.addEventListener(
  "touchend",
  (event) => {
    if (touchStart !== null) {
      const delta = event.changedTouches[0].clientX - touchStart;
      if (Math.abs(delta) > 55) showImage(imageIndex + (delta < 0 ? 1 : -1));
    }
    touchStart = null;
  },
  { passive: true },
);

// Slow carousel: pauses for hover, focus, hidden pages and reduced motion.
const reviewSection = document.querySelector("#reviews");
const reviews = [...document.querySelectorAll(".review-slide")];
const pauseButton = document.querySelector("#review-pause");
let reviewIndex = 0;
let reviewsPaused = reducedMotion.matches;
let reviewTimer;
function showReview(direction) {
  reviewIndex = (reviewIndex + direction + reviews.length) % reviews.length;
  reviews.forEach((review, index) => {
    review.hidden = index !== reviewIndex;
  });
  document.querySelector("#review-count").textContent =
    `0${reviewIndex + 1} / 0${reviews.length}`;
}
function updateReviewTimer() {
  clearInterval(reviewTimer);
  pauseButton.hidden = reducedMotion.matches;
  pauseButton.textContent = reviewsPaused ? "Play" : "Pause";
  pauseButton.setAttribute(
    "aria-label",
    reviewsPaused ? "Play automatic reviews" : "Pause automatic reviews",
  );
  if (
    !reviewsPaused &&
    !reducedMotion.matches &&
    !document.hidden &&
    !reviewSection.matches(":hover") &&
    !reviewSection.contains(document.activeElement)
  ) {
    reviewTimer = setInterval(() => showReview(1), 8000);
  }
}
document.querySelector("#review-prev").addEventListener("click", () => {
  showReview(-1);
  updateReviewTimer();
});
document.querySelector("#review-next").addEventListener("click", () => {
  showReview(1);
  updateReviewTimer();
});
pauseButton.addEventListener("click", () => {
  reviewsPaused = !reviewsPaused;
  updateReviewTimer();
});
reviewSection.addEventListener("mouseenter", () => clearInterval(reviewTimer));
reviewSection.addEventListener("mouseleave", updateReviewTimer);
reviewSection.addEventListener("focusin", () => clearInterval(reviewTimer));
reviewSection.addEventListener("focusout", () =>
  setTimeout(updateReviewTimer, 0),
);
document.addEventListener("visibilitychange", updateReviewTimer);
reducedMotion.addEventListener("change", () => {
  reviewsPaused = reducedMotion.matches;
  updateReviewTimer();
  updateScroll();
});
updateReviewTimer();

// Frontend-only forms: validate, preview and explicitly hand off to email.
const dateInput = document.querySelector("#date");
function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
dateInput.min = localDate();
function validateField(field) {
  let message = "";
  const value = field.value.trim();
  if (field.required && !value) message = "Please complete this field.";
  else if (
    field.type === "email" &&
    value &&
    (field.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
  )
    message = "Enter a valid email address.";
  else if (field.id === "phone" && value) {
    const normalized = value.replace(/[\s()\-]/g, "");
    if (
      !/^(?:09\d{9}|\+639\d{9}|639\d{9}|0[2-8]\d{8,9}|\+63[2-8]\d{7,9})$/.test(
        normalized,
      )
    )
      message =
        "Enter a Philippine number, e.g. 0917 123 4567 or (046) 494 6597.";
  } else if (field.type === "date" && value < localDate())
    message = "Choose today or a future date.";
  else if (
    field.type === "number" &&
    (!Number.isInteger(Number(value)) ||
      Number(value) < 1 ||
      Number(value) > 100000)
  )
    message = "Enter a whole number between 1 and 100,000.";
  const error = document.querySelector(`#${field.id}-error`);
  error.textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
  field.setAttribute(
    "aria-describedby",
    `${field.id === "phone" ? "phone-hint " : ""}${error.id}`,
  );
  return !message;
}
document.querySelectorAll("form").forEach((form) => {
  const fields = [...form.querySelectorAll("input, select, textarea")];
  const result = form.querySelector(".form-result");
  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      if (field.value || field.getAttribute("aria-invalid") === "true")
        validateField(field);
    });
    field.addEventListener("input", () => {
      result.hidden = true;
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    dateInput.min = localDate();
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) {
      result.hidden = true;
      fields
        .find((field) => field.getAttribute("aria-invalid") === "true")
        .focus();
      return;
    }
    const inquiry = form.id === "quoteForm";
    const subject = inquiry
      ? `Event inquiry — ${document.querySelector("#event-type").value}`
      : document.querySelector("#contact-subject").value.trim();
    const body = fields
      .map((field) => `${field.name}: ${field.value.trim() || "Not specified"}`)
      .join("\n\n");
    result.replaceChildren();
    const title = document.createElement("h4");
    title.textContent = inquiry
      ? "Your inquiry has been prepared."
      : "Your message has been prepared.";
    const explanation = document.createElement("p");
    explanation.textContent =
      "Nothing has been sent yet. Review your details below, then open your email app to send them to jinanenterprises@gmail.com. You can also download a copy.";
    const preview = document.createElement("pre");
    preview.textContent = body;
    const actions = document.createElement("div");
    actions.className = "result-actions";
    const email = document.createElement("a");
    email.textContent = "Open email app ↗";
    email.href = `mailto:jinanenterprises@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const download = document.createElement("button");
    download.type = "button";
    download.textContent = "Download a copy ↓";
    download.addEventListener("click", () => {
      const url = URL.createObjectURL(
        new Blob(
          [`${subject}\n\n${body}\n\nSend to: jinanenterprises@gmail.com`],
          { type: "text/plain;charset=utf-8" },
        ),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "JB-Nav-inquiry.txt";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    actions.append(email, download);
    result.append(title, explanation, actions, preview);
    result.hidden = false;
    result.scrollIntoView({
      behavior: reducedMotion.matches ? "instant" : "smooth",
      block: "nearest",
    });
  });
});
