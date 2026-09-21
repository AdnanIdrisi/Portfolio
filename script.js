/* ========================================
   PORTFOLIO — Main Script
   GSAP + ScrollTrigger + Lenis Smooth Scroll
   ======================================== */

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);

    // ========================================
    // TERMINAL PRELOADER & INITIALIZATION
    // ========================================
    const preloader = document.getElementById('preloader');
    let animationsInitialized = false;

    function startApp() {
        if (animationsInitialized) return;
        animationsInitialized = true;

        if (preloader) {
            gsap.to('.terminal-loader', {
                scale: 0.96,
                y: -10,
                opacity: 0,
                duration: 0.25,
                ease: 'power2.in',
                onComplete: () => {
                    gsap.to(preloader, {
                        opacity: 0,
                        duration: 0.25,
                        ease: 'power2.out',
                        onComplete: () => {
                            preloader.classList.add('hidden');
                            initAnimations();
                            setTimeout(() => {
                                ScrollTrigger.refresh();
                            }, 100);
                        }
                    });
                }
            });
        } else {
            initAnimations();
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        }
    }

    // Terminal boot sequence (snappy & high performance)
    function runTerminalLoader() {
        const line1 = document.getElementById('term-line-1');
        const line2 = document.getElementById('term-line-2');
        const line3 = document.getElementById('term-line-3');
        const line4 = document.getElementById('term-line-4');
        const progressBar = document.getElementById('terminal-progress');
        const progressPct = document.getElementById('terminal-pct');

        if (!line1) {
            setTimeout(startApp, 200);
            return;
        }

        let progress = 0;
        const progressInterval = setInterval(() => {
            progress = Math.min(progress + Math.floor(Math.random() * 15) + 18, 100);
            if (progressBar) progressBar.style.setProperty('--progress-width', `${progress}%`);
            if (progressPct) progressPct.textContent = progress;

            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(startApp, 120);
            }
        }, 50);

        setTimeout(() => { if (line1) line1.classList.add('show'); }, 60);
        setTimeout(() => { if (line2) line2.classList.add('show'); }, 180);
        setTimeout(() => { if (line3) line3.classList.add('show'); }, 300);
        setTimeout(() => { if (line4) line4.classList.add('show'); }, 420);

        // Fail-safe maximum timeout
        setTimeout(startApp, 900);
    }

    runTerminalLoader();

    // ========================================
    // LENIS SMOOTH SCROLL
    // ========================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
    });

    // Sync Lenis with ScrollTrigger strictly via GSAP ticker
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href.length <= 1) return;

            try {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    lenis.scrollTo(target, { offset: -80 });
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    const navToggle = document.getElementById('nav-toggle');
                    if (mobileMenu) mobileMenu.classList.remove('active');
                    if (navToggle) navToggle.classList.remove('active');
                }
            } catch (err) {
                // Ignore invalid CSS selectors safely without crashing
            }
        });
    });

    // ========================================
    // CUSTOM CURSOR (GPU Accelerated)
    // ========================================
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');

    if (cursor && cursorFollower && window.innerWidth > 768) {
        let mouseX = -100, mouseY = -100;
        let followerX = -100, followerY = -100;
        let isCursorMoving = false;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
            if (!isCursorMoving) {
                isCursorMoving = true;
                requestAnimationFrame(animateFollower);
            }
        }, { passive: true });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;

            if (Math.abs(mouseX - followerX) > 0.1 || Math.abs(mouseY - followerY) > 0.1) {
                requestAnimationFrame(animateFollower);
            } else {
                isCursorMoving = false;
            }
        }

        // Hover effects via passive event delegation for performance
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .skill-item, .project-card, .achievement-card, .contact-card')) {
                cursor.classList.add('active');
                cursorFollower.classList.add('active');
            }
        }, { passive: true });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, .skill-item, .project-card, .achievement-card, .contact-card')) {
                cursor.classList.remove('active');
                cursorFollower.classList.remove('active');
            }
        }, { passive: true });
    }

    // ========================================
    // NAVIGATION
    // ========================================
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // ========================================
    // STAT COUNTER ANIMATION
    // ========================================
    function animateCounters() {
        const counters = document.querySelectorAll('.hero-stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(easedProgress * target);
                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

    // ========================================
    // GSAP ANIMATIONS
    // ========================================
    function initAnimations() {
        // --- HERO SECTION ---
        const heroTl = gsap.timeline();

        heroTl
            .from('.hero-image-container', {
                opacity: 0,
                scale: 0.92,
                duration: 0.65,
                ease: 'power3.out'
            }, 0)
            .from('.hero-title-word', {
                y: 80,
                opacity: 0,
                duration: 0.65,
                stagger: 0.08,
                ease: 'power4.out'
            }, 0)
            .from('.hero-description', {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: 'power3.out'
            }, '-=0.35')
            .from('.hero-actions', {
                opacity: 0,
                y: 15,
                duration: 0.45,
                ease: 'power3.out'
            }, '-=0.3')
            .from('.hero-stat', {
                opacity: 0,
                y: 15,
                stagger: 0.08,
                duration: 0.45,
                ease: 'power3.out',
                onStart: animateCounters
            }, '-=0.3')
            .from('.hero-stat-divider', {
                opacity: 0,
                scaleY: 0,
                stagger: 0.08,
                duration: 0.35,
                ease: 'power3.out'
            }, '-=0.35')
            .from('.hero-image-badge', {
                opacity: 0,
                scale: 0.5,
                stagger: 0.1,
                duration: 0.5,
                ease: 'back.out(1.7)'
            }, '-=0.3')
            .from('.hero-scroll-indicator', {
                opacity: 0,
                y: 15,
                duration: 0.4,
                ease: 'power3.out'
            }, '-=0.2');

        // --- SECTION HEADERS ---
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header.children, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 40,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // --- ABOUT SECTION ---
        gsap.from('.about-text > *', {
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            stagger: 0.12,
            duration: 0.7,
            ease: 'power3.out'
        });

        gsap.from('.about-highlight', {
            scrollTrigger: {
                trigger: '.about-highlights',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -40,
            stagger: 0.15,
            duration: 0.7,
            ease: 'power3.out'
        });

        gsap.from('.about-card-inner', {
            scrollTrigger: {
                trigger: '.about-card',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: 0.8,
            ease: 'power3.out'
        });

        // --- SKILLS SECTION ---
        gsap.utils.toArray('.skill-category').forEach((category, i) => {
            gsap.from(category, {
                scrollTrigger: {
                    trigger: category,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                    once: true
                },
                opacity: 0,
                y: 35,
                duration: 0.6,
                delay: (i % 3) * 0.1,
                ease: 'power3.out'
            });
        });

        // --- SKILLS FILTER INTERACTION ---
        const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
        const skillCategories = document.querySelectorAll('.skill-category');

        skillFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                skillFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                skillCategories.forEach(cat => {
                    const catType = cat.getAttribute('data-cat');
                    if (filter === 'all' || catType === filter) {
                        cat.classList.remove('cat-hidden');
                        gsap.fromTo(cat, 
                            { opacity: 0, y: 15, scale: 0.98 }, 
                            { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }
                        );
                    } else {
                        cat.classList.add('cat-hidden');
                    }
                });

                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 80);
            });
        });

        // --- PROJECTS SECTION ---
        gsap.utils.toArray('.project-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 60,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'power3.out'
            });
        });

        // --- ACHIEVEMENTS SECTION ---
        gsap.utils.toArray('.achievement-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: i * 0.12,
                ease: 'power3.out'
            });
        });

        // LeetCode bar animation
        const leetcodeBar = document.querySelector('.leetcode-bar');
        if (leetcodeBar) {
            const fills = leetcodeBar.querySelectorAll('.leetcode-bar-fill');
            fills.forEach(fill => {
                const targetWidth = fill.style.width;
                fill.style.width = '0%';

                ScrollTrigger.create({
                    trigger: leetcodeBar,
                    start: 'top 85%',
                    onEnter: () => {
                        gsap.to(fill, {
                            width: targetWidth,
                            duration: 1.5,
                            ease: 'power3.out',
                            delay: 0.3
                        });
                    }
                });
            });
        }

        // Streak dots animation
        const streakDots = document.querySelectorAll('.streak-dot');
        streakDots.forEach((dot, i) => {
            gsap.from(dot, {
                scrollTrigger: {
                    trigger: dot.parentElement,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                scale: 0,
                duration: 0.3,
                delay: i * 0.05,
                ease: 'back.out(2)'
            });
        });

        // --- TIMELINE SECTION ---
        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                x: -40,
                duration: 0.7,
                delay: i * 0.15,
                ease: 'power3.out'
            });
        });

        // --- CONTACT SECTION ---
        gsap.from('.contact-info > *', {
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 85%',
                toggleActions: 'play none none none',
                once: true
            },
            opacity: 0,
            y: 25,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power3.out'
        });

        gsap.from('.contact-form', {
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 85%',
                toggleActions: 'play none none none',
                once: true
            },
            opacity: 0,
            y: 30,
            duration: 0.7,
            delay: 0.15,
            ease: 'power3.out'
        });

        // --- PARALLAX EFFECTS ---
        gsap.to('.hero-orb-1', {
            y: -100,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });

        gsap.to('.hero-orb-2', {
            y: -60,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });

        // Hero image parallax
        gsap.to('.hero-image-wrapper', {
            y: 60,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }

    // ========================================
    // CONTACT FORM HANDLER
    // ========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = `
                <span>Sending...</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            `;
            btn.disabled = true;

            // Simulate form submission (replace with real endpoint)
            setTimeout(() => {
                btn.innerHTML = `
                    <span>Message Sent! ✓</span>
                `;
                btn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                    contactForm.reset();
                }, 2500);
            }, 1500);
        });
    }

    // ========================================
    // SCROLL HANDLING (Nav & Active Link - RAF Throttled)
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let isScrollTicking = false;

    function handleScrollUpdates() {
        const scrollY = window.scrollY;

        // Nav scrolled styling
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Active link highlighting
        const probeY = scrollY + 200;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (probeY >= sectionTop && probeY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                        link.style.color = 'var(--accent-tertiary)';
                    } else {
                        link.classList.remove('active');
                        link.style.color = '';
                    }
                });
            }
        });

        isScrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!isScrollTicking) {
            isScrollTicking = true;
            requestAnimationFrame(handleScrollUpdates);
        }
    }, { passive: true });

    // Initial check
    handleScrollUpdates();

    // ========================================
    // TILT EFFECT ON PROJECT CARDS (RAF Optimized)
    // ========================================
    if (window.innerWidth > 768) {
        document.querySelectorAll('.project-card').forEach(card => {
            let tiltRafId = null;
            card.addEventListener('mousemove', (e) => {
                if (tiltRafId) cancelAnimationFrame(tiltRafId);
                tiltRafId = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
                });
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                if (tiltRafId) cancelAnimationFrame(tiltRafId);
                card.style.transform = '';
            });
        });
    }

    // ========================================
    // INTERACTIVE DOT FIELD UI COMPONENT
    // (Aceternity / Magic UI Inspired - Whole Website)
    // ========================================
    const dotCanvas = document.getElementById('dot-field-canvas');
    if (dotCanvas) {
        const ctx = dotCanvas.getContext('2d');
        let width = 0;
        let height = 0;
        let dpr = 1;
        let dots = [];
        const spacing = window.innerWidth < 768 ? 30 : 26;
        const interactionRadius = 140;
        let mouse = { x: -1000, y: -1000, active: false };
        let isVisible = true;
        let animFrameId = null;

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            dotCanvas.width = width * dpr;
            dotCanvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            initDots();
        }

        function initDots() {
            dots = [];
            const cols = Math.ceil(width / spacing) + 1;
            const rows = Math.ceil(height / spacing) + 1;
            const offsetX = (width - (cols - 1) * spacing) / 2;
            const offsetY = (height - (rows - 1) * spacing) / 2;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    dots.push({
                        originX: offsetX + c * spacing,
                        originY: offsetY + r * spacing,
                        x: offsetX + c * spacing,
                        y: offsetY + r * spacing,
                        baseRadius: 1.1,
                        currentRadius: 1.1,
                        colorAlpha: 0.16,
                        phase: Math.random() * Math.PI * 2
                    });
                }
            }
        }

        // Global mouse & touch tracking across the whole window
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            mouse.active = false;
            mouse.x = -1000;
            mouse.y = -1000;
        });

        window.addEventListener('blur', () => {
            mouse.active = false;
            mouse.x = -1000;
            mouse.y = -1000;
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
                mouse.active = true;
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            mouse.active = false;
            mouse.x = -1000;
            mouse.y = -1000;
        });

        let time = 0;
        function renderDotField() {
            if (!isVisible) {
                animFrameId = requestAnimationFrame(renderDotField);
                return;
            }

            ctx.clearRect(0, 0, width, height);
            time += 0.02;

            const activeDots = [];

            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];

                // Subtle ambient idle breathing
                const ambient = Math.sin(time + dot.phase) * 0.04;

                let factor = 0;
                if (mouse.active) {
                    const dx = mouse.x - dot.originX;
                    const dy = mouse.y - dot.originY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < interactionRadius) {
                        factor = 1 - (dist / interactionRadius);
                        factor = factor * factor; // Quadratic easing
                    }
                }

                // Spring physics back to origin
                const targetX = dot.originX + (mouse.active && factor > 0 ? (dot.originX - mouse.x) * 0.12 * factor : 0);
                const targetY = dot.originY + (mouse.active && factor > 0 ? (dot.originY - mouse.y) * 0.12 * factor : 0);
                dot.x += (targetX - dot.x) * 0.15;
                dot.y += (targetY - dot.y) * 0.15;

                // Radius expansion & color transition
                dot.currentRadius = dot.baseRadius + factor * 1.8;
                dot.colorAlpha = 0.15 + ambient + factor * 0.75;

                // Draw dot
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);

                if (factor > 0.12) {
                    ctx.fillStyle = `rgba(200, 75, 31, ${Math.min(dot.colorAlpha, 0.9)})`;
                    activeDots.push(dot);
                } else {
                    ctx.fillStyle = `rgba(74, 68, 55, ${Math.min(dot.colorAlpha, 0.32)})`;
                }
                ctx.fill();
            }

            // Draw proximity connection lines between nearby excited dots
            if (activeDots.length > 1) {
                ctx.lineWidth = 0.6;
                const maxLineDist = spacing * 1.6;
                for (let i = 0; i < activeDots.length; i++) {
                    for (let j = i + 1; j < activeDots.length; j++) {
                        const d1 = activeDots[i];
                        const d2 = activeDots[j];
                        const ddx = d1.x - d2.x;
                        const ddy = d1.y - d2.y;
                        const dist = Math.sqrt(ddx * ddx + ddy * ddy);

                        if (dist < maxLineDist) {
                            const lineAlpha = (1 - dist / maxLineDist) * 0.32;
                            ctx.strokeStyle = `rgba(200, 75, 31, ${lineAlpha})`;
                            ctx.beginPath();
                            ctx.moveTo(d1.x, d1.y);
                            ctx.lineTo(d2.x, d2.y);
                            ctx.stroke();
                        }
                    }
                }
            }

            animFrameId = requestAnimationFrame(renderDotField);
        }

        // Throttle rendering when browser tab is inactive to preserve battery & 60fps
        document.addEventListener('visibilitychange', () => {
            isVisible = !document.hidden;
        });

        window.addEventListener('resize', () => {
            resize();
        }, { passive: true });

        resize();
        renderDotField();
    }

    // ========================================
    // CARD SPOTLIGHT EFFECT (Aceternity UI)
    // ========================================
    document.querySelectorAll('.spotlight-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }, { passive: true });
    });

    // ========================================
    // 3D INTERACTIVE TILT & SPECULAR GLARE
    // (Raycast / Aceternity 3D Card Effect)
    // ========================================
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        let isHovered = false;
        let rafId = null;
        let targetRotateX = 0;
        let targetRotateY = 0;
        let currentRotateX = 0;
        let currentRotateY = 0;
        let glareX = 50;
        let glareY = 50;
        let currentGlareOpacity = 0;

        function updateCardPhysics() {
            if (!isHovered && Math.abs(currentRotateX) < 0.05 && Math.abs(currentRotateY) < 0.05) {
                card.classList.remove('is-tilting');
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
                card.style.setProperty('--glare-opacity', '0');
                rafId = null;
                return;
            }

            // Smooth spring lerp
            currentRotateX += (targetRotateX - currentRotateX) * 0.18;
            currentRotateY += (targetRotateY - currentRotateY) * 0.18;
            currentGlareOpacity += ((isHovered ? 0.9 : 0) - currentGlareOpacity) * 0.18;

            card.style.setProperty('--tilt-x', `${currentRotateX.toFixed(2)}deg`);
            card.style.setProperty('--tilt-y', `${currentRotateY.toFixed(2)}deg`);
            card.style.setProperty('--glare-x', `${glareX}px`);
            card.style.setProperty('--glare-y', `${glareY}px`);
            card.style.setProperty('--glare-opacity', `${currentGlareOpacity.toFixed(2)}`);

            rafId = requestAnimationFrame(updateCardPhysics);
        }

        card.addEventListener('mouseenter', () => {
            isHovered = true;
            card.classList.add('is-tilting');
            if (!rafId) {
                rafId = requestAnimationFrame(updateCardPhysics);
            }
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            glareX = x;
            glareY = y;

            const normalizedX = (x / rect.width) - 0.5;
            const normalizedY = (y / rect.height) - 0.5;

            // Smooth tilt angles
            targetRotateX = normalizedY * -12;
            targetRotateY = normalizedX * 12;

            if (!rafId) {
                rafId = requestAnimationFrame(updateCardPhysics);
            }
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            targetRotateX = 0;
            targetRotateY = 0;
        });
    });
});

// Add spin keyframe for loading animation
const style = document.createElement('style');
style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
document.head.appendChild(style);
