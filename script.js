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

    // Terminal boot sequence with real typing, spinner, and loading progress
    function runTerminalLoader() {
        const typedCmd = document.getElementById('term-typed-cmd');
        const cursor = document.getElementById('term-cursor');
        const output = document.getElementById('term-output');
        const progressWrap = document.getElementById('term-progress-wrap');
        const progressBar = document.getElementById('terminal-progress');
        const progressPct = document.getElementById('terminal-pct');
        const progressLabel = document.getElementById('term-progress-label');
        const spinner = document.getElementById('term-spinner');
        const readyLine = document.getElementById('term-ready-line');

        if (!typedCmd || !output) {
            setTimeout(startApp, 200);
            return;
        }

        // Allow skipping preloader on click or escape key
        if (preloader) {
            preloader.addEventListener('click', () => startApp());
        }
        window.addEventListener('keydown', function onKey(e) {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                window.removeEventListener('keydown', onKey);
                startApp();
            }
        });

        // 1. Real typing animation (fast & snappy developer cadence)
        const commandText = 'pnpm run dev';
        let charIdx = 0;

        function typeNextChar() {
            if (animationsInitialized) return;
            if (charIdx < commandText.length) {
                typedCmd.textContent += commandText.charAt(charIdx);
                charIdx++;
                const delay = 22 + Math.random() * 28;
                setTimeout(typeNextChar, delay);
            } else {
                setTimeout(startLogStream, 130);
            }
        }

        // 2. Stream terminal logs
        const logs = [
            { tag: 'ok', tagText: 'READY', text: 'V8 runtime & Node.js environment online' },
            { tag: 'info', tagText: 'SYSTEM', text: 'Loaded MERN architecture & 300+ algorithms' },
            { tag: 'build', tagText: 'BUILD', text: 'Compiling React 19 UI & GSAP shaders...' }
        ];

        function startLogStream() {
            if (animationsInitialized) return;
            let logIdx = 0;

            function outputNextLog() {
                if (animationsInitialized) return;
                if (logIdx < logs.length) {
                    const item = logs[logIdx];
                    const row = document.createElement('div');
                    row.className = 'terminal-log-row';
                    row.innerHTML = `<span class="t-tag ${item.tag}">[${item.tagText}]</span> <span class="t-log-msg">${item.text}</span>`;
                    output.appendChild(row);

                    requestAnimationFrame(() => {
                        row.classList.add('show');
                    });

                    logIdx++;
                    setTimeout(outputNextLog, 140);
                } else {
                    setTimeout(startProgressBar, 110);
                }
            }

            outputNextLog();
        }

        // 3. Spinner & Progress Loading Animation
        function startProgressBar() {
            if (animationsInitialized) return;
            if (progressWrap) progressWrap.style.display = 'flex';

            const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
            let spinnerIdx = 0;
            const spinnerInterval = setInterval(() => {
                if (animationsInitialized) {
                    clearInterval(spinnerInterval);
                    return;
                }
                spinnerIdx = (spinnerIdx + 1) % spinnerFrames.length;
                if (spinner) spinner.textContent = spinnerFrames[spinnerIdx];
            }, 60);

            let currentProgress = 0;
            const progressSteps = [
                { threshold: 35, label: 'Bundling client modules...' },
                { threshold: 75, label: 'Optimizing interactive shaders...' },
                { threshold: 95, label: 'Verifying production build...' },
                { threshold: 100, label: 'Portfolio ready!' }
            ];

            const progressInterval = setInterval(() => {
                if (animationsInitialized) {
                    clearInterval(progressInterval);
                    clearInterval(spinnerInterval);
                    return;
                }

                const increment = Math.floor(Math.random() * 8) + 6;
                currentProgress = Math.min(currentProgress + increment, 100);

                if (progressBar) progressBar.style.width = `${currentProgress}%`;
                if (progressPct) progressPct.textContent = currentProgress;

                for (let i = 0; i < progressSteps.length; i++) {
                    if (currentProgress <= progressSteps[i].threshold) {
                        if (progressLabel) progressLabel.textContent = progressSteps[i].label;
                        break;
                    }
                }

                if (currentProgress >= 100) {
                    clearInterval(progressInterval);
                    clearInterval(spinnerInterval);
                    if (spinner) spinner.textContent = '✔';

                    setTimeout(() => {
                        if (readyLine) readyLine.style.display = 'flex';
                        setTimeout(startApp, 260);
                    }, 110);
                }
            }, 38);
        }

        // Start typing sequence
        setTimeout(typeNextChar, 100);

        // Fail-safe maximum timeout (4s)
        setTimeout(startApp, 4000);
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
                ease: 'power3.out',
                clearProps: 'transform'
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
                    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(dot.colorAlpha, 0.9)})`;
                    activeDots.push(dot);
                } else {
                    ctx.fillStyle = `rgba(190, 183, 164, ${Math.min(dot.colorAlpha, 0.4)})`;
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
                            const lineAlpha = (1 - dist / maxLineDist) * 0.45;
                            ctx.strokeStyle = `rgba(190, 183, 164, ${lineAlpha})`;
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
    // TOP SCROLL PROGRESS INDICATOR
    // ========================================
    const scrollProgressBar = document.getElementById('scroll-progress');
    if (scrollProgressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgressBar.style.width = `${progress}%`;
        }, { passive: true });
    }

    // ========================================
    // TACTILE COPY EMAIL WITH FEEDBACK
    // ========================================
    const copyEmailBtns = document.querySelectorAll('.btn-copy-email');
    copyEmailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const email = btn.getAttribute('data-email') || 'mohammadadnanfaiz@gmail.com';
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(() => {
                    const badge = btn.querySelector('.copy-badge');
                    const prevBadge = badge ? badge.textContent : '';
                    if (badge) badge.textContent = 'Copied! ✓';
                    btn.classList.add('copied');
                    setTimeout(() => {
                        if (badge) badge.textContent = prevBadge || 'Copy';
                        btn.classList.remove('copied');
                    }, 2200);
                }).catch(() => {
                    prompt('Copy email address:', email);
                });
            } else {
                prompt('Copy email address:', email);
            }
        });
    });

    // ========================================
    // ARCHITECTURE CASE STUDY MODAL
    // ========================================
    const projectModal = document.getElementById('project-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalClose = document.getElementById('modal-close');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalFlow = document.getElementById('modal-diagram-flow');
    const modalHighlights = document.getElementById('modal-highlights');
    const modalStackTags = document.getElementById('modal-stack-tags');
    const modalCodeLink = document.getElementById('modal-code-link');
    const modalLiveLink = document.getElementById('modal-live-link');

    const projectData = {
        pulsechat: {
            tag: 'SOCKET.IO // DISTRIBUTED WEBSOCKETS',
            title: 'Real-Time Chat — Distributed WebSocket Architecture',
            nodes: [
                { title: 'Client', sub: 'React 19 / State' },
                { title: 'Gateway', sub: 'Socket.io Cluster' },
                { title: 'Broker', sub: 'Redis Pub/Sub' },
                { title: 'Database', sub: 'MongoDB Shards' }
            ],
            highlights: [
                'Sub-24ms bidirectional WebSocket communication with automated reconnection protocols',
                'Horizontal scaling via Redis Pub/Sub channels broadcasting across multi-core Node.js servers',
                'Dual-token JWT authentication with silent rotation stored in HTTP-only SameSite cookies',
                'Optimistic UI message queuing and client-side acknowledgment reconciliation'
            ],
            stack: ['React 19', 'Node.js', 'Socket.io', 'Redis', 'MongoDB', 'JWT', 'Docker'],
            code: 'https://github.com/AdnanIdrisi',
            live: 'https://github.com/AdnanIdrisi'
        },
        nexusstore: {
            tag: 'STRIPE WEBHOOKS // ACID TRANSACTIONS',
            title: 'NexusStore — High-Concurrency E-Commerce Engine',
            nodes: [
                { title: 'Client', sub: 'React / Redux' },
                { title: 'API Layer', sub: 'Express REST' },
                { title: 'Stripe', sub: 'Webhook Gateway' },
                { title: 'ACID Store', sub: 'MongoDB Sessions' }
            ],
            highlights: [
                'Two-phase commit inventory locks ensuring zero overselling under flash sales',
                'Idempotent Stripe webhook listeners preventing duplicate charges or state corruption',
                'Optimistic cart synchronization with local resilience and background server reconciliation',
                'Strict RBAC middleware guarding product lifecycle and financial analytics routes'
            ],
            stack: ['React', 'Node.js', 'Express', 'Stripe API', 'MongoDB', 'Redux Toolkit'],
            code: 'https://github.com/AdnanIdrisi',
            live: 'https://github.com/AdnanIdrisi'
        },
        blogcms: {
            tag: 'NEXT.JS 15 // EDGE ISR RENDERING',
            title: 'Headless CMS — High-Performance Editorial Platform',
            nodes: [
                { title: 'Studio', sub: 'Markdown AST' },
                { title: 'Next.js 15', sub: 'App Router ISR' },
                { title: 'Edge CDN', sub: 'Sub-50ms TTFB' },
                { title: 'Cloudinary', sub: 'AVIF/WebP Media' }
            ],
            highlights: [
                'Incremental Static Regeneration (ISR) delivering instant page loads with on-demand purge',
                'Automated OpenGraph visual generation and schema.org JSON-LD for 100/100 Lighthouse SEO',
                'High-speed Markdown compiler supporting code block syntax highlighting and reading time analysis',
                'Cloudinary transform pipeline generating adaptive responsive images based on client DPI'
            ],
            stack: ['Next.js 15', 'TypeScript', 'MongoDB Atlas', 'Cloudinary', 'TailwindCSS'],
            code: 'https://github.com/AdnanIdrisi',
            live: 'https://github.com/AdnanIdrisi'
        },
        collaboration: {
            tag: 'FIREBASE // REALTIME COLLABORATION',
            title: 'Team Collaboration — Real-Time Kanban Suite',
            nodes: [
                { title: 'Collaborator', sub: 'React Kanban' },
                { title: 'Realtime DB', sub: 'Event Stream' },
                { title: 'Cloud Fns', sub: 'Task Workers' },
                { title: 'Presence', sub: 'Active Avatars' }
            ],
            highlights: [
                'Zero-latency drag-and-drop state dispatch with optimistic UI task reordering',
                'Real-time multi-tenant presence indicators showing currently active teammates in columns',
                'Granular Firestore security rules enforcing complete workspace data isolation',
                'Event-driven serverless functions triggering automated task assignment notifications'
            ],
            stack: ['React', 'Firebase', 'TailwindCSS', 'Framer Motion', 'WebSockets'],
            code: 'https://github.com/AdnanIdrisi',
            live: 'https://github.com/AdnanIdrisi'
        }
    };

    function openProjectModal(key) {
        const data = projectData[key];
        if (!data || !projectModal) return;

        modalTag.textContent = data.tag;
        modalTitle.textContent = data.title;
        modalCodeLink.href = data.code;
        modalLiveLink.href = data.live;

        // Render flow nodes
        modalFlow.innerHTML = '';
        data.nodes.forEach((node, i) => {
            const nodeEl = document.createElement('div');
            nodeEl.className = 'flow-node';
            nodeEl.innerHTML = `<span class="flow-node-title">${node.title}</span><span class="flow-node-sub">${node.sub}</span>`;
            modalFlow.appendChild(nodeEl);

            if (i < data.nodes.length - 1) {
                const arrowEl = document.createElement('span');
                arrowEl.className = 'flow-arrow';
                arrowEl.textContent = '→';
                modalFlow.appendChild(arrowEl);
            }
        });

        // Render highlights
        modalHighlights.innerHTML = '';
        data.highlights.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            modalHighlights.appendChild(li);
        });

        // Render tech tags
        modalStackTags.innerHTML = '';
        data.stack.forEach(tech => {
            const chip = document.createElement('span');
            chip.className = 'modal-tag-chip';
            chip.textContent = tech;
            modalStackTags.appendChild(chip);
        });

        projectModal.classList.add('active');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        if (typeof lenis !== 'undefined' && lenis) {
            lenis.stop();
        }
    }

    function closeProjectModal() {
        if (!projectModal) return;
        projectModal.classList.remove('active');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        if (typeof lenis !== 'undefined' && lenis) {
            lenis.start();
        }
    }

    const modalDialog = document.querySelector('.project-modal-dialog');
    if (modalDialog) {
        modalDialog.addEventListener('wheel', (e) => {
            e.stopPropagation();
        }, { passive: true });
        modalDialog.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        }, { passive: true });
    }

    document.querySelectorAll('.dock-btn-specs').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectKey = btn.getAttribute('data-project');
            openProjectModal(projectKey);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeProjectModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
            closeProjectModal();
        }
    });
});

// Add spin keyframe for loading animation
const style = document.createElement('style');
style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
document.head.appendChild(style);
