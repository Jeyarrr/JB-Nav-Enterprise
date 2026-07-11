document.addEventListener('DOMContentLoaded', function() {

    // --- Scroll-reveal animations ---
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    // --- Nav: shrink + shadow once scrolled ---
    const mainNav = document.querySelector('.main-nav');
    if (mainNav) {
        const updateNavState = () => {
            mainNav.classList.toggle('scrolled', window.scrollY > 20);
        };
        updateNavState();
        window.addEventListener('scroll', updateNavState, { passive: true });
    }

    // --- Nav: highlight active section ---
const sections = document.querySelectorAll('section[id]');
const desktopNavLinks = document.querySelectorAll('.nav-link');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

function updateActiveLink() {
    let currentSection = '';
    const scrollPosition = window.scrollY + 150; // offset for better accuracy

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    // Update desktop nav links
    desktopNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });

    // Update mobile nav items
    mobileNavItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Run on load and scroll
window.addEventListener('load', updateActiveLink);
window.addEventListener('scroll', updateActiveLink, { passive: true });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                }
            }
        });
    });

    // --- Mobile menu toggle ---
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
    }

    // --- Back to top button ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('show', window.scrollY > 300);
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const src = this.getAttribute('data-src') || this.querySelector('img')?.src;
            if (src) {
                lightboxImg.src = src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    window.closeLightbox = function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });

    // --- Toast message ---
    function showMessage(message, type = 'success') {
        let messageBox = document.getElementById('app-message-box');
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.id = 'app-message-box';
            messageBox.className = 'app-message-box';
            document.body.appendChild(messageBox);
        }

        messageBox.textContent = message;
        messageBox.className = 'app-message-box ' + type;
        messageBox.style.display = 'block';

        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000);
    }

    // --- Book form validation ---
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const eventType = document.getElementById('event-type').value;
            const date = document.getElementById('date').value;

            if (!name || !email || !phone || !eventType || !date) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }

            if (!phone.match(/^\+63\d{10}$/)) {
                showMessage('Phone must be +63 followed by 10 digits.', 'error');
                return;
            }

            showMessage('Your booking request has been sent successfully!', 'success');
            this.reset();
        });
    }

    // --- Contact form validation ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !subject || !message) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }

            showMessage('Your message has been sent successfully!', 'success');
            this.reset();
        });
    }
});