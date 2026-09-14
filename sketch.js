import { constrain } from './constrain.js';
import { draw } from './draw.js';
import { levels } from './levels.js';

on('load', () => {
  const c = $('canvas');
  const ctx = c.getContext('2d');
  let width  = c.width  = innerWidth  * devicePixelRatio;
  let height = c.height = innerHeight * devicePixelRatio;
  let mindim = Math.min(width, height);
  let dirty = false;

  on('resize', () => dirty = true);

  const keys = {};
  const pressed = [];

  on('keydown', (e) => {
    e.preventDefault();
    keys[e.key] = true;
    if (!pressed.includes(e.key)) pressed.push(e.key);
  });

  on('keyup', (e) => {
    e.preventDefault();
    keys[e.key] = false;
    const idx = pressed.indexOf(e.key);
    if (idx !== -1) pressed.splice(idx, 1);
  });

  on('mousedown', (e) => {
    if (e.button !== 0) return;

    const rect = c.getBoundingClientRect();

    const mx = (e.clientX - rect.left) / mindim;
    const my = (e.clientY - rect.top) / mindim;

    const x = mx - 0.5 + camera.x.value;
    const y = my - 0.5 + camera.y.value;

    const dx = x - player.x;
    const dy = y - player.y;

    player.grapple.active = true;
    player.grapple.x = x;
    player.grapple.y = y;
    player.grapple.length = Math.hypot(dx, dy);
  });

  on('mouseup', (e) => {
    if (e.button === 0) {
      player.grapple.active = false;
    }
  });

  const camera = {
    x: spring(0),
    y: spring(0),
    zoom: spring(1),
  };

  const player = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    r: 0.02,
    grapple: {
      active: false,
      x: 0,
      y: 0,
      length: 0,
    }
  };

  const level = 0;

  const controls = (keys, player, dt) => {
    if (keys.w) player.vy -= 0.7 * dt;
    if (keys.a) player.vx -= 0.7 * dt;
    if (keys.s) player.vy += 0.7 * dt;
    if (keys.d) player.vx += 0.7 * dt;
  };

  const update = (dt) => {
    camera.x.update(dt);
    camera.y.update(dt);
    camera.zoom.update(dt);

    controls(keys, player, dt);

    const friction = 0.99;
    const damp = Math.pow(friction, dt * 60);
    player.vx *= damp;
    player.vy *= damp;
    
    player.x += player.vx * dt;
    player.y += player.vy * dt;

    constrain(player, levels[level]);
  };

  const render = (dt) => {
    if (dirty) {
      dirty = false;
      width  = c.width  = innerWidth  * devicePixelRatio;
      height = c.height = innerHeight * devicePixelRatio;
      mindim = Math.min(width, height);
    }

    ctx.fillStyle = '#101010';
    ctx.fillRect(0, 0, width, height);

    ctx.save();

    ctx.translate(width/2, height/2);

    const scale = camera.zoom.value * mindim;
    ctx.scale(scale, scale);

    ctx.translate(-camera.x.value, -camera.y.value);

    draw(ctx, levels[level]);

    if (player.grapple.active) {
      ctx.strokeStyle = '#21a359';
      ctx.lineWidth = 0.01;
      ctx.beginPath();
      ctx.moveTo(player.x, player.y);
      ctx.lineTo(player.grapple.x, player.grapple.y);
      ctx.stroke();
    }
    
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.r, 0, 2*Math.PI);
    ctx.fill();

    ctx.restore();
  };

  let then = 0;
  const frame = (now) => {
    const dt = (now - then) / 1000;
    then = now;
    
    update(dt);
    render(dt);

    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

});