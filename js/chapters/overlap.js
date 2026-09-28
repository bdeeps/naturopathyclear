// Chapter 4: where naturopathy and good science overlap. Much of nature cure is plain healthy
// living, and some of it has been tested. The model: a blood-pressure gauge and one bar per habit,
// each the average fall in systolic blood pressure in trials of people with high blood pressure
// (values and sources in js/nature.js, HABITS). They come from different trials and do not
// simply add up, so the model shows one at a time.
// Other sources:
//  - NFHS-5 (2019–21): elevated blood pressure in 24.0% of men and 21.3% of women aged 15+
//    (≥140/90 mmHg or on medicine; International Institute for Population Sciences, NFHS-5 India
//    Fact Sheet, Ministry of Health and Family Welfare, 2021).
//  - ICMR-NIN Dietary Guidelines for Indians, 2024 (National Institute of Nutrition, Hyderabad):
//    17 guidelines; added salt at most 5 g a day; limit sugar and ultra-processed food; about half
//    the plate vegetables and fruit; over half (about 56%) of India’s disease burden is linked to
//    unhealthy diets. (Note: this NIN is the National Institute of Nutrition, not the National
//    Institute of Naturopathy in Pune.)
//  - Yoga and chronic low back pain: Cochrane review of 21 trials, 2,223 people (Wieland et al.,
//    CD010671, 2022): versus no exercise, pain about 4.5 points lower on a 0–100 scale at 3 months
//    (moderate certainty), a small change; versus other back exercise, little or no difference.
//  - WHO 2020 physical activity guidelines: adults 150–300 min of moderate activity a week;
//    children and teens an average of 60 min a day.
//  - Hypertension threshold 140/90 mmHg (ICMR Standard Treatment Workflow; India Hypertension
//    Control Initiative).
import { THREE, M, clamp, approach, canvasTexture } from '../kit.js';
import { tint, fitNarrow, compactReadout, inReel, board, panel, wrap, glowMat, makePerson, HABITS } from '../nature.js';

const KEYS = ['aerobic', 'salt', 'diet', 'weight', 'yoga'];
const COLS = { aerobic: 0x6ee7a8, salt: 0x8ab4ff, diet: 0x9be08a, weight: 0xffd166, yoga: 0xc9a7ff };
const P0 = 80, P1 = 200, A0 = Math.PI * 1.25, A1 = -Math.PI * 0.25;
const ang = (p) => A0 + ((clamp(p, P0, P1) - P0) / (P1 - P0)) * (A1 - A0);

function drawDial(g, w, h) {
  g.clearRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2, R = w * 0.46;
  g.fillStyle = '#f4f1ea'; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill();
  const band = (p0, p1, c) => { g.strokeStyle = c; g.lineWidth = 22; g.beginPath(); g.arc(cx, cy, R * 0.86, -ang(p0), -ang(p1)); g.stroke(); };
  band(80, 120, '#4cc38a'); band(120, 140, '#f2c14e'); band(140, 200, '#e0645c');
  g.strokeStyle = '#222'; g.fillStyle = '#222'; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (let p = P0; p <= P1; p += 5) {
    const a = -ang(p), big = p % 20 === 0, r1 = R * 0.74, r2 = R * (big ? 0.64 : 0.69);
    g.lineWidth = big ? 5 : 2; g.beginPath(); g.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); g.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); g.stroke();
    if (big) { g.font = '600 34px sans-serif'; g.fillText(String(p), cx + Math.cos(a) * R * 0.52, cy + Math.sin(a) * R * 0.52); }
  }
  g.font = '600 30px sans-serif'; g.fillText('mmHg', cx, cy + R * 0.34);
  g.font = '24px sans-serif'; g.fillStyle = '#555'; g.fillText('systolic (top number)', cx, cy + R * 0.5);
}

function drawAgree(g, w, h) {
  panel(g, w, h, 'Where nature cure and science agree');
  const rows = [
    ['#6ee7a8', 'Move every day', 'WHO: adults 150–300 min a week; teens about 60 min a day.'],
    ['#9be08a', 'Mostly plants, less processed', 'ICMR-NIN 2024: half the plate vegetables and fruit, whole grains, pulses.'],
    ['#8ab4ff', 'Less salt and sugar', 'ICMR-NIN 2024: no more than 5 g of salt a day.'],
    ['#c9a7ff', 'Sleep and calm', 'Regular sleep; yoga and slow breathing ease stress for many.'],
    ['#ffd166', 'No tobacco, little or no alcohol', 'Naturopathy and medicine both say so.'],
  ];
  let y = 108;
  rows.forEach(([c, a, b]) => {
    g.fillStyle = c; g.fillRect(28, y - 24, 8, 56);
    g.font = '600 26px sans-serif'; g.fillText(a, 50, y);
    g.fillStyle = 'rgba(232,238,248,.8)'; g.font = '22px sans-serif'; y = wrap(g, b, 50, y + 30, w - 80, 27) + 20;
  });
}

export default {
  id: 'overlap',
  short: 'Good overlap',
  title: 'Where nature cure meets good science',
  subtitle: 'Exercise, less salt, a plant-rich plate, a healthy weight and yoga: what trials show.',
  view: { pos: [0.8, 1.8, 5.4], target: [0.85, 1.4, 0] },
  learn: `<p>A lot of naturopathy is <b>healthy living</b>, and here it agrees with modern medicine. Gandhi’s <i>Key to Health</i> asked for plain food, fresh air, clean water, exercise and no tobacco or alcohol. Doctors say much the same today.</p>
    <p>Take <b>high blood pressure</b>. The <b>NFHS-5</b> survey found it in about <b>24% of men and 21% of women</b> aged 15 and over in India. Large trials show that habits lower it: <b>brisk exercise</b> by about 8 mmHg on average, <b>eating less salt</b> by about 5, a <b>plate full of vegetables, fruit and pulses</b> by about 11, and <b>losing 5 kg</b> by about 5. <b>Yoga</b> helps by about 4, but the studies were small and many had weaknesses, so that number is less sure.</p>
    <p>India’s own food guide agrees. The <b>Dietary Guidelines for Indians (2024)</b> from ICMR’s <b>National Institute of Nutrition</b>, Hyderabad, say no more than <b>5 g of salt</b> a day, little sugar and ultra-processed food, and about half the plate as vegetables and fruit. For back pain, a <b>Cochrane review</b> of 21 trials found yoga gave a small improvement over no exercise, about the same as other back exercises. How food, breathing and muscles work is in DigestionClear, RespirationClear and MuscleClear.</p>
    <p>These are <b>averages</b> from different trials. They do not simply add up, and they add to medicine rather than replace it. If a doctor has prescribed blood-pressure tablets, <b>keep taking them</b>; healthy habits may one day let the doctor lower the dose.</p>
    <p class="tip"><b>Try it:</b> pick each habit and watch the needle. Which one lowers blood pressure most? Which one has the least certain evidence?</p>`,
  terms: [
    { t: 'Systolic pressure', d: 'The top number in a blood-pressure reading: the pressure when the heart pushes. High if 140 or more.' },
    { t: 'mmHg', d: 'Millimetres of mercury, the unit of blood pressure.' },
    { t: 'Meta-analysis', d: 'A study that pools the results of many trials to get one average answer.' },
    { t: 'Certainty of evidence', d: 'How sure reviewers are that an average effect is real, from high to very low.' },
    { t: 'DASH diet', d: 'A tested eating pattern rich in vegetables, fruit, pulses and low-fat dairy, and low in salt and sugar.' },
    { t: 'ICMR-NIN', d: 'The National Institute of Nutrition in Hyderabad, part of the Indian Council of Medical Research.' },
  ],
  defaults: { habit: 'aerobic', bp: 150, labels: true },
  controls: [
    { key: 'habit', type: 'seg', label: 'Habit', options: ['none', ...KEYS].map((k) => ({ v: k, label: HABITS[k].name })) },
    { key: 'bp', type: 'range', label: 'Starting blood pressure (top number)', min: 140, max: 170, step: 1, ends: ['140', '170'], fmt: (v) => Math.round(v) + ' mmHg' },
    { key: 'labels', type: 'toggle', label: 'Labels' },
  ],
  quiz: [
    { q: 'In the trials here, which change lowered blood pressure most on average?', options: ['Yoga', 'A plate rich in vegetables, fruit and pulses', 'Losing 1 kg', 'Drinking more water'], answer: 1, why: 'In the DASH trial, people with high blood pressure dropped about 11 mmHg systolic on that diet.' },
    { q: 'What is the most added salt a day in the ICMR-NIN 2024 guidelines?', options: ['1 g', '5 g', '15 g', 'No limit'], answer: 1, why: 'ICMR-NIN advises at most 5 g of added salt a day, and a taste for less salt from childhood.' },
    { q: 'Your doctor prescribed blood-pressure tablets and you start yoga. What should you do?', options: ['Stop the tablets at once', 'Keep taking them and tell your doctor about your new habits', 'Take half', 'Switch to fasting'], answer: 1, why: 'Habits add to medicine. Only your doctor should change the dose, after checking your readings.' },
  ],
  reel: [
    { ms: 5600, caption: 'Some of nature cure is solid: brisk exercise, less salt and a plant-rich plate lower blood pressure in trials.', set: { bp: 150, labels: false }, anim: { habit: ['aerobic', 'diet'] }, view: { pos: [1.1, 1.45, 3.7], target: [1.05, 1.0, 0] }, spin: 0.15 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root);
    const L = (h, p, c, parent = root) => tint(stage.label(h, p, parent), c);
    // The gauge: a round aneroid dial on a stand.
    const gauge = new THREE.Group(); gauge.position.set(0.35, 1.1, 0.1); gauge.scale.setScalar(0.85); root.add(gauge);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.12, 64), M.metal(0xc8ccd4)); rim.rotation.x = Math.PI / 2; gauge.add(rim);
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.68, 64), new THREE.MeshBasicMaterial({ map: canvasTexture(640, 640, drawDial).tex, toneMapped: false })); face.position.z = 0.062; gauge.add(face);
    const glass = new THREE.Mesh(new THREE.CircleGeometry(0.69, 64), M.clear(0xffffff, 0.08)); glass.position.z = 0.075; gauge.add(glass);
    const needle = new THREE.Group(); needle.position.z = 0.068; gauge.add(needle);
    const nd = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.022, 0.01), M.glow(0x202020)); nd.position.x = 0.24; needle.add(nd);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 20), M.metal(0x444444)); hub.rotation.x = Math.PI / 2; needle.add(hub);
    const ghost = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.012, 0.005), M.ghost(0xe0645c, 0.7)); ghost.position.x = 0.23; const ghostG = new THREE.Group(); ghostG.position.z = 0.066; ghostG.add(ghost); gauge.add(ghostG);
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.5, 12), M.metal(0x8a9099)); stand.position.set(0.35, 0.25, 0.05); root.add(stand);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.04, 32), M.metal(0x8a9099)); foot.position.set(0.35, 0.02, 0.05); root.add(foot);
    // A tube and cuff to a person, sitting as for a proper reading.
    const person = makePerson({ pose: 'sit', cloth: 0x4a7a5a }); person.position.set(-0.75, 0, 0.1); person.rotation.y = 0.5; root.add(person);
    const chair = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), M.matte(0x6a4a3a)); chair.position.set(-0.75, 0.21, 0.05); chair.rotation.y = 0.5; root.add(chair);
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.14, 20), M.matte(0x2a3a5a)); cuff.position.set(-0.48, 0.83, 0.07); cuff.rotation.z = 0.1; root.add(cuff);
    const tubeC = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.45, 0.83, 0.1), new THREE.Vector3(-0.2, 0.4, 0.3), new THREE.Vector3(0.15, 0.4, 0.2), new THREE.Vector3(0.35, 0.5, 0.1)]);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(tubeC, 40, 0.012, 8), M.matte(0x222222)));
    // Bars: one per habit, height = average fall in systolic pressure.
    const bars = KEYS.map((k, i) => {
      const h = HABITS[k].dSBP * 0.07;
      const x = 1.25 + i * 0.34;
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.24, h, 0.24), glowMat(COLS[k], 0.2, 0.9)); m.position.set(x, h / 2, 0.4); root.add(m);
      const lab = L(`${HABITS[k].name}: −${HABITS[k].dSBP.toFixed(0)}`, [x, h + 0.14 + (i % 2) * 0.2, 0.4], '#' + COLS[k].toString(16));
      return { k, m, lab, g: 0 };
    });
    const bt = L('Average fall in systolic pressure, mmHg', [1.93, -0.08, 0.75], 'muted');
    const agree = board(canvasTexture(700, 640, drawAgree), 1.6, 1.46); agree.position.set(2.05, 2.35, -1.1); agree.rotation.y = -0.3; root.add(agree);
    let cur = 150, t = 0;
    const fit = fitNarrow(stage, { pos: [0.9, 1.9, 4.3], target: [0.9, 1.45, 0] });
    return compactReadout(stage, {
      update(dt, s, time) {
        dt = Math.max(0, dt); t = time;
        const h = HABITS[s.habit] || HABITS.none;
        cur = approach(cur, s.bp - h.dSBP, 2.5, dt);
        needle.rotation.z = ang(cur) + Math.sin(t * 7) * 0.004;
        ghostG.rotation.z = ang(s.bp);
        ghostG.visible = h.dSBP > 0;
        bars.forEach((b) => { b.g = approach(b.g, b.k === s.habit ? 1 : 0, 6, dt); b.m.material.emissiveIntensity = 0.15 + b.g * 0.8; b.m.scale.x = b.m.scale.z = 1 + b.g * 0.25; });
        cuff.scale.set(1 + 0.05 * Math.max(0, Math.sin(t * 1.2)), 1, 1 + 0.05 * Math.max(0, Math.sin(t * 1.2)));
        const narrow = fit(), on = s.labels && !inReel();
        bars.forEach((b) => { b.lab.visible = on && (!narrow || b.k === s.habit); });
        bt.visible = on && !narrow;
      },
      readout: (s) => {
        const h = HABITS[s.habit] || HABITS.none;
        if (!h.dSBP) return `<div class="big">Start: ${Math.round(s.bp)} mmHg</div><div class="row"><span>Pick a habit</span><b>to see what trials found</b></div><small>Averages from trials in people with high blood pressure.</small>`;
        const certCol = h.cert === 'high' ? 'var(--good)' : h.cert === 'moderate' ? '#ffd166' : '#ff8a8a';
        return `<div class="big">About −${h.dSBP.toFixed(0)} mmHg on average</div>
          <div class="row"><span>${h.name}</span><b>${Math.round(s.bp)} → ${Math.round(s.bp - h.dSBP)} mmHg</b></div>
          <div class="row"><span>How sure</span><b style="color:${certCol}">${h.cert}</b></div>
          <div style="color:var(--text);font-size:13px;margin:4px 0">${h.what}.</div>
          <div style="color:var(--muted);font-size:12px">${h.src}</div>
          <small>Averages from separate trials of people with high BP; they don’t simply add up. Never stop BP medicine on your own.</small>`;
      },
    });
  },
};
