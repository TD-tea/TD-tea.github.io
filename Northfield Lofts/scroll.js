const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden, .hidden-left, .hidden-right');
hiddenElements.forEach((el) => observer.observe(el));

// Header shrink on scroll with hysteresis to prevent flicker
let headerIsShrunk = false;
let headerIsScrolled = false;
const SHRINK_POINT = 80;   // scroll position to start shrinking
const EXPAND_POINT = 40;   // scroll position to expand back

// Check if we're on a page with a hero section (landing page)
const heroSection = document.querySelector('.intro');
const hasHeroSection = heroSection !== null;

// If no hero section, make header fixed with background from the start
if (!hasHeroSection) {
    const header = document.getElementById('header');
    if (header) {
        header.classList.add('scrolled');
        header.style.position = 'fixed';
    }
}

window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    if (!header) return;

    const y = window.scrollY || window.pageYOffset;

    // Only apply hero-based scroll behavior on pages with a hero section
    if (hasHeroSection && heroSection) {
        // Calculate when we've scrolled past the hero section
        const heroHeight = heroSection.offsetHeight;
        const heroBottom = heroSection.offsetTop + heroHeight;
        const SCROLL_POINT = heroBottom - 100; // 10px buffer before hero ends

        // Show/hide background color based on scroll past hero
        if (!headerIsScrolled && y > SCROLL_POINT) {
            header.classList.add('scrolled');
            headerIsScrolled = true;
        } else if (headerIsScrolled && y <= SCROLL_POINT) {
            header.classList.remove('scrolled');
            headerIsScrolled = false;
        }
    }

    // Shrink header on scroll (applies to all pages)
    if (!headerIsShrunk && y > SHRINK_POINT) {
        header.classList.add('shrink');
        headerIsShrunk = true;
    } else if (headerIsShrunk && y < EXPAND_POINT) {
        header.classList.remove('shrink');
        headerIsShrunk = false;
    }
});