// Formspree code
const form = document.getElementById("contact-form");

// Show a message in the banner above the form. Failures stay up longer so the
// visitor has time to read the fallback address and copy their message.
function showFormAlert(message, ok) {
  const status = document.getElementById("alert");
  status.textContent = message;
  status.classList.toggle("alert_error", !ok);
  status.style.display = "block";
  setTimeout(function () {
    status.style.display = "none";
  }, ok ? 4000 : 12000);
}

async function handleSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);

  try {
    const response = await fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
        Accept: "application/json",
      },
    });

    // fetch() only rejects on a network failure, so an HTTP error such as 429
    // (rate limited) or 403 still lands here. Without this check the visitor
    // would be told the message was sent when it never arrived.
    if (response.ok) {
      showFormAlert("Your message has been sent.", true);
      form.reset();
      return;
    }

    let detail = "";
    try {
      const body = await response.json();
      if (body && Array.isArray(body.errors) && body.errors.length) {
        detail = " " + body.errors.map((e) => e.message).join(" ");
      }
    } catch (e) {
      // no JSON body; the generic message below still applies
    }
    // Deliberately not resetting the form: the visitor keeps what they typed.
    showFormAlert(
      "Your message was not sent." +
        detail +
        " Please email me directly at joshiutsav2000@gmail.com.",
      false
    );
  } catch (error) {
    showFormAlert(
      "Your message could not be sent. Please check your connection, or email me directly at joshiutsav2000@gmail.com.",
      false
    );
  }
}
form.addEventListener("submit", handleSubmit);

// FORM BORDERS 
$("#contact-form input,#contact-form textarea").on("input focusin",(e)=>{
  $(e.target).parent().addClass("focusIn");
  if ($(e.target).val().trim().length > 0) {
    $(e.target).parent().addClass("valid");
    $(e.target).parent().removeClass("invalid");
  } else {
    $(e.target).parent().addClass("invalid");
    $(e.target).parent().removeClass("valid");
  }
});

$("#contact-form input,#contact-form textarea").on("focusout",(e)=>{
    $(e.target).parent().removeClass("focusIn");
});

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
  if (navToggle) navToggle.setAttribute("aria-expanded", "false");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

// SKILLS
const skillContent = document.querySelectorAll(".skill");
const skillHeader = document.querySelectorAll(".skills_header");
const skillContentArr = Array.from(skillContent);
const skillHeaderArr = Array.from(skillHeader);

skillHeaderArr.forEach((element, idx) => {
  element.addEventListener("click", function () {
    skillContentArr[idx].classList.toggle("skills_open");
  });
});

// QUALIFICATION TABS
let education = document.getElementById("education");
let work = document.getElementById("work");
let educationheader = document.getElementById("educationheader");
let workheader = document.getElementById("workheader");
workheader.style.color = "var(--text-color)";
educationheader.style.color = "var(--first-color)";

educationheader.addEventListener("click", () => {
  let condition1 = work.classList.contains("qualification-inactive");
  if (!condition1) {
    education.classList.remove("qualification-inactive");
    work.classList.add("qualification-inactive");
    workheader.style.color = "var(--text-color)";
    educationheader.style.color = "var(--first-color)";
  }
});
workheader.addEventListener("click", () => {
  let condition2 = education.classList.contains("qualification-inactive");
  if (!condition2) {
    work.classList.remove("qualification-inactive");
    education.classList.add("qualification-inactive");
    educationheader.style.color = "var(--text-color)";
    workheader.style.color = "var(--first-color)";
  }
});

// PROJECTS: technical-details expand/collapse
// The panel is sized to its real content height (figures, wrapped text) so
// nothing gets clipped; it is re-measured on resize and when images load.
function fitPortfolioDetails(details) {
  details.style.maxHeight = details.scrollHeight + "px";
}

document.querySelectorAll(".portfolio_toggle").forEach((toggle) => {
  const label = toggle.querySelector(".portfolio_toggle-label");
  const details = toggle.nextElementSibling;

  details.querySelectorAll("img").forEach((img) => {
    img.addEventListener("load", () => {
      if (details.classList.contains("is-open")) fitPortfolioDetails(details);
    });
  });

  toggle.addEventListener("click", () => {
    const isOpen = !toggle.classList.contains("is-open");
    toggle.classList.toggle("is-open", isOpen);
    details.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      fitPortfolioDetails(details);
    } else {
      details.style.maxHeight = "";
    }
    if (label) {
      label.textContent = isOpen ? "Hide technical details" : "View technical details";
    }
  });
});

window.addEventListener("resize", () => {
  document
    .querySelectorAll(".portfolio_details.is-open")
    .forEach(fitPortfolioDetails);
});

// SCROLL SECTIONS ACTIVE LINK
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    let sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav_menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav_menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}
window.addEventListener("scroll", scrollActive);

// HEADER SHADOW
function scrollHeader() {
  const nav = document.getElementById("header");
  if (this.scrollY >= 80) nav.classList.add("scroll-header");
  else nav.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

// SHOW SCROLL UP BUTTON
function scrollUpfunc() {
  const scrollUp = document.getElementById("scroll-up");
  if (this.scrollY >= 560) scrollUp.classList.add("show-scroll");
  else scrollUp.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUpfunc);

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

// Typing Animation using Typed JS
// Runs for every visitor. The span is pre-filled with "Mechanical" in the HTML
// so the line still reads correctly if JavaScript fails to load; we clear it
// here because Typed treats existing text as already typed and would skip
// typing out the first string on every loop.
document.querySelector(".type").textContent = "";
var typed = new Typed(".type", {
  strings: ["Mechanical", "Manufacturing", "Quality", "Design"],
  smartBackspace: true,
  startDelay: 1000,
  typeSpeed: 130,
  backDelay: 1000,
  backSpeed: 60,
  loop: true,
});

// KEYBOARD ACCESS FOR ICON CONTROLS
// The theme toggle and the menu buttons are <i>/<div> elements, so a browser
// will not focus them or fire a click on Enter/Space the way it does a
// <button>. These give them the same behaviour without changing the layout.
[navToggle, navClose, themeButton].forEach((el) => {
  if (!el) return;
  el.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      el.click();
    }
  });
});
