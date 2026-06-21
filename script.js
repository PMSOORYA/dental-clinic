/* ==========================================================================
   Sajada Dental Hospital - Premium Website Scripts
   ========================================================================== */

// Premium Preloader Animation Control
(function() {
    // Lock scrolling instantly on documentElement (always available)
    document.documentElement.classList.add('preloader-active');
    
    // Safely lock body scroll once it's available
    const lockBodyScroll = () => {
        if (document.body) {
            document.body.classList.add('preloader-active');
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', lockBodyScroll);
    } else {
        lockBodyScroll();
    }

    let width = 0;
    const progressInterval = setInterval(() => {
        const progress = document.querySelector('.preloader-progress');
        if (progress) {
            if (width >= 90) {
                clearInterval(progressInterval);
            } else {
                width += Math.random() * 15;
                if (width > 90) width = 90;
                progress.style.width = width + '%';
            }
        }
    }, 100);

    const hidePreloader = () => {
        clearInterval(progressInterval);
        const progress = document.querySelector('.preloader-progress');
        const preloader = document.getElementById('preloader');
        if (progress) progress.style.width = '100%';
        
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('fade-out');
                document.documentElement.classList.remove('preloader-active');
                if (document.body) {
                    document.body.classList.remove('preloader-active');
                }
            }
        }, 300);
    };

    // Use 'load' event if page is still loading, otherwise hide immediately
    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
        // Safety Fallback (4 seconds max)
        setTimeout(hidePreloader, 4000);
    }
})();

document.addEventListener('DOMContentLoaded', () => {

    // Global Configurations
    const WHATSAPP_NUMBER = '919745805050'; // Easy to edit WhatsApp contact number (with country code, no symbols)

    // ==========================================================================
    // 1. Sticky Header & Shadow on Scroll
    // ==========================================================================
    const header = document.querySelector('.header');
    
    function checkScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check in case of page reload halfway down


    // ==========================================================================
    // 2. Mobile Drawer Navigation Menu (Removed as requested)
    // ==========================================================================


    // ==========================================================================
    // 3. Scroll-Spy Navigation (Highlight active sections)
    // ==========================================================================
    const sections = document.querySelectorAll('section, footer');
    const navLinks = document.querySelectorAll('.nav-link');

    function scrollSpy() {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // Offset for sticky header height
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);


    // ==========================================================================
    // 4. Auto-Moving Services Carousel (Slider)
    // ==========================================================================
    const track = document.getElementById('services-carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    const cards = Array.from(track.children);
    
    let currentIndex = 0;
    let cardsVisible = 3;
    let autoSlideInterval;

    // Detect how many items are visible based on media queries
    function updateCardsVisible() {
        const width = window.innerWidth;
        if (width <= 414) {
            cardsVisible = 1;
        } else if (width <= 1024) {
            cardsVisible = 2;
        } else {
            cardsVisible = 3;
        }
        setupDots();
        moveToSlide(currentIndex);
    }

    // Set up navigation dots indicators
    function setupDots() {
        dotsContainer.innerHTML = '';
        const maxDots = cards.length - cardsVisible + 1;
        
        // Prevent negative dots count
        if (maxDots <= 0) return;

        for (let i = 0; i < maxDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                resetAutoSlide();
                moveToSlide(i);
            });
            dotsContainer.appendChild(dot);
        }
    }

    // Move to specific slide index
    function moveToSlide(index) {
        const maxIndex = cards.length - cardsVisible;
        
        // Boundaries checks
        if (index < 0) {
            currentIndex = maxIndex; // Go to last
        } else if (index > maxIndex) {
            currentIndex = 0; // Wrap around to first
        } else {
            currentIndex = index;
        }

        // Calculate offset percentage
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = 24; // Corresponds to CSS gap in track
        const amountToMove = currentIndex * (cardWidth + gap);
        
        track.style.transform = `translateX(-${amountToMove}px)`;

        // Update active dot
        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, idx) => {
            dot.classList.remove('active');
            if (idx === currentIndex) {
                dot.classList.add('active');
            }
        });
    }

    // Auto sliding interval logic
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            moveToSlide(currentIndex + 1);
        }, 4000); // Shift service slide every 4 seconds
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Manual triggers
    prevBtn.addEventListener('click', () => {
        resetAutoSlide();
        moveToSlide(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        resetAutoSlide();
        moveToSlide(currentIndex + 1);
    });

    // Touch Swiping Support for Carousel (Premium UX feel)
    let startX = 0;
    let isSwiping = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
        clearInterval(autoSlideInterval);
    });

    track.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        if (Math.abs(diffX) > 50) { // Swipe threshold
            if (diffX > 0) {
                moveToSlide(currentIndex + 1); // Swiped Left -> next card
            } else {
                moveToSlide(currentIndex - 1); // Swiped Right -> prev card
            }
        }
        isSwiping = false;
        startAutoSlide();
    });

    // Initial setup and bindings
    window.addEventListener('resize', updateCardsVisible);
    updateCardsVisible();
    startAutoSlide();


    // ==========================================================================
    // 5. Accordion FAQ Animation Actions
    // ==========================================================================
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const parentItem = trigger.parentElement;
            const panel = trigger.nextElementSibling;
            const isActive = parentItem.classList.contains('active');

            // Collapse all other accordion items first
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.accordion-panel').style.maxHeight = null;
            });

            // Toggle selected panel
            if (!isActive) {
                parentItem.classList.add('active');
                panel.style.maxHeight = panel.scrollHeight + "px"; // Calculate scrollHeight dynamically
            }
        });
    });


    // ==========================================================================
    // 6. Form Submission & WhatsApp Routing Redirect
    // ==========================================================================
    const bookingForm = document.getElementById('whatsapp-booking-form');

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Fetch user values
        const nameVal = document.getElementById('form-name').value.trim();
        const phoneVal = document.getElementById('form-phone').value.trim();
        const serviceVal = document.getElementById('form-service').value;
        const dateVal = document.getElementById('form-date').value;

        // Structured message content
        const message = `Hi, I would like to book an appointment.
Name: ${nameVal}
Phone: ${phoneVal}
Service: ${serviceVal}
Preferred Date: ${dateVal}`;

        // Format for URL routing
        const encodedText = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

        // Launch in new window tab
        window.open(whatsappUrl, '_blank');
        
        // Reset form
        bookingForm.reset();
    });

    // Configure fallback static hrefs on floating buttons and hero WhatsApp buttons to use config WHATSAPP_NUMBER with pre-filled message
    const whatsappElements = document.querySelectorAll('.whatsapp-direct-link, .float-wa');
    const defaultMessage = encodeURIComponent("Hi, I would like to book an appointment at Sajada Dental Hospital. Please share available timings.");
    whatsappElements.forEach(elem => {
        elem.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMessage}`);
    });

    // Check if hero video exists and play it, otherwise show fallback image
    const heroVideo = document.getElementById('hero-video-player');
    const heroImage = document.getElementById('hero-fallback-image');
    if (heroVideo) {
        // Only load video on desktop screens (> 768px) to save bandwidth and prevent autoplay bugs
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            heroVideo.remove();
        } else {
            const videoSrc = 'assets/DESKTOP.mp4';
            const source = document.createElement('source');
            source.setAttribute('src', videoSrc);
            source.setAttribute('type', 'video/mp4');
            heroVideo.appendChild(source);
            heroVideo.load();

            heroVideo.addEventListener('canplay', () => {
                heroVideo.style.display = 'block';
                if (heroImage) heroImage.style.display = 'none';
            });
            if (heroVideo.readyState >= 3) {
                heroVideo.style.display = 'block';
                if (heroImage) heroImage.style.display = 'none';
            }
        }
    }

    // ==========================================================================
    // 7. Stats Counter Animation on Scroll
    // ==========================================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds animation duration
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing: outQuad
            const easeProgress = progress * (2 - progress);
            const currentValue = Math.floor(easeProgress * target);
            
            if (currentValue >= 1000) {
                element.textContent = currentValue.toLocaleString() + suffix;
            } else {
                element.textContent = currentValue + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (target >= 1000) {
                    element.textContent = target.toLocaleString() + suffix;
                } else {
                    element.textContent = target + suffix;
                }
            }
        };
        
        requestAnimationFrame(animate);
    };
    
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => statsObserver.observe(num));

});
