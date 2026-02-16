document.addEventListener('DOMContentLoaded', () => {

    // --- Generate twinkling stars ---
    const starsContainer = document.getElementById('stars');
    const starCount = 80;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--duration', (2 + Math.random() * 4) + 's');
        star.style.setProperty('--max-opacity', (0.3 + Math.random() * 0.7).toString());
        star.style.animationDelay = Math.random() * 5 + 's';
        star.style.width = (1 + Math.random() * 2) + 'px';
        star.style.height = star.style.width;
        starsContainer.appendChild(star);
    }

    // --- Parallax on scroll ---
    const heroBg = document.getElementById('heroBg');
    const astronaut = document.getElementById('astronaut');
    const planet = document.getElementById('planet');
    const serviceCards = document.querySelectorAll('.service-card');

    let ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const vh = window.innerHeight;

            // Background parallax — moves slower than scroll
            heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;

            // Astronaut parallax — moves slightly with scroll + keeps floating
            const astroOffset = scrollY * 0.15;
            astronaut.style.transform = `translateY(${astroOffset}px)`;

            // Planet subtle rise
            planet.style.transform = `translateX(-50%) translateY(${-scrollY * 0.08}px)`;

            // Service cards subtle parallax
            serviceCards.forEach(card => {
                const rate = parseFloat(card.dataset.parallax) || 0;
                const rect = card.getBoundingClientRect();
                const center = rect.top + rect.height / 2 - vh / 2;
                card.style.transform = `translateY(${center * rate}px)`;
            });

            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // --- Scroll reveal ---
    const revealElements = document.querySelectorAll(
        '.service-card, .section-label, .section-title, .cta-desc, .cta-large, .stat-item'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // --- Stat counter animation ---
    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateCounter(el, target);
                statObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 1500;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.round(eased * target);
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // --- Mouse parallax on astronaut (desktop) ---
    if (window.matchMedia('(pointer: fine)').matches) {
        const heroSection = document.getElementById('hero');
        const astroImg = document.querySelector('.astronaut-img');

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            astroImg.style.transform = `translate(${x * 20}px, ${y * 15}px)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            astroImg.style.transform = '';
        });
    }
});
