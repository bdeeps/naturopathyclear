// Chapter 5: what the evidence says, and the risks. The working model is a water-only fast:
// the liver's glycogen runs down, the liver makes new glucose, fat turns into ketones, and blood
// sugar holds steady in a healthy adult. Switch the person to "pregnant" (accelerated starvation)
// or "diabetes on insulin" (an ILLUSTRATIVE curve of what happens if doses are not changed) to see
// why fasting is not safe for everyone. The fuel model and its sources are in js/nature.js (fuel()).
// Other sources:
//  - "Detox": the kidneys filter about 180 L of plasma a day (GFR about 125 mL/min) and the liver
//    receives about 1.5 L of blood a minute, about a quarter of the heart's output (Guyton & Hall,
//    14th ed., ch. 27 and 71). A critical review found no randomised trials showing that commercial
//    detox diets remove toxins (Klein & Kiat, J Hum Nutr Diet 28:675, 2015).
//  - Naturopathy abroad: in the USA and Canada, some naturopaths have opposed vaccination; in
//    Washington State, children who saw a naturopath were less likely to be fully immunised (Downey
//    et al., Am J Public Health 100:1729, 2010; Wikipedia "Naturopathy"). WHO: immunisation
//    prevents 3.5–5 million deaths a year (WHO fact sheet "Immunization coverage", 2024).
//    India's Universal Immunisation Programme gives free vaccines against 12 diseases, reaching
//    about 2.6 crore newborns a year (MoHFW / PIB, 2023–24).
//  - Fair tests: randomised, controlled, blinded where possible; the placebo effect makes an
//    untested treatment look better than it is (see MedicineClear's trial simulator).
import { THREE, M, clamp, approach, canvasTexture } from '../kit.js';
import { tint, fitNarrow, compactReadout, inReel, board, panel, wrap, makePerson, skinMat, fuel, PEOPLE, rnd, blob } from '../nature.js';

const H1 = 72;
function drawChart(g, w, h, st) {
  panel(g, w, h, `A water-only fast: ${PEOPLE[st.who].name.toLowerCase()}`);
  const L = 90, R = w - 90, T = 90, B = h - 80;
  const X = (hr) => L + (hr / H1) * (R - L), YG = (v) => B - ((v - 30) / (160 - 30)) * (B - T), YK = (v) => B - (v / 3) * (B - T);
  // hypoglycaemia bands
  g.fillStyle = 'rgba(255,120,110,.14)'; g.fillRect(L, YG(70), R - L, YG(30) - YG(70));
  g.fillStyle = 'rgba(255,90,90,.22)'; g.fillRect(L, YG(54), R - L, YG(30) - YG(54));
  g.fillStyle = 'rgba(255,160,150,.9)'; g.font = '20px sans-serif'; g.fillText('below 70: low sugar', L + 8, YG(70) + 22);
  g.strokeStyle = 'rgba(255,255,255,.2)'; g.lineWidth = 1;
  for (let hr = 0; hr <= H1; hr += 12) { g.beginPath(); g.moveTo(X(hr), T); g.lineTo(X(hr), B); g.stroke(); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillText(hr + ' h', X(hr) - 14, B + 28); }
  const line = (f, Y, col) => { g.strokeStyle = col; g.lineWidth = 5; g.beginPath(); for (let hr = 0; hr <= H1; hr += 0.5) { const y = Y(f(hr)); hr ? g.lineTo(X(hr), y) : g.moveTo(X(hr), y); } g.stroke(); };
  line((hr) => fuel(hr, st.who).G, YG, '#ffffff');
  line((hr) => fuel(hr, st.who).K, YK, '#c9a7ff');
  g.font = '20px sans-serif'; g.fillStyle = '#fff'; g.fillText('blood sugar, mg/dL', L, T - 14);
  g.fillStyle = '#c9a7ff'; g.textAlign = 'right'; g.fillText('ketones, mmol/L', R, T - 14); g.textAlign = 'left';
  g.fillStyle = 'rgba(255,255,255,.7)';
  [40, 70, 100, 130, 160].forEach((v) => g.fillText(String(v), 30, YG(v) + 7));
  g.fillStyle = '#c9a7ff'; [0, 1, 2, 3].forEach((v) => g.fillText(String(v), R + 16, YK(v) + 7));
  const f = fuel(st.h, st.who), x = X(st.h);
  g.strokeStyle = '#ffd166'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, T); g.lineTo(x, B); g.stroke();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(x, YG(f.G), 9, 0, 7); g.fill();
  g.fillStyle = '#c9a7ff'; g.beginPath(); g.arc(x, YK(f.K), 9, 0, 7); g.fill();
  g.fillStyle = 'rgba(255,255,255,.5)'; g.font = '18px sans-serif';
  g.fillText(st.who === 'insulin' ? 'Illustrative: if insulin doses are not changed. Never fast on insulin without your doctor.' : 'After Cahill 2006, Rothman 1991' + (st.who === 'preg' ? ', Metzger 1982' : ''), L, h - 22);
}
function drawDetox(g, w, h) {
  panel(g, w, h, '"Detox"? You already have it');
  const rows = [
    ['#8ab4ff', 'Kidneys', 'Filter about 180 litres of blood plasma a day and send the waste out in urine (KidneyClear).'],
    ['#e0bd7a', 'Liver', 'Gets about 1.5 litres of blood a minute and breaks down drugs, alcohol and old blood cells (LiverClear).'],
    ['#8ef0ff', 'Lungs', 'Breathe out the carbon dioxide your cells make, roughly half a kilogram to a kilogram a day.'],
    ['#ff8a8a', 'The evidence', 'A 2015 review found no good trials showing that detox diets remove any toxin.'],
  ];
  let y = 100;
  rows.forEach(([c, a, b]) => {
    g.fillStyle = c; g.fillRect(28, y - 24, 8, 56);
    g.font = '600 26px sans-serif'; g.fillText(a, 50, y);
    g.fillStyle = 'rgba(232,238,248,.8)'; g.font = '22px sans-serif'; y = wrap(g, b, 50, y + 30, w - 80, 27) + 20;
  });
}
const STATUS = { ok: ['Blood sugar held steady', '#6ee7a8'], low: ['Low blood sugar: shaky, sweaty, confused', '#ffb547'], danger: ['Dangerously low: can cause fainting or fits', '#ff8a8a'] };

export default {
  id: 'evidence',
  short: 'Evidence and risks',
  title: 'What fair tests say, and who should not fast',
  subtitle: 'Fasting physiology, the "detox" idea, and the real risks of stopping medicines.',
  view: { pos: [0.35, 1.8, 3.7], target: [0.55, 1.55, 0] },
  learn: `<p>How do we know if a therapy works? People often feel better anyway: illnesses come and go, and believing in a treatment helps too, the <b>placebo effect</b>. So scientists use <b>fair tests</b>: people are split at random, one group gets the treatment and one does not, and ideally nobody knows who got what. MedicineClear lets you run one.</p>
    <p>For naturopathy, fair tests are still few. Most Indian studies of mud packs, hip baths and nature cure programmes are <b>small and short</b>, often without a proper comparison group. Parts that are healthy living, like exercise and diet, do well (chapter 4). The <b>"toxin" idea does not</b>: your <b>kidneys</b> filter about 180 litres of plasma a day and your <b>liver</b> clears drugs and waste all the time (see KidneyClear and LiverClear), and a 2015 review found no good trials showing that detox diets remove any toxin.</p>
    <p><b>Fasting</b> is the best-understood therapy. In a healthy adult the liver’s store of sugar, <b>glycogen</b>, runs low within about a day. The liver then <b>makes new glucose</b>, and fat is turned into <b>ketones</b>, a second fuel for the brain. Blood sugar stays steady. But for someone on <b>insulin</b> or some diabetes tablets, not eating can drop blood sugar dangerously low. In <b>pregnancy</b>, sugar falls and ketones rise much sooner, something doctors try to avoid. Children, the elderly, and people with eating disorders or kidney disease should not fast without a doctor.</p>
    <p>The biggest risk is <b>stopping medicines</b>. Never stop insulin, blood-pressure, heart, epilepsy, TB or other prescribed medicines for any therapy. Abroad, some naturopaths have opposed <b>vaccines</b>; Indian naturopathy is mostly about lifestyle, and no nature cure replaces a vaccine. The WHO says vaccines save <b>3.5 to 5 million lives a year</b>, and India’s free Universal Immunisation Programme protects against 12 diseases.</p>
    <p class="tip"><b>Try it:</b> fast a healthy adult for 72 hours and watch sugar hold while ketones climb. Then switch to "diabetes, on insulin" and "pregnant".</p>`,
  terms: [
    { t: 'Placebo effect', d: 'Feeling better because you expect to, even from a treatment with no active effect.' },
    { t: 'Randomised controlled trial', d: 'A fair test: people are split by chance into a treatment group and a comparison group.' },
    { t: 'Glycogen', d: 'The body’s short-term store of sugar, in the liver and muscles.' },
    { t: 'Gluconeogenesis', d: 'The liver making new glucose from other building blocks during a fast.' },
    { t: 'Ketones', d: 'Fuels made from fat by the liver when food is scarce; the brain can use them.' },
    { t: 'Hypoglycaemia', d: 'Low blood sugar, below about 70 mg/dL: shaking, sweating, confusion, and at worst fits or coma.' },
  ],
  defaults: { h: 24, who: 'healthy', labels: true },
  controls: [
    { key: 'h', type: 'range', label: 'Hours since the last meal (water only)', min: 0, max: H1, step: 0.5, ends: ['0 h', '72 h'], fmt: (v) => Math.round(v) + ' h' },
    { key: 'who', type: 'seg', label: 'Who is fasting', options: Object.entries(PEOPLE).map(([v, p]) => ({ v, label: p.name })) },
    { key: 'labels', type: 'toggle', label: 'Labels' },
  ],
  quiz: [
    { q: 'Why can a healthy adult keep blood sugar steady during a fast?', options: ['Sugar is stored in the bones', 'The liver uses glycogen, then makes new glucose, while fat becomes ketones', 'The body stops using energy', 'Water contains sugar'], answer: 1, why: 'Glycogen covers roughly the first day; then gluconeogenesis and ketones take over.' },
    { q: 'Who is most at risk of dangerous low blood sugar if they fast?', options: ['A healthy teenager for 12 hours', 'Someone on insulin whose dose is not changed', 'Someone drinking water', 'Nobody'], answer: 1, why: 'Insulin keeps pushing sugar down even when no food comes in. Only a doctor should adjust it.' },
    { q: 'What do the kidneys and liver have to do with "detox"?', options: ['Nothing', 'They already clear waste and drugs from the blood all day', 'They store toxins until a fast', 'They only work during baths'], answer: 1, why: 'The kidneys filter about 180 L of plasma a day and the liver breaks down drugs and waste. No detox diet has been shown to do better.' },
  ],
  reel: [
    { ms: 5400, caption: 'In a fast, the liver’s sugar store runs low within about a day, and fat turns into ketones.', set: { who: 'healthy', labels: false }, anim: { h: [0, 72] }, view: { pos: [0.45, 1.45, 1.8], target: [0.45, 1.3, 0] }, spin: 0.15 },
    { ms: 5400, caption: 'On insulin, not eating can crash blood sugar: never fast or stop medicines without your doctor.', set: { who: 'insulin', labels: false }, anim: { h: [0, 48] }, view: { pos: [0.65, 1.55, 1.8], target: [0.6, 1.4, 0] }, spin: 0 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root);
    const L = (h, p, c, parent = root) => tint(stage.label(h, p, parent), c);
    const person = makePerson({ pose: 'stand', mat: skinMat({ opacity: 0.35 }), cloth: 0x8a8f9a }); person.setOpacity(0.28); root.add(person);
    // Organs: liver with its glycogen, belly fat, brain.
    const liver = blob([0.13, 0.07, 0.08], [-0.07, 1.2, 0.02], new THREE.MeshStandardMaterial({ color: 0x8a3a2a, roughness: 0.5 })); root.add(liver);
    const gly = blob([0.1, 0.05, 0.06], [-0.07, 1.2, 0.04], new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe9a0, emissiveIntensity: 0.8, transparent: true, opacity: 0.8 })); root.add(gly);
    const fat = blob([0.2, 0.12, 0.12], [0, 1.02, 0.02], new THREE.MeshStandardMaterial({ color: 0xf2d27a, roughness: 0.6, emissive: 0xc9a7ff, emissiveIntensity: 0, transparent: true, opacity: 0.5, depthWrite: false })); root.add(fat);
    const brain = blob([0.08, 0.07, 0.09], [0, 1.66, 0.01], new THREE.MeshStandardMaterial({ color: 0xe8a0b0, emissive: 0xc9a7ff, emissiveIntensity: 0.1 })); root.add(brain);
    // A loop of blood vessel with glucose (white) and ketones (purple) riding in it.
    const path = new THREE.CatmullRomCurve3([[0.02, 1.62, 0.02], [0.08, 1.4, 0.1], [0.1, 1.15, 0.12], [0.02, 1.0, 0.12], [-0.08, 1.12, 0.1], [-0.1, 1.35, 0.1], [-0.04, 1.58, 0.05]].map((p) => new THREE.Vector3(...p)), true);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(path, 120, 0.018, 8, true), new THREE.MeshStandardMaterial({ color: 0xd04040, transparent: true, opacity: 0.45, depthWrite: false })));
    const NG = 40, NK = 40;
    const glu = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.014), M.glow(0xffffff), NG); glu.frustumCulled = false; root.add(glu);
    const ket = new THREE.InstancedMesh(new THREE.TetrahedronGeometry(0.016), M.glow(0xb58cff), NK); ket.frustumCulled = false; root.add(ket);
    const st = { h: -1, who: '' };
    const chart = canvasTexture(900, 620, (g, w, h) => { if (st.who) drawChart(g, w, h, st); });
    const cb = board(chart, 1.5, 1.03); cb.position.set(1.0, 2.0, -0.2); cb.rotation.y = -0.25; root.add(cb);
    const db = board(canvasTexture(700, 600, drawDetox), 1.2, 1.03); db.position.set(1.05, 1.05, -0.3); db.rotation.y = -0.25; db.scale.setScalar(0.8); root.add(db);
    const labs = {
      liver: L('Liver: glycogen store', [-0.35, 1.08, 0.15], 'gold'),
      fat: L('Fat → ketones', [0.3, 0.9, 0.15], '#e0bd7a'),
      brain: L('Brain: glucose, then ketones too', [-0.42, 1.5, 0.1], 'purple'),
    };
    const o3 = new THREE.Object3D(), pt = new THREE.Vector3();
    let t = 0, gShow = 1, kShow = 0;
    const fit = fitNarrow(stage, { pos: [0.5, 1.45, 2.7], target: [0.5, 1.3, 0] });
    return compactReadout(stage, {
      update(dt, s, time) {
        dt = Math.max(0, dt); t = time;
        const who = PEOPLE[s.who] ? s.who : 'healthy';
        const f = fuel(s.h, who);
        if (Math.abs(st.h - s.h) > 0.2 || st.who !== who) { st.h = s.h; st.who = who; chart.redraw(); }
        const gk = f.glycogen / 100;
        gly.scale.set(0.1 * (0.15 + 0.85 * gk), 0.05 * (0.2 + 0.8 * gk), 0.06 * (0.15 + 0.85 * gk));
        gly.material.opacity = 0.2 + 0.7 * gk;
        // Fat use: about 150 g a day in a resting adult (Cahill 2006); shown a little exaggerated.
        fat.scale.set(0.2 - s.h * 0.0004, 0.12 - s.h * 0.0003, 0.12 - s.h * 0.0003);
        fat.material.emissiveIntensity = clamp(f.K / 2.5, 0, 0.6);
        brain.material.emissiveIntensity = 0.1 + clamp(f.K / 2.5, 0, 0.8);
        gShow = approach(gShow, clamp((f.G - 30) / 120, 0.05, 1), 3, dt);
        kShow = approach(kShow, clamp(f.K / 2.5, 0, 1), 3, dt);
        const ng = Math.round(gShow * NG), nk = Math.round(kShow * NK);
        const place = (mesh, n, N, off) => {
          for (let i = 0; i < N; i++) {
            if (i >= n) o3.position.set(0, -50, 0);
            else { path.getPointAt((t * 0.08 + i / N + off) % 1, pt); o3.position.copy(pt).add(new THREE.Vector3((rnd(i) - 0.5) * 0.02, (rnd(i + 1) - 0.5) * 0.02, (rnd(i + 2) - 0.5) * 0.02)); }
            o3.rotation.set(t + i, t * 0.7, 0); o3.updateMatrix(); mesh.setMatrixAt(i, o3.matrix);
          }
          mesh.instanceMatrix.needsUpdate = true;
        };
        place(glu, ng, NG, 0); place(ket, nk, NK, 0.013);
        const narrow = fit(), on = s.labels && !inReel();
        Object.values(labs).forEach((l) => { l.visible = on && !narrow; });
      },
      readout: (s) => {
        const who = PEOPLE[s.who] ? s.who : 'healthy';
        const f = fuel(s.h, who), [txt, col] = STATUS[f.status];
        return `<div class="big" style="color:${col}">${txt}</div>
          <div class="row"><span>Hours without food</span><b>${Math.round(s.h)} h</b></div>
          <div class="row"><span>Blood sugar</span><b>${Math.round(f.G)} mg/dL (${(f.G / 18).toFixed(1)} mmol/L)</b></div>
          <div class="row"><span>Ketones</span><b>${f.K.toFixed(1)} mmol/L</b></div>
          <div class="row"><span>Sugar left in the liver</span><b>about ${Math.round(f.glycogen)} g</b></div>
          <div class="row"><span>Glucose made new by the liver</span><b>${who === 'insulin' ? 'held back by insulin' : 'about ' + Math.round(f.gng) + '%'}</b></div>
          <small>${who === 'insulin' ? 'Illustrative curve, not a prediction for anyone. Talk to your doctor before any fast.' : 'Typical values from fasting studies. Real people vary.'}</small>`;
      },
    });
  },
};
