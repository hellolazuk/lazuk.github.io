// Check for saved theme preference, otherwise use system preference
function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme to document
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Initialize theme
let currentTheme = getInitialTheme();
applyTheme(currentTheme);

// Update button aria-label based on current theme
function updateButtonLabel(button) {
    button.setAttribute('aria-label', `Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`);
}

// Find the theme toggle button
const themeToggle = document.querySelector('[aria-label="Switch to dark theme"], [aria-label="Switch to light theme"]');

if (themeToggle) {
    // Update initial button label
    updateButtonLabel(themeToggle);

    // Add click event listener
    themeToggle.addEventListener('click', () => {
        // Toggle theme
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';

        // Save to localStorage
        localStorage.setItem('theme', currentTheme);

        // Apply the new theme
        applyTheme(currentTheme);

        // Update button label
        updateButtonLabel(themeToggle);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            currentTheme = e.matches ? 'dark' : 'light';
            applyTheme(currentTheme);
            updateButtonLabel(themeToggle);
        }
    });
}



// Get necessary elements
const menuToggle = document.querySelector('#mobile-menu-toggle');
const menuContent = document.querySelector('#mobile-menu-content');
const overlay = document.querySelector('.overlay');
const closeButton = document.querySelector('#mobile-menu-close');
const menuLinks = document.querySelectorAll('#mobile-menu-content a');

// Function to open menu
function openMenu() {
    // Show menu content
    menuContent.style.display = 'block';
    // Add small delay to allow transition
    setTimeout(() => {
        menuContent.style.opacity = '1';
        menuContent.style.transform = 'scale(1)';
    }, 10);

    // Show overlay with transition
    overlay.style.display = 'block';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.backgroundColor = 'rgb(0 0 0 / 0.9)';
    overlay.style.opacity = '1';
    overlay.style.zIndex = '40';
}

// Function to close menu
function closeMenu() {
    menuContent.style.opacity = '0';
    menuContent.style.transform = 'scale(0.95)';
    overlay.style.opacity = '0';

    // Wait for transition to finish before hiding elements
    setTimeout(() => {
        menuContent.style.display = 'none';
        overlay.style.display = 'none';
    }, 150);
}

// Add click event listener to menu toggle button
menuToggle.addEventListener('click', openMenu);

// Add click event listener to close button
closeButton.addEventListener('click', closeMenu);

// Add click event listener to overlay for closing
overlay.addEventListener('click', closeMenu);

// Close menu when clicking on menu links
menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMenu();
    }
});

// Prevent clicks inside menu from closing it
menuContent.addEventListener('click', (e) => {
    e.stopPropagation();
});




// Smart sticky header
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');
const OFFSET = 0; // Offset from top before sticky behavior

// Add core styles
if (header) {
    header.style.position = 'fixed'; // Start as static
    header.style.zIndex = '50';
    header.style.transition = 'transform 0.3s';
    header.style.width = '100%';
}

window.addEventListener('scroll', () => {
    if (!header) return;

    const currentScrollY = window.scrollY;
    const hiddenElement = header.querySelector('.logo');

    // At initial offset point - add d-none
    if (currentScrollY <= OFFSET) {
        header.style.position = 'fixed';
        header.style.transform = 'translateY(0%)';
        if (hiddenElement) {
            // Add d-none only at the very top
            hiddenElement.classList.add('d-none');
        }
        return;
    }

    // Scrolling down
    if (currentScrollY > lastScrollY && currentScrollY > OFFSET) {
        header.style.transform = 'translateY(0%)';
        header.style.position = 'fixed';
        if (hiddenElement) {
            // Keep visible while scrolling down
            hiddenElement.classList.remove('d-none');
        }
    }
    // Scrolling up (but after offset)
    else if (currentScrollY > OFFSET) {
        header.style.transform = 'translateY(-10%)';
        header.style.position = 'fixed';
        header.style.top = `${OFFSET}px`;
        if (hiddenElement) {
            // Keep visible while sticky
            hiddenElement.classList.remove('d-none');
        }
    }

    lastScrollY = currentScrollY;
});