const PALETTES = {
  aurora: { core:[255,220,170], mid:[139,124,246], rim:[110,195,255], glow:'139,124,246', coreGlow:'255,224,178' },
  ember:  { core:[255,225,190], mid:[255,140,60],  rim:[255,60,90],   glow:'255,110,60',  coreGlow:'255,214,170' },
  glacier:{ core:[240,250,255], mid:[140,190,255], rim:[80,110,255],  glow:'120,170,255', coreGlow:'230,244,255' },
  neon:   { core:[255,230,250], mid:[255,80,200],  rim:[80,140,255],  glow:'255,80,200',  coreGlow:'255,224,244' }
};

function makeGalaxy(canvas, opts) {
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W, H, CX, CY, R;
  let mouseX = 0, mouseY = 0, mx = 0, my = 0;
  const stars = [], field = [];
  const cfg = Object.assign({ count: 2400, arms: 3, spin: 1, tilt: .58, palette: 'aurora' }, opts || {});
  let pal = PALETTES[cfg.palette];

  function lerp(a, b, t) { return a + (b - a) * t; }
  function mix(c1, c2, t) { return [lerp(c1[0],c2[0],t)|0, lerp(c1[1],c2[1],t)|0, lerp(c1[2],c2[2],t)|0]; }

  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    CX = W / 2; CY = H * .5;
    R = Math.min(W, H) * .38;
  }

  function build() {
    stars.length = 0; field.length = 0;
    for (let i = 0; i < cfg.count; i++) {
      const t = Math.pow(Math.random(), .58);
      const arm = (i % cfg.arms) * (Math.PI * 2 / cfg.arms);
      const angle = arm + t * 4.6 + (Math.random() - .5) * (1.25 - t * .75);
      const r = .16 + t * .84;
      const jitter = (Math.random() - .5) * .05 * (1.4 - t);
      let col;
      if (t < .22) col = mix(pal.core, pal.mid, t / .22 * .5);
      else if (t < .62) col = mix(pal.mid, pal.mid, 0);
      else col = mix(pal.mid, pal.rim, (t - .62) / .38);
      if (t >= .22 && t < .62) col = mix(mix(pal.core, pal.mid, .5), pal.mid, (t - .22) / .4);
      const isStar = Math.random() < .06;
      stars.push({
        r, a: angle + jitter,
        w: isStar ? 1.6 + Math.random() * 1.3 : .5 + Math.random() * 1.1,
        o: isStar ? .95 : .28 + Math.random() * .5,
        c: isStar ? '255,255,255' : `${col[0]},${col[1]},${col[2]}`,
        tw: Math.random() * Math.PI * 2, tws: .4 + Math.random() * 1.4,
        sp: .055 / (0.25 + t * 1.15)
      });
    }
    for (let i = 0; i < 160; i++) {
      field.push({ x: Math.random(), y: Math.random(), w: Math.random() * 1.2 + .3,
        o: .12 + Math.random() * .5, tw: Math.random() * Math.PI * 2, tws: .3 + Math.random() });
    }
  }

  let last = performance.now(), T = 0;
  function frame(now) {
    const dt = Math.min((now - last) / 1000, .05); last = now; T += dt;
    mx += (mouseX - mx) * .04; my += (mouseY - my) * .04;
    ctx.clearRect(0, 0, W, H);

    ctx.save(); ctx.translate(-mx * 12, -my * 8);
    for (const s of field) {
      const o = s.o * (.55 + .45 * Math.sin(T * s.tws + s.tw));
      ctx.fillStyle = `rgba(255,255,255,${o.toFixed(3)})`;
      ctx.fillRect(s.x * W, s.y * H, s.w, s.w);
    }
    ctx.restore();

    const g = ctx.createRadialGradient(CX - mx * 20, CY - my * 14, 0, CX - mx * 20, CY - my * 14, R * .55);
    g.addColorStop(0, `rgba(${pal.coreGlow},.30)`);
    g.addColorStop(.35, `rgba(${pal.glow},.13)`);
    g.addColorStop(1, `rgba(${pal.glow},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(CX - mx * 26, CY - my * 18);
    ctx.globalCompositeOperation = 'lighter';
    for (const p of stars) {
      const a = p.a + T * p.sp * cfg.spin;
      const r = p.r * R;
      const x = Math.cos(a) * r, y = Math.sin(a) * r * cfg.tilt;
      const o = p.o * (.7 + .3 * Math.sin(T * p.tws + p.tw));
      ctx.fillStyle = `rgba(${p.c},${o.toFixed(3)})`;
      ctx.fillRect(x, y, p.w, p.w);
    }
    const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, R * .18);
    cg.addColorStop(0, `rgba(${pal.coreGlow},.85)`);
    cg.addColorStop(.5, `rgba(${pal.glow},.25)`);
    cg.addColorStop(1, `rgba(${pal.glow},0)`);
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.arc(0, 0, R * .18, 0, 7); ctx.fill();
    ctx.restore();

    requestAnimationFrame(frame);
  }

  canvas.addEventListener('mousemove', e => {
    const b = canvas.getBoundingClientRect();
    mouseX = ((e.clientX - b.left) / b.width - .5) * 2;
    mouseY = ((e.clientY - b.top) / b.height - .5) * 2;
  });
  canvas.addEventListener('mouseleave', () => { mouseX = 0; mouseY = 0; });
  window.addEventListener('resize', () => { resize(); });

  resize(); build(); requestAnimationFrame(frame);
  return {
    rebuild(o) {
      Object.assign(cfg, o || {});
      pal = PALETTES[cfg.palette] || PALETTES.aurora;
      build();
    },
    get cfg() { return cfg; }
  };
}

const heroGalaxy = makeGalaxy(document.getElementById('galaxy'), { tilt: .58 });
const tuneGalaxy = makeGalaxy(document.getElementById('tuneCanvas'), { tilt: .58 });
const $ = id => document.getElementById(id);
const rCount = $('rCount'), rArms = $('rArms'), rSpin = $('rSpin'), rTilt = $('rTilt');
const PAL_NAMES = {
  aurora: 'warm white core → violet arms → cyan rim',
  ember: 'fire core → amber arms → red rim',
  glacier: 'ice white core → pale blue arms → deep blue rim',
  neon: 'magenta core → electric blue rim'
};

function currentPrompt() {
  const c = +rCount.value, a = +rArms.value, s = +rSpin.value, t = +rTilt.value, p = document.querySelector('.swatch.on').dataset.p;
  return `scene: pinwheel galaxy, ${a} spiral arms, ${c.toLocaleString()} particles
rotation: differential — inner fast, outer slow${s !== 1 ? `, global speed ${s.toFixed(1)}×` : ''}
palette: ${PAL_NAMES[p]}
tilt: ${t.toFixed(2)} vertical squash (edge-on 0.15 → face-on 1.0)
motion: slow drift, mouse parallax, star twinkle
container: single HTML file, no dependencies`;
}

function syncPromptBox() {
  const p = document.querySelector('.swatch.on').dataset.p;
  const c = +rCount.value, a = +rArms.value;
  $('oCount').textContent = c.toLocaleString();
  $('oArms').textContent = a;
  $('oSpin').textContent = (+rSpin.value).toFixed(1) + '×';
  $('oTilt').textContent = (+rTilt.value).toFixed(2);
  document.querySelector('.prompt-box').innerHTML =
    `<span class="k">scene</span>: pinwheel galaxy, ${a} spiral arms, <span class="s">${c.toLocaleString()} particles</span><br>` +
    `<span class="k">rotation</span>: differential — inner fast, outer slow${+rSpin.value !== 1 ? `, <span class="s">${(+rSpin.value).toFixed(1)}× speed</span>` : ''}<br>` +
    `<span class="k">palette</span>: ${PAL_NAMES[p]}<br>` +
    `<span class="k">tilt</span>: ${(+rTilt.value).toFixed(2)} <span class="s">(0.15 edge-on → 1.0 face-on)</span><br>` +
    `<span class="k">motion</span>: slow drift, mouse parallax, star twinkle<br>` +
    `<span class="k">container</span>: single HTML file, no dependencies`;
}

function applyTune() {
  tuneGalaxy.rebuild({
    count: +rCount.value, arms: +rArms.value,
    spin: +rSpin.value, tilt: +rTilt.value,
    palette: document.querySelector('.swatch.on').dataset.p
  });
  syncPromptBox();
}

[rCount, rArms, rSpin, rTilt].forEach(r => r.addEventListener('input', applyTune));
document.querySelectorAll('.swatch').forEach(s => s.addEventListener('click', () => {
  document.querySelectorAll('.swatch').forEach(x => x.classList.remove('on'));
  s.classList.add('on');
  applyTune();
}));
$('resetBtn').addEventListener('click', () => {
  rCount.value = 2400; rArms.value = 3; rSpin.value = 1; rTilt.value = .58;
  document.querySelectorAll('.swatch').forEach(x => x.classList.remove('on'));
  document.querySelector('.swatch[data-p=aurora]').classList.add('on');
  applyTune();
});
syncPromptBox();

document.querySelectorAll('.faq-q').forEach(q => q.addEventListener('click', () => q.parentElement.classList.toggle('open')));

const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .18 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, target = +el.dataset.count;
  if (target === 0) { el.textContent = '0'; cio.unobserve(el); return; }
  const t0 = performance.now(), dur = 1600;
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(target * ease).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
  cio.unobserve(el);
}), { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

document.getElementById('copyBtn').addEventListener('click', async function () {
  const PROMPT = currentPrompt();
  try { await navigator.clipboard.writeText(PROMPT); }
  catch (e) {
    const ta = document.createElement('textarea'); ta.value = PROMPT;
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
  }
  this.textContent = 'Copied ✓'; this.classList.add('done');
  const t = document.getElementById('toast'); t.classList.add('show');
  setTimeout(() => { t.classList.remove('show'); this.textContent = 'Copy prompt'; this.classList.remove('done'); }, 2000);
});
