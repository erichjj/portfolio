document.addEventListener("DOMContentLoaded", () => {
    /* ------ Sticky Navigation Bar Styling ------ */
    const header = document.querySelector("header");

    function stickyNavbar() {
        if (!header) return;
        header.classList.toggle("scrolled", window.pageYOffset > 0);
    }

    stickyNavbar();
    window.addEventListener("scroll", stickyNavbar);

    /* ------ Scroll Reveal Animation Styling ------ */
    if (typeof ScrollReveal !== "undefined") {
        const sr = ScrollReveal({
            duration: 2500,
            distance: "60px"
        });

        sr.reveal(".showcase-info", { delay: 200 });
        sr.reveal(".showcase-image", { origin: "top", delay: 250 });
    }

    /* ------ Skills Styling ------ */
    const first_skill = document.querySelector(".skill:first-child");
    const sk_counters = document.querySelectorAll(".counter span");
    const progress_bars = document.querySelectorAll(".skills svg circle");

    const ml_counter = document.querySelectorAll(".number span");

    let skillsPlayed = false;
    let mlPlayed = false;

    function updateCount(num, maxNum) {
        let currentNum = +num.innerText;

        if (currentNum < maxNum) {
            num.innerText = currentNum + 1;
            setTimeout(() => {
                updateCount(num, maxNum);
            }, 12);
        }
    }

    function hasReached(el) {
        if (!el) return false;
        const topPosition = el.getBoundingClientRect().top;
        return window.innerHeight >= topPosition + el.offsetHeight;
    }

    function skillsCounter() {
        if (!hasReached(first_skill)) return;

        skillsPlayed = true;

        sk_counters.forEach((counter, i) => {
            const target = +counter.dataset.target;
            const strokeValue = 427 - 427 * (target / 100);

            if (progress_bars[i]) {
                progress_bars[i].style.setProperty("--target", strokeValue);
            }
            setTimeout(() => {
                updateCount(counter, target);
            }, 400);
        });

        progress_bars.forEach((p) => (p.style.animation = "progress 2s ease-in-out forwards"));
    }

    function mlCounter() {
        if (!hasReached(first_skill)) return;

        mlPlayed = true;

        ml_counter.forEach((counter) => {
            const target = +counter.dataset.target;
            setTimeout(() => {
                updateCount(counter, target);
            }, 400);
        });
    }

    window.addEventListener("scroll", () => {
        if (!skillsPlayed) skillsCounter();
        if (!mlPlayed) mlCounter();
    });

    /* ------ Contact Me ------ */
    const name_input = document.getElementById("name-field");
    const email_input = document.getElementById("email-field");
    const message_input = document.getElementById("msg-field");

    const contactme_form = document.getElementById("form-contact");
    const error_element = document.getElementById("error-field");

    if (contactme_form) {
        contactme_form.addEventListener("submit", (e) => {
            const error_messages = [];
            if (!name_input?.value) {
                error_messages.push("Name is required");
            }

            if (!email_input?.value) {
                error_messages.push("Email is required");
            }

            if (!message_input?.value) {
                error_messages.push("Message is required.");
            }

            if (error_messages.length > 0) {
                e.preventDefault();
                if (error_element) error_element.innerHTML = error_messages.join(". ");
            } else {
                alert("Message sent successfully.");
            }
        });
    }

    /* ------ Navigation Link Highlight ------ */
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");
    const linksContainer = document.querySelector(".links");
    const underline = document.querySelector(".nav-underline");

    function updateUnderline() {
        if (!underline || !linksContainer || navLinks.length === 0) return;
        const active = Array.from(navLinks).find((l) => l.classList.contains("active")) || navLinks[0];
        const rect = active.getBoundingClientRect();
        const containerRect = linksContainer.getBoundingClientRect();
        const pad = 6;
        underline.style.left = `${rect.left - containerRect.left - pad}px`;
        underline.style.width = `${rect.width + pad * 2}px`;
    }

    function updateActiveLink() {
        let current = "";
        let maxOffset = -Infinity;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const triggerPoint = sectionTop - sectionHeight / 3;

            if (pageYOffset >= triggerPoint && triggerPoint > maxOffset) {
                const id = section.getAttribute("id");
                if (id) {
                    current = id;
                    maxOffset = triggerPoint;
                }
            }
        });

        document.querySelectorAll("div[id]").forEach((div) => {
            const divTop = div.offsetTop;
            const triggerPoint = divTop - 200;

            if (pageYOffset >= triggerPoint && triggerPoint > maxOffset) {
                current = div.getAttribute("id");
                maxOffset = triggerPoint;
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href")?.includes(current)) {
                link.classList.add("active");
            }
        });

        updateUnderline();
    }

    window.addEventListener("scroll", updateActiveLink);
    window.addEventListener("resize", updateUnderline);

    navLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => {
            navLinks.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
            updateUnderline();
        });

        link.addEventListener("mouseleave", () => {
            updateActiveLink();
        });
    });

    updateActiveLink();

    /* ------ Mobile Menu Toggle ------ */
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobile-menu");
    const closeMenu = document.getElementById("close-menu");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");

    function openMobileMenu() {
        if (!mobileMenu || !hamburger) return;
        mobileMenu.classList.add("active");
        hamburger.classList.add("active");
        mobileMenu.setAttribute("aria-hidden", "false");
    }

    function closeMobileMenu() {
        if (!mobileMenu || !hamburger) return;
        mobileMenu.classList.remove("active");
        hamburger.classList.remove("active");
        mobileMenu.setAttribute("aria-hidden", "true");
    }

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            if (mobileMenu?.classList.contains("active")) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener("click", closeMobileMenu);
    }

    mobileLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    /* ------ Dark Mode Toggle ------ */
    const darkModeToggle = document.getElementById("darkModeToggle");
    const toggleIcon = document.getElementById("toggleIcon");
    const html = document.documentElement;
    const logoImg = document.querySelector(".logo img");

    const currentTheme = localStorage.getItem("theme") || "light";

    if (currentTheme === "dark") {
        html.setAttribute("data-theme", "dark");
        if (toggleIcon) toggleIcon.src = "./assets/toggle-right.svg";
        if (logoImg) logoImg.src = "./assets/logo3_inverted.png";
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", () => {
            const theme = html.getAttribute("data-theme");

            if (theme === "dark") {
                html.setAttribute("data-theme", "light");
                if (toggleIcon) toggleIcon.src = "./assets/toggle-left.svg";
                if (logoImg) logoImg.src = "./assets/abstract_r.png";
                localStorage.setItem("theme", "light");
            } else {
                html.setAttribute("data-theme", "dark");
                if (toggleIcon) toggleIcon.src = "./assets/toggle-right.svg";
                if (logoImg) logoImg.src = "./assets/logo3_inverted.png";
                localStorage.setItem("theme", "dark");
            }
        });
    }
});
