// ECLIPSE SEASONS — why eclipses come in pairs. Geometry is schematic: not to scale, tilt exaggerated (16° drawn vs 5.1° real).
const DEG = Math.PI / 180, RE = 2600, RM = 300, ER = 30, MR = 13, INC = 16 * DEG, WIN = 17, SYN = 29.53, DPD = .9856;
const ss = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
const seg = (t, a, b, e = E.io2) => e(P(t, a, b));
const T = { tilt: LB(2), cal: LB(4), world: LB(6), end: LB(17) };
const t7 = LS(7), t8 = LS(8), t9 = LS(9), t10 = LS(10), t11 = LS(11), t12 = LS(12), t13 = LS(13), t14 = LS(14), t15 = LS(15), t16 = LS(16);
const AMB = '#ffb340', COP = '#ff7a4d';

// ------------------------------------------------------------ backdrop
let STARS = [], RAYS = [], MARIA = [];
function initFilm() {
  const r = rng(11); for (let i = 0; i < 340; i++) STARS.push({ x: r(), y: r(), s: .5 + r() * r() * 2.2, p: r() * TAU, f: .4 + r() * 1.5, a: .25 + r() * .75 });
  const r2 = rng(5); for (let i = 0; i < 22; i++) RAYS.push({ a: r2() * TAU, l: 1.5 + r2() * 1.3, w: .05 + r2() * .12, p: r2() * TAU });
  const r3 = rng(23); for (let i = 0; i < 9; i++) MARIA.push({ a: r3() * TAU, d: r3() * .7, s: .12 + r3() * .22 });
}
function space(t, shift = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#02040c'); g.addColorStop(.6, '#050c1c'); g.addColorStop(1, '#0a1730');
  ctx.fillStyle = g; ctx.fillRect(-20, -20, W + 40, H + 40);
  for (const s of STARS) { const x = (((s.x * W + shift * (20 + s.s * 30)) % W) + W) % W; ctx.globalAlpha = s.a * (.65 + .35 * Math.sin(t * s.f + s.p)); ctx.fillStyle = '#dfeeff'; ctx.beginPath(); ctx.arc(x, s.y * H, s.s, 0, TAU); ctx.fill(); }
  ctx.globalAlpha = 1;
}
function glow(x, y, r, col, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); }

// ------------------------------------------------------------ eclipse icons (hero pair)
function solarIcon(x, y, R, a, cover, t) {           // cover 0 = bare sun, 1 = totality
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
  const c = E.io2(clamp(cover));
  glow(x, y, R * 3.2, `rgba(255,${Math.round(lerp(190, 235, c))},${Math.round(lerp(90, 215, c))},.55)`, a * lerp(1, .8, c));
  if (c > .5) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y);
    for (const k of RAYS) { const l = R * k.l * (.9 + .1 * Math.sin(t * .8 + k.p)); ctx.rotate(k.a); const g = ctx.createLinearGradient(R * .9, 0, l, 0); g.addColorStop(0, `rgba(255,244,225,${.34 * (c - .5) * 2 * a})`); g.addColorStop(1, 'rgba(255,244,225,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(R * .9, -R * k.w * 2.2); ctx.lineTo(l, 0); ctx.lineTo(R * .9, R * k.w * 2.2); ctx.fill(); ctx.rotate(-k.a); }
    ctx.restore(); }
  const sg = ctx.createRadialGradient(x, y, 0, x, y, R); sg.addColorStop(0, '#fffbe8'); sg.addColorStop(.8, '#ffd76a'); sg.addColorStop(1, '#ff9d2e'); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill();
  const mx = x + (1 - c) * R * 2.3, my = y - (1 - c) * R * .35;
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, R * 3.3, 0, TAU); ctx.clip(); ctx.fillStyle = '#03060d'; ctx.beginPath(); ctx.arc(mx, my, R * 1.035, 0, TAU); ctx.fill(); ctx.restore();
  if (c > .9) { ctx.strokeStyle = `rgba(255,250,240,${(c - .9) * 10 * .9})`; ctx.lineWidth = R * .035; ctx.beginPath(); ctx.arc(x, y, R * 1.05, 0, TAU); ctx.stroke(); glow(x - R * .74, y - R * .74, R * .5, 'rgba(255,255,255,.9)', (c - .9) * 10 * a * (.7 + .3 * Math.sin(t * 3))); }
  ctx.restore();
}
function lunarIcon(x, y, R, a, red, t) {             // red 0 = grey full moon, 1 = deep in Earth's shadow
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; const c = E.io2(clamp(red));
  glow(x, y, R * 2.4, c > .5 ? 'rgba(255,90,40,.32)' : 'rgba(200,220,255,.3)', a);
  const body = (c0, c1, c2) => { const g = ctx.createRadialGradient(x - R * .35, y - R * .35, R * .1, x, y, R); g.addColorStop(0, c0); g.addColorStop(.6, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill(); };
  body('#f4f6fa', '#b9c0cc', '#6d7482');
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.clip();
  if (c > 0) { ctx.beginPath(); ctx.arc(x - R * 2.6 * (1 - c) - R * .12, y + R * .5 * (1 - c), R * 1.5, 0, TAU); ctx.clip(); body('#ffb48c', '#c24e28', '#4a1006'); }
  ctx.restore(); ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.clip();
  for (const m of MARIA) { ctx.fillStyle = 'rgba(20,10,20,.16)'; ctx.beginPath(); ctx.arc(x + Math.cos(m.a) * m.d * R, y + Math.sin(m.a) * m.d * R, m.s * R, 0, TAU); ctx.fill(); }
  ctx.restore(); ctx.restore();
}
function pairLayout() { return { y: O(440, 610), dx: O(350, 250), R: O(135, 112) }; }
function iconLabels(L, a1, a2, full) {
  const y = L.y + L.R + O(78, 70);
  for (const [sx, a, d, n, col] of [[-1, a1, 'AUG 12, 2026', O('TOTAL SOLAR ECLIPSE', 'TOTAL SOLAR'), AMB], [1, a2, 'AUG 28, 2026', O('PARTIAL LUNAR ECLIPSE', 'PARTIAL LUNAR'), COP]]) {
    if (a <= 0) continue; ctx.save(); ctx.globalAlpha = a; const x = W / 2 + sx * L.dx;
    if (full) { txt(d, x, y, font(800, O(34, 30)), '#fff', 'center', 2); txt(n, x, y + 34, font(600, O(17, 16), F.m), col, 'center', 3); }
    else txt(sx < 0 ? 'SOLAR ECLIPSE' : 'LUNAR ECLIPSE', x, y, font(700, O(19, 18), F.m), col, 'center', 4);
    ctx.restore(); }
}

// ------------------------------------------------------------ scene 0: the pair + the question
function sceneIntro(t) {
  space(t); const L = pairLayout(), a = 1 - P(t, T.tilt - .1, T.tilt + .3);
  const tA = wt(0, 'eclipses') - .1, tB = wt(0, 'pairs') - .15, tQ = wt(1, 'links') - .1;
  solarIcon(W / 2 - L.dx, L.y, L.R, P(t, tA, tA + .5) * a, P(t, tA + .1, tA + 1.5), t);
  lunarIcon(W / 2 + L.dx, L.y, L.R, P(t, tB, tB + .5) * a, P(t, tB + .3, tB + 1.9), t);
  iconLabels(L, P(t, tA + .9, tA + 1.4) * a, P(t, tB + .9, tB + 1.4) * a, false);
  // dashed link + ?
  const lp = seg(t, tQ, tQ + .9), x0 = W / 2 - L.dx + L.R * 1.25, x1 = W / 2 + L.dx - L.R * 1.25;
  if (lp > 0) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.cyan; ctx.lineWidth = 3; ctx.setLineDash([10, 12]); ctx.lineDashOffset = -t * 30;
    ctx.beginPath(); ctx.moveTo(x0, L.y); ctx.lineTo(lerp(x0, W / 2 - 46, lp), L.y); ctx.moveTo(x1, L.y); ctx.lineTo(lerp(x1, W / 2 + 46, lp), L.y); ctx.stroke(); ctx.setLineDash([]);
    const q = E.oBack(P(t, tQ + .5, tQ + .9)); ctx.translate(W / 2, L.y); ctx.scale(q, q); glow(0, 0, 90, 'rgba(95,212,255,.35)', a * (.6 + .4 * Math.sin(t * 4)));
    txt('?', 0, 4, font(900, O(96, 84)), C.cyan2, 'center', 0, 'middle'); ctx.restore(); }
  const ta = vis(t, .5, T.tilt, .8, .4);
  ctx.globalAlpha = ta; txt('WHY ECLIPSES COME IN PAIRS', W / 2, O(206, 360), font(600, O(22, 20), F.m), 'rgba(200,230,255,.85)', 'center', O(10, 6)); ctx.globalAlpha = 1;
}

// ------------------------------------------------------------ the orbital world
function proj(p, cam) {
  const dx = p[0] - cam.fx, dy = p[1] - cam.fy, ca = Math.cos(cam.az), sa = Math.sin(cam.az), xr = dx * ca - dy * sa, yr = dx * sa + dy * ca, se = Math.sin(cam.el), ce = Math.cos(cam.el);
  return { x: cam.cx + cam.sc * xr, y: cam.cy + cam.sc * (yr * se - p[2] * ce), d: yr * ce + p[2] * se };
}
function sysAt(lam, phi, m) {
  const Ep = [RE * Math.cos(lam * DEG), RE * Math.sin(lam * DEG), 0];
  const mp = a => [Ep[0] + m * RM * Math.cos(a), Ep[1] + m * RM * Math.sin(a) * Math.cos(INC), m * RM * Math.sin(a) * Math.sin(INC)];
  return { E: Ep, mp, moon: mp(phi * DEG), u: [Math.cos(lam * DEG), Math.sin(lam * DEG), 0] };
}
function cone(p0, p1, w0, w1, a) {
  const dx = p1.x - p0.x, dy = p1.y - p0.y, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
  const g = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y); g.addColorStop(0, `rgba(120,135,255,${.42 * a})`); g.addColorStop(1, `rgba(120,135,255,0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(p0.x + nx * w0, p0.y + ny * w0); ctx.lineTo(p1.x + nx * w1, p1.y + ny * w1); ctx.lineTo(p1.x - nx * w1, p1.y - ny * w1); ctx.lineTo(p0.x - nx * w0, p0.y - ny * w0); ctx.fill();
  const g2 = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y); g2.addColorStop(0, `rgba(170,180,255,${.6 * a})`); g2.addColorStop(1, 'rgba(170,180,255,0)'); ctx.strokeStyle = g2; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(p0.x + nx * w0, p0.y + ny * w0); ctx.lineTo(p1.x + nx * w1, p1.y + ny * w1); ctx.moveTo(p0.x - nx * w0, p0.y - ny * w0); ctx.lineTo(p1.x - nx * w1, p1.y - ny * w1); ctx.stroke();
}
function drawWorld(t, o) {
  const cam = o.cam, m = o.m, S = sysAt(o.lam, o.phi, m), sc = cam.sc;
  space(t, cam.az * 1.2 + o.lam * .004);
  const e = proj(S.E, cam), mo = proj(S.moon, cam), sun = proj([0, 0, 0], cam);
  const sl = Math.hypot(sun.x - e.x, sun.y - e.y) || 1, sd = { x: (sun.x - e.x) / sl, y: (sun.y - e.y) / sl };
  const wide = clamp((1 - sc) / .8);
  // sun
  glow(sun.x, sun.y, lerp(3900, 380, wide), 'rgba(255,170,70,.34)'); glow(sun.x, sun.y, lerp(700, 120, wide), 'rgba(255,225,150,.9)');
  ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.arc(sun.x, sun.y, lerp(190, 30, wide), 0, TAU); ctx.fill();
  // earth orbit + season arcs
  if (o.aOrbit > 0) { ctx.save(); ctx.globalAlpha = o.aOrbit; ctx.strokeStyle = 'rgba(160,200,255,.35)'; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let i = 0; i <= 180; i++) { const a = i / 180 * TAU, p = proj([RE * Math.cos(a), RE * Math.sin(a), 0], cam); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); } ctx.stroke();
    if (o.aArcs > 0) for (const c0 of [0, 180]) { const ext = WIN * E.o3(o.aArcs); ctx.globalAlpha = o.aOrbit * (c0 ? .55 : 1); ctx.strokeStyle = AMB; ctx.lineCap = 'round';
      for (const [lw, al] of [[22, .16], [9, .9]]) { ctx.lineWidth = lw; ctx.globalAlpha = o.aOrbit * al * (c0 ? .55 : 1); ctx.beginPath(); for (let i = 0; i <= 24; i++) { const a = (c0 - ext + 2 * ext * i / 24) * DEG, p = proj([RE * Math.cos(a), RE * Math.sin(a), 0], cam); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); } ctx.stroke(); } }
    ctx.restore(); }
  // light rays
  if (o.aRays > 0) { ctx.save(); ctx.globalAlpha = o.aRays; ctx.strokeStyle = 'rgba(255,215,140,.16)'; ctx.lineWidth = 2; ctx.setLineDash([46, 60]); ctx.lineDashOffset = t * 90;
    for (let k = -4; k <= 4; k++) { if (!k) continue; const off = k * 62 * sc; ctx.beginPath(); ctx.moveTo(e.x + sd.x * 1500 - sd.y * off, e.y + sd.y * 1500 + sd.x * off); ctx.lineTo(e.x + sd.x * RM * sc * 1.6 - sd.y * off, e.y + sd.y * RM * sc * 1.6 + sd.x * off); ctx.stroke(); }
    ctx.restore(); }
  const ring = (rad, n = 96) => { const a = []; for (let i = 0; i <= n; i++) { const an = i / n * TAU; a.push(proj([S.E[0] + rad * Math.cos(an), S.E[1] + rad * Math.sin(an), 0], cam)); } return a; };
  // ecliptic plane disc
  if (o.aPlane > 0) { ctx.save(); const pts = ring(RM * m * 1.5); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    ctx.fillStyle = `rgba(95,212,255,${.06 * o.aPlane + .07 * (o.plHi || 0)})`; ctx.fill(); ctx.strokeStyle = `rgba(95,212,255,${.3 * o.aPlane + .5 * (o.plHi || 0)})`; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.strokeStyle = `rgba(95,212,255,${.1 * o.aPlane})`; for (const rr of [.5, 1]) { ctx.beginPath(); ring(RM * m * rr).forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); }
    for (let k = 0; k < 12; k++) { const a = k * 30 * DEG, p = proj([S.E[0] + RM * m * 1.5 * Math.cos(a), S.E[1] + RM * m * 1.5 * Math.sin(a), 0], cam); ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(p.x, p.y); ctx.stroke(); }
    ctx.restore(); }
  // eclipse-window wedges around the node line
  if (o.aWedge > 0) { ctx.save(); for (const c0 of [0, 180]) { ctx.beginPath(); ctx.moveTo(e.x, e.y); for (let i = 0; i <= 16; i++) { const a = (c0 - WIN + 2 * WIN * i / 16) * DEG, p = proj([S.E[0] + RM * m * 1.42 * Math.cos(a), S.E[1] + RM * m * 1.42 * Math.sin(a), 0], cam); ctx.lineTo(p.x, p.y); } ctx.closePath();
      ctx.fillStyle = `rgba(255,179,64,${(.13 + .1 * (o.wPulse || 0)) * o.aWedge})`; ctx.fill(); ctx.strokeStyle = `rgba(255,179,64,${.55 * o.aWedge})`; ctx.lineWidth = 1.5; ctx.stroke(); } ctx.restore(); }
  // node line
  const n1 = proj(S.mp(Math.PI), cam), n2 = proj(S.mp(0), cam);
  if (o.aLine > 0) { ctx.save(); ctx.globalAlpha = o.aLine; const a = proj([S.E[0] - RM * m * 1.6 - (o.lineExt || 0), S.E[1], 0], cam), b = proj([S.E[0] + RM * m * 1.6, S.E[1], 0], cam);
    ctx.strokeStyle = o.lineHot ? `rgba(255,${Math.round(lerp(255, 200, o.lineHot))},${Math.round(lerp(255, 90, o.lineHot))},.9)` : 'rgba(255,255,255,.75)'; ctx.lineWidth = 2 + 2 * (o.lineHot || 0); ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.restore(); }
  // moon orbit ring (far half first)
  const N = 120, rp = []; for (let i = 0; i <= N; i++) { const a = i / N * TAU, w = S.mp(a), p = proj(w, cam); p.z = w[2]; rp.push(p); }
  const drawRing = near => { if (o.aRing <= 0) return; ctx.save(); ctx.lineCap = 'round';
    if (o.aDrops > 0 && !near) { ctx.strokeStyle = `rgba(155,231,255,${.22 * o.aDrops})`; ctx.lineWidth = 1; for (let i = 0; i < N; i += 5) { const a = i / N * TAU, g0 = proj([S.E[0] + m * RM * Math.cos(a), S.E[1] + m * RM * Math.sin(a) * Math.cos(INC), 0], cam); ctx.beginPath(); ctx.moveTo(rp[i].x, rp[i].y); ctx.lineTo(g0.x, g0.y); ctx.stroke(); } }
    for (let i = 0; i < N; i++) { const p = rp[i], q = rp[i + 1]; if ((p.d + q.d) / 2 > e.d !== near) continue; const up = (p.z + q.z) >= 0;
      ctx.strokeStyle = up ? `rgba(155,231,255,${.95 * o.aRing})` : `rgba(90,150,200,${.6 * o.aRing})`; ctx.lineWidth = Math.max(1.5, 3 * Math.sqrt(sc)); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
    ctx.restore(); };
  // hit tests
  const rel = [S.moon[0] - S.E[0], S.moon[1] - S.E[1], S.moon[2]], along = rel[0] * S.u[0] + rel[1] * S.u[1], perp = Math.hypot(rel[0] - along * S.u[0], rel[1] - along * S.u[1], rel[2]);
  const fx = o.fx === undefined ? 1 : o.fx, red = fx * (along > 0 ? 1 : 0) * (1 - ss(ER * m * 1.0, ER * m * 2.3, perp)), sol = fx * (along < 0 ? 1 : 0) * (1 - ss(ER * m * 1.0, ER * m * 2.2, perp));
  const re = Math.max(ER * m * sc, 5), rm = Math.max(MR * m * sc, 4);
  const drawMoon = () => { if (o.aMoon <= 0) return; ctx.save(); ctx.globalAlpha = o.aMoon;
    if (o.trail) { ctx.strokeStyle = C.cyan; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.globalAlpha = .9 * o.trail.a; ctx.shadowColor = C.cyan; ctx.shadowBlur = 18; ctx.beginPath(); const n = 40; for (let i = 0; i <= n; i++) { const p = proj(S.mp(lerp(o.trail.a0, o.trail.a1, i / n) * DEG), cam); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); } ctx.stroke(); ctx.shadowBlur = 0; ctx.globalAlpha = o.aMoon; }
    if (along < 0 && o.aShadow > 0) { const hit = perp < ER * m * 1.7, len = hit ? -along : RM * m * 1.25; cone(mo, proj([S.moon[0] + S.u[0] * len, S.moon[1] + S.u[1] * len, S.moon[2]], cam), rm * .9, rm * (hit ? .35 : .2), o.aShadow * (hit ? 1.5 : .8)); }
    glow(mo.x, mo.y, rm * 3.2, red > .3 ? 'rgba(255,80,40,.6)' : 'rgba(210,225,255,.35)', o.aMoon);
    const g = ctx.createRadialGradient(mo.x + sd.x * rm * .45, mo.y + sd.y * rm * .45, 0, mo.x, mo.y, rm * 1.15); g.addColorStop(0, '#ffffff'); g.addColorStop(.5, '#c4cbd6'); g.addColorStop(1, '#4a5160'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mo.x, mo.y, rm, 0, TAU); ctx.fill();
    if (red > 0) { ctx.globalAlpha = o.aMoon * red; const g2 = ctx.createRadialGradient(mo.x - rm * .3, mo.y - rm * .3, 0, mo.x, mo.y, rm); g2.addColorStop(0, '#ffb08a'); g2.addColorStop(.7, '#c0431f'); g2.addColorStop(1, '#4a1006'); ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(mo.x, mo.y, rm, 0, TAU); ctx.fill(); }
    ctx.restore(); };
  drawRing(false); if (mo.d <= e.d) drawMoon();
  if (o.aShadow > 0) cone(e, proj([S.E[0] + S.u[0] * RM * m * 1.6, S.E[1] + S.u[1] * RM * m * 1.6, 0], cam), re * .95, re * .5, o.aShadow);
  // earth
  glow(e.x, e.y, re * 2.6, 'rgba(70,150,255,.5)');
  { const g = ctx.createRadialGradient(e.x + sd.x * re * .5, e.y + sd.y * re * .5, 0, e.x, e.y, re * 1.1); g.addColorStop(0, '#c9ecff'); g.addColorStop(.3, '#3d93ee'); g.addColorStop(.75, '#0c2f78'); g.addColorStop(1, '#020818'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(e.x, e.y, re, 0, TAU); ctx.fill();
    if (re > 12) { ctx.save(); ctx.beginPath(); ctx.arc(e.x, e.y, re, 0, TAU); ctx.clip(); ctx.fillStyle = 'rgba(120,220,150,.32)'; for (const [ax, ay, rr] of [[.25, -.3, .34], [-.2, .25, .28], [.5, .35, .2], [-.45, -.4, .22]]) { ctx.beginPath(); ctx.ellipse(e.x + ax * re + sd.x * re * .15, e.y + ay * re, rr * re, rr * re * .7, .5, 0, TAU); ctx.fill(); } ctx.restore(); }
    if (sol > 0) { ctx.fillStyle = `rgba(0,0,10,${.85 * sol})`; ctx.beginPath(); ctx.arc(e.x + sd.x * re * .5, e.y + sd.y * re * .5 - re * .12, re * .24, 0, TAU); ctx.fill(); } }
  drawRing(true); if (mo.d > e.d) drawMoon();
  // nodes
  if (o.aN1 > 0 || o.aN2 > 0) for (const [n, a, lab, hot] of [[n1, o.aN1, o.n1Label || 'POINT 1', o.n1Hot], [n2, o.aN2, o.n2Label || 'POINT 2', o.n2Hot]]) { if (!(a > 0)) continue; ctx.save(); ctx.globalAlpha = clamp(a);
    const pop = E.oBack(clamp(a)), pr = 1 + .25 * Math.sin(t * 4); glow(n.x, n.y, 34 * sc * pr * (1 + (hot || 0)), hot ? 'rgba(255,200,90,.9)' : 'rgba(255,255,255,.6)', clamp(a));
    ctx.fillStyle = hot ? AMB : '#fff'; ctx.beginPath(); ctx.arc(n.x, n.y, Math.max(3, 8 * sc * pop), 0, TAU); ctx.fill(); ctx.strokeStyle = hot ? AMB : '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(n.x, n.y, Math.max(6, 17 * sc * pop), 0, TAU); ctx.stroke();
    if (o.nodeLabels) { ctx.shadowColor = 'rgba(0,0,0,.9)'; ctx.shadowBlur = 10; txt(lab, n.x, n.y + 50 * Math.max(sc, .8), font(700, 20, F.m), hot ? AMB : '#fff', 'center', 3); }
    ctx.restore(); }
  return { e, mo, n1, n2, sun, sd, red, sol, re, rm, S };
}
const SC = O(1.18, .98), CYC = O(540, 890);
function label(s, x, y, a, col = 'rgba(230,242,255,.85)', size = 18, al = 'center') { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = 'rgba(0,0,0,.9)'; ctx.shadowBlur = 10; txt(s, x, y, font(600, size, F.m), col, al, 3); ctx.restore(); }

// ------------------------------------------------------------ scene 1: the tilt, and a miss every month
const tMiss = wt(3, 'missing') + .3, TM = 3.3;
function sceneTilt(t) {
  const lam = 90, phi = 90 + 360 * (t - tMiss) / TM, S0 = sysAt(lam, phi, 1);
  const cam = { fx: S0.E[0], fy: S0.E[1], sc: SC * lerp(.92, 1.04, P(t, T.tilt, T.cal)), az: (-90 + lerp(-7, 9, seg(t, T.tilt, T.cal))) * DEG, el: .33, cx: W / 2, cy: CYC };
  const aT = P(t, wt(2, 'moon') - .2, wt(2, 'tilted'));
  const R = drawWorld(t, { cam, lam, phi, m: 1, aOrbit: 0, aRays: 1, aPlane: 1, aRing: 1, aDrops: aT, aMoon: 1, aShadow: 1, aLine: 0, aWedge: 0 });
  // misses: full moons pass above the shadow, new-moon shadows pass under Earth
  for (let k = -3; k <= 1; k++) for (const half of [0, .5]) { const te = tMiss + (k - half) * TM; if (te < T.tilt + .2 || te > T.cal - .3) continue; const a = vis(t, te - .25, te + 1.3, .2, .5); if (a <= 0) continue;
    const Sx = sysAt(lam, 90 + 360 * (te - tMiss) / TM, 1), p = proj(Sx.moon, cam), full = !half, yy = p.y + (full ? -44 : 52);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(p.x, yy); const s = lerp(1.7, 1, E.o3(P(t, te - .25, te + .05))); ctx.scale(s, s); ctx.shadowColor = 'rgba(0,0,0,.9)'; ctx.shadowBlur = 12; txt('✕ MISS', 0, 0, font(900, 26), C.red, 'center', 3, 'middle'); ctx.restore(); }
  const mN = Math.max(1, Math.min(3, Math.floor((t - (tMiss - 1.5 * TM)) / TM) + 2));
  label('MONTH 0' + mN, W / 2, O(150, 300), vis(t, wt(2, 'monthly') - .2, T.cal, .4, .3), C.cyan2, O(20, 20));
  { const q = proj(R.S.mp(35 * DEG), cam); R.qx = q.x; R.qy = q.y; }
  callout(R.qx, R.qy, O(-120, -60), O(-150, -230), 'TILTED 5.1°', 'EXAGGERATED HERE', vis(t, wt(2, 'tilted') - .2, T.cal - .1, .8), C.cyan2, O(undefined, 0));
  callout(R.e.x + 150 * cam.sc, R.e.y + 6, O(150, 60), O(190, 230), "EARTH'S SHADOW", 'ONLY REACHES ALONG THE FLAT PLANE', vis(t, LS(3) - .2, T.cal - .1, .8), '#b9c0ff', O(undefined, 0));
  label('SUNLIGHT  ▶', O(120, 70), R.e.y - O(150, 210), vis(t, T.tilt + .4, T.cal, .5), 'rgba(255,220,150,.9)', 20, 'left');
}

// ------------------------------------------------------------ scene 2: August 2026 calendar
function sceneCal(t) {
  space(t, .3); const a = 1;
  const cw = O(98, 124), ch = O(76, 86), gx = W / 2 - cw * 3.5, gy = O(330, 890), tA = wt(4, 'august') - .1, tB = wt(5, 'lunar') - .1;
  const ix = O(250, W / 2 - 250), iy = O(470, 462), iR = O(118, 105), ix2 = O(W - 250, W / 2 + 250);
  // calendar panel
  const ap = seg(t, T.cal + .1, T.cal + .8, E.o3); ctx.save(); ctx.globalAlpha = ap; ctx.translate(0, 30 * (1 - ap));
  ctx.fillStyle = 'rgba(8,18,36,.82)'; rrect(gx - 30, gy - 118, cw * 7 + 60, ch * 6 + 148, 20); ctx.fill(); ctx.strokeStyle = 'rgba(95,212,255,.35)'; ctx.lineWidth = 1.5; ctx.stroke();
  txt('AUGUST', gx, gy - 62, font(800, 44), '#fff', 'left', 6); txt('2026', gx + cw * 7, gy - 62, font(800, 44), AMB, 'right', 4);
  'SMTWTFS'.split('').forEach((d, i) => txt(d, gx + cw * (i + .5), gy - 18, font(600, 16, F.m), 'rgba(155,231,255,.7)', 'center'));
  const cell = d => { const k = d + 5; return { x: gx + cw * ((k % 7) + .5), y: gy + ch * (Math.floor(k / 7) + .5) }; };
  const hop = lerp(12, 28, seg(t, wt(5, 'followed'), tB + .25, E.io2));
  for (let d = 1; d <= 31; d++) { const c = cell(d), on = d > 12 && d <= hop + .01 && d < 28;
    if (on) { ctx.fillStyle = 'rgba(95,212,255,.14)'; rrect(c.x - cw / 2 + 5, c.y - ch / 2 + 5, cw - 10, ch - 10, 10); ctx.fill(); }
    txt('' + d, c.x, c.y + 2, font(d === 12 || d === 28 ? 800 : 500, 28), on ? C.cyan2 : 'rgba(230,240,255,.75)', 'center', 0, 'middle'); }
  for (const [d, tt, col] of [[12, tA, AMB], [28, tB + .2, COP]]) { const p = E.oBack(P(t, tt, tt + .35)); if (p <= 0) continue; const c = cell(d); ctx.save(); ctx.translate(c.x, c.y); ctx.scale(lerp(1.8, 1, p), lerp(1.8, 1, p)); ctx.globalAlpha = ap * clamp(p * 2);
    ctx.fillStyle = col; rrect(-cw / 2 + 5, -ch / 2 + 5, cw - 10, ch - 10, 10); ctx.fill(); glow(0, 0, cw, col === AMB ? 'rgba(255,179,64,.4)' : 'rgba(255,110,60,.4)'); txt('' + d, 0, 2, font(900, 32), '#0a0f1a', 'center', 0, 'middle'); ctx.restore(); }
  // arc 12 -> 28
  const c1 = cell(12), c2 = cell(28), pa = seg(t, wt(5, 'followed'), tB + .25);
  if (pa > 0) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.setLineDash([8, 9]); ctx.beginPath(); const n = 40, mx = (c1.x + c2.x) / 2 + O(190, 150), my = (c1.y + c2.y) / 2 - 20;
    let last; for (let i = 0; i <= n * pa; i++) { const u = i / n, x = (1 - u) * (1 - u) * (c1.x + cw * .4) + 2 * u * (1 - u) * mx + u * u * (c2.x + cw * .1), y = (1 - u) * (1 - u) * c1.y + 2 * u * (1 - u) * my + u * u * (c2.y - ch * .45); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); last = [x, y]; } ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(last[0], last[1], 6, 0, TAU); ctx.fill(); }
  ctx.restore();
  const aw = vis(t, wt(5, 'two') - .1, T.world, .4, .3); if (aw > 0) { const c = { x: gx + cw * 4.5, y: gy + ch * 5.5 }; ctx.save(); ctx.globalAlpha = aw; ctx.fillStyle = 'rgba(4,10,20,.92)'; rrect(c.x - 118, c.y - 23, 236, 46, 23); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke(); txt('≈ 2 WEEKS LATER', c.x, c.y + 1, font(700, 18, F.m), '#fff', 'center', 2, 'middle'); ctx.restore(); }
  // icons
  const a1 = P(t, tA - .5, tA), a2 = P(t, tB - .1, tB + .4);
  solarIcon(ix, iy, iR, a1, P(t, tA - .5, tA + .7), t); lunarIcon(ix2, iy, iR, a2, P(t, tB + .1, tB + 1.3), t);
  for (const [x, al, d, n, s, col] of [[ix, P(t, tA + .2, tA + .7), 'AUG 12', 'TOTAL SOLAR ECLIPSE', 'GREENLAND · ICELAND · SPAIN', AMB], [ix2, P(t, tB + .4, tB + .9), 'AUG 28', 'PARTIAL LUNAR ECLIPSE', 'AMERICAS · EUROPE · AFRICA', COP]]) { if (al <= 0) continue; ctx.save(); ctx.globalAlpha = al; const y = iy + iR + O(86, 76);
    txt(d, x, y, font(800, O(46, 40)), '#fff', 'center', 3); txt(O(n, n.replace(' ECLIPSE', '')), x, y + 36, font(700, O(19, 18), F.m), col, 'center', 3); txt(s, x, y + 64, font(500, O(15, 14), F.m), 'rgba(220,235,255,.7)', 'center', 2); ctx.restore(); }
}

// ------------------------------------------------------------ scene 3-6: nodes -> season -> the pair (one continuous world)
const tNo = wt(7, "isn't") + .25, tm0 = t8 + .3, tAl = wt(8, 'points') - .1, tb = wt(9, 'temporary'), tc = t10 - .1, td0 = wt(10, 'orbits') - .1, td1 = wt(10, '34') + .7;
const tz = t11 + 1.6, th0 = wt(12, '14') - .25, th1 = wt(12, 'side') + .35, tr0 = t13 - .72, tr1 = t13 - .05, tS = wt(13, 'solar') + .2, tL = wt(16, 'second') + .35, tLun = Math.max(tL + .3, wt(16, 'lunar'));
const HALF = SYN / 2, D17 = WIN / DPD + 8, DAY0 = 17.25 - 8;      // window day of the solar eclipse in this model
const phiSyn = lam => lam + 180 + 360 * (lam / DPD + 8) / SYN;
function dayB(t) {
  if (t < tz) return lerp(D17, 0, seg(t, t11, tz, E.io));
  if (t < th0) return 0; if (t < th1) return lerp(0, HALF, seg(t, th0, th1));
  if (t < tr0) return HALF; if (t < tr1) return lerp(HALF, -1.3, seg(t, tr0, tr1, E.io));
  if (t < tS) return lerp(-1.3, 0, seg(t, tr1, tS, E.o3)); if (t < t14) return lerp(0, .5, P(t, tS, t14));
  if (t < tL) return lerp(.5, HALF, seg(t, t14, tL)); return HALF + (t - tL) * .1;
}
function stateB(t) {
  let lam, phi, D = null;
  if (t < t11) {
    if (t < tm0) lam = -60; else if (t < tAl) lam = lerp(-60, 0, seg(t, tm0, tAl)); else if (t < tb) lam = 0; else if (t < tc) lam = lerp(0, -WIN, seg(t, tb, tc));
    else if (t < td0) lam = -WIN; else lam = lerp(-WIN, WIN, seg(t, td0, td1));
    const phiA = 360 * (t - tNo) / 9;
    phi = t < tm0 ? phiA : phiSyn(lam) + (360 * (tm0 - tNo) / 9 - phiSyn(-60)) * (1 - seg(t, tm0, tAl));
  } else { D = dayB(t); lam = (D - 8) * DPD; phi = lam + 180 + 360 * D / SYN; }
  return { lam, phi, D };
}
function camB(t, st) {
  const w = seg(t, t8 - .1, t8 + 1.4, E.io) * (1 - seg(t, t11, t11 + 1.6, E.io));
  const Ep = [RE * Math.cos(st.lam * DEG), RE * Math.sin(st.lam * DEG)];
  const push = t > t13 ? 1 + .05 * seg(t, t13, tL) : lerp(.94, 1, P(t, T.world, t8));
  return { w, fx: lerp(Ep[0], O(120, 0), w), fy: lerp(Ep[1], 0, w), sc: Math.exp(lerp(Math.log(SC * push), Math.log(O(.17, .142)), w)), m: lerp(1, O(2.3, 2.0), w),
    az: t < t11 ? lerp(-.55, -.2, seg(t, T.world, t8)) * (1 - seg(t, t8 - .1, t8 + 1.4, E.io)) : -.42 * seg(t, t11, t11 + 1.6, E.io) + .05 * Math.sin((t - t11) * .35), el: lerp(.4, .64, w), cx: W / 2, cy: lerp(CYC, O(545, 880), w) };
}
function hudWindow(t, st) {
  const aBar = P(t, td0 - .5, td0) * (1 - P(t, T.end - .1, T.end + .3)); if (aBar <= 0) return;
  const BW = O(860, 840), x0 = W / 2 - BW / 2, y0 = O(170, 330), X = d => x0 + BW * d / 34.5;
  const day = st.D === null ? (st.lam + WIN) / DPD : DAY0 + st.D, inD = t >= t13 - .05;
  ctx.save(); ctx.globalAlpha = aBar;
  txt('ECLIPSE SEASON WINDOW', x0, y0 - 16, font(700, 20, F.m), AMB, 'left', 3);
  const still = inD && t > wt(15, 'still') - .1, blink = still ? .6 + .4 * Math.sin((t - wt(15, 'still')) * 9) * (1 - P(t, wt(15, 'still') + 1.5, wt(15, 'still') + 2)) : 1;
  const rt = t < t11 ? `DAY ${String(Math.round(clamp(day, 0, 34))).padStart(2, '0')} / 34` : still ? 'WINDOW STILL OPEN' : '34 DAYS';
  ctx.globalAlpha = aBar * blink; txt(rt, x0 + BW, y0 - 16, font(800, 22, F.m), still ? C.green : '#fff', 'right', 3); ctx.globalAlpha = aBar;
  ctx.fillStyle = 'rgba(255,179,64,.16)'; rrect(x0, y0, BW, 16, 8); ctx.fill(); ctx.strokeStyle = 'rgba(255,179,64,.8)'; ctx.lineWidth = 1.5; ctx.stroke();
  const fill = t < t11 ? clamp(day / 34.5) : 1; if (fill > 0) { ctx.fillStyle = `rgba(255,179,64,${t < t11 ? .85 : .5})`; rrect(x0, y0, Math.max(16, BW * fill), 16, 8); ctx.fill(); }
  for (let d = 0; d <= 34; d++) { ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(X(d + .25) - .5, y0 + 20, 1, d % 7 === 0 ? 9 : 4); }
  // moon half-orbit bar
  const a2 = P(t, th0 - .3, th0); if (a2 > 0 && st.D !== null) { const dd = t < tr0 ? clamp(st.D, 0, HALF) : HALF, y1 = y0 + 38; ctx.globalAlpha = aBar * a2;
    ctx.fillStyle = 'rgba(95,212,255,.9)'; rrect(X(DAY0), y1, Math.max(10, X(DAY0 + dd) - X(DAY0)), 10, 5); ctx.fill();
    const aL = a2 * (1 - P(t, tS - .3, tS)); if (aL > 0) { ctx.globalAlpha = aBar * aL; txt(`MOON · HALF A LAP · ${(Math.floor(dd * 10) / 10).toFixed(1)} DAYS`, X(DAY0), y1 + 40, font(700, 19, F.m), C.cyan2, 'left', 3); }
    ctx.globalAlpha = aBar;
    for (const [d, tt, s, col] of [[DAY0, tS, 'AUG 12 · SOLAR', AMB], [DAY0 + HALF, tL, 'AUG 28 · LUNAR', COP]]) { const am = P(t, tt, tt + .3); if (am <= 0) continue; ctx.globalAlpha = aBar * am; const pop = E.oBack(am);
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(X(d), y0 + 8, 11 * pop, 0, TAU); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); txt(s, X(d), y1 + 42, font(800, 19, F.m), col, 'center', 2); }
    if (inD) { ctx.globalAlpha = aBar * P(t, t13, t13 + .3); const px = X(DAY0 + clamp(st.D, -2, 20)); ctx.fillStyle = '#fff'; ctx.fillRect(px - 1.5, y0 - 8, 3, 62); ctx.beginPath(); ctx.moveTo(px - 8, y0 - 12); ctx.lineTo(px + 8, y0 - 12); ctx.lineTo(px, y0 - 1); ctx.fill(); } }
  ctx.restore();
}
function sceneWorld(t) {
  const st = stateB(t), cam = camB(t, st), w = cam.w, close = 1 - w;
  const aNodes1 = P(t, wt(6, 'two') - .1, wt(6, 'two') + .35), aNodes2 = P(t, wt(6, 'intersection') - .1, wt(6, 'intersection') + .35);
  const alignHot = vis(t, tAl - .15, tb + .3, .2, .8), still = t > t15 ? vis(t, wt(15, 'still') - .1, wt(15, 'still') + 1.8, .2, .6) : 0;
  const inD = t >= tr1, trailA = t >= th0 ? (t < tr0 ? 1 : t < tr1 ? 1 - P(t, tr0, tr1) : P(t, t14 - .2, t14 + .2)) : 0;
  const o = { cam, lam: st.lam, phi: st.phi, m: cam.m, aOrbit: w, aArcs: P(t, wt(9, 'window') - .2, wt(9, 'window') + .9), aRays: close, aPlane: close * .9 + .1, plHi: vis(t, wt(6, 'flat') - .2, wt(6, 'two'), .3, .6),
    aRing: 1, aDrops: close * (1 - P(t, t7, t8)) * .8, aMoon: 1, aShadow: lerp(1, .7, w), aLine: P(t, wt(6, 'intersection') + .2, wt(6, 'intersection') + .8), lineExt: w * RE * 1.45, lineHot: alignHot,
    aWedge: P(t, t11 + .8, t11 + 1.6), wPulse: still * (.5 + .5 * Math.sin(t * 8)), aN1: aNodes1, aN2: aNodes2, nodeLabels: w < .3, n1Hot: inD ? vis(t, tS - .2, tS + 1.6, .2, .8) : 0, n2Hot: inD ? P(t, tL - .2, tL) : 0,
    fx: t < t11 ? 1 : (t < tr1 ? 0 : 1), trail: trailA > 0 && st.D !== null ? { a: trailA, a0: (0 - 8) * DPD + 180, a1: st.lam + 180 + 360 * clamp(st.D, 0, HALF + 1) / SYN } : null };
  if (o.trail) { o.trail.a0 = st.lam + 180; }   // trail is drawn in the Earth-centred frame: start = sunward side
  const R = drawWorld(t, o);
  // --- close-up labels: plane, nodes, "no eclipse"
  callout(R.e.x - 150 * cam.sc, R.e.y + 118 * cam.sc, O(-150, -40), O(120, 200), "EARTH'S ORBITAL PLANE", 'THE "FLAT PLANE"', vis(t, wt(6, 'flat') - .2, t7 - .1, .7) * close, C.cyan2, O(undefined, 0));
  callout(R.e.x + 40 * cam.sc, R.e.y - 112 * cam.sc, O(150, 100), O(-140, -190), "MOON'S TILTED PATH", null, vis(t, LS(6) + .2, wt(6, 'flat') + .6, .7) * close, C.cyan2, O(undefined, 0));
  const aNo = vis(t, tNo - .3, t8 + .1, .25, .3);
  if (aNo > 0) { ctx.save(); ctx.globalAlpha = aNo; const s = lerp(1.6, 1, E.o3(P(t, tNo - .3, tNo))); ctx.translate(R.n2.x + O(40, -60), R.n2.y - O(96, 110)); ctx.scale(s, s); ctx.shadowColor = 'rgba(0,0,0,.9)'; ctx.shadowBlur = 12; txt('✕ NO ECLIPSE', 0, 0, font(900, 30), C.red, 'center', 3, 'middle'); txt("SHADOW POINTS ELSEWHERE", 0, 32, font(600, 15, F.m), 'rgba(255,255,255,.85)', 'center', 3, 'middle'); ctx.restore(); }
  // --- wide labels
  if (w > .05) {
    label('SUN', R.sun.x, R.sun.y + O(74, 70), w * (1 - alignHot * .0), 'rgba(255,225,160,.95)', 20);
    label('EARTH + MOON', R.e.x, R.e.y + cam.m * RM * cam.sc * .62 + 34, w * P(t, t8 + 1, t8 + 1.5) * (1 - P(t, tAl - .5, tAl)), 'rgba(200,230,255,.9)', 18);
    label('LINE THROUGH THE TWO POINTS', lerp(R.e.x, R.sun.x, .55), R.e.y - 20, w * vis(t, t8 + 1.2, tAl - .3, .4, .3), '#fff', 18);
    if (t >= tAl) { const a = vis(t, tAl, tb + .5, .1, .5); ctx.save(); ctx.globalAlpha = a * w; const s = lerp(1.8, 1, E.o3(P(t, tAl, tAl + .3))); ctx.translate(lerp(R.sun.x, R.e.x, .5), R.sun.y - O(58, 64)); ctx.scale(s, s); ctx.shadowColor = 'rgba(0,0,0,.9)'; ctx.shadowBlur = 12; txt('SUN ALIGNED', 0, 0, font(900, 34), AMB, 'center', 5, 'middle'); ctx.restore(); }
    const p17 = proj([RE * Math.cos(-WIN * DEG), RE * Math.sin(-WIN * DEG), 0], cam);
    callout(p17.x, p17.y, O(70, -170), O(-150, -250), 'ECLIPSE SEASON', '≈ 34 DAYS OF ORBIT', vis(t, wt(9, 'eclipse') - .2, t11 + .2, .8) * w, AMB, O(undefined, 0));
    const pl = proj([-RE, 0, 0], cam); label('NEXT SEASON', pl.x + O(-40, 0), pl.y + O(0, -70), w * vis(t, wt(9, 'eclipse') + .6, t11, .5), 'rgba(255,200,120,.75)', 18, O('right', 'left'));
    label('≈ 6 MONTHS LATER', pl.x + O(-40, 0), pl.y + O(24, -46), w * vis(t, wt(9, 'eclipse') + .6, t11, .5), 'rgba(255,200,120,.55)', 15, O('right', 'left'));
  }
  // --- hero moon
  if (t > t11 + 1) { const aR = P(t, t11 + 1.2, t11 + 1.7) * (1 - P(t, T.end - .2, T.end)), d = st.D;
    reticle(R.mo.x, R.mo.y, 30, t, 'MOON', t < tr0 || t >= tr1 ? 'DAY ' + (d >= 0 ? '+' : '−') + (Math.floor(Math.abs(d) * 10) / 10).toFixed(1).padStart(4, '0') : 'REWIND', aR, t >= tr1 && R.red > .5 ? COP : C.cyan2); }
  if (t > tr0 - .1 && t < tr1 + .5) label('◀◀  BACK TO AUG 12', W / 2, CYC + O(250, 330), vis(t, tr0 - .1, tr1 + .5, .15, .3), '#fff', 20);
  // --- eclipse events
  callout(R.e.x - R.sd.x * 0 - 10, R.e.y + R.re * .9, O(-170, -40), O(150, 210), 'SOLAR ECLIPSE', 'AUG 12 · MOON AT POINT 1', inD ? vis(t, tS, t15 + .4, .7, .4) : 0, AMB, O(undefined, 0));
  if (inD && t > tS - .1) glow(R.e.x, R.e.y, 160, 'rgba(255,220,150,.8)', (1 - P(t, tS, tS + .8)) * P(t, tS - .1, tS));
  callout(R.mo.x + 6, R.mo.y + R.rm + 4, O(120, -80), O(150, 230), 'LUNAR ECLIPSE', "AUG 28 · MOON AT POINT 2", inD ? vis(t, tLun, T.end + .3, .7, .3) : 0, COP, O(undefined, 0));
  if (inD && t > tL - .1) glow(R.mo.x, R.mo.y, 150, 'rgba(255,110,60,.8)', (1 - P(t, tL, tL + .9)) * P(t, tL - .1, tL));
  if (t > t11 + .6) label('◀ TO THE SUN', R.e.x + R.sd.x * O(640, 400), R.e.y + R.sd.y * O(640, 400) + O(-16, 84), close * P(t, t11 + 1.2, t11 + 1.7) * (1 - P(t, T.end - .3, T.end)), 'rgba(255,220,150,.9)', 17, 'center');
  hudWindow(t, st);
}

// ------------------------------------------------------------ scene 7: the pair, linked
function sceneEnd(t) {
  space(t, .6); const L = pairLayout(), tG = wt(17, 'guarantees'), a = P(t, T.end, T.end + .5);
  solarIcon(W / 2 - L.dx, L.y, L.R, a, 1, t); lunarIcon(W / 2 + L.dx, L.y, L.R, a, 1, t); iconLabels(L, a, a, true);
  const x0 = W / 2 - L.dx + L.R * 1.25, x1 = W / 2 + L.dx - L.R * 1.25, lp = seg(t, T.end + .5, tG);
  ctx.save(); ctx.strokeStyle = AMB; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.shadowColor = AMB; ctx.shadowBlur = 16 * P(t, tG, tG + .3);
  ctx.beginPath(); ctx.moveTo(x0, L.y); ctx.lineTo(lerp(x0, x1, lp), L.y); ctx.stroke(); ctx.restore();
  const al = P(t, T.end + 1.1, T.end + 1.6); ctx.globalAlpha = al; txt('ONE ECLIPSE SEASON', W / 2, L.y - 26, font(800, O(22, 17), F.m), AMB, 'center', O(3, 1)); txt('34-DAY WINDOW', W / 2, L.y + 40, font(600, O(16, 14), F.m), 'rgba(255,255,255,.8)', 'center', O(3, 1)); ctx.globalAlpha = 1;
  stamp(t, tG, W / 2, O(775, 1010), 'GUARANTEED', AMB, -.05, O(44, 50));
  const te = TL[17].e + .35, ae = P(t, te, te + .6); if (ae > 0) { ctx.globalAlpha = ae; const y = O(900, 1330) + 16 * (1 - E.o3(ae));
    txt('ECLIPSE SEASONS', W / 2, y, font(800, O(64, 58)), '#fff', 'center', O(12, 6)); ctx.fillStyle = C.cyan; const lw = O(420, 340) * E.o3(ae); ctx.fillRect(W / 2 - lw / 2, y + 26, lw, 2);
    txt('ONE WINDOW · TWO ECLIPSES', W / 2, y + 66, font(500, O(20, 18), F.m), C.cyan2, 'center', O(8, 5)); ctx.globalAlpha = 1; }
}

const fullMoons = [], newMoons = []; for (let k = -3; k <= 1; k++) { const a = tMiss + k * TM, b = a - TM / 2; if (a > T.tilt + .2 && a < T.cal - .3) fullMoons.push(a); if (b > T.tilt + .2 && b < T.cal - .3) newMoons.push(b); }
window.FILM = {
  title: 'ECLIPSE SEASONS', tag: 'SCHEMATIC · NOT TO SCALE', init: initFilm,
  hotLines: [4, 10, 15, 17],
  scenes: [{ start: 0, draw: sceneIntro }, { start: T.tilt, draw: sceneTilt }, { start: T.cal, draw: sceneCal }, { start: T.world, draw: sceneWorld }, { start: T.end, draw: sceneEnd }],
  xfades: [[T.tilt, .6], [T.cal, .6], [T.world, .6], [T.end, .7]],
  chapters: [[0, '00', 'THE PAIR'], [T.tilt, '01', 'A TILTED ORBIT'], [T.cal, '02', 'AUGUST 2026'], [T.world, '03', 'TWO CROSSING POINTS'], [t9 - .2, '04', 'ECLIPSE SEASON'], [t11 - .2, '05', "THE MOON'S HALF LAP"], [t13 - .2, '06', 'THE PAIR, EXPLAINED'], [T.end, '07', 'LINKED']],
  hits: [[tAl, 8, .4], [tS, 10, .5], [tL, 10, .5], [wt(17, 'guarantees'), 12, .45]],
  flashes: [],
  events: { scene: [T.tilt, T.cal, T.world, T.end], sunIcon: [wt(0, 'eclipses')], moonIcon: [wt(0, 'pairs')], question: [wt(1, 'links') + .4], miss: fullMoons.concat(newMoons).sort((a, b) => a - b), tilt: [wt(2, 'tilted')],
    cal12: [wt(4, 'august') - .1], cal28: [wt(5, 'lunar') + .1], hop0: [wt(5, 'followed')], node: [wt(6, 'two') - .1, wt(6, 'intersection') - .1], noEclipse: [tNo - .3], zoomOut: [t8 - .1], align: [tAl], arcs: [wt(9, 'window') - .2],
    count: [td0, td1], zoomIn: [t11], half: [th0, th1], rewind: [tr0, tr1], solar: [tS], travel: [t14, tL], still: [wt(15, 'still')], lunar: [tL], stamp: [wt(17, 'guarantees')], endcard: [TL[17].e + .35] },
};
