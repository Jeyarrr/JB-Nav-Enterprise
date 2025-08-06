document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
    }

    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { 
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function showMessage(message, type = 'success') {
        let messageBox = document.getElementById('app-message-box');
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.id = 'app-message-box';
            document.body.appendChild(messageBox);
        }

        messageBox.textContent = message;
        messageBox.className = 'app-message-box';
        messageBox.classList.add(type);
        messageBox.style.display = 'block';

        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000);
    }

    const style = document.createElement('style');
    style.textContent = `
        .app-message-box {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            display: none; /* Hidden by default */
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            text-align: center;
        }
        .app-message-box.success {
            background-color: #4CAF50; /* Green */
        }
        .app-message-box.error {
            background-color: #f44336; /* Red */
        }
    `;
    document.head.appendChild(style);

    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Book Request Form Submitted!');
            showMessage('Your booking request has been sent successfully!', 'success');
            this.reset();
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Contact Form Submitted!');
            showMessage('Your message has been sent successfully!', 'success');
            this.reset();
        });
    }
});
