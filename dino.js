(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const hiEl = document.getElementById('hi');
  const overlay = document.getElementById('overlay');
  const currentTimeEl = document.getElementById('currentTime');
  const jumpBtn = document.getElementById('jumpBtn');
  const duckBtn = document.getElementById('duckBtn');

  const W = 600;
  const H = 150;
  const GROUND_Y = 124;

  const state = {
    running: false,
    gameOver: false,
    speed: 6,
    maxSpeed: 13,
    accel: 0.001,
    score: 0,
    hi: Number(localStorage.getItem('dino-hi') || 0),
    lastTime: 0,
    spawnTimer: 0,
    nextSpawnAt: 50,
    jumpPressed: false,
    duckPressed: false,
    blinkTick: 0,
    clouds: [],
    obstacles: []
  };

  const dino = {
    x: 50,
    y: GROUND_Y,
    w: 40,
    h: 43,
    duckH: 26,
    vy: 0,
    gravity: 0.6,
    jumpVel: -12.5,
    onGround: true,
    legFrame: 0,
    legTick: 0
  };

  hiEl.textContent = `HI ${pad(state.hi)}`;

  function showTime() {
    if (!currentTimeEl) return;
    currentTimeEl.innerHTML = new Date().toUTCString();
  }
  showTime();
  setInterval(function () {
    showTime();
  }, 1000);

  function pad(v) {
    return String(Math.floor(v)).padStart(5, '0');
  }

  function reset() {
    state.speed = 6;
    state.score = 0;
    state.spawnTimer = 0;
    state.nextSpawnAt = randomSpawnDistance();
    state.gameOver = false;
    state.blinkTick = 0;
    state.obstacles = [];
    state.clouds = [];
    dino.y = GROUND_Y;
    dino.vy = 0;
    dino.onGround = true;
    dino.legFrame = 0;
  }

  function startGame() {
    reset();
    state.running = true;
    overlay.classList.remove('visible');
  }

  function endGame() {
    state.gameOver = true;
    state.running = false;
    state.hi = Math.max(state.hi, Math.floor(state.score));
    localStorage.setItem('dino-hi', String(state.hi));
    hiEl.textContent = `HI ${pad(state.hi)}`;
    overlay.querySelector('.overlay-title').textContent = 'Game Over — Tap/Space to Restart';
    overlay.classList.add('visible');
  }

  function randomSpawnDistance() {
    return 80 + Math.random() * 120;
  }

  function spawnCloud() {
    if (Math.random() < 0.01) {
      state.clouds.push({
        x: W + 20,
        y: 18 + Math.random() * 45,
        w: 34,
        h: 10,
        speed: 1 + Math.random() * 0.8
      });
    }
  }

  function spawnObstacle() {
    state.spawnTimer += state.speed;
    if (state.spawnTimer < state.nextSpawnAt) return;
    state.spawnTimer = 0;
    state.nextSpawnAt = randomSpawnDistance() + state.speed * 5;

    const useBird = state.score > 450 && Math.random() < 0.25;
    if (useBird) {
      const birdLevels = [GROUND_Y - 38, GROUND_Y - 56, GROUND_Y - 26];
      state.obstacles.push({
        type: 'bird',
        x: W + 10,
        y: birdLevels[Math.floor(Math.random() * birdLevels.length)],
        w: 36,
        h: 26,
        frame: 0,
        frameTick: 0
      });
      return;
    }

    const multi = Math.random() < 0.30 ? 2 : 1;
    for (let i = 0; i < multi; i += 1) {
      const w = 18 + Math.random() * 10;
      const h = 32 + Math.random() * 16;
      state.obstacles.push({
        type: 'cactus',
        x: W + 10 + i * (w + 10),
        y: GROUND_Y - h,
        w,
        h
      });
    }
  }

  function setJump(on) {
    state.jumpPressed = on;
    if (on && dino.onGround && !state.gameOver) {
      dino.vy = dino.jumpVel;
      dino.onGround = false;
    }
  }

  function setDuck(on) {
    state.duckPressed = on;
    if (on && !dino.onGround) {
      dino.vy += 0.38;
    }
  }

  function keyDown(e) {
    if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
      e.preventDefault();
      if (state.gameOver || !state.running) {
        overlay.querySelector('.overlay-title').textContent = 'Press Space / Tap to Start';
        startGame();
      }
      setJump(true);
    }
    if (['ArrowDown', 'KeyS'].includes(e.code)) {
      e.preventDefault();
      setDuck(true);
    }
  }

  function keyUp(e) {
    if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
      setJump(false);
    }
    if (['ArrowDown', 'KeyS'].includes(e.code)) {
      setDuck(false);
    }
  }

  function touchJump(e) {
    e.preventDefault();
    if (state.gameOver || !state.running) {
      overlay.querySelector('.overlay-title').textContent = 'Press Space / Tap to Start';
      startGame();
    }
    setJump(true);
    setTimeout(() => setJump(false), 40);
  }

  window.addEventListener('keydown', keyDown, { passive: false });
  window.addEventListener('keyup', keyUp, { passive: true });
  canvas.addEventListener('pointerdown', touchJump, { passive: false });
  overlay.addEventListener('pointerdown', touchJump, { passive: false });

  jumpBtn.addEventListener('pointerdown', touchJump, { passive: false });
  duckBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    setDuck(true);
  }, { passive: false });
  duckBtn.addEventListener('pointerup', () => setDuck(false), { passive: true });
  duckBtn.addEventListener('pointercancel', () => setDuck(false), { passive: true });
  duckBtn.addEventListener('pointerleave', () => setDuck(false), { passive: true });

  function update(dt) {
    if (!state.running) return;

    state.speed = Math.min(state.maxSpeed, state.speed + state.accel * dt);
    state.score += dt * 0.06;
    scoreEl.textContent = pad(state.score);

    // Dino physics
    dino.vy += dino.gravity;
    dino.y += dino.vy;

    if (dino.y >= GROUND_Y) {
      dino.y = GROUND_Y;
      dino.vy = 0;
      dino.onGround = true;
    }

    dino.legTick += dt;
    if (dino.legTick > 70) {
      dino.legTick = 0;
      dino.legFrame = dino.legFrame ? 0 : 1;
    }

    spawnCloud();
    spawnObstacle();

    for (let i = state.clouds.length - 1; i >= 0; i -= 1) {
      state.clouds[i].x -= state.clouds[i].speed;
      if (state.clouds[i].x + state.clouds[i].w < 0) state.clouds.splice(i, 1);
    }

    for (let i = state.obstacles.length - 1; i >= 0; i -= 1) {
      const obs = state.obstacles[i];
      obs.x -= state.speed;
      if (obs.type === 'bird') {
        obs.frameTick += dt;
        if (obs.frameTick > 85) {
          obs.frameTick = 0;
          obs.frame = obs.frame ? 0 : 1;
        }
      }
      if (obs.x + obs.w < -10) state.obstacles.splice(i, 1);
    }

    // Collision
    const dinoH = state.duckPressed && dino.onGround ? dino.duckH : dino.h;
    const dinoYTop = dino.y - dinoH;
    const hitbox = {
      x: dino.x + 5,
      y: dinoYTop + 4,
      w: 30,
      h: dinoH - 6
    };

    for (const obs of state.obstacles) {
      const oBox = { x: obs.x + 2, y: obs.y + 2, w: obs.w - 4, h: obs.h - 4 };
      if (
        hitbox.x < oBox.x + oBox.w &&
        hitbox.x + hitbox.w > oBox.x &&
        hitbox.y < oBox.y + oBox.h &&
        hitbox.y + hitbox.h > oBox.y
      ) {
        endGame();
        break;
      }
    }
  }

  function drawCloud(cloud) {
    ctx.fillStyle = '#d5d5d5';
    ctx.fillRect(cloud.x + 8, cloud.y + 2, 8, 5);
    ctx.fillRect(cloud.x + 16, cloud.y, 10, 7);
    ctx.fillRect(cloud.x + 24, cloud.y + 2, 8, 5);
  }

  function drawDino() {
    const ducking = state.duckPressed && dino.onGround;
    const x = dino.x;
    const baseY = dino.y;

    ctx.fillStyle = '#535353';

    if (ducking) {
      ctx.fillRect(x + 2, baseY - 22, 30, 16);
      ctx.fillRect(x + 30, baseY - 20, 9, 10);
      ctx.fillRect(x + (dino.legFrame ? 9 : 18), baseY - 6, 8, 6);
      ctx.fillRect(x + 4, baseY - 28, 8, 6);
      return;
    }

    ctx.fillRect(x + 8, baseY - 42, 18, 22); // body
    ctx.fillRect(x + 22, baseY - 52, 12, 14); // neck/head
    ctx.fillRect(x + 30, baseY - 50, 9, 10);
    ctx.fillRect(x + 14, baseY - 46, 3, 3); // body pixel detail
    ctx.fillRect(x + 18, baseY - 33, 2, 2);
    if (!state.gameOver || Math.floor(state.blinkTick / 120) % 2 === 0) {
      ctx.fillRect(x + 33, baseY - 47, 2, 2); // eye
    }
    ctx.fillRect(x + 10 + (dino.legFrame ? 0 : 8), baseY - 18, 6, 18);
    ctx.fillRect(x + 10 + (dino.legFrame ? 8 : 0), baseY - 18, 6, 18);
    ctx.fillRect(x + 5, baseY - 28, 6, 12); // tail
    ctx.fillRect(x + 4, baseY - 24, 4, 4); // tail tip
  }

  function drawCactus(o) {
    ctx.fillStyle = '#535353';
    ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.fillRect(o.x - 5, o.y + 8, 6, 10);
    ctx.fillRect(o.x + o.w - 1, o.y + 14, 6, 10);
    ctx.fillStyle = '#737373';
    ctx.fillRect(o.x + 2, o.y + 3, 2, o.h - 6);
  }

  function drawBird(o) {
    ctx.fillStyle = '#535353';
    ctx.fillRect(o.x + 7, o.y + 8, 18, 8);
    ctx.fillRect(o.x + 22, o.y + 6, 6, 6);
    ctx.fillRect(o.x + 24, o.y + 8, 2, 2);
    if (o.frame) {
      ctx.fillRect(o.x + 1, o.y + 1, 10, 6);
      ctx.fillRect(o.x + 11, o.y + 1, 8, 4);
    } else {
      ctx.fillRect(o.x + 1, o.y + 12, 10, 6);
      ctx.fillRect(o.x + 11, o.y + 14, 8, 4);
    }
  }

  function drawGround() {
    ctx.fillStyle = '#bfbfbf';
    ctx.fillRect(0, GROUND_Y + 1, W, 2);

    // moving pebbles
    const shift = (state.score * 0.8) % 34;
    for (let i = -1; i < 20; i += 1) {
      const x = i * 34 - shift;
      ctx.fillStyle = '#c7c7c7';
      ctx.fillRect(x + 8, GROUND_Y + 4, 4, 2);
      ctx.fillRect(x + 20, GROUND_Y + 7, 3, 2);
      ctx.fillStyle = '#dedede';
      ctx.fillRect(x + 26, GROUND_Y + 5, 2, 1);
    }
  }

  function drawGameOverText() {
    if (!state.gameOver) return;
    ctx.fillStyle = '#666';
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText('GAME OVER', 210, 60);
  }

  function render(dt) {
    ctx.clearRect(0, 0, W, H);

    state.blinkTick += dt;

    state.clouds.forEach(drawCloud);
    drawGround();
    drawDino();
    state.obstacles.forEach((o) => (o.type === 'bird' ? drawBird(o) : drawCactus(o)));
    drawGameOverText();
  }

  function loop(ts) {
    if (!state.lastTime) state.lastTime = ts;
    const dt = Math.min(32, ts - state.lastTime);
    state.lastTime = ts;

    update(dt);
    render(dt);

    requestAnimationFrame(loop);
  }

  reset();
  render(16);
  requestAnimationFrame(loop);
})();
