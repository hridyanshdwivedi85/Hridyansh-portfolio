document.addEventListener('DOMContentLoaded', () => {

    /**
     /**
     * 0. ADVANCED PROCEDURAL AUDIO SYNTHESIZER
     * Engineered realistic physics-based audio (Fluids, Mechanical, Digital)
     */
    const AudioEngine = {
        ctx: null, unlocked: false,
        init() {
            if (this.unlocked) return;
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext(); this.unlocked = true; this.playBoot();
        },
        playHover() {
            if (!this.unlocked || !this.ctx) return;
            const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
            osc.type = 'sine'; osc.frequency.setValueAtTime(800, this.ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.01, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
            osc.connect(gain).connect(this.ctx.destination); osc.start(); osc.stop(this.ctx.currentTime + 0.05);
        },
        playClick() {
            if (!this.unlocked || !this.ctx) return;
            const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
            osc.type = 'square'; osc.frequency.setValueAtTime(400, this.ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.03, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
            osc.connect(gain).connect(this.ctx.destination); osc.start(); osc.stop(this.ctx.currentTime + 0.1);
        },
        playMech() {
            if (!this.unlocked || !this.ctx) return; // Heavy mechanical clunk for coffee machine
            const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, this.ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
            osc.connect(gain).connect(this.ctx.destination); osc.start(); osc.stop(this.ctx.currentTime + 0.15);
        },
        playBoot() {
            if (!this.unlocked || !this.ctx) return;
            const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
            osc.type = 'sine'; osc.frequency.setValueAtTime(100, this.ctx.currentTime); osc.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + 0.8);
            gain.gain.setValueAtTime(0, this.ctx.currentTime); gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.2); gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
            osc.connect(gain).connect(this.ctx.destination); osc.start(); osc.stop(this.ctx.currentTime + 1);
        },
        playSuccess() {
            if (!this.unlocked || !this.ctx) return;
            const t = this.ctx.currentTime;
            [523.25, 659.25, 783.99].forEach((freq, i) => { // C Major Chord
                const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
                osc.type = 'triangle'; osc.frequency.value = freq;
                gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.03, t + 0.1 + (i*0.05)); gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
                osc.connect(gain).connect(this.ctx.destination); osc.start(t); osc.stop(t + 1.5);
            });
        },
        playIceClink() {
            if (!this.unlocked || !this.ctx) return;
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            // High pitch glass clink
            osc.type = 'sine';
            osc.frequency.setValueAtTime(3500 + Math.random() * 1000, t);
            osc.frequency.exponentialRampToValueAtTime(1000, t + 0.1);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
            osc.connect(gain).connect(this.ctx.destination);
            osc.start(t); osc.stop(t + 0.1);
        },
        playIceDropSequence() {
            if (!this.unlocked || !this.ctx) return;
            const t = this.ctx.currentTime;

            // Three small collisions make the ice feel physical instead of a single click.
            [0, 0.07, 0.13].forEach((offset) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(1700 + Math.random() * 1300, t + offset);
                osc.frequency.exponentialRampToValueAtTime(480 + Math.random() * 240, t + offset + 0.08);
                gain.gain.setValueAtTime(0.0001, t + offset);
                gain.gain.exponentialRampToValueAtTime(0.11, t + offset + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.09);
                osc.connect(gain).connect(this.ctx.destination);
                osc.start(t + offset);
                osc.stop(t + offset + 0.1);
            });

            // A brief low tap for glass/body resonance.
            const body = this.ctx.createOscillator();
            const bodyGain = this.ctx.createGain();
            body.type = 'sine';
            body.frequency.setValueAtTime(180, t);
            body.frequency.exponentialRampToValueAtTime(90, t + 0.18);
            bodyGain.gain.setValueAtTime(0.0001, t);
            bodyGain.gain.exponentialRampToValueAtTime(0.04, t + 0.03);
            bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
            body.connect(bodyGain).connect(this.ctx.destination);
            body.start(t);
            body.stop(t + 0.24);
        },
        playSteamBurst() {
            if (!this.unlocked || !this.ctx) return;
            const t = this.ctx.currentTime;

            // Gentle steam "whoosh": filtered noise + soft airy highs
            const bSize = this.ctx.sampleRate * 0.9;
            const buf = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < bSize; i++) data[i] = (Math.random() * 2 - 1) * 0.7;

            const noise = this.ctx.createBufferSource();
            noise.buffer = buf;

            const band = this.ctx.createBiquadFilter();
            band.type = 'bandpass';
            band.frequency.setValueAtTime(1100, t);
            band.frequency.exponentialRampToValueAtTime(2100, t + 0.55);
            band.Q.value = 0.8;

            const high = this.ctx.createBiquadFilter();
            high.type = 'highpass';
            high.frequency.value = 600;

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.exponentialRampToValueAtTime(0.04, t + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

            noise.connect(high).connect(band).connect(gain).connect(this.ctx.destination);
            noise.start(t);
            noise.stop(t + 0.75);
        },
        startPour() {
            if (!this.unlocked || !this.ctx) return { stop: () => {} };
            const t = this.ctx.currentTime;
            // Liquid pouring sound using filtered noise
            const bSize = this.ctx.sampleRate * 2; const buf = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
            const data = buf.getChannelData(0); for (let i=0; i<bSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = this.ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
            
            const filter = this.ctx.createBiquadFilter(); filter.type = 'bandpass'; 
            filter.frequency.setValueAtTime(620, t);
            filter.frequency.linearRampToValueAtTime(1700, t + 3); // Pitch rises as glass fills.
            filter.Q.value = 1.2;

            const gurgle = this.ctx.createOscillator();
            gurgle.type = 'triangle';
            gurgle.frequency.setValueAtTime(122, t);
            gurgle.frequency.linearRampToValueAtTime(148, t + 2.4);
            const gurgleGain = this.ctx.createGain();
            gurgleGain.gain.setValueAtTime(0.0001, t);
            gurgleGain.gain.exponentialRampToValueAtTime(0.026, t + 0.24);

            const gain = this.ctx.createGain(); 
            gain.gain.setValueAtTime(0.0001, t); 
            gain.gain.exponentialRampToValueAtTime(0.17, t + 0.2);
            
            noise.connect(filter).connect(gain).connect(this.ctx.destination);
            gurgle.connect(gurgleGain).connect(this.ctx.destination);
            noise.start(t);
            gurgle.start(t);

            return {
                stop: () => {
                    const now = this.ctx.currentTime;
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
                    gurgleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
                    setTimeout(() => { noise.stop(); gurgle.stop(); }, 340);
                }
            };
        },
        startDataStream() {
            if (!this.unlocked || !this.ctx) return { stop: () => {} };
            const hum = this.ctx.createOscillator(); hum.type = 'square'; hum.frequency.value = 80;
            const humGain = this.ctx.createGain(); humGain.gain.value = 0.01;
            const filter = this.ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 300;
            hum.connect(filter).connect(humGain).connect(this.ctx.destination); hum.start();

            let active = true;
            const playBlip = () => {
                if(!active) return;
                const osc = this.ctx.createOscillator(); const g = this.ctx.createGain();
                osc.type = Math.random() > 0.5 ? 'sine' : 'square'; osc.frequency.value = 500 + Math.random() * 2500;
                g.gain.setValueAtTime(0.02, this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
                osc.connect(g).connect(this.ctx.destination); osc.start(); osc.stop(this.ctx.currentTime + 0.05);
                setTimeout(playBlip, Math.random() * 60 + 20);
            };
            playBlip();

            return { stop: () => { active = false; humGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3); setTimeout(() => hum.stop(), 300); } };
        }
    };

    /**
     * UNLOCK AUDIO & START APP
     */
    const unlockOverlay = document.getElementById('audio-unlock');
    
    // Auto-unlock for Search Engine Bots (so they can index your content)
    if (/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)) {
        unlockOverlay.style.display = 'none';
        // Force opening animations instantly
        gsap.set("#mod-origin p.code-font", { y: 0, opacity: 1 });
        gsap.set("#mod-origin h1", { y: 0, opacity: 1 });
        gsap.set("#mod-origin p.text-gray-400", { y: 0, opacity: 1 });
        gsap.set(".nav-area", { x: 0, opacity: 1 });
    }

    unlockOverlay.addEventListener('click', () => {
        AudioEngine.init();
        unlockOverlay.style.opacity = '0';
        setTimeout(() => unlockOverlay.remove(), 1000);
        
        // Opening Animations
        gsap.from("#mod-origin p.code-font", { y: 20, opacity: 0, duration: 1, delay: 0.2 });
        gsap.from("#mod-origin h1", { y: 40, opacity: 0, duration: 1.2, ease: "power4.out", delay: 0.4 });
        gsap.from("#mod-origin p.text-gray-400", { y: 20, opacity: 0, duration: 1, delay: 0.7 });
        gsap.from(".nav-area", { x: 50, opacity: 0, duration: 1, delay: 0.9 });
    });

    // Global UI Sound Bindings
    document.querySelectorAll('.sound-hover, .nav-item').forEach(el => {
        el.addEventListener('mouseenter', () => AudioEngine.playHover());
    });
    document.querySelectorAll('.sound-click, .hw-btn').forEach(el => {
        el.addEventListener('click', () => AudioEngine.playClick());
    });

    const OriginPrompt = {
        commands: [
            {
                cmd: 'npm run build:ios --release',
                output: [
                    'Analyzing dependency graph... done.',
                    'Compiling UI layer with typed modules... done.',
                    'Signing artifact: build/ios/Hridyansh.app',
                    'Build completed in 3.2s.'
                ]
            },
            {
                cmd: 'git commit -m "feat: realtime growth systems"',
                output: [
                    '9 files changed, 344 insertions(+), 27 deletions(-).',
                    'Lint check passed with zero errors.',
                    'Commit hash: 4b7f2ad'
                ]
            },
            {
                cmd: 'node scripts/deploy.mjs --target production',
                output: [
                    'Uploading static assets to edge cache... done.',
                    'Invalidating stale CDN objects... done.',
                    'Deployment status: healthy.'
                ]
            }
        ],
        init() {
            this.cmdEl = document.getElementById('origin-terminal-command');
            this.outputEl = document.getElementById('origin-terminal-output');
            if(!this.cmdEl || !this.outputEl) return;
            this.commandIndex = 0;
            this.runLoop();
        },
        async runLoop() {
            while(true) {
                const item = this.commands[this.commandIndex % this.commands.length];
                await this.typeCommand(item.cmd);
                await this.sleep(260);
                this.renderOutput(item.output);
                await this.sleep(1900);
                this.clearTerminal();
                this.commandIndex++;
            }
        },
        async typeCommand(command) {
            this.cmdEl.textContent = '';
            for (const char of command) {
                this.cmdEl.textContent += char;
                await this.sleep(24 + Math.random() * 18);
            }
        },
        renderOutput(lines) {
            this.outputEl.innerHTML = lines.map((line, idx) => {
                const variant = idx === lines.length - 1 ? 'ok' : (line.toLowerCase().includes('deploy') ? 'info' : '');
                return `<div class="${variant}">↳ ${line}</div>`;
            }).join('');
        },
        clearTerminal() {
            this.cmdEl.textContent = '';
            this.outputEl.innerHTML = '';
        },
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
    };

    /**
     * 1. CUSTOM CURSOR ENGINE
     */
    const cursorDot = document.getElementById("cursor-dot");
    const cursorOutline = document.getElementById("cursor-outline");
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    const updateCursorPosition = (x, y, instant = false) => {
        if (!cursorDot || !cursorOutline) return;
        cursorDot.style.left = `${x}px`;
        cursorDot.style.top = `${y}px`;

        if (instant || !window.matchMedia("(pointer: fine)").matches) {
            cursorOutline.style.left = `${x}px`;
            cursorOutline.style.top = `${y}px`;
            return;
        }

        cursorOutline.animate(
            { left: `${x}px`, top: `${y}px` },
            { duration: 500, fill: "forwards" }
        );
    };

    window.addEventListener("mousemove", (e) => {
        // Only run if the device has a mouse pointer (ignores touch screens)
        if (window.matchMedia("(pointer: fine)").matches) {
            updateCursorPosition(e.clientX, e.clientY);
        }
    });

    window.addEventListener("touchstart", (e) => {
        if (!isTouchDevice) return;
        const touch = e.touches?.[0];
        if (!touch) return;
        updateCursorPosition(touch.clientX, touch.clientY, true);
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
        if (!isTouchDevice) return;
        const touch = e.touches?.[0];
        if (!touch) return;
        updateCursorPosition(touch.clientX, touch.clientY, true);
    }, { passive: true });

    /**
     * 2. GENERAL BACKGROUND ENGINE (For standard tabs)
     */
    const BGEngine = {
        canvas: document.getElementById('bg-canvas'), ctx: null, particles: [], theme: 'galaxy', animationId: null, isRunning: true,
        init() { 
            this.ctx = this.canvas.getContext('2d'); 
            this.resize(); 
            window.addEventListener('resize', () => this.resize()); 
            this.setTheme('galaxy'); 
            this.animate(); 
        },
        resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; this.createParticles(); },
        setTheme(newTheme) {
            this.isRunning = true;
            this.canvas.style.opacity = '0.6';
            this.theme = newTheme; 
            this.createParticles();
            
            document.body.style.transition = "background-color 1s ease";
            if(newTheme === 'matrix') document.body.style.backgroundColor = "#020804";
            else if(newTheme === 'data') document.body.style.backgroundColor = "#080402";
            else if(newTheme === 'coffee') document.body.style.backgroundColor = "#0a0602";
            else if(newTheme === 'aurora') document.body.style.backgroundColor = "#050208";
            else if(newTheme === 'geo') document.body.style.backgroundColor = "#020617";
            else if(newTheme === 'music') document.body.style.backgroundColor = "#020202";
            else if(newTheme === 'entropy') document.body.style.backgroundColor = "#0b0806";
            else document.body.style.backgroundColor = "#030303";
        },
        createParticles() {
            this.particles = [];
            const count = this.theme === 'galaxy' ? 150 : (this.theme === 'coffee' ? 60 : (this.theme === 'music' ? 80 : 100));
            for(let i=0; i<count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 1, vy: (Math.random() - 0.5) * 1,
                    size: Math.random() * 2 + 0.5, color: this.getThemeColor()
                });
            }
        },
        getThemeColor() {
            if(this.theme === 'galaxy') return `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`;
            if(this.theme === 'data') return `rgba(217, 119, 6, ${Math.random() * 0.6 + 0.2})`;
            if(this.theme === 'coffee') return `rgba(180, 83, 9, ${Math.random() * 0.4 + 0.1})`;
            if(this.theme === 'matrix') return `rgba(61, 220, 132, ${Math.random() * 0.5 + 0.1})`;
            if(this.theme === 'aurora') return `rgba(168, 85, 247, ${Math.random() * 0.4 + 0.1})`;
            if(this.theme === 'geo') return `rgba(56, 189, 248, ${Math.random() * 0.4 + 0.1})`;
            return `rgba(100, 100, 100, ${Math.random() * 0.3})`;
        },
        animate() {
            if(!this.isRunning) {
                this.animationId = requestAnimationFrame(() => this.animate());
                return;
            }
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles.forEach(p => {
                if(this.theme === 'coffee') {
                    p.vy = -Math.abs(p.vy) - 0.5; p.x += Math.sin(p.y * 0.01) * 0.5;
                } else {
                    p.x += p.vx; p.y += p.vy;
                }
                if(p.x < 0) p.x = this.canvas.width; if(p.x > this.canvas.width) p.x = 0;
                if(p.y < 0) p.y = this.canvas.height; if(p.y > this.canvas.height) p.y = 0;

                this.ctx.fillStyle = p.color; this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); this.ctx.fill();
            });
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    };

    /**
     * 3. APP / TAB CONTROLLER
     */
    const AppController = {
        navItems: document.querySelectorAll('.nav-item'),
        tabNavItems: [],
        modules: document.querySelectorAll('.module'),
        isAnimating: false,
        wheelLock: false,
        touchStartY: null,
        touchStartX: null,
        touchStartedOnRail: false,
        touchCanSwitchTabs: false,
        navRailThreshold: 18,
        navIndicator: document.querySelector('.nav-rail-highlight'),
        init() {
            this.tabNavItems = Array.from(this.navItems).filter(
                nav => nav.getAttribute('data-target')
            );

            this.navItems.forEach(nav => {
                nav.addEventListener('click', (e) => {
                    // Let the browser handle standard link navigation (like Celestial Tab)
                    if (nav.tagName.toLowerCase() === 'a') return; 

                    if(this.isAnimating || nav.classList.contains('active')) return;
                    this.switchTab(nav, nav.getAttribute('data-target'), nav.getAttribute('data-theme'), true);
                });
            });

            // Read URL Hash on Load and open correct tab
            const hash = window.location.hash.substring(1);
            if(hash) {
                const targetNav = Array.from(this.navItems).find(nav => nav.getAttribute('data-target') === `mod-${hash}`);
                if(targetNav) {
                    this.switchTab(targetNav, `mod-${hash}`, targetNav.getAttribute('data-theme'), false);
                }
            }

            // Listen for Browser Back/Forward buttons
            window.addEventListener('popstate', () => {
                const currentHash = window.location.hash.substring(1) || 'origin';
                const targetNav = Array.from(this.navItems).find(nav => nav.getAttribute('data-target') === `mod-${currentHash}`);
                if(targetNav) {
                    this.switchTab(targetNav, `mod-${currentHash}`, targetNav.getAttribute('data-theme'), false);
                }
            });

            this.bindScrollTabSwitch();
            this.updateNavIndicator();
            window.addEventListener('resize', () => this.updateNavIndicator(), { passive: true });
            window.addEventListener('orientationchange', () => this.updateNavIndicator(), { passive: true });
        },
        isOnNavRail(clientX) {
            if (typeof clientX !== 'number') return false;
            const navArea = document.querySelector('.nav-area');
            if (!navArea) return false;
            const rect = navArea.getBoundingClientRect();
            const extra = this.navRailThreshold;
            return clientX >= (rect.left - extra) && clientX <= (rect.right + extra);
        },
        updateNavIndicator() {
            if (!this.navIndicator) return;
            const activeTab = this.tabNavItems.find(nav => nav.classList.contains('active'));
            const navWrap = document.getElementById('main-nav');
            if (!activeTab || !navWrap) {
                this.navIndicator.style.opacity = '0';
                return;
            }

            const navRect = navWrap.getBoundingClientRect();
            const activeRect = activeTab.getBoundingClientRect();
            const top = Math.max(0, activeRect.top - navRect.top + 2);
            const height = Math.max(8, activeRect.height - 4);

            this.navIndicator.style.top = `${top}px`;
            this.navIndicator.style.height = `${height}px`;
            this.navIndicator.style.opacity = '1';
        },
        bindScrollTabSwitch() {
            // Intentionally disabled: tab switching is click/tap only across desktop and mobile.
        },
        switchTab(navElement, targetId, theme, updateHash = true) {
            this.isAnimating = true;
            document.body.classList.toggle('identity-active', targetId === 'mod-identity');
            
            // Toggle Crosshair Cursor for Entropy
            const cursorOutline = document.getElementById("cursor-outline");
            const cursorDot = document.getElementById("cursor-dot");
            if(targetId === 'mod-entropy') {
                cursorOutline.classList.add('entropy-cursor');
                cursorDot.classList.add('entropy-cursor-dot');
                if (isTouchDevice) {
                    cursorOutline.style.opacity = '1';
                    cursorDot.style.opacity = '0';
                    cursorOutline.style.left = `${window.innerWidth / 2}px`;
                    cursorOutline.style.top = `${window.innerHeight / 2}px`;
                }
            } else {
                cursorOutline.classList.remove('entropy-cursor');
                cursorDot.classList.remove('entropy-cursor-dot');
                cursorOutline.style.opacity = '';
                cursorDot.style.opacity = '';
                cursorOutline.style.transform = 'translate(-50%, -50%)';
                if (window.EntropyEngine) {
                    EntropyEngine.sequenceStarted = false;
                    EntropyEngine.stopAmbientLoop?.();
                    EntropyEngine.isExploded = false;
                    EntropyEngine.textParticles = [];
                    EntropyEngine.trailParticles = [];
                }
            }

            // Update URL for SEO and Sharing
            if (updateHash) {
                const urlName = targetId.replace('mod-', '');
                window.history.pushState(null, null, `#${urlName}`);
            }
            this.navItems.forEach(n => n.classList.remove('active')); 
            navElement.classList.add('active');
            this.updateNavIndicator();
            
            BGEngine.setTheme(theme);

            const activeMod = document.querySelector('.module.active'); 
            const targetMod = document.getElementById(targetId);

            if(activeMod && targetMod) {
                gsap.to(activeMod, { 
                    opacity: 0, y: -30, scale: 0.98, duration: 0.5, ease: "power2.in",
                    onComplete: () => {
                        activeMod.classList.remove('active'); 
                        targetMod.classList.add('active');
                        gsap.fromTo(targetMod, { opacity: 0, y: 30, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)", onComplete: () => {
                            this.isAnimating = false;
                            
                            // Trigger LinkedIn "Live Sync" Simulation when Identity module opens
                            if(targetId === 'mod-identity') {
                                this.simulateLinkedInSync();
                            }
                            if(targetId === 'mod-entropy' && window.EntropyEngine) {
                                EntropyEngine.sequenceStarted = true;
                                EntropyEngine.runSequence();
                            }
                        }});
                    }
                });
            } else {
                this.isAnimating = false;
            }
        },
        simulateLinkedInSync() {
            const overlay = document.getElementById('li-sync-overlay');
            const connEl = document.getElementById('li-connections');
            const follEl = document.getElementById('li-followers');
            
            if(!overlay) return;

            // Reset overlay
            overlay.style.display = 'flex';
            overlay.style.opacity = '1';
            connEl.innerText = "---";
            follEl.innerText = "---";

            // Audio Cue for syncing
            if(window.AudioEngine && window.AudioEngine.unlocked) {
                if (typeof AudioEngine.playDataProcess === 'function') AudioEngine.playDataProcess();
                else AudioEngine.playClick();
            }

            // Simulate Network Request Delay
            setTimeout(() => {
                // Fade out overlay
                overlay.style.opacity = '0';
                
                // Roll numbers to simulate live injection
                setTimeout(() => {
                    overlay.style.display = 'none';
                    if(window.AudioEngine && window.AudioEngine.unlocked) AudioEngine.playSuccess();
                    
                    // You can manually update your numbers right here whenever you want them to change!
                    connEl.innerText = "500+";
                    
                    // Little rolling animation for followers
                    let count = 3900;
                    const interval = setInterval(() => {
                        count += 15;
                        follEl.innerText = count.toLocaleString();
                        if(count >= 4000) { // Target follower count
                            follEl.innerText = "4K"; // Updated to match screenshot exactly
                            clearInterval(interval);
                        }
                    }, 20);

                }, 500); // Overlay fade duration
            }, 1200); // API "Fetching" time
        }
    };

    /**
     * 4. NEURAL CORE
     */
    const NeuralCore = {
        state: 'OFF', dropInterval: null,
        init() {
            const btnPower = document.getElementById('ai-btn-power'); const btnIngest = document.getElementById('ai-btn-ingest'); const btnTrain = document.getElementById('ai-btn-train');
            const terminal = document.getElementById('ai-terminal'); const statusTxt = document.getElementById('ai-status-text'); const dot = document.getElementById('sys-status-dot');

            btnPower.addEventListener('click', () => {
                if(this.state === 'OFF') {
                    AudioEngine.playBoot();
                    this.state = 'ON'; document.getElementById('ai-led-power').classList.add('on'); dot.classList.replace('bg-red-900', 'bg-red-500'); statusTxt.textContent = "SYSTEM READY"; statusTxt.style.color = "var(--brand-orange)";
                    document.getElementById('ai-gauge').classList.replace('opacity-10', 'opacity-100'); terminal.classList.replace('opacity-0', 'opacity-100');
                    terminal.innerHTML = "> BOOT_SEQ: KERNEL_OK<br>> MEM: ALLOCATED<br>> AWAITING DATA...<div class='w-2 h-3 bg-[#d97706] animate-pulse inline-block ml-1'></div>";
                    btnIngest.classList.remove('opacity-50', 'pointer-events-none');
                }
            });

            btnIngest.addEventListener('click', () => {
                if(this.state === 'ON') {
                    this.audioStream = AudioEngine.startDataStream();
                    this.state = 'INGESTING'; document.getElementById('ai-led-ingest').classList.add('process'); statusTxt.textContent = "LOADING DATASET"; terminal.innerHTML = "> fetching data streams...<br>> cleaning vectors...";
                    this.startDataDrops();
                    setTimeout(() => {
                        this.state = 'READY_TRAIN'; document.getElementById('ai-led-ingest').classList.replace('process', 'success'); btnTrain.classList.remove('opacity-50', 'pointer-events-none');
                        terminal.innerHTML += "<br>> <b>DATASET LOADED (1.4TB)</b><br>> AWAITING TRAIN_CMD."; this.stopDataDrops();
                        if(this.audioStream) this.audioStream.stop();
                        AudioEngine.playSuccess();
                    }, 3000);
                }
            });

            btnTrain.addEventListener('click', () => {
                if(this.state === 'READY_TRAIN') {
                    this.audioStream = AudioEngine.startDataStream();
                    this.state = 'TRAINING'; document.getElementById('ai-led-train').classList.add('process'); statusTxt.textContent = "EPOCH PROCESSING"; terminal.innerHTML = "> initializing neural net...<br>> optimizing weights...";
                    let progress = 0; const gaugeFill = document.getElementById('gauge-fill'); const gaugeText = document.getElementById('gauge-text');
                    const interval = setInterval(() => {
                        progress += 2;
                        if(progress >= 100) {
                            clearInterval(interval); this.state = 'COMPLETE'; document.getElementById('ai-led-train').classList.replace('process', 'success'); statusTxt.textContent = "MODEL YIELD: OPTIMAL"; statusTxt.style.color = "#22c55e"; dot.classList.replace('bg-red-500', 'bg-green-500');
                            terminal.innerHTML += "<br>> <span style='color:#22c55e'>COMPILE SUCCESS. ORB READY.</span>";
                            document.getElementById('ai-orb-glow').classList.replace('opacity-0', 'opacity-60'); document.getElementById('ai-orb-icon').classList.replace('text-[#333]', 'text-white'); document.getElementById('ai-orb').classList.add('shadow-[0_0_30px_var(--brand-orange)]');
                            if(this.audioStream) this.audioStream.stop();
                            AudioEngine.playSuccess();
                        }
                        gaugeText.textContent = progress; gaugeFill.style.strokeDashoffset = 283 - (283 * progress / 100);
                    }, 50);
                }
            });
        },
        startDataDrops() {
            const container = document.getElementById('data-drops');
            this.dropInterval = setInterval(() => {
                const drop = document.createElement('div'); drop.className = "absolute w-1 h-3 rounded bg-[var(--brand-orange)] opacity-80 left-1/2 -ml-[2px] top-12"; container.appendChild(drop);
                gsap.to(drop, { y: 60, opacity: 0, duration: 0.4, ease: "power1.in", onComplete: () => drop.remove() });
            }, 100);
        },
        stopDataDrops() { clearInterval(this.dropInterval); }
    };

/**
    /**
     * 5. MIXOLOGY ENGINE V3 (Advanced Physics & Photorealism)
     */
    const MixologyEngine = {
        state: 'READY', // READY, POURING
        drink: 'whiskey', // whiskey, wine, vodka
        waterMl: 0,
        iceCount: 0,
        liquidVol: 0,
        pouredSpiritMl: 0,
        pouredWaterMl: 0,

        // High-end realistic color gradients and physical properties
        drinks: {
            whiskey: { 
                name: "WHISKEY", 
                colorBase: "rgba(180, 70, 0, 0.85)", // Deep Amber
                colorGradient: "linear-gradient(to right, rgba(120,40,0,0.9) 0%, rgba(200,90,10,0.8) 50%, rgba(120,40,0,0.9) 100%)",
                vol: 60, 
                shape: "whiskey-shape",
                glow: "rgba(217, 119, 6, 0.6)"
            },
            wine: { 
                name: "RED WINE", 
                colorBase: "rgba(90, 5, 15, 0.95)", // Deep Ruby
                colorGradient: "linear-gradient(to right, rgba(50,0,5,0.95) 0%, rgba(130,10,25,0.9) 50%, rgba(50,0,5,0.95) 100%)",
                vol: 150, 
                shape: "wine-shape",
                glow: "rgba(159, 18, 57, 0.6)"
            },
            vodka: { 
                name: "VODKA", 
                colorBase: "rgba(230, 245, 255, 0.3)", // Clear / Icy
                colorGradient: "linear-gradient(to right, rgba(200,230,255,0.2) 0%, rgba(255,255,255,0.4) 50%, rgba(200,230,255,0.2) 100%)",
                vol: 45, 
                shape: "vodka-shape",
                glow: "rgba(56, 189, 248, 0.6)"
            }
        },

        init() {
            this.ui = {
                btnWhiskey: document.getElementById('btn-whiskey'),
                btnWine: document.getElementById('btn-wine'),
                btnVodka: document.getElementById('btn-vodka'),
                btnIce: document.getElementById('btn-ice'),
                btnAddWater: document.getElementById('btn-add-water'),
                btnPour: document.getElementById('btn-pour'),
                btnReset: document.getElementById('btn-reset'),
                sliderWater: document.getElementById('slider-water'),
                valWater: document.getElementById('val-water'),
                
                glass: document.getElementById('the-glass'),
                liquid: document.getElementById('the-liquid'),
                iceContainer: document.getElementById('ice-container'),
                stream: document.getElementById('pour-stream'),
                stem: document.getElementById('wine-stem'),
                
                statusText: document.getElementById('mix-status-text'),
                readoutVol: document.getElementById('readout-vol'),
                readoutAbv: document.getElementById('readout-abv'),
                readoutTemp: document.getElementById('readout-temp'),
                panel: document.getElementById('mixology-panel')
            };

            this.bindEvents();
            this.setDrink('whiskey'); // Default initialization
        },

        bindEvents() {
            this.ui.btnWhiskey.addEventListener('click', () => this.setDrink('whiskey'));
            this.ui.btnWine.addEventListener('click', () => this.setDrink('wine'));
            this.ui.btnVodka.addEventListener('click', () => this.setDrink('vodka'));

            this.ui.btnIce.addEventListener('click', () => {
                if(this.state !== 'POURING') this.addIce();
            });

            this.ui.sliderWater.addEventListener('input', (e) => {
                this.waterMl = parseInt(e.target.value);
                this.ui.valWater.innerText = this.waterMl + "ml";
                this.updateMetrics();
            });

            this.ui.btnAddWater.addEventListener('click', () => {
                if(this.state !== 'POURING') this.addWater();
            });

            this.ui.btnPour.addEventListener('click', () => {
                if(this.state === 'READY') this.startPour();
            });

            this.ui.btnReset.addEventListener('click', () => {
                if(this.state !== 'POURING') this.resetGlass();
            });

            window.addEventListener('resize', () => this.syncStreamHeight());
        },

        setDrink(type) {
            if(this.state === 'POURING') return;
            AudioEngine.playClick();
            
            // Toggle Button UI
            [this.ui.btnWhiskey, this.ui.btnWine, this.ui.btnVodka].forEach(btn => btn.classList.remove('active'));
            if(type === 'whiskey') this.ui.btnWhiskey.classList.add('active');
            if(type === 'wine') this.ui.btnWine.classList.add('active');
            if(type === 'vodka') this.ui.btnVodka.classList.add('active');

            this.drink = type;
            this.resetGlass();
            this.ui.statusText.innerText = "STANDBY: " + this.drinks[type].name;
            this.ui.statusText.style.color = "#4ade80"; // reset to green
            
            // Morph Glass Shape Seamlessly
            this.ui.glass.className = `realistic-glass ${this.drinks[type].shape}`;
            
            // Handle Wine Stem
            if(type === 'wine') {
                gsap.to(this.ui.stem, {opacity: 1, duration: 0.5});
            } else if (type === 'whiskey') {
                gsap.to(this.ui.stem, {opacity: 0, duration: 0.3});
            } else {
                gsap.to(this.ui.stem, {opacity: 0, duration: 0.3});
            }
            this.applyLiquidAppearance();
        },

        addIce() {
            if(this.drink === 'wine') {
                this.ui.statusText.innerText = "ERR: NO ICE IN WINE";
                this.ui.statusText.style.color = "#ef4444";
                return;
            }
            if(this.iceCount >= 6) return;
            
            AudioEngine.playIceDropSequence();
            this.iceCount++;
            
            const ice = document.createElement('div');
            ice.className = 'real-ice';
            
            const rot = (Math.random() - 0.5) * 60;
            const glassWidth = this.ui.glass.clientWidth;
            const glassHeight = this.ui.glass.clientHeight;
            const cubeSize = Math.max(18, Math.min(34, glassWidth * 0.22));
            const dropSlot = this.getIceDropSlot(this.iceCount - 1, cubeSize);

            this.ui.iceContainer.appendChild(ice);

            ice.style.left = '50%';
            ice.style.width = `${cubeSize}px`;
            ice.style.height = `${cubeSize}px`;

            // Realistic Drop Animation
            gsap.fromTo(ice, 
                { y: -230, x: dropSlot.x, xPercent: -50, rotation: rot + 150, opacity: 0, scale: 0.65 },
                { y: `${Math.max(6, glassHeight - cubeSize - dropSlot.yOffset)}px`, x: dropSlot.x, xPercent: -50, rotation: rot, opacity: 1, scale: 1, duration: 0.95, ease: "bounce.out" }
            );

            // Displace liquid if already poured (Archimedes principle)
            if(this.pouredSpiritMl + this.pouredWaterMl > 0) {
                this.animateLiquidToCurrentVolume(0.4);
            }
            
            this.ui.statusText.innerText = `ICE CUBE INSERTED (${this.iceCount})`;
            this.ui.statusText.style.color = "#38bdf8";
            this.updateStatusLights();
        },

        addWater() {
            if(!this.waterMl) {
                this.ui.statusText.innerText = "SET H2O SLIDER FIRST";
                this.ui.statusText.style.color = "#60a5fa";
                return;
            }
            const addAmount = this.waterMl;
            this.pouredWaterMl += addAmount;
            this.ui.statusText.innerText = `WATER DOSING +${this.waterMl}ml`;
            this.ui.statusText.style.color = "#60a5fa";
            this.syncStreamHeight();
            const totalSpirit = this.pouredSpiritMl;
            const totalLiquidAfterWater = Math.max(1, totalSpirit + this.pouredWaterMl);
            const waterRatio = Math.max(0, Math.min(1, 1 - (totalSpirit / totalLiquidAfterWater)));
            const selectionTint = this.mixDrinkWithWater(this.drink, waterRatio);
            this.ui.stream.style.setProperty('--stream-top', selectionTint.top);
            this.ui.stream.style.setProperty('--stream-mid', selectionTint.mid);
            this.ui.stream.style.setProperty('--stream-bottom', selectionTint.bottom);
            this.animateDropletLeadIn(selectionTint, Math.max(0.38, 0.35 + (addAmount / 240)));
            this.animateLiquidToCurrentVolume(0.9);
            this.updateMetrics();
            this.updateStatusLights();
        },

        startPour() {
            this.state = 'POURING';
            this.ui.statusText.innerText = "DISPENSING...";
            this.ui.statusText.style.color = "#facc15";
            this.audioRef = AudioEngine.startPour();
            
            const baseVol = this.drinks[this.drink].vol;
            const pendingSpirit = baseVol;
            const pendingWater = this.waterMl;
            const targetMl = this.pouredSpiritMl + this.pouredWaterMl + pendingSpirit + pendingWater;
            const targetFill = this.computeFillPercent(targetMl);
            this.syncStreamHeight();

            // Stream styling follows currently selected spirit and dilution ratio.
            const pendingWaterRatio = pendingWater / Math.max(1, pendingSpirit + pendingWater);
            const pourTint = this.mixDrinkWithWater(this.drink, pendingWaterRatio);
            this.ui.stream.style.setProperty('--stream-top', pourTint.top);
            this.ui.stream.style.setProperty('--stream-mid', pourTint.mid);
            this.ui.stream.style.setProperty('--stream-bottom', pourTint.bottom);
            this.ui.stream.style.boxShadow = `0 0 15px ${this.drinks[this.drink].glow}`;
            
            const tl = gsap.timeline();
            
            // 1. Droplets lead in, then stream starts.
            tl.add(this.animateDropletLeadIn(pourTint, 0.3, true, false));
            
            // 2. Liquid Rises
            this.applyLiquidAppearance(targetMl, this.pouredSpiritMl + pendingSpirit);

            tl.to(this.ui.liquid, {
                height: `${targetFill}%`, 
                duration: 2.1 + (targetFill * 0.02), 
                ease: "power1.inOut",
                onUpdate: () => {
                    const currentProgress = tl.progress();
                    this.liquidVol = targetFill * currentProgress;
                    this.updateMetrics(currentProgress);
                }
            });

            // 3. Stream stops
            tl.to(this.ui.stream, { scaleY: 0, opacity: 0, transformOrigin: "top", duration: 0.3 }, "-=0.2");
            
            tl.call(() => {
                this.pouredSpiritMl += pendingSpirit;
                this.pouredWaterMl += pendingWater;
                this.waterMl = 0;
                this.ui.sliderWater.value = "0";
                this.ui.valWater.innerText = "0ml";
                this.liquidVol = this.computeFillPercent(this.pouredSpiritMl + this.pouredWaterMl);
                this.ui.stream.style.height = '0px';
                if(this.audioRef) this.audioRef.stop();
                this.state = 'READY';
                this.ui.statusText.innerText = "READY TO SERVE";
                this.ui.statusText.style.color = "#4ade80";
                this.ui.liquid.classList.remove('is-pouring');
                this.applyLiquidAppearance();
                this.updateMetrics(1);
                this.updateStatusLights();
            });
        },

        resetGlass() {
            this.liquidVol = 0;
            this.iceCount = 0;
            this.waterMl = 0;
            this.pouredSpiritMl = 0;
            this.pouredWaterMl = 0;
            this.ui.sliderWater.value = "0";
            this.ui.valWater.innerText = "0ml";
            
            // Fade out ice cubes before removing
            gsap.to('.real-ice', { opacity: 0, scale: 0.5, duration: 0.3, onComplete: () => {
                this.ui.iceContainer.innerHTML = '';
            }});
            
            gsap.killTweensOf(this.ui.liquid);
            gsap.to(this.ui.liquid, { height: "0%", duration: 0.5, ease: "power2.inOut" });
            gsap.to(this.ui.stream, { scaleY: 0, opacity: 0, duration: 0.2 });
            this.ui.liquid.style.background = 'transparent';
            this.ui.liquid.style.opacity = '0';
            this.ui.liquid.classList.remove('is-pouring');
            
            this.updateMetrics(0);
            this.ui.statusText.innerText = "SYSTEM FLUSHED";
            this.ui.statusText.style.color = "#4ade80";
            this.updateStatusLights();
        },

        updateMetrics(progress = 1) {
            const pendingMl = this.state === 'POURING' ? (this.drinks[this.drink].vol + this.waterMl) : 0;
            const totalMl = this.pouredSpiritMl + this.pouredWaterMl + pendingMl;
            const currentTotal = Math.max(0, Math.floor(totalMl * progress));
            
            // Animate number change
            this.ui.readoutVol.innerHTML = `${currentTotal}<span class="text-xs text-gray-500">ml</span>`;

            // Calculate precise ABV
            let baseAbv = 0;
            if(this.drink === 'whiskey') baseAbv = 42.5;
            if(this.drink === 'vodka') baseAbv = 40.0;
            if(this.drink === 'wine') baseAbv = 13.5;

            if(currentTotal === 0) {
                this.ui.readoutAbv.innerHTML = `0.0<span class="text-xs text-orange-700">%</span>`;
            } else {
                const spiritMl = this.pouredSpiritMl + (this.state === 'POURING' ? this.drinks[this.drink].vol * progress : 0);
                const waterMl = this.pouredWaterMl + (this.state === 'POURING' ? this.waterMl * progress : 0);
                const totalLiquid = Math.max(1, spiritMl + waterMl);
                const dilutedAbv = (spiritMl * baseAbv) / totalLiquid;
                this.ui.readoutAbv.innerHTML = `${dilutedAbv.toFixed(1)}<span class="text-xs text-orange-700">%</span>`;
            }
            const temp = this.computeTemperature(currentTotal);
            this.ui.readoutTemp.innerHTML = `${temp}<span class="text-xs text-cyan-700">°C</span>`;
            this.updateStatusLights();
        },

        computeTemperature(totalVolume) {
            const base = this.drink === 'wine' ? 16 : 7;
            const warmByVolume = Math.min(8, totalVolume * 0.04);
            const chillByIce = this.iceCount * 2.4;
            return Math.max(-2, Math.round((base + warmByVolume - chillByIce) * 10) / 10);
        },

        updateStatusLights() {
            const cold = this.computeTemperature(Math.floor(this.liquidVol));
            const activeColor = this.state === 'POURING'
                ? 'rgba(250, 204, 21, 0.55)'
                : (cold <= 5 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(74, 222, 128, 0.45)');
            this.ui.panel.style.boxShadow = `0 30px 60px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.1), 0 0 24px ${activeColor}`;
        },

        getIceDropSlot(index, cubeSize) {
            const spreadX = Math.max(14, this.ui.glass.clientWidth * 0.24);
            const spreadY = cubeSize * 0.6;
            const slots = [
                { x: -spreadX * 0.9, yOffset: spreadY * 0.7 },
                { x: spreadX * 0.9, yOffset: spreadY * 0.7 },
                { x: 0, yOffset: spreadY * 1.1 },
                { x: -spreadX * 0.5, yOffset: spreadY * 1.6 },
                { x: spreadX * 0.5, yOffset: spreadY * 1.6 },
                { x: 0, yOffset: spreadY * 2.05 }
            ];
            return slots[index % slots.length];
        },

        computeFillPercent(totalMl) {
            const maxFillByDrink = this.drink === 'vodka' ? 84 : (this.drink === 'wine' ? 88 : 80);
            return Math.min(maxFillByDrink, Math.max(0, (totalMl + (this.iceCount * 12)) / 2.85));
        },

        animateLiquidToCurrentVolume(duration = 0.45) {
            const targetFill = this.computeFillPercent(this.pouredSpiritMl + this.pouredWaterMl);
            this.liquidVol = targetFill;
            this.applyLiquidAppearance();
            gsap.to(this.ui.liquid, { height: `${targetFill}%`, duration, ease: "power2.out" });
            this.updateMetrics();
        },

        applyLiquidAppearance(totalMl = this.pouredSpiritMl + this.pouredWaterMl, spiritMl = this.pouredSpiritMl) {
            if(totalMl <= 0) {
                this.ui.liquid.style.background = 'transparent';
                this.ui.liquid.style.opacity = '0';
                return;
            }

            const waterRatio = Math.max(0, Math.min(1, 1 - (spiritMl / Math.max(1, totalMl))));
            if(spiritMl <= 0) {
                this.ui.liquid.style.background = "linear-gradient(to right, rgba(220,242,255,0.08) 0%, rgba(255,255,255,0.18) 50%, rgba(220,242,255,0.08) 100%)";
                this.ui.liquid.style.opacity = "0.92";
                return;
            }

            const mixGradient = this.mixDrinkWithWater(this.drink, waterRatio);
            this.ui.liquid.style.background = `linear-gradient(to right, ${mixGradient.bottom} 0%, ${mixGradient.mid} 50%, ${mixGradient.bottom} 100%)`;
            this.ui.liquid.style.opacity = `${Math.max(0.56, 1 - (waterRatio * 0.42))}`;
        },

        mixDrinkWithWater(drinkKey, waterRatio = 0) {
            const basePalette = {
                whiskey: { top: [232, 138, 36], mid: [184, 86, 16], bottom: [105, 43, 6] },
                wine: { top: [154, 34, 58], mid: [104, 12, 35], bottom: [55, 5, 20] },
                vodka: { top: [230, 247, 255], mid: [188, 221, 244], bottom: [124, 172, 207] }
            };
            const palette = basePalette[drinkKey] || basePalette.whiskey;
            const blend = (rgb, alpha) => {
                const ratio = Math.max(0, Math.min(1, waterRatio));
                const out = rgb.map((channel) => Math.round(channel + (255 - channel) * ratio * 0.75));
                return `rgba(${out[0]}, ${out[1]}, ${out[2]}, ${alpha})`;
            };
            return {
                top: blend(palette.top, 0.95),
                mid: blend(palette.mid, 0.88),
                bottom: blend(palette.bottom, 0.82)
            };
        },

        syncStreamHeight() {
            const nozzleRect = this.ui.stream.parentElement.getBoundingClientRect();
            const glassRect = this.ui.glass.getBoundingClientRect();
            const safetyInset = 5;
            const gapToBase = Math.max(0, Math.round(glassRect.bottom - nozzleRect.bottom - safetyInset));
            const streamHeight = Math.max(0, Math.min(520, gapToBase));
            this.ui.stream.style.height = `${streamHeight}px`;
        },

        spawnDroplets(tint) {
            const streamRect = this.ui.stream.getBoundingClientRect();
            const stage = this.ui.stream.closest('.machine-stage');
            if(!stage) return [];
            const stageRect = stage.getBoundingClientRect();
            const droplets = [];
            const dropletCount = 4;

            for(let i = 0; i < dropletCount; i++) {
                const drop = document.createElement('span');
                drop.className = 'stream-droplet';
                drop.style.setProperty('--stream-top', tint.top);
                drop.style.setProperty('--stream-mid', tint.mid || tint.top);
                drop.style.setProperty('--stream-bottom', tint.bottom);
                const baseLeft = (streamRect.left - stageRect.left) + (streamRect.width / 2);
                drop.style.left = `${baseLeft + ((Math.random() - 0.5) * 9)}px`;
                drop.style.top = `${Math.max(0, streamRect.top - stageRect.top)}px`;
                stage.appendChild(drop);
                droplets.push(drop);
            }

            return droplets;
        },

        animateDropletLeadIn(tint, flowDuration = 0.5, markPouring = false, autoStop = true) {
            const droplets = this.spawnDroplets(tint);
            const leadTl = gsap.timeline();

            leadTl.to(droplets, {
                y: () => 18 + (Math.random() * 14),
                x: () => (Math.random() - 0.5) * 8,
                scaleY: 1.14,
                opacity: 0.95,
                duration: 0.16,
                stagger: 0.04,
                ease: "power1.out"
            });

            leadTl.to(droplets, {
                y: () => 58 + (Math.random() * 20),
                scaleX: 0.88,
                opacity: 0,
                duration: 0.18,
                stagger: 0.03,
                ease: "power1.in",
                onComplete: () => droplets.forEach((drop) => drop.remove())
            });

            leadTl.to(this.ui.stream, {
                scaleY: 1,
                opacity: 1,
                duration: 0.22,
                ease: "power2.in",
                onStart: () => {
                    if(markPouring) this.ui.liquid.classList.add('is-pouring');
                }
            });

            if(autoStop) {
                leadTl.to(this.ui.stream, {
                    scaleY: 0,
                    opacity: 0,
                    duration: 0.22,
                    ease: "power1.in"
                }, `+=${Math.max(0.2, flowDuration)}`);
            }

            return leadTl;
        }
    };
	
    /**
     * 6. COMPILER ARENA V2
     */
    const CompilerArena = {
        state: {
            isCompiling: false,
            packetInterval: null,
        },

        init() {
            this.ui = {
                btn: document.getElementById('btn-compile-v2'),
                term: document.getElementById('compiler-terminal'),
                linesIn: [document.getElementById('pipe-in-1'), document.getElementById('pipe-in-2'), document.getElementById('pipe-in-3')],
                linesOut: [document.getElementById('pipe-out-1'), document.getElementById('pipe-out-2')],
                outApple: document.getElementById('out-apple'),
                outAndroid: document.getElementById('out-android'),
                forge: document.getElementById('forge-core'),
                forgeIcon: document.querySelector('.forge-center i'),
                progress: document.getElementById('compiler-progress-bar'),
                stages: [
                    document.getElementById('stage-parse'),
                    document.getElementById('stage-compile'),
                    document.getElementById('stage-bundle'),
                    document.getElementById('stage-sign'),
                    document.getElementById('stage-deploy')
                ],
                packets: document.getElementById('compiler-dataflow'),
                inputNodes: ['#node-src-1', '#node-src-2', '#node-src-3']
            };

            this.updateSVGPaths();
            window.addEventListener('resize', () => this.updateSVGPaths());
            this.ui.btn.addEventListener('click', () => this.startBuild());
        },

        setProgress(value) {
            this.ui.progress.style.width = `${Math.max(0, Math.min(100, value))}%`;
        },

        setStage(index) {
            this.ui.stages.forEach((s, i) => s.classList.toggle('active', i <= index));
        },

        log(lines) {
            this.ui.term.innerHTML = lines.join('<br>');
        },

        startPackets() {
            this.stopPackets();
            this.state.packetInterval = setInterval(() => {
                if(!document.getElementById('mod-compiler').classList.contains('active')) return;
                const packet = document.createElement('div');
                packet.className = 'data-packet';
                this.ui.packets.appendChild(packet);

                const rect = this.ui.packets.getBoundingClientRect();
                const startY = rect.height * (0.22 + Math.random() * 0.56);
                const isMobile = window.matchMedia('(max-width: 767px)').matches;

                if(isMobile) {
                    packet.style.left = `${rect.width * (0.2 + Math.random() * 0.6)}px`;
                    packet.style.top = `${rect.height * 0.28}px`;
                    gsap.to(packet, {
                        y: rect.height * 0.5,
                        opacity: 0,
                        duration: 0.9,
                        ease: 'power1.out',
                        onComplete: () => packet.remove()
                    });
                    return;
                }

                packet.style.left = `170px`;
                packet.style.top = `${startY}px`;
                gsap.to(packet, {
                    x: rect.width - 340,
                    y: (Math.random() - 0.5) * 40,
                    opacity: 0,
                    duration: 1.1,
                    ease: 'none',
                    onComplete: () => packet.remove()
                });
            }, 140);
        },

        stopPackets() {
            clearInterval(this.state.packetInterval);
            this.state.packetInterval = null;
        },

        startBuild() {
            if(this.state.isCompiling) return;
            this.state.isCompiling = true;
            this.ui.btn.style.opacity = '0.5';
            this.ui.btn.style.pointerEvents = 'none';

            let audioStream;
            this.setProgress(4);
            this.setStage(-1);
            this.log([
                '> BUILD REQUEST ACCEPTED.',
                '> PREPARING EXECUTION GRAPH...',
                '> TARGETS: IOS, ANDROID.'
            ]);

            const tl = gsap.timeline();

            tl.call(() => {
                audioStream = AudioEngine.startDataStream();
                this.setStage(0);
                this.setProgress(16);
                this.log([
                    '> STAGE 1/5 :: PARSE',
                    '> PARSING SOURCE MODULES...',
                    '> RESOLVING DEPENDENCIES...'
                ]);
                this.ui.linesIn.forEach(l => l.classList.add('active'));
                this.ui.inputNodes.forEach(sel => document.querySelector(sel).classList.add('active'));
            });
            tl.to(this.ui.inputNodes, { x: 36, duration: 0.5, stagger: 0.12, ease: 'power2.inOut' });

            tl.call(() => {
                this.setStage(1);
                this.setProgress(40);
                this.ui.forge.classList.add('compiling');
                this.ui.forgeIcon.className = 'fas fa-microchip text-[#3ddc84] text-4xl';
                this.log([
                    '> STAGE 2/5 :: COMPILE',
                    '> EMITTING BYTECODE SEGMENTS...',
                    '> OPTIMIZING TREESHAKE + MINIFY...'
                ]);
                this.startPackets();
            });
            tl.to(this.ui.forge, { scale: 1.16, duration: 0.85, ease: 'power1.inOut' });

            tl.call(() => {
                this.setStage(2);
                this.setProgress(62);
                this.log([
                    '> STAGE 3/5 :: BUNDLE',
                    '> SPLITTING CHUNKS BY TARGET...',
                    '> GENERATING SOURCE MAPS...'
                ]);
            });
            tl.to(this.ui.forge, { scale: 1.04, duration: 0.5 });

            tl.call(() => {
                this.setStage(3);
                this.setProgress(78);
                this.ui.linesIn.forEach(l => l.classList.remove('active'));
                this.ui.linesOut.forEach(l => l.classList.add('active'));
                this.log([
                    '> STAGE 4/5 :: SIGN',
                    '> SIGNING IOS ARTIFACTS...',
                    '> SIGNING ANDROID ARTIFACTS...'
                ]);
                this.ui.forgeIcon.className = 'fas fa-shield-alt text-[#60a5fa] text-4xl';
            });
            tl.to(this.ui.forge, { scale: 1.0, duration: 0.4 });

            tl.call(() => {
                this.setStage(4);
                this.setProgress(96);
                this.log([
                    '> STAGE 5/5 :: DEPLOY',
                    '> PUSHING IOS BUILD TO RELEASE QUEUE...',
                    '> PUSHING ANDROID BUILD TO RELEASE QUEUE...'
                ]);
                this.ui.forgeIcon.className = 'fas fa-rocket text-[#facc15] text-4xl';
            });
            tl.to(this.ui.outApple, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' });
            tl.call(() => {
                this.ui.outApple.classList.add('active');
                this.ui.outApple.querySelector('.status-badge').innerText = 'DEPLOYED';
            });
            tl.to(this.ui.outAndroid, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.2');

            tl.call(() => {
                this.ui.outAndroid.classList.add('active');
                this.ui.outAndroid.querySelector('.status-badge').innerText = 'DEPLOYED';
                this.setProgress(100);
                this.log([
                    '> STAGE 5/5 :: DEPLOY',
                    '> IOS BUILD: DEPLOYED ✅',
                    '> ANDROID BUILD: DEPLOYED ✅',
                    '> UNIVERSAL PIPELINE SUCCESSFUL.'
                ]);
                this.ui.forgeIcon.className = 'fas fa-check text-[#3ddc84] text-4xl';
                this.ui.linesOut.forEach(l => l.classList.remove('active'));
                this.stopPackets();
                if(audioStream) audioStream.stop();
                AudioEngine.playSuccess();
            });

            tl.call(() => this.resetAfterRun(), null, '+=3.5');
        },

        resetAfterRun() {
            this.ui.outApple.classList.remove('active');
            this.ui.outAndroid.classList.remove('active');
            this.ui.outApple.querySelector('.status-badge').innerText = 'AWAITING';
            this.ui.outAndroid.querySelector('.status-badge').innerText = 'AWAITING';
            gsap.to([this.ui.outApple, this.ui.outAndroid], { opacity: 0.3, scale: 0.9, duration: 0.45 });
            gsap.to(this.ui.inputNodes, { x: 0, duration: 0.4 });
            this.ui.inputNodes.forEach(sel => document.querySelector(sel).classList.remove('active'));
            this.ui.forge.classList.remove('compiling');
            this.ui.forgeIcon.className = 'fas fa-cube text-white text-4xl';
            this.log([
                '> SYSTEM IDLE.',
                '> WAITING FOR BUILD TRIGGER.',
                '> TARGETS: IOS, ANDROID.'
            ]);
            this.setProgress(0);
            this.setStage(-1);
            this.ui.btn.style.opacity = '1';
            this.ui.btn.style.pointerEvents = 'auto';
            this.state.isCompiling = false;
        },

        updateSVGPaths() {
            const svg = document.getElementById('pipeline-lines');
            if(!svg || window.matchMedia('(max-width: 767px)').matches) return;

            const toLocal = (el) => {
                const svgRect = svg.getBoundingClientRect();
                const rect = el.getBoundingClientRect();
                return {
                    x: rect.left - svgRect.left + rect.width / 2,
                    y: rect.top - svgRect.top + rect.height / 2
                };
            };

            const inputs = [
                toLocal(document.getElementById('node-src-1')),
                toLocal(document.getElementById('node-src-2')),
                toLocal(document.getElementById('node-src-3'))
            ];
            const core = toLocal(document.getElementById('forge-core'));
            const out1 = toLocal(document.getElementById('out-apple'));
            const out2 = toLocal(document.getElementById('out-android'));

            document.getElementById('pipe-in-1').setAttribute('d', `M ${inputs[0].x + 40} ${inputs[0].y} Q ${core.x - 80} ${inputs[0].y} ${core.x - 20} ${core.y}`);
            document.getElementById('pipe-in-2').setAttribute('d', `M ${inputs[1].x + 40} ${inputs[1].y} L ${core.x - 20} ${core.y}`);
            document.getElementById('pipe-in-3').setAttribute('d', `M ${inputs[2].x + 40} ${inputs[2].y} Q ${core.x - 80} ${inputs[2].y} ${core.x - 20} ${core.y}`);
            document.getElementById('pipe-out-1').setAttribute('d', `M ${core.x + 20} ${core.y} Q ${out1.x - 90} ${out1.y} ${out1.x - 40} ${out1.y}`);
            document.getElementById('pipe-out-2').setAttribute('d', `M ${core.x + 20} ${core.y} Q ${out2.x - 90} ${out2.y} ${out2.x - 40} ${out2.y}`);
        }
    };

    /**
     * 8. SOCIAL CARD
     */
    const SocialCard = {
        init() {
            const wrapper = document.getElementById('ig-wrapper'); const card = document.getElementById('ig-card');
            if(!wrapper) return;
            wrapper.addEventListener('mousemove', (e) => {
                const rect = wrapper.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                const centerX = rect.width / 2; const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -12; const rotateY = ((x - centerX) / centerX) * 12;
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            wrapper.addEventListener('mouseleave', () => { card.style.transform = `rotateX(0deg) rotateY(0deg)`; });
        }
    };

    /**
     * 9. MUSIC PLAYER (Minimal Local Media Deck)
     */
    const MusicPlayer = {
        tracks: [
            {
                title: 'Tum Hi Ho Aashiqui 2',
                artist: 'Local MP3',
                src: 'assets/media/Tum Hi Ho Aashiqui 2 320 Kbps.mp3'
            },
            {
                title: 'Meri Aashiqui',
                artist: 'Local MP3',
                src: 'assets/media/Meri Aashiqui Aashiqui 2 320 Kbps.mp3'
            },
            {
                title: 'Sunn Raha Hai',
                artist: 'Local MP3',
                src: 'assets/media/Sunn Raha Hai Male Aashiqui 2 320 Kbps.mp3'
            }
        ],
        currentIndex: 0,
        isReady: false,
        init() {
            this.audio = document.getElementById('music-audio');
            this.shell = document.getElementById('airpods-shell');
            this.startCaseBtn = document.getElementById('buds-start');
            this.stage = this.shell?.querySelector('.airpods-stage');
            this.playBtn = document.getElementById('music-play');
            this.playIcon = document.getElementById('music-play-icon');
            this.stopBtn = document.getElementById('music-stop');
            this.prevBtn = document.getElementById('music-prev');
            this.nextBtn = document.getElementById('music-next');
            this.progress = document.getElementById('music-progress');
            this.volume = document.getElementById('music-volume');
            this.currentTimeEl = document.getElementById('music-current-time');
            this.durationEl = document.getElementById('music-duration');
            this.trackTitleEl = document.getElementById('music-track-title');
            this.trackArtistEl = document.getElementById('music-track-artist');

            if (!this.audio || !this.playBtn || !this.progress || !this.volume) return;

            this.loadTrack(0);
            this.setControlsEnabled(false);
            this.bind();
            this.bind3DRotation();
            this.initRainScene();
        },
        bind() {
            this.startCaseBtn?.addEventListener('click', () => this.openCase());
            this.playBtn.addEventListener('click', () => this.togglePlay());
            this.stopBtn?.addEventListener('click', () => this.stopAndDock());
            this.prevBtn?.addEventListener('click', () => this.prevTrack());
            this.nextBtn?.addEventListener('click', () => this.nextTrack());

            this.audio.addEventListener('loadedmetadata', () => {
                this.durationEl.textContent = this.formatTime(this.audio.duration || 0);
            });
            this.audio.addEventListener('timeupdate', () => {
                const duration = this.audio.duration || 0;
                const current = this.audio.currentTime || 0;
                this.currentTimeEl.textContent = this.formatTime(current);
                this.progress.value = duration ? (current / duration) * 100 : 0;
            });
            this.audio.addEventListener('ended', () => this.nextTrack());
            this.audio.addEventListener('play', () => this.setPlayingState(true));
            this.audio.addEventListener('pause', () => this.setPlayingState(false));
            this.audio.addEventListener('error', () => {
                this.trackArtistEl.textContent = 'Unable to load this MP3. Skipping to the next track.';
                setTimeout(() => this.nextTrack(), 600);
                this.setPlayingState(false);
            });

            this.progress.addEventListener('input', () => {
                const duration = this.audio.duration || 0;
                if (!duration) return;
                this.audio.currentTime = (Number(this.progress.value) / 100) * duration;
            });

            this.volume.addEventListener('input', () => {
                this.audio.volume = Number(this.volume.value);
            });
            this.audio.volume = Number(this.volume.value);
        },
        loadTrack(index) {
            const total = this.tracks.length;
            this.currentIndex = (index + total) % total;
            const track = this.tracks[this.currentIndex];
            this.audio.src = track.src;
            this.trackTitleEl.textContent = track.title;
            this.trackArtistEl.textContent = track.artist;
            this.currentTimeEl.textContent = '00:00';
            this.durationEl.textContent = '00:00';
            this.progress.value = 0;
        },
        togglePlay() {
            if (!this.isReady) return;
            if (this.audio.paused) this.audio.play().catch(() => {});
            else this.stopAndDock();
        },
        prevTrack() {
            if (!this.isReady) return;
            this.loadTrack(this.currentIndex - 1);
            this.audio.play().catch(() => {});
        },
        nextTrack() {
            if (!this.isReady) return;
            this.loadTrack(this.currentIndex + 1);
            this.audio.play().catch(() => {});
        },
        setPlayingState(isPlaying) {
            if (!this.playIcon) return;
            this.playIcon.classList.toggle('fa-play', !isPlaying);
            this.playIcon.classList.toggle('fa-pause', isPlaying);
            this.shell?.classList.toggle('is-playing', isPlaying);
        },
        openCase() {
            if (this.isReady && this.shell?.classList.contains('is-open')) return;
            this.isReady = true;
            this.shell?.classList.add('is-open');
            this.setControlsEnabled(true);
            this.startCaseBtn?.setAttribute('aria-label', 'AirPods case opened');
        },
        stopAndDock() {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.progress.value = 0;
            this.currentTimeEl.textContent = '00:00';
            this.shell?.classList.remove('is-open');
            this.setPlayingState(false);
            setTimeout(() => {
                this.isReady = false;
                this.setControlsEnabled(false);
                this.startCaseBtn?.setAttribute('aria-label', 'Start and open AirPods case');
            }, 420);
        },
        setControlsEnabled(enabled) {
            const elements = [this.playBtn, this.stopBtn, this.prevBtn, this.nextBtn, this.progress, this.volume];
            elements.forEach(el => {
                if (!el) return;
                if ('disabled' in el) el.disabled = !enabled;
            });
            this.shell?.classList.toggle('is-ready', enabled);
        },
        bind3DRotation() {
            if (!this.stage || !this.shell) return;

            const setRotation = (x, y) => {
                this.shell.style.setProperty('--pods-rotate-x', `${x.toFixed(2)}deg`);
                this.shell.style.setProperty('--pods-rotate-y', `${y.toFixed(2)}deg`);
            };

            let dragging = false;
            let pointerId = null;

            const onPointerMove = (event) => {
                if (!dragging || event.pointerId !== pointerId) return;
                const rect = this.stage.getBoundingClientRect();
                const px = (event.clientX - rect.left) / rect.width;
                const py = (event.clientY - rect.top) / rect.height;
                const rotateY = (px - 0.5) * 24;
                const rotateX = (0.45 - py) * 20;
                setRotation(rotateX, rotateY);
            };

            const endDrag = (event) => {
                if (event.pointerId !== pointerId) return;
                dragging = false;
                pointerId = null;
                this.stage.releasePointerCapture(event.pointerId);
                setRotation(-12, 0);
            };

            this.stage.addEventListener('pointerdown', (event) => {
                dragging = true;
                pointerId = event.pointerId;
                this.stage.setPointerCapture(event.pointerId);
            });
            this.stage.addEventListener('pointermove', onPointerMove);
            this.stage.addEventListener('pointerup', endDrag);
            this.stage.addEventListener('pointercancel', endDrag);
            this.stage.addEventListener('pointerleave', () => {
                if (!dragging) setRotation(-12, 0);
            });
        },
        formatTime(seconds) {
            if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        },
        initRainScene() {
            const rainLayer = document.getElementById('music-rain-layer');
            const reflectionLayer = document.getElementById('music-reflection-layer');
            if (!rainLayer || !reflectionLayer || rainLayer.dataset.ready === 'true') return;

            rainLayer.dataset.ready = 'true';
            const dropCount = window.matchMedia('(max-width: 768px)').matches ? 70 : 130;
            const rippleCount = window.matchMedia('(max-width: 768px)').matches ? 30 : 55;

            for (let i = 0; i < dropCount; i++) {
                const drop = document.createElement('span');
                drop.className = 'rain-drop';
                drop.style.left = `${Math.random() * 110 - 5}%`;
                drop.style.animationDuration = `${0.55 + Math.random() * 0.7}s`;
                drop.style.animationDelay = `${Math.random() * -1.5}s`;
                drop.style.opacity = `${0.35 + Math.random() * 0.45}`;
                drop.style.height = `${7 + Math.random() * 10}vh`;
                rainLayer.appendChild(drop);
            }

            for (let i = 0; i < rippleCount; i++) {
                const ripple = document.createElement('span');
                ripple.className = 'reflection-droplet';
                ripple.style.left = `${Math.random() * 100}%`;
                ripple.style.animationDuration = `${1.3 + Math.random() * 1.6}s`;
                ripple.style.animationDelay = `${Math.random() * -3}s`;
                ripple.style.width = `${40 + Math.random() * 50}px`;
                ripple.style.height = ripple.style.width;
                reflectionLayer.appendChild(ripple);
            }
        }
    };

    
    
   /**
     * 10. ENTROPY ENGINE (Kinetic Particle Exploder & Bokeh Trail)
     */
    const EntropyEngine = {
        init() {
            this.canvas = document.getElementById('entropy-canvas');
            if(!this.canvas) return;
            
            this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
            this.trailParticles = [];
            this.textParticles = [];
            this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            this.isExploded = false;
            this.sequenceStarted = false;
            this.ambientLoop = null;
            this.ambientGain = null;
            this.isMobile = window.matchMedia('(max-width: 767px)').matches;
            this.wordExplosionEnabled = false;
            this.lineConnectCooldown = 0;
            this.lastTrailSpawn = 0;
            this.lastVibrateAt = 0;
            this.lastMicroPulseAt = 0;
            this.spaceStars = [];
            this.spaceDust = [];
            this.starFov = 520;
            this.spaceTravelSpeed = this.isMobile ? 92 : 126;
            this.baseTravelSpeed = this.spaceTravelSpeed;
            this.travelBoost = 1;
            this.cameraDrift = { x: 0, y: 0 };
            this.lastFrameTime = performance.now();
            this.prevMouse = { x: this.mouse.x, y: this.mouse.y };

            this.resize();
            window.addEventListener('resize', () => this.resize());
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;

                // Spawn fast motion line particles around cursor movement.
                if (this.isEntropyActive()) {
                    this.spawnTrailParticles(e.clientX, e.clientY);
                }
            });

            // Explicit interaction haptics: click on laptop, touch on mobile.
            const triggerInteractionPulse = (x, y, duration) => {
                if (!this.isEntropyActive()) return;
                this.mouse.x = x;
                this.mouse.y = y;
                this.spawnTrailParticles(x, y);
                this.vibratePulse(duration, true);
            };

            window.addEventListener('pointerdown', (e) => {
                const x = e.clientX ?? this.mouse.x;
                const y = e.clientY ?? this.mouse.y;
                const duration = e.pointerType === 'touch' ? 16 : 14;
                triggerInteractionPulse(x, y, duration);
            });

            if (!window.PointerEvent) {
                window.addEventListener('touchstart', (e) => {
                    const touch = e.touches?.[0];
                    if (!touch) return;
                    triggerInteractionPulse(touch.clientX, touch.clientY, 16);
                }, { passive: true });
            }

            window.addEventListener('touchmove', (e) => {
                const touch = e.touches?.[0];
                if (!touch) return;
                this.mouse.x = touch.clientX;
                this.mouse.y = touch.clientY;
                if (this.isEntropyActive()) {
                    this.spawnTrailParticles(touch.clientX, touch.clientY);
                }
            }, { passive: true });

            // Bind observer to start sequence only when tab is opened
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mut) => {
                    if (mut.target.classList.contains('active') && !this.sequenceStarted) {
                        this.sequenceStarted = true;
                        this.runSequence();
                    }
                });
            });
            observer.observe(document.getElementById('mod-entropy'), { attributes: true, attributeFilter: ['class'] });

            this.animate();
        },

        resize() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.isMobile = window.matchMedia('(max-width: 767px)').matches;
            this.wordExplosionEnabled = false;
            this.spaceTravelSpeed = this.isMobile ? 92 : 126;
            this.baseTravelSpeed = this.spaceTravelSpeed;
            this.createSpaceField();
        },

        createSpaceField() {
            const starCount = this.isMobile ? 460 : 1100;
            this.spaceStars = [];
            for (let i = 0; i < starCount; i++) {
                this.spaceStars.push(this.makeStar(true));
            }
            this.createDustField();
        },

        createDustField() {
            const dustCount = this.isMobile ? 170 : 340;
            this.spaceDust = [];
            for (let i = 0; i < dustCount; i++) {
                this.spaceDust.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    z: Math.random() * this.width,
                    size: Math.random() * 0.65 + 0.15,
                    drift: (Math.random() - 0.5) * 0.12
                });
            }
        },

        makeStar(randomDepth = false) {
            return {
                x: (Math.random() - 0.5) * this.width,
                y: (Math.random() - 0.5) * this.height,
                z: randomDepth ? (Math.random() * this.width) : this.width,
                size: this.isMobile ? (Math.random() * 0.18 + 0.05) : (Math.random() * 0.26 + 0.06),
                hue: 200 + Math.random() * 28,
                twinkle: Math.random() * Math.PI * 2
            };
        },

        drawSpaceField() {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            this.ctx.fillRect(0, 0, this.width, this.height);

            const now = performance.now();
            const boostPulse = 0.88 + Math.sin(now * 0.0012) * 0.12;
            this.travelBoost += (boostPulse - this.travelBoost) * 0.08;
            const pointerInfluenceX = ((this.mouse.x / this.width) - 0.5) * 0.85;
            const pointerInfluenceY = ((this.mouse.y / this.height) - 0.5) * 0.85;
            this.cameraDrift.x += (pointerInfluenceX - this.cameraDrift.x) * 0.04;
            this.cameraDrift.y += (pointerInfluenceY - this.cameraDrift.y) * 0.04;
            const speed = this.baseTravelSpeed * this.travelBoost * this.frameDelta;

            for (let i = 0; i < this.spaceStars.length; i++) {
                const star = this.spaceStars[i];
                const prevZ = star.z;
                star.z -= speed;

                if (star.z <= 1) {
                    this.spaceStars[i] = this.makeStar(false);
                    continue;
                }

                const proj = this.starFov / star.z;
                const prevProj = this.starFov / prevZ;

                const sx = (star.x * proj) + (this.width / 2) + (this.cameraDrift.x * 80 * proj);
                const sy = (star.y * proj) + (this.height / 2) + (this.cameraDrift.y * 80 * proj);
                const px = (star.x * prevProj) + (this.width / 2) + (this.cameraDrift.x * 80 * prevProj);
                const py = (star.y * prevProj) + (this.height / 2) + (this.cameraDrift.y * 80 * prevProj);

                if (sx < 0 || sx > this.width || sy < 0 || sy > this.height) {
                    this.spaceStars[i] = this.makeStar(false);
                    continue;
                }

                const alpha = Math.max(0.08, 1 - (star.z / this.width));
                const twinklePulse = 0.65 + (Math.sin((performance.now() * 0.003) + star.twinkle) * 0.35);
                const lineWidth = Math.max(0.5, star.size * proj * 1.35);
                const starAlpha = Math.min(0.9, alpha * twinklePulse);

                this.ctx.strokeStyle = `hsla(${star.hue}, 95%, 88%, ${Math.min(0.8, starAlpha)})`;
                this.ctx.lineWidth = lineWidth;
                this.ctx.beginPath();
                this.ctx.moveTo(px, py);
                this.ctx.lineTo(sx, sy);
                this.ctx.stroke();

                this.ctx.shadowBlur = 9;
                this.ctx.shadowColor = `rgba(255,255,255,${Math.min(0.55, starAlpha)})`;
                this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, starAlpha + 0.18)})`;
                this.ctx.beginPath();
                this.ctx.arc(sx, sy, Math.max(0.35, star.size * proj), 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }

            this.drawDustField(speed);

            const vignette = this.ctx.createRadialGradient(
                this.width / 2,
                this.height / 2,
                this.width * 0.1,
                this.width / 2,
                this.height / 2,
                this.width * 0.78
            );
            vignette.addColorStop(0, 'rgba(20, 26, 42, 0)');
            vignette.addColorStop(0.72, 'rgba(6, 10, 18, 0.24)');
            vignette.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
            this.ctx.fillStyle = vignette;
            this.ctx.fillRect(0, 0, this.width, this.height);
        },

        drawDustField(speed) {
            this.ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < this.spaceDust.length; i++) {
                const dust = this.spaceDust[i];
                dust.z -= speed * 0.56;
                dust.y += dust.drift;
                if (dust.z <= 1 || dust.y < -20 || dust.y > this.height + 20) {
                    dust.x = Math.random() * this.width;
                    dust.y = Math.random() * this.height;
                    dust.z = this.width;
                    dust.drift = (Math.random() - 0.5) * 0.12;
                }

                const depth = this.starFov / Math.max(1, dust.z);
                const x = ((dust.x - this.width / 2) * depth) + (this.width / 2) + (this.cameraDrift.x * 30 * depth);
                const y = ((dust.y - this.height / 2) * depth) + (this.height / 2) + (this.cameraDrift.y * 30 * depth);
                const alpha = Math.max(0.05, 1 - (dust.z / this.width));

                this.ctx.fillStyle = `rgba(238, 244, 255, ${alpha * 0.36})`;
                this.ctx.fillRect(x, y, dust.size * depth, dust.size * depth);
            }
        },

        spawnTrailParticles(x, y) {
            const now = performance.now();
            const spawnInterval = this.isMobile ? 26 : 12;
            if (now - this.lastTrailSpawn < spawnInterval) return;
            this.lastTrailSpawn = now;

            const dx = x - this.prevMouse.x;
            const dy = y - this.prevMouse.y;
            const movement = Math.max(2, Math.hypot(dx, dy));
            const dirX = dx / movement;
            const dirY = dy / movement;
            const count = this.isMobile ? 6 : 11;
            const colors = ['255, 255, 255', '217, 119, 6', '125, 211, 252'];

            for(let i=0; i<count; i++) {
                const spread = i / Math.max(1, count - 1);
                const tailX = x - (dirX * movement * spread);
                const tailY = y - (dirY * movement * spread);
                this.trailParticles.push({
                    x: tailX + (Math.random() - 0.5) * 4,
                    y: tailY + (Math.random() - 0.5) * 4,
                    baseX: tailX,
                    baseY: tailY,
                    vx: (-dirX * 1.2) + ((Math.random() - 0.5) * 0.45),
                    vy: (-dirY * 1.2) + ((Math.random() - 0.5) * 0.45),
                    size: this.isMobile ? (Math.random() * 0.32 + 0.2) : (Math.random() * 0.65 + 0.3),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    life: this.isMobile ? (34 + Math.random() * 20) : (56 + Math.random() * 36),
                    maxLife: this.isMobile ? 60 : 92,
                    jitterAmp: this.isMobile ? 0.7 : 1.25,
                    jitterFreq: 0.14 + Math.random() * 0.2,
                    jitterPhase: Math.random() * Math.PI * 2
                });
            }
            this.prevMouse.x = x;
            this.prevMouse.y = y;
        },

        isEntropyActive() {
            const entropyModule = document.getElementById('mod-entropy');
            return !!entropyModule && entropyModule.classList.contains('active');
        },

        vibratePulse(duration = 10, force = false) {
            if (!navigator.vibrate) return;
            const now = performance.now();
            if (!force && now - this.lastVibrateAt < 55) return;
            this.lastVibrateAt = now;
            navigator.vibrate(duration);
        },

        runSequence() {
            const t1 = document.getElementById('entropy-t1');
            const t2 = document.getElementById('entropy-t2');
            if (!t1 || !t2) return;
            
            // Reset state if re-running
            this.stopAmbientLoop();
            this.textParticles = [];
            this.isExploded = false;
            this.lineConnectCooldown = 0;
            t1.style.opacity = 0;
            t2.style.opacity = 0;
            t1.style.filter = 'blur(10px)';
            t2.style.filter = 'blur(8px)';
            t2.style.transform = 'translateY(0px) scale(1)';
            gsap.set([t1, t2], { clearProps: "all" });

            const tl = gsap.timeline();
            // Stage 1: Title 1 fade/blur in-out
            tl.fromTo(t1,
                { opacity: 0, filter: 'blur(12px)', y: 10 },
                { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1.2, ease: "power2.out" }
              )
              .to(t1, { opacity: 1, duration: 0.9, ease: "none" })
              .to(t1, { opacity: 0, filter: 'blur(10px)', y: -8, duration: 1.1, ease: "power2.inOut" })
              // Stage 2: Title 2 glow pulse + slight parallax
              .fromTo(t2,
                { opacity: 0, filter: 'blur(8px)', textShadow: '0 0 0 rgba(217,119,6,0)', y: 14 },
                { opacity: 1, filter: 'blur(0px)', textShadow: '0 0 16px rgba(217,119,6,0.35)', y: 0, duration: 1.3, ease: "power2.out" },
                "+=0.2"
              )
              .to(t2, {
                  textShadow: '0 0 22px rgba(217,119,6,0.45)',
                  duration: 1.1,
                  repeat: 1,
                  yoyo: true,
                  ease: "sine.inOut"
              })
              .to(t2, {
                  y: () => (this.mouse.y - this.height / 2) * 0.015,
                  x: () => (this.mouse.x - this.width / 2) * 0.01,
                  duration: 1.0,
                  ease: "sine.out"
              })
              .add(() => {
                  // Stage 3: Particle burst phase
                  gsap.to(t2, { opacity: 0, filter: 'blur(8px)', duration: 0.9, ease: "power2.inOut" });
                  if (typeof AudioEngine !== 'undefined' && typeof AudioEngine.playSteamBurst === 'function') {
                      AudioEngine.playSteamBurst();
                  }
                  // Removed exploding text particle words for a cleaner entropy experience.
                  // Stage 4: Calm ambient phase
                  setTimeout(() => this.startAmbientLoop(), 900);
              });
        },

        startAmbientLoop() {
            if (this.ambientLoop || !window.AudioEngine || !AudioEngine.unlocked || !AudioEngine.ctx) return;
            const t = AudioEngine.ctx.currentTime;
            const osc = AudioEngine.ctx.createOscillator();
            const gain = AudioEngine.ctx.createGain();
            const lowpass = AudioEngine.ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(92, t);
            osc.frequency.linearRampToValueAtTime(110, t + 8);
            osc.frequency.linearRampToValueAtTime(92, t + 16);
            lowpass.type = 'lowpass';
            lowpass.frequency.value = 220;

            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.exponentialRampToValueAtTime(0.008, t + 1.5);

            osc.connect(lowpass).connect(gain).connect(AudioEngine.ctx.destination);
            osc.start(t);

            this.ambientLoop = osc;
            this.ambientGain = gain;
        },

        stopAmbientLoop() {
            if (!this.ambientLoop || !this.ambientGain || !window.AudioEngine || !AudioEngine.ctx) {
                this.ambientLoop = null;
                this.ambientGain = null;
                return;
            }
            const now = AudioEngine.ctx.currentTime;
            this.ambientGain.gain.cancelScheduledValues(now);
            this.ambientGain.gain.setValueAtTime(Math.max(this.ambientGain.gain.value, 0.0001), now);
            this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
            this.ambientLoop.stop(now + 0.7);
            this.ambientLoop = null;
            this.ambientGain = null;
        },

        explodeText(text) {
            // Draw text onto hidden canvas state to sample pixels
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = "white";
            const fontSize = window.innerWidth < 768 ? '10vw' : '7vw';
            this.ctx.font = `900 ${fontSize} "Syne", sans-serif`;
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(text, this.width / 2, this.height / 2);
            
            const data = this.ctx.getImageData(0, 0, this.width, this.height).data;
            this.ctx.clearRect(0, 0, this.width, this.height);
            
            // Map pixels to particles
            const step = this.isMobile ? 8 : 7; // Lower particle count on smaller screens
            for(let y = 0; y < this.height; y += step) {
                for(let x = 0; x < this.width; x += step) {
                    const index = (y * this.width + x) * 4;
                    if(data[index + 3] > 128) {
                        this.textParticles.push({
                            x: x, y: y,
                            originX: x, originY: y,
                            vx: (Math.random() - 0.5) * 20,
                            vy: (Math.random() - 0.5) * 20,
                            color: Math.random() > 0.5 ? '#ffffff' : '#d97706',
                            size: Math.random() * 2 + 1
                        });
                    }
                }
            }
            this.isExploded = true;
        },

        animate() {
            requestAnimationFrame(() => this.animate());
            
            if (!this.isEntropyActive()) return;
            const now = performance.now();
            this.frameDelta = Math.min(2.1, Math.max(0.55, (now - this.lastFrameTime) / 16.67));
            this.lastFrameTime = now;

            // Infinite deep-space motion background (always fast FPS-travel effect).
            this.drawSpaceField();
            this.shakeCursor();
            this.microVibrate();

            // Draw line-like trail particles with vibration.
            this.ctx.globalCompositeOperation = 'screen';
            for(let i = this.trailParticles.length - 1; i >= 0; i--) {
                let p = this.trailParticles[i];
                const lifeRatio = p.life / p.maxLife;
                const jitter = Math.sin((performance.now() * p.jitterFreq) + p.jitterPhase) * p.jitterAmp;
                p.x += p.vx; p.y += p.vy;
                p.life--;
                
                let alpha = lifeRatio * 0.85;
                const drawX = p.x + jitter;
                const drawY = p.y - jitter;

                this.ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
                this.ctx.fillRect(drawX, drawY, p.size, p.size);

                const cursorDist = Math.hypot(this.mouse.x - drawX, this.mouse.y - drawY);
                if (cursorDist < (this.isMobile ? 110 : 140)) {
                    this.ctx.strokeStyle = `rgba(217, 119, 6, ${Math.max(0.12, (1 - (cursorDist / 160)) * 0.6)})`;
                    this.ctx.lineWidth = this.isMobile ? 0.6 : 0.9;
                    this.ctx.beginPath();
                    this.ctx.moveTo(drawX, drawY);
                    this.ctx.lineTo(
                        this.mouse.x + (Math.sin((performance.now() * 0.02) + p.jitterPhase) * 1.4),
                        this.mouse.y + (Math.cos((performance.now() * 0.02) + p.jitterPhase) * 1.4)
                    );
                    this.ctx.stroke();
                }

                const next = this.trailParticles[i - 1];
                if (next && Math.random() > 0.5) {
                    const nx = next.x;
                    const ny = next.y;
                    const near = Math.hypot(nx - drawX, ny - drawY);
                    if (near < (this.isMobile ? 38 : 52)) {
                        this.ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.08, lifeRatio * 0.28)})`;
                        this.ctx.lineWidth = 0.45;
                        this.ctx.beginPath();
                        this.ctx.moveTo(drawX, drawY);
                        this.ctx.lineTo(nx, ny);
                        this.ctx.stroke();
                    }
                }

                if(p.life <= 0) this.trailParticles.splice(i, 1);
            }

            // Draw Text Explosion Particles
            this.ctx.globalCompositeOperation = 'source-over';
            if(this.isExploded) {
                for(let i = 0; i < this.textParticles.length; i++) {
                    let p = this.textParticles[i];
                    p.x += p.vx; 
                    p.y += p.vy;
                    
                    p.vx *= 0.94; // Friction
                    p.vy *= 0.94;

                    // Mouse gravity/repel effect
                    let dx = this.mouse.x - p.x;
                    let dy = this.mouse.y - p.y;
                    let dist = Math.hypot(dx, dy);
                    if(dist < 250) {
                        p.vx += dx * 0.02;
                        p.vy += dy * 0.02;
                        
                        // Draw connection lines from exploded text to mouse (frequency capped on mobile)
                        const lineChance = this.isMobile ? 0.985 : 0.92;
                        if (this.lineConnectCooldown <= 0 && dist < 80 && Math.random() > lineChance) {
                            this.ctx.strokeStyle = `rgba(217, 119, 6, ${0.4 - dist/200})`;
                            this.ctx.beginPath();
                            this.ctx.moveTo(p.x, p.y);
                            this.ctx.lineTo(this.mouse.x, this.mouse.y);
                            this.ctx.stroke();
                            this.lineConnectCooldown = this.isMobile ? 8 : 3;
                        }
                    }

                    // Return to origin slowly
                    let ox = p.originX - p.x;
                    let oy = p.originY - p.y;
                    p.vx += ox * 0.005;
                    p.vy += oy * 0.005;

                    this.ctx.fillStyle = p.color;
                    this.ctx.fillRect(p.x, p.y, p.size, p.size);
                }
                this.lineConnectCooldown = Math.max(0, this.lineConnectCooldown - 1);
            }
        },

        shakeCursor() {
            const cursorOutline = document.getElementById("cursor-outline");
            if (!cursorOutline || !cursorOutline.classList.contains('entropy-cursor')) return;
            const t = performance.now() * 0.045;
            const offsetX = Math.sin(t * 1.3) * 1.8;
            const offsetY = Math.cos(t * 1.7) * 1.8;
            const rotation = Math.sin(t) * 1.2;
            cursorOutline.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
        },

        microVibrate() {
            if (!this.isEntropyActive()) return;
            if (!navigator.vibrate) return;
            const now = performance.now();
            if (now - this.lastMicroPulseAt < 220) return;
            this.lastMicroPulseAt = now;
            this.vibratePulse(4);
        }
    };

    /**
     * INIT ALL SYSTEMS
     */
    BGEngine.init();
    OriginPrompt.init();
    AppController.init();
    NeuralCore.init();
    MixologyEngine.init();
    CompilerArena.init();
    SocialCard.init();
    MusicPlayer.init();
    window.EntropyEngine = EntropyEngine;
    EntropyEngine.init(); // <-- Add this initialization
     
});
