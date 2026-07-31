/* scene-rig.js — Milo + BoBo scene.
   Click the teddy: it springs up, BoBo crouches and jumps to meet it,
   headbutts it much higher, and it bounces back down to rest.
   Both dogs watch the toy the whole way.

   createScene(document.querySelector('#scene'))
*/

const CFG = {
  // --- geometry, all in scene (viewBox) units ---
  boboHeadPivot: [754, 580],
  ground: 777.6,             // BoBo's floor line, used as the squash origin
  headTop: [663.5, 423.8],   // skull top at rest — the arming reference
  teddyRest: [527, 794],
  teddyHalfH: 46,

  // --- toy physics (px per second) ---
  gravity: 2600,
  // The toy is lobbed toward BoBo and comes back down onto his skull at the
  // top of the rear. Rearing swings the head ~120px to the right, so the arc
  // has to travel — these three numbers are solved together, not guessed.
  // Solved against the drawn bobo-up frame: its skull top sits at (680.8, 362.1),
  // which is 61.7px up but only 17.3px across — so the arc is nearly vertical now.
  popUp: -1856,
  popDrift: 141,
  spikeUp: -1100,
  spikeDrift: -90,          // fallback only — normally solved per throw
  spinRate: 620,            // desired average spin, rounded to whole turns
  bounce: 0.42,              // energy kept per floor bounce
  restSpeed: 110,            // below this on a bounce, settle

  // --- BoBo's leap: drawn extremes, with squash carrying the in-betweens ---
  // Anticipation and landing are squashes about the floor line rather than
  // translations, so the planted paws never sink through it.
  leap: {
    delay: 520,
    anticMs: 170,     // neutral compresses
    downMs: 200,      // drops into the drawn crouch, then starts to unload
    launchMs: 110,    // still the crouch drawing, now pivoting off the rear paws
    riseMs: 90,       // contact frame travels into place — the strike lands here
    apexMs: 45,
    fallMs: 100,
    landMs: 240,

    rearPivot: [920, 735],   // where BoBo's rear paws meet the floor
    anticSquash: 0.955,
    landSquash: 0.90,

    // Every held drawing gets internal movement; the cuts happen mid-motion,
    // which is what stops it reading as two still frames.
    downDip: -16,            // crouch frame enters from above and settles
    pushLift: -18,           // then unloads upward before the launch
    launchLift: -40,
    launchRot: 11,           // degrees about the rear paws
    upEnter: [32, 18],       // lands exactly where the crouch frame left off
    headLag: 16,             // skull keeps rising after the body stops
    fallDrop: 55,
  },

  // --- gaze ---
  gaze: { headRot: 5, headX: 9, headY: 7, ease: 0.085 },
  pupil: { left: 5, right: 9, up: 4, down: 9, ease: 0.20 },
  miloEye: { range: 6, ease: 0.17 },
  miloHead: { rot: 4, ease: 0.07 },

  blink: { min: 2400, max: 6200, close: 95 },

  // --- Milo's head shake ---
  shake: {
    angle: 18,        // peak head rotation, degrees
    hz: 4.2,          // shakes per second — real dogs are 4–6
    decay: 0.48,      // longer damping gives Milo one extra full shake
    duration: 1650,
    // Springs are defined by natural frequency + damping ratio, not per-frame
    // coefficients — that keeps them identical at 60 and 120fps, and lets us
    // detune away from the 5.2Hz drive so nothing resonates.
    // Leads are large on purpose: a light plush and a floppy ear really do
    // swing past 80° when a dog shakes. Clamped so they can't wrap around.
    toyLead: 3.80, toyHz: 6.6, toyZeta: 0.16,   // above the drive: snaps and whips
    earLead: 4.20, earHz: 3.6, earZeta: 0.20,   // below the drive: lags and flings
    limit: 110,
    squint: 0.35,     // eyes squash to this at full shake
    swirlTilt: 0.42,  // the loop tilts WITH the head instead of tumbling
    swirlFade: 0.12,  // how fast the loop catches up to the shake intensity
    swirlStagger: 0.035,  // per-stroke delay so the loop scribbles itself on

    // hand-drawn smear frames swap in near the peaks; below poseLow we stay
    // on the rigged neutral head and let rotation do the work
    poseHigh: 9,      // |angle| above this → the full extreme drawing
    poseLow: 5,       // between the two, only while swinging back → recoil
    poseHold: 45,     // ms minimum, so a pose can't flicker for one frame

    // on the second swing to the right the toy lets go and sails off screen
    throwAt: 3,       // one extra back-and-forth before the toy is released
    throwVx: 1450, throwVy: -980, throwSpin: 900,
    throwGravity: 2200,
    returnAfter: 700, // ms after it leaves frame before it's back in the mouth
    toyFrontAt: 34,   // above this swing angle the toy passes in front of the muzzle
  },
};

export function createScene(svg, opts = {}) {
  const C = { ...CFG, ...opts };
  const $ = (id) => svg.querySelector('#' + id);

  const teddy = $('teddy');
  const boboAnim = $('bobo-anim');
  const boboPoses = [...svg.querySelectorAll('.bobo-pose')];
  const poseDown = $('bobo-pose-down');
  const poseUp = $('bobo-pose-up');
  const upHead = $('bobo-up-head');
  const RP = CFG.leap.rearPivot.join(' ');
  function setBobo(name) {
    const want = 'bobo-pose-' + name;
    boboPoses.forEach((el) => { el.style.display = el.id === want ? '' : 'none'; });
  }
  const boboHead = $('bobo-head');
  const pupils = [$('bobo-pupil-l'), $('bobo-pupil-r')].filter(Boolean);
  const boboEyes = [...svg.querySelectorAll('.dog-eye')];
  const miloHead = $('milo-head');
  const miloEyes = [$('milo-eye-a'), $('milo-eye-b')].filter(Boolean);
  const miloTail = $('milo-tail');
  const miloToy = $('milo-toy');
  const miloShake = $('milo-shake');
  const miloEars = [$('milo-ear-l'), $('milo-ear-r')].filter(Boolean);
  const swirls = [...svg.querySelectorAll('.milo-swirl')];
  const swirlPaths = [...svg.querySelectorAll('.milo-swirl path')];
  const poses = [...svg.querySelectorAll('.milo-pose')];
  const poseToys = [...svg.querySelectorAll('.pose-toy')];

  // The toy is drawn behind the head so the muzzle overlaps its hindquarters —
  // that's what makes it read as *held*. Only when it swings up past the snout
  // (or gets thrown) does it need to come forward, so we restack on demand.
  const miloHeadEl = $('milo-head');
  let toyInFront = false;
  function setToyDepth(front) {
    if (front === toyInFront || !miloToy || !miloHeadEl) return;
    toyInFront = front;
    const parent = miloHeadEl.parentNode;
    if (front) parent.insertBefore(miloToy, miloHeadEl.nextSibling);
    else parent.insertBefore(miloToy, miloHeadEl);
  }
  let swirlOn = 0;

  function setPose(name) {
    const want = 'milo-pose-' + name;
    poses.forEach((el) => { el.style.display = el.id === want ? '' : 'none'; });
  }
  const eyeC = miloEyes.map((e) => (e.getAttribute('data-c') || '0 0').split(/\s+/).map(Number));
  setPose('neutral');
  setBobo('neutral');

  boboEyes.forEach((e) => {
    e.style.transformBox = 'fill-box';
    e.style.transformOrigin = 'center';
  });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    && opts.reducedMotion !== 'off';

  // ---- state ----
  const toy = { x: 0, y: 0, vx: 0, vy: 0, rot: 0, vrot: 0, live: false, armed: false, hit: false };
  const bobo = { squash: 1, phase: 'idle', t0: 0 };
  let focus = null;                       // {x,y} in scene units, or null → cursor
  let gx = 0, gy = 0, tgx = 0, tgy = 0;   // gaze, -1..1
  let mgx = 0, mgy = 0;                   // milo gaze
  let lid = 1, lidT = 1, blinkAt = performance.now() + 1600;
  const shake = { t0: -1e9, ang: 0, prev: 0, toy: 0, toyV: 0, ear: 0, earV: 0,
                  pose: 'neutral', poseUntil: 0, peaks: 0 };
  const flight = { live: false, gone: false, x: 0, y: 0, vx: 0, vy: 0,
                   rot: 0, backAt: 0 };
  let raf = 0, last = 0, running = false;
  // The toy integrates on a fixed sub-step, identical to the one planFlight
  // uses. If the two disagreed, the solved landing would drift by ~12° at
  // 60fps and the snap would be visible.
  const FIXED = 1 / 240;
  let toyAcc = 0;

  const clamp = (v, m) => Math.max(-m, Math.min(m, v));

  // Fast-forward the remaining flight (including every bounce) and report how
  // much a unit of spin / drift would accumulate over it. That lets us solve
  // the exit velocities so the toy arrives home already upright and on its
  // mark — no visible correction after it lands.
  function planFlight(y0, vy0) {
    let y = y0, vy = vy0, t = 0;
    let kRot = 1, kX = 1, unitRot = 0, unitX = 0;
    const dt = 1 / 240;
    while (t < 8) {
      vy += C.gravity * dt; y += vy * dt; t += dt;
      unitRot += kRot * dt; unitX += kX * dt;
      if (y >= 0) {
        y = 0;
        if (Math.abs(vy) < C.restSpeed) break;
        vy = -vy * C.bounce; kRot *= 0.4; kX *= 0.55;
      }
    }
    return { unitRot: unitRot || 1e-6, unitX: unitX || 1e-6 };
  }

  function solveExit(y0, vy0, fromRot, fromX) {
    const { unitRot, unitX } = planFlight(y0, vy0);
    const turns = Math.max(1, Math.round((fromRot + C.spinRate * unitRot) / 360));
    return { vrot: (turns * 360 - fromRot) / unitRot, vx: -fromX / unitX };
  }

  // damped harmonic oscillator, integrated per real elapsed time
  function spring(o, key, target, hz, zeta, dt) {
    const w = 2 * Math.PI * hz;
    const vk = key + 'V';
    o[vk] += (-w * w * (o[key] - target) - 2 * zeta * w * o[vk]) * dt;
    o[key] += o[vk] * dt;
  }

  // ---- input ----
  function onPointer(e) {
    if (focus) return;
    const r = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const sx = vb.width / r.width, sy = vb.height / r.height;
    aimAt((e.clientX - r.left) * sx, (e.clientY - r.top) * sy);
  }

  function aimAt(x, y) {
    // BoBo: relative to its head pivot
    tgx = clamp((x - C.boboHeadPivot[0]) / 420, 1);
    tgy = clamp((y - C.boboHeadPivot[1]) / 340, 1);
    // Milo: its own head sits higher and further right
    mgx = clamp((x - 880) / 460, 1);
    mgy = clamp((y - 280) / 380, 1);
  }

  function launch() {
    if (toy.live || reduced) return;
    toy.live = true; toy.armed = false; toy.hit = false;
    toy.rot = 0; toy.x = 0; toy.y = 0;
    toy.vy = C.popUp; toy.vx = C.popDrift; toyAcc = 0;
    // planned for the un-struck case; re-solved at the strike if BoBo connects
    toy.vrot = solveExit(0, C.popUp, 0, -C.popDrift * 0.35).vrot;
    bobo.phase = 'wait'; bobo.t0 = performance.now() + C.leap.delay;
    svg.dispatchEvent(new CustomEvent('toy:launch'));
  }

  function shakeHead() {
    if (reduced) return;
    shake.t0 = performance.now();
    shake.peaks = 0;
    svg.dispatchEvent(new CustomEvent('milo:shake'));
  }

  const miloHit = $('hit-milo-head');
  [miloHit, miloToy].forEach((el) => el && el.addEventListener('pointerdown', (e) => {
    e.currentTarget.blur?.();
    shakeHead();
  }));
  if (miloHit) {
    miloHit.setAttribute('tabindex', '0');
    miloHit.setAttribute('role', 'button');
    miloHit.setAttribute('aria-label', 'Make Milo shake the toy');
    miloHit.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); shakeHead(); }
    });
  }

  teddy.addEventListener('pointerdown', (e) => {
    e.currentTarget.blur?.();
    launch();
  });
  teddy.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') launch(); });
  teddy.setAttribute('tabindex', '0');
  teddy.setAttribute('role', 'button');
  teddy.setAttribute('aria-label', 'Toss the toy');
  if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true });

  // ---- loop ----
  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;

    // --- toy ---
    if (toy.live) {
      toyAcc = Math.min(toyAcc + dt, 0.25);
      while (toy.live && toyAcc >= FIXED) {
        toyAcc -= FIXED;
        toy.vy += C.gravity * FIXED;
        toy.y += toy.vy * FIXED;
        toy.x += toy.vx * FIXED;
        toy.rot += toy.vrot * FIXED;

        // Arm once the toy has cleared BoBo's resting skull. The strike itself
        // fires on the frame the drawn contact pose appears — deterministic,
        // so a dropped frame can never make him swing through thin air.
        if (!toy.armed && C.teddyRest[1] + C.teddyHalfH + toy.y < C.headTop[1] - 24) {
          toy.armed = true;
        }

        if (toy.y >= 0) {                    // floor
          toy.y = 0;
          if (Math.abs(toy.vy) < C.restSpeed) {
            toy.live = false; toy.vy = 0; toy.vx = 0; toy.vrot = 0;
            toy.rot = Math.round(toy.rot / 360) * 360;   // residual is < 1°
            toy.x = 0;
            svg.dispatchEvent(new CustomEvent('toy:complete'));
          } else {
            toy.vy = -toy.vy * C.bounce;
            toy.vx *= 0.55;
            toy.vrot *= 0.4;
          }
        }
      }
      focus = { x: C.teddyRest[0] + toy.x, y: C.teddyRest[1] + toy.y };
      aimAt(focus.x, focus.y);
    } else if (focus) {
      focus = null;                          // already home and upright
    }

    teddy.setAttribute('transform',
      `translate(${toy.x.toFixed(2)} ${toy.y.toFixed(2)}) ` +
      `rotate(${toy.rot.toFixed(1)} ${C.teddyRest[0]} ${C.teddyRest[1]})`);

    // --- BoBo's leap ---
    const L = C.leap;
    const step = (ms) => Math.min(1, (now - bobo.t0) / ms);
    const outQ = (k) => 1 - (1 - k) * (1 - k);
    const inQ = (k) => k * k;

    if (bobo.phase === 'wait' && now >= bobo.t0) { bobo.phase = 'antic'; bobo.t0 = now; }

    if (bobo.phase === 'antic') {
      const e = outQ(step(L.anticMs));
      bobo.squash = 1 - (1 - L.anticSquash) * e;
      if (step(L.anticMs) >= 1) { bobo.phase = 'down'; bobo.t0 = now; setBobo('down'); bobo.squash = 1; }

    } else if (bobo.phase === 'down') {
      const k = step(L.downMs);
      // first 55% settling into the crouch, then unloading upward
      const ty = k < 0.55
        ? L.downDip * (1 - outQ(k / 0.55))
        : L.pushLift * inQ((k - 0.55) / 0.45);
      poseDown.setAttribute('transform', `translate(0 ${ty.toFixed(2)})`);
      if (k >= 1) { bobo.phase = 'launch'; bobo.t0 = now; }

    } else if (bobo.phase === 'launch') {
      const e = inQ(step(L.launchMs));
      const ty = L.pushLift + (L.launchLift - L.pushLift) * e;
      poseDown.setAttribute('transform',
        `translate(0 ${ty.toFixed(2)}) rotate(${(L.launchRot * e).toFixed(2)} ${RP})`);
      if (step(L.launchMs) >= 1) {
        bobo.phase = 'rise'; bobo.t0 = now; setBobo('up');
        poseDown.setAttribute('transform', 'translate(0 0)');
      }

    } else if (bobo.phase === 'rise') {
      const k = step(L.riseMs), e = outQ(k);
      poseUp.setAttribute('transform',
        `translate(${(L.upEnter[0] * (1 - e)).toFixed(2)} ${(L.upEnter[1] * (1 - e)).toFixed(2)})`);
      upHead && upHead.setAttribute('transform', `translate(0 ${(L.headLag * (1 - e)).toFixed(2)})`);
      if (k >= 1) {
        bobo.phase = 'apex'; bobo.t0 = now;
        if (toy.live && toy.armed && !toy.hit) {          // the strike
          toy.hit = true;
          toy.vy = C.spikeUp;
          const exit = solveExit(toy.y, C.spikeUp, toy.rot, toy.x);
          toy.vrot = exit.vrot;
          toy.vx = exit.vx;
          svg.dispatchEvent(new CustomEvent('toy:hit'));
        }
      }

    } else if (bobo.phase === 'apex') {
      // skull overshoots a few px and settles — follow-through off the strike
      const k = step(L.apexMs);
      upHead && upHead.setAttribute('transform',
        `translate(0 ${(-5 * Math.sin(k * Math.PI)).toFixed(2)})`);
      if (k >= 1) { bobo.phase = 'fall'; bobo.t0 = now; }

    } else if (bobo.phase === 'fall') {
      const e = inQ(step(L.fallMs));
      poseUp.setAttribute('transform', `translate(0 ${(L.fallDrop * e).toFixed(2)})`);
      if (step(L.fallMs) >= 1) {
        bobo.phase = 'land'; bobo.t0 = now; setBobo('neutral');
        poseUp.setAttribute('transform', 'translate(0 0)');
        upHead && upHead.setAttribute('transform', 'translate(0 0)');
      }

    } else if (bobo.phase === 'land') {
      const k = step(L.landMs);
      bobo.squash = 1 - (1 - L.landSquash) * Math.sin(k * Math.PI) * (1 - k * 0.35);
      if (k >= 1) { bobo.phase = 'idle'; bobo.squash = 1; }
    }

    boboAnim.style.transformBox = 'view-box';
    boboAnim.style.transformOrigin = `760px ${C.ground}px`;
    boboAnim.style.transform = `scale(${(2 - bobo.squash).toFixed(4)}, ${bobo.squash.toFixed(4)})`;

    // --- gaze ---
    gx += (tgx - gx) * C.gaze.ease;
    gy += (tgy - gy) * C.gaze.ease;
    boboHead.setAttribute('transform',
      `translate(${(gx * C.gaze.headX).toFixed(2)} ${(gy * C.gaze.headY).toFixed(2)}) ` +
      `rotate(${(gx * C.gaze.headRot).toFixed(2)} ${C.boboHeadPivot[0]} ${C.boboHeadPivot[1]})`);

    const px = gx < 0 ? gx * C.pupil.left : gx * C.pupil.right;
    const py = gy < 0 ? gy * C.pupil.up : gy * C.pupil.down;
    pupils.forEach((p) => p.setAttribute('transform', `translate(${px.toFixed(2)} ${py.toFixed(2)})`));

    // --- Milo's shake: damped oscillation, with the toy and ear whipping behind it ---
    const S = C.shake;
    const st = (now - shake.t0) / 1000;
    if (st >= 0 && st * 1000 < S.duration) {
      const env = Math.exp(-st / S.decay);
      shake.ang = S.angle * env * Math.sin(st * S.hz * Math.PI * 2);
    } else {
      shake.ang += (0 - shake.ang) * 0.2;
    }

    // The toy wants to keep hanging the way it was; the head yanks it around.
    // Spring toward the negated head angle so it lags, then overshoots.
    spring(shake, 'toy', -shake.ang * S.toyLead, S.toyHz, S.toyZeta, dt);
    spring(shake, 'ear', -shake.ang * S.earLead, S.earHz, S.earZeta, dt);
    shake.toy = clamp(shake.toy, S.limit);
    shake.ear = clamp(shake.ear, S.limit);

    // motion loop: fades in with the shake, spins slowly, lingers a beat after
    const inten = Math.min(1, Math.abs(shake.ang) / S.angle + Math.abs(shake.toy) / 90);
    swirlOn += (inten - swirlOn) * (inten > swirlOn ? 0.35 : S.swirlFade);
    if (swirlOn > 0.004) {
      const puff = 1 + 0.04 * Math.sin(now / 110);
      const tilt = shake.ang * S.swirlTilt;   // same direction as the head
      swirls.forEach((el) => {
        el.setAttribute('opacity', '1');
        el.setAttribute('transform',
          `rotate(${tilt.toFixed(2)} 881 260) translate(881 260) ` +
          `scale(${puff.toFixed(3)}) translate(-881 -260)`);
      });
      // strokes come in one after another, so the loop looks scribbled on
      swirlPaths.forEach((p, i) => {
        const lag = i * S.swirlStagger;
        const k = Math.max(0, (swirlOn - lag) / Math.max(0.001, 1 - lag));
        p.setAttribute('opacity', (Math.min(1, k) * 0.9).toFixed(3));
      });
    } else if (swirls.length && swirls[0].getAttribute('opacity') !== '0') {
      swirls.forEach((el) => el.setAttribute('opacity', '0'));
    }

    const shaking = Math.abs(shake.ang) + Math.abs(shake.toy);

    // Gaze and shake live on separate groups: the drawn smear frames are
    // already posed, so they must not inherit the shake rotation on top.
    if (miloHead) {
      miloHead.setAttribute('transform', `rotate(${(mgx * C.miloHead.rot).toFixed(2)} 836 345)`);
    }
    if (miloShake) {
      miloShake.setAttribute('transform', `rotate(${shake.ang.toFixed(2)} 836 345)`);
    }
    // --- the throw: released at the Nth swing to the right ---
    const vNow = (shake.ang - shake.prev) / Math.max(dt, 1e-4);
    if (shake.ang > 0 && vNow < 0 && shake.prevV >= 0) shake.peaks++;
    shake.prevV = vNow;
    if (!flight.gone && shake.peaks >= S.throwAt && Math.abs(shake.ang) > 1) {
      flight.live = true; flight.gone = true;
      flight.x = 0; flight.y = 0; flight.rot = shake.toy;
      flight.vx = S.throwVx; flight.vy = S.throwVy;
      poseToys.forEach((im) => { im.style.opacity = '0'; });
      svg.dispatchEvent(new CustomEvent('toy:thrown'));
    }

    if (flight.live) {
      flight.vy += S.throwGravity * dt;
      flight.x += flight.vx * dt;
      flight.y += flight.vy * dt;
      flight.rot += S.throwSpin * dt;
      const gone = 914.8 + flight.x > 1600 || 363.7 + flight.y < -240;
      if (gone) { flight.live = false; flight.backAt = now + S.returnAfter; }
    } else if (flight.gone && flight.backAt && now >= flight.backAt) {
      flight.gone = false; flight.backAt = 0; flight.x = flight.y = flight.rot = 0;
      poseToys.forEach((im) => { im.style.opacity = ''; });
      svg.dispatchEvent(new CustomEvent('milo:complete'));
    }

    if (miloToy) {
      const posed = shake.pose !== 'neutral';
      setToyDepth(flight.live || Math.abs(shake.toy) > S.toyFrontAt);
      if (flight.live) {
        miloToy.style.display = '';
        miloToy.setAttribute('transform',
          `translate(${flight.x.toFixed(1)} ${flight.y.toFixed(1)}) ` +
          `rotate(${flight.rot.toFixed(1)} 914.8 363.7)`);
      } else if (flight.gone) {
        miloToy.style.display = 'none';          // off screen, waiting to come back
      } else {
        // the toy hangs off the head, so it has to carry the head's rotation
        // itself now that it lives outside #milo-head
        miloToy.style.display = posed ? 'none' : '';
        miloToy.setAttribute('transform',
          `rotate(${(mgx * C.miloHead.rot + shake.ang).toFixed(2)} 836 345) ` +
          `rotate(${shake.toy.toFixed(2)} 914.8 363.7)`);
      }
    }
    miloEars.forEach((el) => {
      const pv = el.getAttribute('data-pivot') || '0 0';
      el.setAttribute('transform', `rotate(${shake.ear.toFixed(2)} ${pv})`);
    });

    // --- pick a drawn frame ---
    const angVel = (shake.ang - shake.prev) / Math.max(dt, 1e-4);
    shake.prev = shake.ang;
    const mag = Math.abs(shake.ang);
    let want = 'neutral';
    if (mag > S.poseHigh) want = shake.ang < 0 ? 'left' : 'right';
    else if (mag > S.poseLow && shake.ang * angVel < 0) {
      want = shake.ang < 0 ? 'left-recoil' : 'right-recoil';
    }
    if (want !== shake.pose && now >= shake.poseUntil) {
      shake.pose = want;
      shake.poseUntil = now + (want === 'neutral' ? 0 : S.poseHold);
      setPose(want);
    }

    // eyes squeeze shut while shaking, the way dogs actually do
    const sq = 1 - Math.min(1, shaking / S.angle) * (1 - S.squint);
    const mr = C.miloEye.range;
    miloEyes.forEach((e, i) => {
      const c = eyeC[i] || [0, 0];
      e.setAttribute('transform',
        `translate(${(mgx * mr).toFixed(2)} ${(mgy * mr * 0.7).toFixed(2)}) ` +
        `translate(${c[0]} ${c[1]}) scale(1 ${sq.toFixed(3)}) translate(${-c[0]} ${-c[1]})`);
    });

    if (miloTail) {
      const excited = toy.live || Math.abs(shake.ang) > 1;
      const wag = excited ? Math.sin(now / 90) * 7 : Math.sin(now / 700) * 1.5;
      miloTail.setAttribute('transform', `rotate(${wag.toFixed(2)} 500 380)`);
    }

    // --- blink ---
    if (now > blinkAt) {
      lidT = 0;
      setTimeout(() => { lidT = 1; }, C.blink.close);
      blinkAt = now + C.blink.min + Math.random() * (C.blink.max - C.blink.min);
    }
    lid += (lidT - lid) * 0.35;
    const s = Math.max(0.06, lid).toFixed(3);
    boboEyes.forEach((e) => { e.style.transform = `scaleY(${s})`; });

    raf = requestAnimationFrame(tick);
  }

  function start() { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(tick); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '150px' });
  io.observe(svg);
  start();

  return {
    launch,
    shakeHead,
    destroy() { stop(); io.disconnect(); window.removeEventListener('pointermove', onPointer); },
    state: () => ({ toy: { ...toy }, bobo: { ...bobo }, shake: { ...shake },
                    gaze: [+gx.toFixed(2), +gy.toFixed(2)] }),
  };
}
