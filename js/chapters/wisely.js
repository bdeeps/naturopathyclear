// Chapter 6: using it wisely. A 24-hour day as a ring: sleep, active time and meals, checked
// against guidelines, with a board of signs that mean "see a qualified doctor".
// Guidelines:
//  - Sleep: teens 13–18 years 8–10 h; adults 7 h or more (American Academy of Sleep Medicine
//    consensus, Paruthi et al., J Clin Sleep Med 12:785, 2016; Watson et al., Sleep 38:843, 2015).
//  - Activity: teens an average of 60 min a day of moderate-to-vigorous activity; adults 150–300
//    min a week (WHO Guidelines on physical activity and sedentary behaviour, 2020). The ICMR-NIN
//    Dietary Guidelines for Indians (2024) also ask for regular physical activity.
//  - Vegetables and fruit: at least 400 g a day, about five 80 g portions (WHO healthy diet fact
//    sheet); ICMR-NIN 2024 "My Plate" makes vegetables and fruit about half the plate.
//  - Red flags (general advice, not diagnosis): chest pain, stroke signs (FAST), breathlessness,
//    fever over 3 days, blood in vomit or stool, fainting, a cough of 2 weeks or more (TB test, as
//    India's National TB Elimination Programme advises), low-sugar symptoms in diabetes.
import { THREE, M, clamp, approach, canvasTexture } from '../kit.js';
import { tint, fitNarrow, compactReadout, inReel, board, panel, wrap, glowMat, makePerson } from '../nature.js';

const AGE = {
  teen: { name: 'Teenager (13–18)', sleep: [8, 10], act: 60, actText: '60 min a day' },
  adult: { name: 'Adult', sleep: [7, 9], act: 22, actText: '150 min a week (about 22 a day)' },
};
function drawDoctor(g, w, h) {
  panel(g, w, h, 'See a qualified doctor');
  const rows = [
    ['#ff8a8a', 'Straight away', 'Chest pain, sudden weakness or a drooping face, hard breathing, fainting, blood in vomit or stool.'],
    ['#ffb547', 'Soon', 'Fever over 3 days, a cough of 2 weeks or more, weight loss without trying, a lump that grows.'],
    ['#ffd166', 'Never on your own', 'Stop or change insulin, blood-pressure, heart, TB, epilepsy or any prescribed medicine.'],
    ['#9db4ff', 'Before a fast', 'If you have diabetes, are pregnant, are a child, or have kidney or heart disease.'],
    ['#6ee7a8', 'Ask', 'Is this practitioner qualified (BNYS, MBBS)? Is there a fair test for this treatment?'],
  ];
  let y = 100;
  rows.forEach(([c, a, b]) => {
    g.fillStyle = c; g.fillRect(28, y - 24, 8, 58);
    g.font = '600 26px sans-serif'; g.fillText(a, 50, y);
    g.fillStyle = 'rgba(232,238,248,.82)'; g.font = '22px sans-serif'; y = wrap(g, b, 50, y + 30, w - 80, 27) + 18;
  });
}
// Ring geometry: a flat arc between hours a and b (0–24, clockwise from the top, like a clock).
function arc(a, b, r0, r1, h, mat) {
  const sh = new THREE.Shape(), n = 48, A = (x) => Math.PI / 2 - (x / 24) * Math.PI * 2;
  for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n; const p = [Math.cos(A(x)) * r1, Math.sin(A(x)) * r1]; i ? sh.lineTo(...p) : sh.moveTo(...p); }
  for (let i = n; i >= 0; i--) { const x = a + ((b - a) * i) / n; sh.lineTo(Math.cos(A(x)) * r0, Math.sin(A(x)) * r0); }
  const g = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: false });
  g.rotateX(-Math.PI / 2);
  return new THREE.Mesh(g, mat);
}
const hourPos = (x, r, y = 0.1) => { const A = Math.PI / 2 - (x / 24) * Math.PI * 2; return [Math.cos(A) * r, y, -Math.sin(A) * r]; };

export default {
  id: 'wisely',
  short: 'Using it wisely',
  title: 'Healthy habits, and when to see a doctor',
  subtitle: 'Keep the good parts of nature cure, check the claims, and never drop your medicines.',
  view: { pos: [0.45, 2.8, 4.8], target: [0.6, 0.85, 0] },
  learn: `<p>The best parts of nature cure are things anyone can do, and they match what doctors advise: <b>sleep</b> enough, <b>move</b> every day, eat <b>plenty of vegetables, fruit, pulses and whole grains</b>, go easy on salt, sugar and fried or packaged food, get some <b>fresh air and daylight</b>, and find time to <b>calm down</b>, through yoga, prayer, a walk or a chat.</p>
    <p>Use naturopathy <b>alongside</b> modern medicine, never instead of it for serious illness. Choose a <b>qualified</b> practitioner, such as a BNYS graduate at a recognised centre, and tell both your naturopath and your doctor about everything you take and do. <b>Never stop</b> insulin, blood-pressure or any prescribed medicine without your doctor. Fast only if you are a healthy adult, keep drinking water, stop if you feel faint, and ask a doctor first if you have diabetes, are pregnant, or are a child.</p>
    <p>Some signs mean <b>see a qualified doctor now</b>: chest pain, sudden weakness or a drooping face, trouble breathing, fainting, or blood in vomit or stool. A cough of two weeks or more needs a TB test, which is free in India.</p>
    <p>Nature cure has a real place in India’s health culture. Gandhi’s ashram at Urulikanchan, NIN Pune and hundreds of centres keep alive an idea worth keeping: that <b>daily habits</b> shape health. Honest science helps sort out which parts work, so families can keep those and stay safe.</p>
    <p class="tip"><b>Try it:</b> set your own sleep, activity and vegetables for a normal day. How many ticks do you get? Switch between teenager and adult.</p>`,
  terms: [
    { t: 'Guideline', d: 'Advice written by experts after weighing all the evidence, like the WHO’s activity guidelines.' },
    { t: 'Moderate activity', d: 'Movement that makes you breathe harder but still talk: brisk walking, cycling, dancing.' },
    { t: 'Portion', d: 'A standard serving; for vegetables and fruit, about 80 g, a small bowl or one medium fruit.' },
    { t: 'Red flag', d: 'A warning sign that needs a doctor quickly, whatever other treatment you use.' },
    { t: 'Integrative care', d: 'Using a traditional therapy alongside modern medicine, with both practitioners informed.' },
  ],
  defaults: { age: 'teen', sleep: 7, act: 30, veg: 3, labels: true },
  controls: [
    { key: 'age', type: 'seg', label: 'Who', options: Object.entries(AGE).map(([v, a]) => ({ v, label: a.name })) },
    { key: 'sleep', type: 'range', label: 'Sleep a night', min: 4, max: 11, step: 0.5, ends: ['4 h', '11 h'], fmt: (v) => v.toFixed(1) + ' h' },
    { key: 'act', type: 'range', label: 'Active minutes a day', min: 0, max: 120, step: 5, ends: ['0', '2 h'], fmt: (v) => Math.round(v) + ' min' },
    { key: 'veg', type: 'range', label: 'Vegetable and fruit portions (80 g each)', min: 0, max: 8, step: 1, ends: ['0', '8'], fmt: (v) => `${v} (${v * 80} g)` },
    { key: 'labels', type: 'toggle', label: 'Labels' },
  ],
  quiz: [
    { q: 'You have high blood pressure and start nature cure. What about your tablets?', options: ['Stop them', 'Keep taking them and tell your doctor', 'Swap them for a fast', 'Take them only on weekends'], answer: 1, why: 'Never stop prescribed medicines on your own. Only your doctor can safely change them.' },
    { q: 'How much sleep do teenagers need?', options: ['5 to 6 hours', '8 to 10 hours', '12 to 14 hours', 'It does not matter'], answer: 1, why: 'Sleep experts advise 8 to 10 hours a night for 13 to 18 year olds.' },
    { q: 'Which of these means see a doctor straight away?', options: ['Feeling hungry on a fast', 'Chest pain or sudden weakness on one side', 'A mild cold', 'Tired after exercise'], answer: 1, why: 'Chest pain and stroke signs are emergencies. Get medical help at once.' },
  ],
  reel: [
    { ms: 5600, caption: 'Keep the good habits, check the claims, and never stop prescribed medicines: see a qualified doctor.', set: { age: 'teen', veg: 5, labels: false }, anim: { sleep: [6, 9], act: [10, 60] }, view: { pos: [-0.3, 2.4, 2.6], target: [-0.3, 0.45, 0] }, spin: 0.25 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); root.position.set(-0.3, 0, 0.2); stage.root.add(root);
    const L = (h, p, c, parent = root) => tint(stage.label(h, p, parent), c);
    const R0 = 0.95, R1 = 1.35;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(R1 + 0.08, R1 + 0.12, 0.06, 96), M.matte(0x2a2f3c)); base.position.y = 0.03; root.add(base);
    const face = new THREE.Mesh(new THREE.CylinderGeometry(R0 - 0.02, R0 - 0.02, 0.07, 64), M.matte(0x353b4a)); face.position.y = 0.035; root.add(face);
    for (let hh = 0; hh < 24; hh++) { const tk = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.02, hh % 6 ? 0.06 : 0.14), M.glow(0x9aa3b5)); const p = hourPos(hh, R1 + 0.05, 0.07); tk.position.set(...p); tk.rotation.y = (hh / 24) * Math.PI * 2; root.add(tk); }
    ['midnight', '6 am', 'noon', '6 pm'].forEach((n, i) => L(n, hourPos(i * 6, R1 + 0.32, 0.08), 'muted'));
    const person = makePerson({ pose: 'stand', cloth: 0x3f7a6a }); person.scale.setScalar(0.62); person.position.y = 0.07; root.add(person);
    const segs = new THREE.Group(); root.add(segs);
    const mats = { sleep: glowMat(0x6a78ff, 0.45), act: glowMat(0x6ee7a8, 0.55), meal: glowMat(0xffd166, 0.5), day: glowMat(0xffb547, 0.12, 0.35), rest: glowMat(0x4a5163, 0.05, 0.6) };
    const labs = { sleep: L('', [0, 0, 0], '#9aa6ff'), act: L('', [0, 0, 0], 'good'), meal: L('Meals', hourPos(13, R1 + 0.2, 0.3), 'gold') };
    const sun = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), M.glow(0xffd166)); root.add(sun);
    const doc = board(canvasTexture(720, 780, drawDoctor), 1.5, 1.62); doc.position.set(2.35, 1.0, -0.4); doc.rotation.y = -0.3; stage.root.add(doc);
    let key = '', t = 0;
    const rebuild = (s) => {
      segs.children.forEach((c) => c.geometry.dispose()); segs.clear();
      const wake = 6.5, bed = (wake - s.sleep + 24) % 24;
      const add = (a, b, r0, r1, h, m) => { if (b < a) { segs.add(arc(a, 24, r0, r1, h, m)); if (b > 0) segs.add(arc(0, b, r0, r1, h, m)); } else segs.add(arc(a, b, r0, r1, h, m)); };
      add(bed, wake, R0, R1, 0.12, mats.sleep);
      add(wake, bed, R0, R1, 0.05, mats.rest);
      const actH = s.act / 60;
      if (actH > 0) add(17, 17 + actH, R0 + 0.05, R1 - 0.05, 0.22, mats.act);
      [8, 13, 20].forEach((m) => add(m, m + 0.5, R0 + 0.1, R1 - 0.1, 0.16 + 0.02 * s.veg, mats.meal));
      const mid = (bed + (s.sleep / 2)) % 24;
      labs.sleep.position.set(...hourPos(mid, R1 + 0.2, 0.3)); labs.sleep.element.innerHTML = `Sleep ${s.sleep.toFixed(1)} h`;
      labs.act.position.set(...hourPos(17 + actH / 2, R1 + 0.25, 0.4)); labs.act.element.innerHTML = `Active ${Math.round(s.act)} min`;
    };
    const fit = fitNarrow(stage, { pos: [-0.3, 3.2, 3.4], target: [-0.3, 0.95, 0] });
    return compactReadout(stage, {
      update(dt, s, time) {
        dt = Math.max(0, dt); t = time;
        const k = `${s.sleep.toFixed(1)}|${Math.round(s.act)}|${s.veg}`;
        if (k !== key) { key = k; rebuild(s); }
        const hr = (t * 1.2) % 24;
        sun.position.set(...hourPos(hr, R1 + 0.12, 0.35));
        sun.material.color.setHex(hr > 6.5 && hr < 18.5 ? 0xffd166 : 0x9aa6ff);
        person.rotation.y = Math.sin(t * 0.4) * 0.4;
        const narrow = fit(), on = s.labels && !inReel();
        Object.values(labs).forEach((l) => { l.visible = on && !narrow; });
        labs.act.visible = labs.act.visible && s.act > 0;
      },
      readout: (s) => {
        const a = AGE[s.age] || AGE.teen;
        const okS = s.sleep >= a.sleep[0] && s.sleep <= a.sleep[1] + 1, okA = s.act >= a.act, okV = s.veg >= 5;
        const n = [okS, okA, okV].filter(Boolean).length;
        const tick = (ok) => `<span class="${ok ? 'ok' : 'no'}">${ok ? '✓' : '✗'}</span>`;
        return `<div class="big">${n} of 3 healthy-day ticks</div>
          <div class="row"><span>${tick(okS)} Sleep (${a.sleep[0]}–${a.sleep[1]} h advised)</span><b>${s.sleep.toFixed(1)} h</b></div>
          <div class="row"><span>${tick(okA)} Active (${a.actText})</span><b>${Math.round(s.act)} min</b></div>
          <div class="row"><span>${tick(okV)} Veg and fruit (400 g or more)</span><b>${s.veg * 80} g</b></div>
          <small>Guides from WHO, ICMR-NIN (2024) and sleep experts. Habits add to medicine; they never replace a doctor’s care.</small>`;
      },
    });
  },
};
