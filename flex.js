const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) document.body.classList.add('reduce-motion');

const card = document.getElementById('essence-card');
const flipButtons = document.querySelectorAll('[data-flip]');
flipButtons.forEach((btn) => btn.addEventListener('click', () => card.classList.toggle('is-flipped')));
flipButtons.forEach((btn) => btn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    card.classList.toggle('is-flipped');
  }
}));

const stage = document.querySelector('.card-stage');
stage.addEventListener('mousemove', (e) => {
  if (prefersReduced || window.innerWidth < 768) return;
  const rect = stage.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width - 0.5;
  const py = (e.clientY - rect.top) / rect.height - 0.5;
  card.style.transform = `${card.classList.contains('is-flipped') ? 'rotateY(180deg)' : ''} rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
});
stage.addEventListener('mouseleave', () => {
  card.style.transform = card.classList.contains('is-flipped') ? 'rotateY(180deg)' : 'rotateY(0deg)';
});

const typedTarget = document.getElementById('typed-terminal');
const lines = ['> AUTH: essence.node::ok', '> mission: architect meaningful interfaces', '> signal: empathy + systems + aesthetics'];
let li = 0;
function typeLine() {
  if (!typedTarget || li >= lines.length || prefersReduced) return;
  const row = document.createElement('div');
  row.className = 'terminal-line';
  typedTarget.appendChild(row);
  let ci = 0;
  const text = lines[li];
  const int = setInterval(() => {
    row.textContent = text.slice(0, ci++);
    if (ci > text.length) {
      clearInterval(int);
      li += 1;
      setTimeout(typeLine, 180);
    }
  }, 22);
}
setTimeout(typeLine, 300);

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let w = 0, h = 0;
function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();

const count = window.innerWidth < 768 ? 45 : 90;
const particles = Array.from({ length: count }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  vx: (Math.random() - 0.5) * 0.25,
  vy: (Math.random() - 0.5) * 0.25,
  r: Math.random() * 1.6 + 0.6
}));
const pointer = { x: w / 2, y: h / 2 };
window.addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; });

function draw() {
  ctx.clearRect(0, 0, w, h);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const dxp = pointer.x - p.x;
    const dyp = pointer.y - p.y;
    const distMouse = Math.hypot(dxp, dyp);
    if (distMouse < 130) {
      p.vx -= dxp * -0.00002;
      p.vy -= dyp * -0.00002;
    }
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(217,119,6,0.35)';
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 80) {
        ctx.strokeStyle = `rgba(217,119,6,${(1 - d / 80) * 0.17})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
if (!prefersReduced) requestAnimationFrame(draw);

const ring = document.querySelector('.cursor-ring');
const dot = document.querySelector('.cursor-dot');
if (window.innerWidth >= 768 && ring && dot) {
  let rx = window.innerWidth / 2, ry = window.innerHeight / 2;
  let tx = rx, ty = ry;
  window.addEventListener('pointermove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    dot.style.left = `${tx}px`; dot.style.top = `${ty}px`;
  });
  function animateCursor() {
    rx += (tx - rx) * 0.15;
    ry += (ty - ry) * 0.15;
    ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a,button,[role="button"],.magnetic').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${dx * 0.08}px, ${dy * 0.08}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  document.querySelectorAll('p,h1,h2,h3,span').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('text'));
    el.addEventListener('mouseleave', () => ring.classList.remove('text'));
  });

  window.addEventListener('click', (e) => {
    const ripple = document.createElement('span');
    Object.assign(ripple.style, {
      position: 'fixed', left: `${e.clientX}px`, top: `${e.clientY}px`, width: '8px', height: '8px', border: '1px solid rgba(217,119,6,.65)',
      borderRadius: '999px', pointerEvents: 'none', transform: 'translate(-50%,-50%)', zIndex: 31
    });
    document.body.appendChild(ripple);
    ripple.animate([{ width: '8px', height: '8px', opacity: 1 }, { width: '80px', height: '80px', opacity: 0 }], { duration: 320, easing: 'ease-out' });
    setTimeout(() => ripple.remove(), 340);
  });
}

const audioBtn = document.getElementById('audio-toggle');
let audioCtx;
let ambient;
function toggleAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (ambient) {
    ambient.stop(); ambient = null; audioBtn.textContent = 'Ambient: Off'; return;
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle'; osc.frequency.value = 72;
  gain.gain.value = 0.012;
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  ambient = osc;
  audioBtn.textContent = 'Ambient: On';
}
audioBtn?.addEventListener('click', toggleAudio);
