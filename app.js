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
        startPour() {
            if (!this.unlocked || !this.ctx) return { stop: () => {} };
            const t = this.ctx.currentTime;
            // Liquid pouring sound using filtered noise
            const bSize = this.ctx.sampleRate * 2; const buf = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
            const data = buf.getChannelData(0); for (let i=0; i<bSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = this.ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
            
            const filter = this.ctx.createBiquadFilter(); filter.type = 'bandpass'; 
            filter.frequency.setValueAtTime(800, t);
            filter.frequency.linearRampToValueAtTime(1500, t + 3); // Pitch goes up as glass fills
            filter.Q.value = 1.5;

            const gain = this.ctx.createGain(); 
            gain.gain.setValueAtTime(0, t); 
            gain.gain.linearRampToValueAtTime(0.15, t + 0.2);
            
            noise.connect(filter).connect(gain).connect(this.ctx.destination); noise.start(t);

            return {
                stop: () => {
                    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
                    setTimeout(() => noise.stop(), 400);
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

    /**
     * 1. CUSTOM CURSOR ENGINE
     */
    const cursorDot = document.getElementById("cursor-dot");
    const cursorOutline = document.getElementById("cursor-outline");
    window.addEventListener("mousemove", (e) => {
        // Only run if the device has a mouse pointer (ignores touch screens)
        if (window.matchMedia("(pointer: fine)").matches) {
            cursorDot.style.left = `${e.clientX}px`; 
            cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
        }
    });

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
            else if(newTheme === 'entropy') document.body.style.backgroundColor = "#0b0806";
            else document.body.style.backgroundColor = "#030303";
        },
        createParticles() {
            this.particles = [];
            const count = this.theme === 'galaxy' ? 150 : (this.theme === 'coffee' ? 60 : 100);
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
        navItems: document.querySelectorAll('.nav-item'), modules: document.querySelectorAll('.module'), isAnimating: false,
        init() {
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
        },
        switchTab(navElement, targetId, theme, updateHash = true) {
            this.isAnimating = true;
            
            // Toggle Crosshair Cursor for Entropy
            const cursorOutline = document.getElementById("cursor-outline");
            const cursorDot = document.getElementById("cursor-dot");
            if(targetId === 'mod-entropy') {
                cursorOutline.classList.add('entropy-cursor');
                cursorDot.classList.add('entropy-cursor-dot');
            } else {
                cursorOutline.classList.remove('entropy-cursor');
                cursorDot.classList.remove('entropy-cursor-dot');
            }

            // Update URL for SEO and Sharing
            if (updateHash) {
                const urlName = targetId.replace('mod-', '');
                window.history.pushState(null, null, `#${urlName}`);
            }
            this.navItems.forEach(n => n.classList.remove('active')); 
            navElement.classList.add('active');
            
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
                AudioEngine.playDataProcess();
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
                readoutAbv: document.getElementById('readout-abv')
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

            this.ui.btnPour.addEventListener('click', () => {
                if(this.state === 'READY') this.startPour();
            });

            this.ui.btnReset.addEventListener('click', () => {
                if(this.state !== 'POURING') this.resetGlass();
            });
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
                this.ui.liquid.style.borderRadius = "0 0 80px 80px";
            } else if (type === 'whiskey') {
                gsap.to(this.ui.stem, {opacity: 0, duration: 0.3});
                this.ui.liquid.style.borderRadius = "0 0 20px 20px";
            } else {
                gsap.to(this.ui.stem, {opacity: 0, duration: 0.3});
                this.ui.liquid.style.borderRadius = "0 0 10px 10px";
            }
        },

        addIce() {
            if(this.drink === 'wine') {
                this.ui.statusText.innerText = "ERR: NO ICE IN WINE";
                this.ui.statusText.style.color = "#ef4444";
                return;
            }
            if(this.iceCount >= 4) return;
            
            AudioEngine.playIceClink();
            this.iceCount++;
            
            const ice = document.createElement('div');
            ice.className = 'real-ice';
            
            // Calculate physics-based landing position
            // Spread ice horizontally, stack them vertically
            const rot = (Math.random() - 0.5) * 60;
            const xOffset = (Math.random() - 0.5) * 40; 
            const yStack = (this.iceCount * 25); // Stack height offset
            
            this.ui.iceContainer.appendChild(ice);

            // Realistic Drop Animation
            gsap.fromTo(ice, 
                { y: -300, x: xOffset, rotation: rot + 180, opacity: 0, scale: 0.5 },
                { y: `calc(100% - ${yStack}px)`, x: xOffset, rotation: rot, opacity: 1, scale: 1, duration: 0.7, ease: "bounce.out" }
            );

            // Displace liquid if already poured (Archimedes principle)
            if(this.liquidVol > 0) {
                this.liquidVol += 15; // Ice displacement volume
                gsap.to(this.ui.liquid, { height: `${this.liquidVol}%`, duration: 0.4, ease: "back.out(1.2)" });
            }
            
            this.ui.statusText.innerText = `ICE CUBE INSERTED (${this.iceCount})`;
            this.ui.statusText.style.color = "#38bdf8";
        },

        startPour() {
            this.state = 'POURING';
            this.ui.statusText.innerText = "DISPENSING...";
            this.ui.statusText.style.color = "#facc15";
            this.audioRef = AudioEngine.startPour();
            
            const baseVol = this.drinks[this.drink].vol;
            const targetFill = Math.min(95, (baseVol + this.waterMl + (this.iceCount * 15)) / 2.5);

            // Stream Styling (mix color if water added)
            const pureColor = this.drinks[this.drink].colorBase;
            this.ui.stream.style.background = this.waterMl > baseVol ? "rgba(200,240,255,0.7)" : pureColor;
            this.ui.stream.style.boxShadow = `0 0 15px ${this.drinks[this.drink].glow}`;
            
            const tl = gsap.timeline();
            
            // 1. Stream shoots down
            tl.to(this.ui.stream, { scaleY: 1, duration: 0.3, ease: "power2.in" });
            
            // 2. Liquid Rises
            this.ui.liquid.style.background = this.drinks[this.drink].colorGradient;
            if(this.waterMl > 0) {
                this.ui.liquid.style.opacity = "0.85"; // Water dilution
            } else {
                this.ui.liquid.style.opacity = "1";
            }

            tl.to(this.ui.liquid, { 
                height: `${targetFill}%`, 
                duration: 2.5 + (targetFill * 0.02), 
                ease: "power1.inOut",
                onUpdate: () => {
                    const currentProgress = tl.progress();
                    this.liquidVol = targetFill * currentProgress;
                    this.updateMetrics(currentProgress);
                }
            });

            // 3. Stream stops
            tl.to(this.ui.stream, { scaleY: 0, transformOrigin: "top", duration: 0.3 }, "-=0.2");
            
            tl.call(() => {
                if(this.audioRef) this.audioRef.stop();
                this.state = 'READY';
                this.ui.statusText.innerText = "READY TO SERVE";
                this.ui.statusText.style.color = "#4ade80";
            });
        },

        resetGlass() {
            this.liquidVol = 0;
            this.iceCount = 0;
            
            // Fade out ice cubes before removing
            gsap.to('.real-ice', { opacity: 0, scale: 0.5, duration: 0.3, onComplete: () => {
                this.ui.iceContainer.innerHTML = '';
            }});
            
            gsap.to(this.ui.liquid, { height: "0%", duration: 0.5, ease: "power2.inOut" });
            gsap.to(this.ui.stream, { scaleY: 0, duration: 0.2 });
            
            this.updateMetrics(0);
            this.ui.statusText.innerText = "SYSTEM FLUSHED";
            this.ui.statusText.style.color = "#4ade80";
        },

        updateMetrics(progress = 1) {
            const baseVol = this.drinks[this.drink].vol;
            const currentTotal = Math.floor((baseVol + this.waterMl) * progress);
            
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
                const totalLiquid = baseVol + this.waterMl;
                const dilutedAbv = (baseVol * baseAbv) / totalLiquid;
                this.ui.readoutAbv.innerHTML = `${dilutedAbv.toFixed(1)}<span class="text-xs text-orange-700">%</span>`;
            }
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
     * 9. ENTROPY ENGINE (Kinetic Particle Exploder & Bokeh Trail)
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

            this.resize();
            window.addEventListener('resize', () => this.resize());
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                
                // Spawn beautiful bokeh trail particles on mouse move
                if(document.getElementById('mod-entropy').classList.contains('active')) {
                    this.spawnTrailParticles(e.clientX, e.clientY);
                }
            });

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
        },

        spawnTrailParticles(x, y) {
            const count = Math.random() * 3 + 2; // Spawn more particles (2 to 5 per move)
            const colors = ['255, 255, 255', '217, 119, 6', '150, 150, 150']; 
            
            for(let i=0; i<count; i++) {
                this.trailParticles.push({
                    x: x + (Math.random() - 0.5) * 10,
                    y: y + (Math.random() - 0.5) * 10,
                    vx: (Math.random() - 0.5) * 1.0,
                    vy: (Math.random() - 0.5) * 1.0 - 0.5, // Stronger upward smoke-like drift
                    size: Math.random() * 3 + 1.5, // MUCH SMALLER: 1.5px to 4.5px radius
                    color: colors[Math.floor(Math.random() * colors.length)],
                    life: 70 + Math.random() * 50,
                    maxLife: 120
                });
            }
        },

        runSequence() {
            const t1 = document.getElementById('entropy-t1');
            const t2 = document.getElementById('entropy-t2');
            
            // Reset state if re-running
            this.textParticles = [];
            this.isExploded = false;
            t1.style.opacity = 0; t2.style.opacity = 0;

            const tl = gsap.timeline();
            tl.to(t1, { opacity: 1, duration: 2, ease: "power2.out" })
              .to(t1, { opacity: 0, duration: 1.5, ease: "power2.in" }, "+=2")
              .to(t2, { opacity: 1, scale: 1.05, duration: 2, ease: "back.out(1.2)" }, "+=0.5")
              .add(() => {
                  setTimeout(() => {
                      t2.style.opacity = 0; 
                      if(window.AudioEngine && window.AudioEngine.unlocked) AudioEngine.playSteamBurst();
                      this.explodeText("Coding means creativity.");
                  }, 2000);
              });
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
            const step = window.innerWidth < 768 ? 5 : 7; // Performance adjustment
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
            
            if(!document.getElementById('mod-entropy').classList.contains('active')) return;

            // Smoky background clear for long trails
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.fillStyle = 'rgba(2, 4, 2, 0.25)'; // Dark clear for trails
            this.ctx.fillRect(0, 0, this.width, this.height);

            // Draw Bokeh Trail Particles
            this.ctx.globalCompositeOperation = 'screen';
            for(let i = this.trailParticles.length - 1; i >= 0; i--) {
                let p = this.trailParticles[i];
                p.x += p.vx; p.y += p.vy;
                p.life--;
                
                let alpha = (p.life / p.maxLife) * 0.7; // Max opacity 0.7
                
                let radGrad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                radGrad.addColorStop(0, `rgba(${p.color}, ${alpha})`);
                radGrad.addColorStop(0.4, `rgba(${p.color}, ${alpha * 0.5})`);
                radGrad.addColorStop(1, `rgba(${p.color}, 0)`);
                
                this.ctx.fillStyle = radGrad;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();

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
                        
                        // Draw connection lines from exploded text to mouse
                        if (dist < 80 && Math.random() > 0.8) {
                            this.ctx.strokeStyle = `rgba(217, 119, 6, ${0.4 - dist/200})`;
                            this.ctx.beginPath();
                            this.ctx.moveTo(p.x, p.y);
                            this.ctx.lineTo(this.mouse.x, this.mouse.y);
                            this.ctx.stroke();
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
            }
        }
    };

    /**
     * INIT ALL SYSTEMS
     */
    BGEngine.init();
    AppController.init();
    NeuralCore.init();
    MixologyEngine.init();
    CompilerArena.init();
    SocialCard.init();
    EntropyEngine.init(); // <-- Add this initialization
     
});
