// NAVIGATION PANEL
let navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

// MENU SHOW
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
    navToggle.setAttribute("aria-expanded", "true");
  });
}

// MENU HIDDEN
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  });
}

// REMOVE MENU MOBILE
const navLink = document.querySelectorAll(".nav_link");

function linkAction() {
  navMenu = document.getElementById("nav-menu");
  navMenu.classList.remove("show-menu");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

// HEADER SHADOW
function scrollHeader() {
  const nav = document.getElementById("header");
  if (this.scrollY >= 80) nav.classList.add("scroll-header");
  else nav.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

// DARK/LIGHT THEME
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "uil-sun";

// Browsers set to block site data, and some locked-down profiles, throw on any
// localStorage access. An unguarded call here stops the whole script, which
// took the theme toggle, the typing animation and the keyboard handlers down
// with it. The theme still toggles for the visit; it just is not remembered.
function readStored(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}
function writeStored(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // storage unavailable: the choice applies to this visit only
  }
}

// Previously selected topic (if user selected)
const selectedTheme = readStored("selected-theme");
const selectedIcon = readStored("selected-icon");

// obtain the current theme
const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun";

if (selectedTheme) {
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
    darkTheme
  );
  themeButton.classList[selectedIcon === "uil-moon" ? "add" : "remove"](
    iconTheme
  );
}

// Activate/Deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  // Add or remove the dark icon/theme
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);
  // We save the theme and the current icon that the user chose
  writeStored("selected-theme", getCurrentTheme());
  writeStored("selected-icon", getCurrentIcon());
});

// KEYBOARD ACCESS FOR ICON CONTROLS
// These are <i>/<div> elements, so they are not focusable and do not fire a
// click on Enter/Space the way a <button> does.
[navToggle, navClose, themeButton].forEach((el) => {
  if (!el) return;
  el.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      el.click();
    }
  });
});


// ICON FONT CHECK
// Every icon is a glyph from the unicons stylesheet on a third-party CDN. If it
// fails in any way, the icon elements collapse to nothing and the theme toggle
// and mobile menu button become impossible to tap. The stylesheet's onerror
// only catches a hard network failure; a firewall that answers with an HTML
// "blocked" page, or a font file that never arrives, gets through it. So check
// the outcome instead: does an icon actually render, and did the font load?
// Turns text labels on via .no-icons (see custom.css) and off again if the
// font turns up late.
(function () {
  const probe = document.createElement("i");
  probe.className = "uil uil-moon";
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = "position:absolute;left:-9999px;visibility:hidden";
  document.body.appendChild(probe);

  function iconsFailed(stalled) {
    // No glyph at all: the stylesheet never applied (blocked, or a block page).
    if (probe.offsetWidth === 0) return true;
    const faces = Array.from(document.fonts || []).filter((f) =>
      /unicons/i.test(f.family)
    );
    if (faces.some((f) => f.status === "loaded")) return false;
    // The stylesheet applied but the font file itself failed.
    if (faces.some((f) => f.status === "error")) return true;
    // Still downloading after a few seconds: show labels until it arrives.
    if (stalled && faces.some((f) => f.status === "loading")) return true;
    return false;
  }

  function update(stalled) {
    document.documentElement.classList.toggle("no-icons", iconsFailed(stalled));
  }

  window.addEventListener("load", () => update(false));
  if (document.fonts) {
    document.fonts.ready.then(() => update(false));
    document.fonts.addEventListener("loadingdone", () => update(false));
    document.fonts.addEventListener("loadingerror", () => update(false));
  }
  setTimeout(() => update(true), 4000);
})();
