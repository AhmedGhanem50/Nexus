/**
 * NEXUS LANDING PAGE - VANILLA JAVASCRIPT
 * No frameworks, no dependencies - pure vanilla JS
 */

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initCounterAnimation();
    initSmoothScroll();
    initCTAForm();
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class based on scroll position
        if (currentScroll > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    };

    // Use requestAnimationFrame for smooth performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Initial check
    handleScroll();
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    if (revealElements.length === 0) return;

    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Fallback for older browsers - show all elements
        revealElements.forEach(el => {
            el.classList.add('revealed');
        });
    }
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    
    if (counters.length === 0) return;

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'), 10);
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startValue = 0;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = Math.floor(startValue + (target - startValue) * easeOut);
            counter.textContent = formatNumber(currentValue);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = formatNumber(target);
            }
        };

        requestAnimationFrame(updateCounter);
    };

    // Format large numbers with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Use IntersectionObserver to trigger counter when visible
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    } else {
        // Fallback - animate immediately
        counters.forEach(counter => {
            animateCounter(counter);
        });
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    // Get all anchor links that point to IDs
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// CTA FORM
// ============================================
function initCTAForm() {
    const ctaButton = document.getElementById('ctaButton');
    const emailInput = document.getElementById('emailInput');
    const toast = document.getElementById('toast');
    
    if (!ctaButton || !emailInput) return;

    const showToast = (message) => {
        if (!toast) return;
        
        const toastMessage = toast.querySelector('.toast-message');
        if (toastMessage) {
            toastMessage.textContent = message;
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = () => {
        const email = emailInput.value.trim();
        
        if (!email) {
            emailInput.focus();
            emailInput.style.borderColor = '#ef4444';
            setTimeout(() => {
                emailInput.style.borderColor = '';
            }, 2000);
            return;
        }
        
        if (!validateEmail(email)) {
            emailInput.focus();
            emailInput.style.borderColor = '#ef4444';
            showToast('Please enter a valid email address');
            setTimeout(() => {
                emailInput.style.borderColor = '';
            }, 2000);
            return;
        }
        
        // Success
        showToast('Thanks for subscribing!');
        emailInput.value = '';
        
        // Add a subtle success animation to the button
        const originalText = ctaButton.innerHTML;
        ctaButton.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Subscribed!
        `;
        ctaButton.style.background = '#22c55e';
        
        setTimeout(() => {
            ctaButton.innerHTML = originalText;
            ctaButton.style.background = '';
        }, 2000);
    };

    ctaButton.addEventListener('click', handleSubmit);
    
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });
    
    // Clear error state on input
    emailInput.addEventListener('input', () => {
        emailInput.style.borderColor = '';
    });
}

// ============================================
// PARALLAX EFFECT (Optional enhancement)
// ============================================
(function initParallax() {
    const heroBg = document.querySelector('.hero-bg-img');
    if (!heroBg) return;

    let ticking = false;
    
    const handleParallax = () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        heroBg.style.transform = `translateY(${rate}px)`;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

// ============================================
// CURSOR GLOW EFFECT (Desktop only)
// ============================================
(function initCursorGlow() {
    // Only on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const ctaSection = document.querySelector('.cta');
    if (!ctaSection) return;

    const glow1 = ctaSection.querySelector('.cta-glow-1');
    const glow2 = ctaSection.querySelector('.cta-glow-2');
    
    if (!glow1 || !glow2) return;

    let ticking = false;
    
    ctaSection.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const rect = ctaSection.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Subtle parallax for glows
                glow1.style.transform = `translate(${x * 0.02}px, ${y * 0.02}px)`;
                glow2.style.transform = `translate(${-x * 0.02}px, ${-y * 0.02}px)`;
                
                ticking = false;
            });
            ticking = true;
        }
    });
    
    ctaSection.addEventListener('mouseleave', () => {
        glow1.style.transform = '';
        glow2.style.transform = '';
    });
})();

// ============================================
// PERFORMANCE: Preload critical resources
// ============================================
(function preloadResources() {
    const criticalImages = [
        'images/hero-bg.jpg',
        'images/product-mockup.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
})();

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('contactSubmit');
    const toast = document.getElementById('toast');
    if (!form || !submitBtn) return;

    const showToast = (message) => {
        if (!toast) return;
        const toastMessage = toast.querySelector('.toast-message');
        if (toastMessage) toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const setError = (input, state) => {
        input.classList.toggle('error', state);
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name    = form.querySelector('#contactName');
        const email   = form.querySelector('#contactEmail');
        const subject = form.querySelector('#contactSubject');
        const message = form.querySelector('#contactMessage');

        let valid = true;

        [name, subject, message].forEach(field => {
            const empty = !field.value.trim();
            setError(field, empty);
            if (empty) valid = false;
        });

        const emailEmpty   = !email.value.trim();
        const emailInvalid = !emailEmpty && !validateEmail(email.value.trim());
        setError(email, emailEmpty || emailInvalid);
        if (emailEmpty || emailInvalid) valid = false;

        if (!valid) {
            showToast('Please fill in all fields correctly.');
            return;
        }

        // Success state
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Message Sent!
        `;
        submitBtn.style.background = '#22c55e';
        submitBtn.disabled = true;

        showToast('Message sent! We\'ll be in touch soon.');
        form.reset();

        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    });

    // Clear error state on input
    form.querySelectorAll('.contact-input').forEach(input => {
        input.addEventListener('input', () => setError(input, false));
    });
}
// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%c◆ Nexus', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cBuilt with vanilla HTML, CSS & JavaScript', 'font-size: 12px; color: #888;');
console.log('%cNo frameworks, no dependencies - just pure code.', 'font-size: 12px; color: #888;');
