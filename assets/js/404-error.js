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

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

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
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
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
