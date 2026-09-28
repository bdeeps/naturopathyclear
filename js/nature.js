// Shared models and helpers for NaturopathyClear: a simple stylised person, element orbs, boards,
// and the three small physiology models the chapters drive (hydrotherapy heat exchange, the
// body's fuel during a fast, and blood-pressure effects of lifestyle habits from trials).
// Every number is cited next to the constant that uses it.
import { THREE, clamp, lerp } from './kit.js';

// ---------------------------------------------------------------- small helpers
const TINT = { gold: '#ffd166', good: '#6ee7a8', bad: '#ff8a8a', warn: '#ffb547', blue: '#9db4ff', cold: '#7fc4ff', hot: '#ff9a6a', purple: '#c9a7ff', muted: '#a8b0c0', leaf: '#9be08a', sky: '#8ef0ff' };
export function tint(l, cls) { const c = TINT[cls] || cls; if (c && c[0] === '#') { l.element.style.borderColor = c; l.element.style.color = c; } return l; }
export const inReel = () => document.body.classList.contains('gb-reel');
export const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const hex = (c) => '#' + c.toString(16).padStart(6, '0');

// On a phone-width stage the readout covers the upper left: re-centre once, unless orbited.
export function fitNarrow(stage, view) {
  let done = false;
  return () => {
    const narrow = stage.host.clientWidth < 560;
    if (narrow && !done && !stage.moved && !inReel()) { stage.setView(view.pos, view.target, 0.01); done = true; }
    return narrow;
  };
}
// On phones keep only the readout's headline and two rows.
export function compactReadout(stage, api) {
  const full = api.readout;
  if (!full) return api;
  api.readout = (s) => {
    const html = full(s);
    if (stage.host.clientWidth >= 560 || !html) return html;
    let rows = 0;
    return html.replace(/<small>[\s\S]*?<\/small>/g, '').replace(/<div style="[^"]*">[\s\S]*?<\/div>/g, '').replace(/<div class="row">[\s\S]*?<\/div>/g, (m) => (++rows <= 2 ? m : ''));
  };
  return api;
}

export function board(ct, w, h) {
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: ct.tex, transparent: true, toneMapped: false, side: THREE.DoubleSide, depthWrite: false }));
}
export function rrect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
export function panel(g, w, h, title, a = 0.9) {
  g.clearRect(0, 0, w, h); g.fillStyle = `rgba(10,12,18,${a})`; rrect(g, 0, 0, w, h, 20); g.fill();
  if (title) { g.fillStyle = '#e8ecf4'; g.font = '600 32px sans-serif'; g.fillText(title, 28, 50); }
}
export function wrap(g, text, x, y, maxW, lh) {
  const words = String(text).split(' '); let line = '';
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (g.measureText(t).width > maxW && line) { g.fillText(line, x, y); y += lh; line = w; } else line = t;
  }
  if (line) { g.fillText(line, x, y); y += lh; }
  return y;
}
export const glowMat = (c, ei = 0.45, op = 1) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.4, emissive: c, emissiveIntensity: ei, transparent: op < 1, opacity: op, depthWrite: op >= 1 });
export const skinMat = (o = {}) => new THREE.MeshPhysicalMaterial({ color: 0xb98a6a, roughness: 0.6, clearcoat: 0.2, transparent: true, opacity: 1, ...o });

const V = (p) => (p.isVector3 ? p.clone() : new THREE.Vector3(...p));
export function capsule(a, b, r, mat) {
  const A = V(a), B = V(b), len = Math.max(0.001, A.distanceTo(B));
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 16), mat);
  m.position.copy(A).add(B).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
  m.castShadow = true;
  return m;
}
export function blob(r, pos, mat, seg = 28) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7)), mat);
  m.scale.set(...r); m.position.set(...pos); m.castShadow = true;
  return m;
}

// ---------------------------------------------------------------- a stylised person
// An adult about 1.7 m tall, in metres, facing +z. Poses: stand, sit (on a stool or in a hip bath,
// thighs forward, shins down) and cross (sukhasana, cross-legged on the floor).
const POSES = {
  stand: { pelvis: 0.95, knee: (s) => [s * 0.1, 0.5, 0.02], ankle: (s) => [s * 0.1, 0.08, 0], toe: (s) => [s * 0.11, 0.03, 0.14], elbow: (s) => [s * 0.27, 1.14, 0.02], wrist: (s) => [s * 0.29, 0.88, 0.06] },
  sit: { pelvis: 0.5, knee: (s) => [s * 0.13, 0.52, 0.44], ankle: (s) => [s * 0.13, 0.09, 0.46], toe: (s) => [s * 0.13, 0.03, 0.6], elbow: (s) => [s * 0.26, 0.72, 0.1], wrist: (s) => [s * 0.2, 0.56, 0.34] },
  cross: { pelvis: 0.14, knee: (s) => [s * 0.36, 0.12, 0.2], ankle: (s) => [-s * 0.12, 0.08, 0.3], toe: (s) => [-s * 0.24, 0.07, 0.32], elbow: (s) => [s * 0.27, 0.36, 0.06], wrist: (s) => [s * 0.3, 0.16, 0.28] },
};
export function makePerson({ pose = 'stand', mat = skinMat(), cloth = 0x3f6fa8 } = {}) {
  const g = new THREE.Group(), P = POSES[pose], y0 = P.pelvis;
  const clothM = new THREE.MeshStandardMaterial({ color: cloth, roughness: 0.8, transparent: true, opacity: 1 });
  const parts = [];
  const add = (m) => { g.add(m); parts.push(m); return m; };
  // Head, neck, torso (proportions after a 1.7 m adult, trunk about 0.52 m hip to shoulder).
  const sh = y0 + 0.5;
  add(blob([0.1, 0.12, 0.11], [0, sh + 0.2, 0.01], mat));
  add(capsule([0, sh + 0.02, 0], [0, sh + 0.1, 0.01], 0.045, mat));
  add(blob([0.19, 0.27, 0.12], [0, y0 + 0.28, 0], clothM));
  add(blob([0.17, 0.11, 0.11], [0, y0 + 0.04, 0], clothM));
  for (const s of [-1, 1]) {
    const shoulder = [s * 0.2, sh - 0.03, 0];
    add(capsule(shoulder, P.elbow(s), 0.045, clothM));
    add(capsule(P.elbow(s), P.wrist(s), 0.038, mat));
    add(blob([0.04, 0.06, 0.025], P.wrist(s).map((v, i) => v + [0, -0.03, 0.02][i]), mat, 14));
    const hip = [s * 0.09, y0, 0.02];
    add(capsule(hip, P.knee(s), 0.068, clothM));
    add(capsule(P.knee(s), P.ankle(s), 0.052, mat));
    add(capsule(P.ankle(s), P.toe(s), 0.035, mat));
  }
  g.userData.parts = parts;
  g.setOpacity = (o) => { [mat, clothM].forEach((m) => { m.opacity = o; m.depthWrite = o > 0.95; }); };
  g.heights = { pelvis: y0, shoulder: sh, head: sh + 0.2, chest: y0 + 0.34, belly: y0 + 0.14 };
  return g;
}

// ---------------------------------------------------------------- the five elements
// As Indian naturopathy teaches them (pancha mahabhuta), each paired with therapies. After the
// Ministry of Ayush description of naturopathy, NIN Pune teaching material, and Gandhi's "Key to
// Health" (1942, published 1948), whose Part II has chapters on earth, water, akash, sun and air.
export const ELEMENTS = {
  akasha: { name: 'Akasha', en: 'space (ether)', col: 0xc9a7ff, css: '#c9a7ff', therapy: 'Fasting', how: 'Giving the gut "space" by eating nothing or only water, juice or light food for a set time.' },
  vayu: { name: 'Vayu', en: 'air', col: 0x8ef0ff, css: '#8ef0ff', therapy: 'Air baths and pranayama', how: 'Fresh air on bare skin, walks outdoors, and slow, controlled yoga breathing.' },
  agni: { name: 'Agni', en: 'fire (sun)', col: 0xff9a4c, css: '#ffa06a', therapy: 'Sun baths', how: 'Short spells of morning sunlight on the skin, sometimes through coloured glass or wet cloth.' },
  jala: { name: 'Jala', en: 'water', col: 0x5b9dff, css: '#8ab4ff', therapy: 'Hydrotherapy', how: 'Hip baths, foot baths, steam, wet packs and compresses, hot and cold.' },
  prithvi: { name: 'Prithvi', en: 'earth', col: 0xc8a060, css: '#e0bd7a', therapy: 'Mud therapy and diet', how: 'Cool mud packs on the belly, eyes or whole body, and plain, fresh, mostly raw or lightly cooked food.' },
};
export const EL_ORDER = ['akasha', 'vayu', 'agni', 'jala', 'prithvi'];

// A soft glowing orb with an inner core, used for elements.
export function orb(col, r = 0.18) {
  const g = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(r * 0.55, 24, 16), glowMat(col, 0.9));
  const halo = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.22, depthWrite: false }));
  g.add(core, halo); g.core = core; g.halo = halo;
  return g;
}

// ---------------------------------------------------------------- hydrotherapy heat exchange
// Heat flow from the body's core through the tissue shell into still water:
//   q = A · (Tcore − Twater) / (I_tissue + 1/h_water)
// h_water, still water, about 230 W/m²·K (Boutelier et al., Undersea Biomed Res 4:181, 1977;
// in moving water it is higher). Tissue insulation I_tissue about 0.1 m²·K/W with the skin
// vessels shut in cold water and about 0.03 with them wide open in warm water (Veicsteinas,
// Ferretti & Rennie, J Appl Physiol 53:1557, 1982; Toner & McArdle, Handbook of Physiology 1996).
// Local skin blood flow relative to a thermoneutral (about 34–35 °C) bath: cold drives it to a
// small fraction; local heating towards 42 °C raises it many-fold (Johnson & Kellogg, J Appl
// Physiol 109:1229, 2010; Charkoudian, Mayo Clin Proc 78:603, 2003). Body heat capacity about
// 3.47 kJ/kg·K; an adult of 65 kg (a typical Indian adult reference weight, ICMR-NIN 2020 RDA
// report) at rest makes about 100 W (ASHRAE Fundamentals, ch. 9), spread over about 1.7 m² of skin.
export const BATHS = {
  foot: { name: 'Foot bath', area: 0.13, note: 'feet and ankles, about 7% of the skin' },
  hip: { name: 'Hip bath', area: 0.4, note: 'hips, lower belly and upper thighs, about 23% of the skin' },
  full: { name: 'Full bath', area: 1.5, note: 'everything below the neck, about 88% of the skin' },
};
export const BODY = { mass: 65, cp: 3470, M: 100, area: 1.7, Tcore: 37 };
const H_WATER = 230;
export const insulation = (Tw) => (Tw <= 20 ? 0.1 : Tw >= 40 ? 0.03 : Tw <= 34 ? lerp(0.1, 0.05, (Tw - 20) / 14) : lerp(0.05, 0.03, (Tw - 34) / 6));
export const skinFlowRel = (Tw) => (Tw < 34 ? lerp(0.12, 1, clamp((Tw - 12) / 22, 0, 1) ** 1.6) : lerp(1, 7, clamp((Tw - 34) / 8, 0, 1) ** 1.3));
export function hydro(Tw, bath = 'hip', minutes = 10) {
  const A = BATHS[bath].area, I = insulation(Tw);
  const q = (A * (BODY.Tcore - Tw)) / (I + 1 / H_WATER);          // W out of the body into the water (negative = heat in)
  const Tskin = Tw + (q / A) / H_WATER;                             // skin sits just above (or below) the water
  const share = BODY.M * (A / BODY.area);                           // what that patch of skin loses in comfortable room air
  const net = share - q;                                            // extra gain (+) or loss (−) compared with sitting in room air
  const dT = (net * minutes * 60) / (BODY.mass * BODY.cp);          // °C, if nothing else compensated
  const state = Tw < 20 ? 'cold' : Tw < 30 ? 'cool' : Tw <= 36 ? 'neutral' : 'hot';
  return { A, I, q, Tskin, net, dT, flow: skinFlowRel(Tw), state, shock: bath === 'full' && Tw < 15 };
}

// ---------------------------------------------------------------- fuel during a water-only fast
// Healthy adult, from the last meal (hour 0):
//  - liver glycogen, about 100 g after a meal, mostly used within about a day (Rothman et al.,
//    Science 254:573, 1991: net breakdown about 4.3 g/h in the first 22 h);
//  - share of glucose output made new (gluconeogenesis): about 64% in the first 22 h, 82% over
//    the next 14 h and 96% over the 18 h after that (Rothman et al., Science 254:573, 1991);
//  - blood glucose drifts from about 90 to the mid-70s mg/dL over 3 days (Cahill, Annu Rev Nutr
//    26:1, 2006);
//  - β-hydroxybutyrate (a ketone) under 0.1 mmol/L overnight, about 1 to 2 mmol/L by day 3
//    (Cahill 2006; Owen et al.).
// Pregnancy: "accelerated starvation": after an overnight fast glucose runs lower and ketones rise
// much sooner (Metzger et al., Lancet 1:588, 1982; Freinkel). The model shifts the curves.
// Diabetes on insulin or sulfonylureas with no dose change: the medicine keeps pushing glucose
// down while no food comes in. The curve is ILLUSTRATIVE of that risk, not a prediction for any
// person. Hypoglycaemia: below 70 mg/dL (level 1), below 54 mg/dL (level 2) (ADA Standards of
// Care 2024, section 6; the same cut-offs appear in the RSSDI clinical practice recommendations).
export const PEOPLE = {
  healthy: { name: 'Healthy adult' },
  preg: { name: 'Pregnant' },
  insulin: { name: 'Diabetes, on insulin' },
};
export function fuel(h, who = 'healthy') {
  h = Math.max(0, h);
  const glycogen = 100 * Math.exp(-h / 16);
  const gng = h < 13 ? lerp(45, 64, h / 13) : h < 31 ? lerp(64, 82, (h - 13) / 18) : h < 52 ? lerp(82, 96, (h - 31) / 21) : 96;
  let G = 90 - 16 * (1 - Math.exp(-h / 28));
  let K = 0.05 + 2.2 / (1 + Math.exp(-(h - 62) / 13));
  if (who === 'preg') { G -= 12 * (1 - Math.exp(-h / 8)); K = 0.05 + 2.6 / (1 + Math.exp(-(h - 30) / 9)); }
  if (who === 'insulin') { G = 150 - 105 * (1 - Math.exp(-h / 20)); K = 0.05 + 0.25 * (1 - Math.exp(-h / 40)); }
  G = Math.max(G, 30);
  const status = G < 54 ? 'danger' : G < 70 ? 'low' : 'ok';
  return { glycogen, gng, G, K, status };
}

// ---------------------------------------------------------------- lifestyle and blood pressure
// Average fall in systolic blood pressure in trials of people with high blood pressure.
// These come from different trials; they do not simply add up.
export const HABITS = {
  none: { name: 'No change', dSBP: 0, cert: '', src: '' },
  aerobic: { name: 'Brisk exercise', dSBP: 8.3, cert: 'moderate', what: 'About 30 to 60 minutes of walking, cycling or swimming on most days', src: 'Cornelissen & Smart, J Am Heart Assoc 2:e004473, 2013 (people with high BP)' },
  salt: { name: 'Less salt', dSBP: 5.4, cert: 'high', what: 'About 4.4 g less salt a day, towards the ICMR-NIN limit of 5 g', src: 'He, Li & MacGregor, Cochrane Review CD004937, 2013' },
  diet: { name: 'Fruit, veg, pulses', dSBP: 11.4, cert: 'high', what: 'A DASH-style plate: lots of vegetables, fruit, pulses and low-fat dairy', src: 'Appel et al., N Engl J Med 336:1117, 1997 (hypertensive subgroup)' },
  weight: { name: 'Lose 5 kg', dSBP: 5.2, cert: 'moderate', what: 'About 1 mmHg lower for each kilogram lost', src: 'Neter et al., Hypertension 42:878, 2003' },
  yoga: { name: 'Yoga', dSBP: 4.2, cert: 'low', what: 'Postures, breathing and meditation; about 8 mmHg in studies using all three', src: 'Hagins et al., Evid Based Complement Alternat Med 2013:649836 (17 studies, all at unclear or high risk of bias)' },
};
