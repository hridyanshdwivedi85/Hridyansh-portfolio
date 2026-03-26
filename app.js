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
        playSteamBurst() {
            if (!this.unlocked || !this.ctx) return;
            const bufferSize = this.ctx.sampleRate * 2; const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0); for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = this.ctx.createBufferSource(); noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter(); filter.type = 'highpass'; filter.frequency.value = 3000;
            const gain = this.ctx.createGain(); gain.gain.setValueAtTime(0.15, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
            noise.connect(filter).connect(gain).connect(this.ctx.destination); noise.start();
        },
        startBrew() {
            if (!this.unlocked || !this.ctx) return { stop: () => {} };
            const t = this.ctx.currentTime;
            
            // 1. Machine Pump (60Hz Hum)
            const humOsc = this.ctx.createOscillator(); humOsc.type = 'sawtooth'; humOsc.frequency.value = 55;
            const humGain = this.ctx.createGain(); humGain.gain.setValueAtTime(0, t); humGain.gain.linearRampToValueAtTime(0.08, t + 0.5);
            humOsc.connect(humGain).connect(this.ctx.destination); humOsc.start();

            // 2. Liquid Gurgle (Modulated White Noise)
            const bSize = this.ctx.sampleRate * 2; const buf = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
            const data = buf.getChannelData(0); for (let i=0; i<bSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = this.ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
            const filter = this.ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 400;
            
            // LFO to create the "bubbling" effect
            const lfo = this.ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 4; 
            const lfoGain = this.ctx.createGain(); lfoGain.gain.value = 300; 
            lfo.connect(lfoGain).connect(filter.frequency); lfo.start();

            const noiseGain = this.ctx.createGain(); noiseGain.gain.setValueAtTime(0, t); noiseGain.gain.linearRampToValueAtTime(0.08, t + 2);
            noise.connect(filter).connect(noiseGain).connect(this.ctx.destination); noise.start();

            return {
                stop: () => {
                    const st = this.ctx.currentTime;
                    humGain.gain.linearRampToValueAtTime(0, st + 0.5); noiseGain.gain.linearRampToValueAtTime(0, st + 0.5);
                    setTimeout(() => { humOsc.stop(); noise.stop(); lfo.stop(); }, 500);
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
     * 5. ESSENCE BREW ENGINE (PRO-MOD LIVE ANIMATION)
     */
    const BrewEngine = {
        state: 'OFF', // OFF, HEATING, READY, BREWING
        temp: 24.0, targetTemp: 93.0,
        timer: 0, yieldGrams: 0,
        intervals: { heat: null, brew: null, particles: null },

        init() {
            this.ui = {
                btnPower: document.getElementById('brew-btn-power'),
                btnBrew: document.getElementById('brew-btn-brew'),
                btnSteam: document.getElementById('brew-btn-steam'),
                ledPower: document.getElementById('led-power'),
                ledBrew: document.getElementById('led-brew'),
                ledSteam: document.getElementById('led-steam'),
                pidTemp: document.getElementById('pid-temp'),
                pidDot: document.getElementById('pid-dot'),
                pidStatus: document.getElementById('pid-status-text'),
                shotTimer: document.getElementById('shot-timer'),
                shotYield: document.getElementById('shot-yield'),
                tmrDot: document.getElementById('tmr-dot'),
                streamL: document.getElementById('stream-l'),
                streamR: document.getElementById('stream-r'),
                liquid: document.getElementById('cup-liquid'),
                haze: document.getElementById('v2-haze'),
                pContainer: document.getElementById('v2-particle-container')
            };

            this.startAmbientParticles();
            this.bindEvents();
        },

        bindEvents() {
           // POWER BUTTON
            this.ui.btnPower.addEventListener('click', () => {
                AudioEngine.playMech();
                if(this.state === 'OFF') {
                    this.state = 'HEATING';
                    AudioEngine.playBoot();
                    this.ui.ledPower.classList.add('on');
                    this.ui.pidDot.classList.replace('bg-red-900', 'bg-red-500');
                    this.ui.pidTemp.classList.replace('text-gray-700', 'text-[#d97706]');
                    this.ui.pidStatus.innerText = "HEATING...";
                    
                    // Simulate PID heating
                    this.intervals.heat = setInterval(() => {
                        this.temp += (Math.random() * 2 + 0.5);
                        if(this.temp >= this.targetTemp) {
                            this.temp = this.targetTemp;
                            clearInterval(this.intervals.heat);
                            this.setReady();
                        }
                        this.ui.pidTemp.innerText = this.temp.toFixed(1);
                    }, 150);
                } else {
                    // Turn OFF
                    this.resetSystem();
                }
            });

            // BREW BUTTON
            this.ui.btnBrew.addEventListener('click', () => {
                if(this.state === 'READY') {
                    this.startExtraction();
                } else if(this.state === 'BREWING') {
                    this.stopExtraction();
                }
            });

            // STEAM BUTTON
            this.ui.btnSteam.addEventListener('click', () => {
                if(this.state === 'READY' || this.state === 'BREWING') {
                    AudioEngine.playMech();
                    AudioEngine.playSteamBurst();
                    this.ui.ledSteam.classList.add('process');
                    for(let i=0; i<15; i++) {
                        setTimeout(() => this.spawnSteam(this.ui.pContainer, true), i * 100);
                    }
                    setTimeout(() => this.ui.ledSteam.classList.remove('process'), 1500);
                }
            });

            // Floating Beans Animation
            document.querySelectorAll('.coffee-bean').forEach((bean, i) => {
                gsap.to(bean, { y: "+=15", rotation: "+=25", x: "+=5", duration: 3 + i * 0.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
            });
        },

        setReady() {
            this.state = 'READY';
            this.ui.pidDot.classList.replace('bg-red-500', 'bg-green-500');
            this.ui.pidStatus.innerText = "READY";
            this.ui.btnBrew.classList.remove('opacity-50', 'pointer-events-none');
            this.ui.btnSteam.classList.remove('opacity-50', 'pointer-events-none');
            this.ui.ledPower.classList.replace('on', 'success');
            AudioEngine.playSuccess();
        },

        startExtraction() {
            this.state = 'BREWING';
            AudioEngine.playMech();
            this.brewSound = AudioEngine.startBrew();
            
            // UI Updates
            this.ui.ledBrew.classList.add('process');
            this.ui.tmrDot.classList.replace('bg-gray-700', 'bg-red-500');
            this.ui.shotTimer.classList.replace('text-gray-700', 'text-white');
            this.ui.haze.classList.add('active');
            
            // Reset Cup
            this.ui.liquid.style.height = '0%';
            this.timer = 0; this.yieldGrams = 0;

            const tl = gsap.timeline();
            
            // Start Streams (Pre-infusion delay)
            tl.to([this.ui.streamL, this.ui.streamR], { scaleY: 1, duration: 0.8, ease: "power2.in" });
            tl.add(() => {
                this.ui.streamL.classList.add('stream-wobble');
                this.ui.streamR.classList.add('stream-wobble-alt');
            });

            // Fill Cup Animation
            tl.to(this.ui.liquid, { height: "75%", duration: 28, ease: "power1.out" }, "-=0.2");

            // Telemetry Counters
            this.intervals.brew = setInterval(() => {
                this.timer += 0.1;
                this.yieldGrams += 0.14; // Approximate flow rate
                this.ui.shotTimer.innerText = this.timer.toFixed(1);
                this.ui.shotYield.innerText = this.yieldGrams.toFixed(1);
                
                // Spawn minor steam during brew
                if(Math.random() > 0.6) this.spawnSteam(this.ui.pContainer, false);
                
                // Auto-stop at 30s
                if(this.timer >= 30.0) this.stopExtraction();
            }, 100);
        },

        stopExtraction() {
            if(this.brewSound) this.brewSound.stop();
            AudioEngine.playMech();
            this.state = 'READY';
            clearInterval(this.intervals.brew);
            
            // Stop Streams
            this.ui.streamL.classList.remove('stream-wobble');
            this.ui.streamR.classList.remove('stream-wobble-alt');
            gsap.to([this.ui.streamL, this.ui.streamR], { scaleY: 0, transformOrigin: "top", duration: 0.5 });
            
            // UI Reset
            this.ui.ledBrew.classList.remove('process');
            this.ui.tmrDot.classList.replace('bg-red-500', 'bg-green-500');
            this.ui.haze.classList.remove('active');
            AudioEngine.playSuccess();
        },

        resetSystem() {
            this.state = 'OFF';
            clearInterval(this.intervals.heat);
            clearInterval(this.intervals.brew);
            
            this.ui.ledPower.classList.remove('on', 'success');
            this.ui.ledBrew.classList.remove('process');
            this.ui.ledSteam.classList.remove('process');
            
            this.ui.btnBrew.classList.add('opacity-50', 'pointer-events-none');
            this.ui.btnSteam.classList.add('opacity-50', 'pointer-events-none');
            
            this.ui.pidTemp.classList.replace('text-[#d97706]', 'text-gray-700');
            this.ui.shotTimer.classList.replace('text-white', 'text-gray-700');
            this.ui.pidDot.className = "w-1.5 h-1.5 rounded-full bg-red-900";
            this.ui.tmrDot.className = "w-1.5 h-1.5 rounded-full bg-gray-700";
            
            this.temp = 24.0;
            this.ui.pidTemp.innerText = "24.0";
            this.ui.pidStatus.innerText = "OFFLINE";
            
            gsap.to([this.ui.streamL, this.ui.streamR], { scaleY: 0, duration: 0.2 });
            gsap.to(this.ui.liquid, { height: "0%", duration: 1.5 });
        },

        startAmbientParticles() {
            this.intervals.particles = setInterval(() => {
                const mod = document.getElementById('mod-brew');
                if(!mod.classList.contains('active')) return;
                // Idle steam only if heated
                if (this.state === 'READY' && Math.random() > 0.6) this.spawnSteam(this.ui.pContainer, false);
            }, 800);
        },

        spawnSteam(container, isHeavy) {
            const steam = document.createElement('div');
            steam.className = 'steam-wisp-v2';
            
            const size = isHeavy ? (40 + Math.random() * 50) : (20 + Math.random() * 20);
            // Center around portafilter
            const leftOffset = 45 + (Math.random() * 10); 
            
            steam.style.width = `${size}px`;
            steam.style.height = `${size}px`;
            steam.style.left = `${leftOffset}%`;
            steam.style.top = `250px`; 
            
            container.appendChild(steam);

            gsap.to(steam, {
                y: -150 - Math.random() * 100,
                x: (Math.random() - 0.5) * 80,
                scale: 1.5 + Math.random(),
                opacity: isHeavy ? 0.4 : 0.15,
                duration: isHeavy ? 2.5 : (4 + Math.random() * 2),
                ease: "power1.out",
                onComplete: () => {
                    gsap.to(steam, { opacity: 0, duration: 1, onComplete: () => steam.remove() });
                }
            });
        }
    };

    /**
     * 6. COMPILER ARENA V2
     */
    const CompilerArena = {
        init() {
            const btn = document.getElementById('btn-compile-v2');
            const term = document.getElementById('compiler-terminal');
            const linesIn = [document.getElementById('pipe-in-1'), document.getElementById('pipe-in-2'), document.getElementById('pipe-in-3')];
            const linesOut = [document.getElementById('pipe-out-1'), document.getElementById('pipe-out-2')];
            const outApple = document.getElementById('out-apple');
            const outAndroid = document.getElementById('out-android');
            const forgeCenter = document.querySelector('.forge-center i');

            let isCompiling = false;

            this.updateSVGPaths();
            window.addEventListener('resize', () => this.updateSVGPaths());

            btn.addEventListener('click', () => {
                if(isCompiling) return;
                isCompiling = true;
                btn.style.opacity = '0.5'; btn.style.pointerEvents = 'none';
                let audioStream; // Added reference

                const tl = gsap.timeline();
                
                tl.call(() => { audioStream = AudioEngine.startDataStream(); term.innerHTML = "> PARSING AST...<br>> RESOLVING DEPENDENCIES..."; linesIn.forEach(l => l.classList.add('active')); });
                tl.to(['#node-src-1', '#node-src-2', '#node-src-3'], { x: 50, opacity: 0.5, duration: 0.5, stagger: 0.2 });
                
                tl.call(() => { term.innerHTML += "<br>> COMPILING BYTECODE...<br>> OPTIMIZING ASSETS..."; forgeCenter.className = "fas fa-sync fa-spin text-[#3ddc84] text-4xl shadow-[#3ddc84]"; });
                tl.to('.forge-container', { scale: 1.2, duration: 1.5, ease: "power2.inOut" });
                
                tl.call(() => { 
                    linesIn.forEach(l => l.classList.remove('active'));
                    linesOut.forEach(l => l.classList.add('active'));
                    term.innerHTML += "<br>> SIGNING PAYLOADS...<br>> DISPATCHING BUILD...";
                    forgeCenter.className = "fas fa-check text-white text-4xl";
                    gsap.to('.forge-container', { scale: 1, duration: 0.5 });
                });

                tl.to([outApple, outAndroid], { opacity: 1, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" }, "+=1");
                tl.call(() => {
                    if(audioStream) audioStream.stop();
                    AudioEngine.playSuccess();
                    linesOut.forEach(l => l.classList.remove('active'));
                    outApple.classList.add('active'); outApple.querySelector('.status-badge').innerText = "DEPLOYED";
                    outAndroid.classList.add('active'); outAndroid.querySelector('.status-badge').innerText = "DEPLOYED";
                    term.innerHTML += "<br>> <span style='color:#3ddc84'>UNIVERSAL BUILD SUCCESSFUL.</span>";
                    
                    setTimeout(() => {
                        outApple.classList.remove('active'); outApple.querySelector('.status-badge').innerText = "AWAITING";
                        outAndroid.classList.remove('active'); outAndroid.querySelector('.status-badge').innerText = "AWAITING";
                        gsap.to([outApple, outAndroid], { opacity: 0.3, scale: 0.9, duration: 0.5 });
                        gsap.to(['#node-src-1', '#node-src-2', '#node-src-3'], { x: 0, opacity: 1, duration: 0.5 });
                        forgeCenter.className = "fas fa-cube text-white text-4xl";
                        term.innerHTML = "> SYSTEM IDLE.<br>> AWAITING BUILD COMMAND.";
                        btn.style.opacity = '1'; btn.style.pointerEvents = 'auto';
                        isCompiling = false;
                    }, 5000);
                });
            });
        },
        updateSVGPaths() {
            const svg = document.getElementById('pipeline-lines');
            if(!svg) return;
            const w = svg.clientWidth; const h = svg.clientHeight;
            
            const p1 = `M 180 ${h/2 - 90} Q 400 ${h/2 - 90} ${w/2} ${h/2}`;
            const p2 = `M 180 ${h/2} L ${w/2} ${h/2}`;
            const p3 = `M 180 ${h/2 + 90} Q 400 ${h/2 + 90} ${w/2} ${h/2}`;

            const o1 = `M ${w/2} ${h/2} Q 600 ${h/2 - 80} ${w - 180} ${h/2 - 80}`;
            const o2 = `M ${w/2} ${h/2} Q 600 ${h/2 + 80} ${w - 180} ${h/2 + 80}`;

            document.getElementById('pipe-in-1').setAttribute('d', p1);
            document.getElementById('pipe-in-2').setAttribute('d', p2);
            document.getElementById('pipe-in-3').setAttribute('d', p3);
            document.getElementById('pipe-out-1').setAttribute('d', o1);
            document.getElementById('pipe-out-2').setAttribute('d', o2);
        }
    };

    /**
     * 7. SOCIAL CARD
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
     * INIT ALL SYSTEMS
     */
    BGEngine.init();
    AppController.init();
    NeuralCore.init();
    BrewEngine.init();
    CompilerArena.init();
    SocialCard.init();

});