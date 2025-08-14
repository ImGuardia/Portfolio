// Portfolio JavaScript. This one I had to look up a lot of stuff for because I wanted to add advanced animations and interactions, and I'm still learning JavaScript. This script handles the more advanced features of the portfolio, including animations, scroll effects, and form handling that CSS cant handle or do on its own.

// DOM Elements
const loader = document.getElementById('loader');
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const scrollProgress = document.getElementById('scroll-progress');
const contactForm = document.getElementById('contact-form');

// Global variables
let isScrolling = false;
let currentSection = 'home';

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Main initialization function. Sets up all features and event listeners for the portfolio site.
 */
function initializeApp() {
    // Hide loader after page load
    window.addEventListener('load', hideLoader);
    
    // Navigation functionality
    setupNavigation();
    
    // Scroll-based animations
    setupScrollAnimations();
    
    // Intersection Observer for animations
    setupIntersectionObserver();
    
    // Form handling
    setupFormHandling();
    
    // Smooth scrolling for buttons
    setupSmoothScrolling();
    
    // Keyboard navigation
    setupKeyboardNavigation();
    
    // Mouse parallax effect
    setupParallaxEffect();
    
    // Dynamic skill bars
    setupSkillBars();
}

/**
 * Hides the loader animation after the page has loaded.
 */
function hideLoader() {
    setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1000);
}

// Navigation setup
/**
 * Sets up navigation menu, hamburger toggle, scroll spy, and nav background changes on scroll.
 */
function setupNavigation() {
    // Hamburger menu toggle (this one is for the mobile menu toggle)
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            closeMobileMenu();
            handleNavClick(e);
        });
    });
    
    // Scroll spy for navigation (this one updates the active link based on scroll position)
    window.addEventListener('scroll', throttle(updateScrollSpy, 100));
    window.addEventListener('scroll', throttle(updateScrollProgress, 16));
    window.addEventListener('scroll', throttle(updateNavBackground, 100));
}

/**
 * Toggles the mobile navigation menu and body scroll lock.
 */
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

/**
 * Closes the mobile navigation menu and restores body scroll.
 */
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Handles navigation link clicks for smooth scrolling and menu closing.
 * @param {Event} e - The click event
 */
function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    scrollToSection(targetId);
}

// Scroll spy functionality
/**
 * Updates the active navigation link based on scroll position (scroll spy).
 */
function updateScrollSpy() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < bottom) {
            updateActiveNavLink(id);
            currentSection = id;
        }
    });
}

/**
 * Sets the active class on the navigation link matching the current section.
 * @param {string} activeId - The id of the active section
 */
function updateActiveNavLink(activeId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
        }
    });
}

// Scroll progress bar
/**
 * Updates the scroll progress bar width based on scroll position.
 */
function updateScrollProgress() {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = `${Math.min(scrolled, 100)}%`;
}

// Navigation background on scroll
/**
 * Changes the navigation bar background when scrolling past a threshold.
 */
function updateNavBackground() {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

// Smooth scrolling function
/**
 * Smoothly scrolls to a section by id, offsetting for the nav bar.
 * @param {string} targetId - The id of the section to scroll to
 */
function scrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Smooth scrolling setup
/**
 * Enables smooth scrolling for anchor links.
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// Intersection Observer for scroll animations
/**
 * Sets up Intersection Observer to animate elements as they enter the viewport.
 */
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for different elements
                if (entry.target.classList.contains('skill-item')) {
                    animateSkillBar(entry.target);
                }
                
                if (entry.target.classList.contains('project-card')) {
                    animateProjectCard(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToObserve = [
        '.section-title',
        '.section-line',
        '.about-description',
        '.skill-item',
        '.project-card',
        '.contact-info',
        '.contact-form'
    ];
    
    elementsToObserve.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            observer.observe(element);
        });
    });
}

// Skill bar animation
/**
 * Sets up Intersection Observer to animate skill bars when they enter the viewport.
 */
function setupSkillBars() {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress');
                const width = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = `${width}%`;
                }, 200);
                
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.skill-item').forEach(item => {
        skillObserver.observe(item);
    });
}

/**
 * Animates a single skill bar to its target width.
 * @param {Element} skillItem - The skill item element
 */
function animateSkillBar(skillItem) {
    const progressBar = skillItem.querySelector('.skill-progress');
    const width = progressBar.getAttribute('data-width');
    
    setTimeout(() => {
        progressBar.style.width = `${width}%`;
    }, 300);
}

// Project card animations
/**
 * Animates a project card with a staggered fade-in effect.
 * @param {Element} card - The project card element
 */
function animateProjectCard(card) {
    const delay = Array.from(card.parentNode.children).indexOf(card) * 100;
    
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, delay);
}

// Form handling (for contact form submission)
/**
 * Sets up contact form submission and input focus animations.
 */
function setupFormHandling() {
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Input focus animations
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

/**
 * Handles contact form submission, simulates sending, and resets the form.
 * @param {Event} e - The form submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Animate button
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.transform = 'scale(0.98)';
    
    // Simulate form submission
    setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = '#10b981';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.transform = 'scale(1)';
            submitBtn.style.background = '';
            contactForm.reset();
        }, 2000);
    }, 1500);
}

// Keyboard navigation
/**
 * Enables keyboard navigation: closes menu on Escape, navigates sections with Alt+Arrow keys.
 */
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }

        // Arrow key navigation through sections (this was cool, so people can be a bit lazy when navigating)
        if (e.altKey) {
            const sections = ['home', 'about', 'projects', 'contact'];
            const currentIndex = sections.indexOf(currentSection);
            
            if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                scrollToSection(sections[currentIndex + 1]);
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                scrollToSection(sections[currentIndex - 1]);
            }
        }
    });
}

// Parallax effect for floating shapes removed
/**
 * (Placeholder) Sets up parallax effect for floating shapes (currently not used).
 */
function setupParallaxEffect() {
    // No floating shapes to animate
}

// Advanced scroll effects (floating shapes removed)
window.addEventListener('scroll', throttle(() => {
    // No floating shapes to animate
}, 16));

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Utility functions (Apparently this is used to maintain performance and prevent excessive function calls, think of it like adding a funnel and valve to flowing water)
/**
 * Throttles a function so it only runs once per limit interval.
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time interval in ms
 * @returns {Function}
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Debounces a function so it only runs after a delay since the last call.
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in ms
 * @param {boolean} immediate - If true, run at the start
 * @returns {Function}
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Performance optimization (this one is a must for performance, especially with animations and scroll effects, not entirely sure how it works but I looked it up and it seems to be a good idea)
/**
 * Polyfill for requestIdleCallback for performance optimization.
 * @param {Function} callback - The function to run when the browser is idle
 * @param {Object} options - Options for requestIdleCallback
 * @returns {number}
 */
function requestIdleCallback(callback, options = {}) {
    if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(callback, options);
    } else {
        return setTimeout(() => {
            const start = Date.now();
            callback({
                didTimeout: false,
                timeRemaining() {
                    return Math.max(0, 50 - (Date.now() - start));
                }
            });
        }, 1);
    }
}

// Preload critical resources (e.g., fonts and styles) 
/**
 * Preloads critical resources (fonts, styles) for faster page load.
 */
function preloadResources() {
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Call preload on page load (to ensure resources are ready)
preloadResources();

// Add smooth reveal animation for text (this one is for the text animations, it looks really nice)
/**
 * Animates text by revealing each character with a fade and slide effect.
 * @param {Element} element - The text element to animate
 */
function animateText(element) {
    const text = element.textContent;
    element.textContent = '';
    
    [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.transition = `all 0.3s ease ${index * 0.05}s`;
        element.appendChild(span);
        
        requestAnimationFrame(() => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        });
    });
}

// Enhanced loading animation (this one adds a nice touch to the loading experience, always wanted to do this)
/**
 * Creates a ripple loading animation inside the loader element.
 */
function createLoadingAnimation() {
    const loader = document.querySelector('.loader-content');
    if (loader) {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 40px;
            height: 40px;
            border: 2px solid var(--accent-color);
            border-radius: 50%;
            animation: ripple 1.5s infinite;
            opacity: 0.3;
        `;
        loader.appendChild(ripple);
    }
}

// Add ripple animation
const rippleKeyframes = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 0.3;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;

const style = document.createElement('style');
style.textContent = rippleKeyframes;
document.head.appendChild(style);

// Initialize enhanced loading (to ensure the loading animation is started)
createLoadingAnimation();

// Export functions for global access (Edge for some reason needs this)
window.scrollToSection = scrollToSection;
window.toggleMobileMenu = toggleMobileMenu;
