// Chapter 1: roots. From the water cure of the Silesian mountains to Gandhi's nature cure ashram
// at Urulikanchan and naturopathy in India today. Fourteen moments stand on a rail, evenly
// spaced (not to scale); the chosen one rises, glows and shows its card.
// Sources (see history.json for the full list):
//  - Priessnitz (1799–1851) turned his father's house at Gräfenberg (now Lázně Jeseník, Czechia)
//    into a water-cure spa in 1822; 1,500 patients came in 1839 (Wikipedia "Vincenz Priessnitz").
//  - Arnold Rikli's sun and air baths at Veldes (Bled, Slovenia) from 1855 (Wikipedia "Arnold Rikli").
//  - Kneipp, "Meine Wasserkur" (My Water Cure), 1886, Wörishofen (Wikipedia "Sebastian Kneipp").
//  - Louis Kuhne, "Die neue Heilwissenschaft" (The New Science of Healing), Leipzig, 1891; hip
//    and friction sitz baths in water of about 10–14 °C; one cause of disease, "foreign matter"
//    (Wikipedia "Louis Kuhne").
//  - Telugu translation of Kuhne by Dronamraju Venkatachalapathi Sarma, 1894; Hindi and Urdu 1904
//    (Ministry of Ayush, Ayush Next "Historical facts about Indian naturopathy"; ETV Bharat 2022).
//  - "Naturopathy": coined by John Scheel in 1895; Benedict Lust bought the name and used it for
//    his New York school and magazine from 1901–1902 (Wikipedia "Naturopathy", "Benedict Lust").
//  - Gandhi: wrote "Key to Health" in the Aga Khan Palace, 27 Aug to 18 Dec 1942; published 1948
//    by Navajivan (mkgandhi.org); earlier read Kuhne and Adolf Just (Autobiography, Part IV).
//    Satyalakshmi, "Mahatma Gandhi and nature cure", Indian J Med Res 149 (Suppl):S83, 2019.
//  - All India Nature Cure Foundation Trust, 18 Nov 1945, Gandhi founder-chairman for life; Dr
//    Dinshaw Mehta's Nature Cure Clinic, Pune, opened 1929; Gandhi stayed there in 1944 and 1945.
//  - Urulikanchan: Gandhi arrived 22 March 1946; Nisargopchar Gramsudhar Trust, 1 April 1946.
//  - CCRYN, registered 30 March 1978 (CCRYN; Ayush InfoHub). NIN Pune, 22 Dec 1986, at Bapu
//    Bhavan (Ministry of Ayush). Ministry of AYUSH, 9 Nov 2014. International Day of Yoga, UN
//    resolution 69/131 of 11 Dec 2014, first held 21 June 2015. Naturopathy Day, 18 Nov, first
//    observed 2018 (Ministry of Ayush).
import { THREE, M, canvasTexture, approach } from '../kit.js';
import { tint, compactReadout, inReel, board, panel, wrap, glowMat, capsule, hex, makePerson, rnd } from '../nature.js';

const TL = [
  { y: 1822, date: '1822', icon: 'drop', col: 0x5b9dff, title: 'The water cure', who: 'Vincenz Priessnitz', where: 'Gräfenberg, Silesia (now Czechia)', text: 'A farmer who healed his own broken ribs with wet bandages opens a spa of cold baths, wet wraps, fresh air and plain food. By 1839, 1,500 patients a year come.' },
  { y: 1855, date: '1855', icon: 'sun', col: 0xffb547, title: 'Sun and air baths', who: 'Arnold Rikli', where: 'Bled, Slovenia', text: 'A Swiss healer sends patients out in light clothing to sunbathe and walk in the mountain air: the "atmospheric cure".' },
  { y: 1886, date: '1886', icon: 'can', col: 0x8ab4ff, title: 'My Water Cure', who: 'Sebastian Kneipp', where: 'Wörishofen, Bavaria', text: 'A priest’s bestseller on cold affusions, walking barefoot in wet grass, herbs, exercise and simple food. Kneipp spas still exist in Germany.' },
  { y: 1891, date: '1891', icon: 'tub', col: 0x6ec9ff, title: 'One disease, one cure', who: 'Louis Kuhne', where: 'Leipzig, Germany', text: 'The New Science of Healing says all illness is one thing, "foreign matter" in the body, cleared by hip baths, steam and a raw vegetarian diet.' },
  { y: 1894, date: 'c. 1894', icon: 'book', col: 0xffd166, india: true, title: 'Kuhne in Telugu', who: 'D. Venkatachalapathi Sarma', where: 'Andhra region, India', text: 'Kuhne’s book is translated into Telugu, and into Hindi and Urdu in 1904. Nature cure spreads in Andhra, Bengal, Gujarat, Maharashtra and UP.' },
  { y: 1902, date: '1901–1902', icon: 'book', col: 0x9db4ff, title: 'The word "naturopathy"', who: 'Benedict Lust (word by John Scheel, 1895)', where: 'New York, USA', text: 'A Kneipp-trained German migrant runs a school and magazine under the new name. In America it later adds herbs, homeopathy and supplements.' },
  { y: 1942, date: '1942 (published 1948)', icon: 'wheel', col: 0xf2efe6, india: true, title: 'Key to Health', who: 'Mahatma Gandhi', where: 'Aga Khan Palace, Pune', text: 'Held in prison, Gandhi writes on food, air, water, earth, sun and akash. He had tried Kuhne’s baths and Adolf Just’s mud packs since his South Africa years.' },
  { y: 1945, date: '18 Nov 1945', icon: 'scroll', col: 0xe0bd7a, india: true, title: 'A trust for nature cure', who: 'Gandhi and Dr Dinshaw Mehta', where: 'Nature Cure Clinic, Pune', text: 'Gandhi becomes chairman for life of the All India Nature Cure Foundation Trust, "to make nature cure available to all". The date is now Naturopathy Day.' },
  { y: 1946, date: 'March 1946', icon: 'hut', col: 0x9be08a, india: true, title: 'A village nature cure ashram', who: 'Gandhi, later Manibhai Desai', where: 'Urulikanchan, near Pune', text: 'Gandhi opens nature cure to villagers: clean water, sanitation, diet, mud and water. The Nisargopchar Ashram still treats thousands a year.' },
  { y: 1978, date: '30 March 1978', icon: 'flask', col: 0x6ee7a8, india: true, title: 'A research council', who: 'Government of India', where: 'New Delhi', text: 'The CCRYN, the Central Council for Research in Yoga & Naturopathy, is set up to run and fund studies.' },
  { y: 1986, date: '22 Dec 1986', icon: 'building', col: 0xffa06a, india: true, title: 'National Institute of Naturopathy', who: 'Government of India', where: 'Bapu Bhavan, Pune', text: 'NIN opens in Dr Mehta’s old clinic, where Gandhi stayed. It trains therapists, treats patients and spreads nature cure.' },
  { y: 2014, date: '9 Nov 2014', icon: 'pillars', col: 0x6ee7a8, india: true, title: 'Ministry of AYUSH', who: 'Government of India', where: 'New Delhi', text: 'Yoga & Naturopathy is the "Y" and "N" of AYUSH. The BNYS degree takes 5½ years, including a 1-year internship.' },
  { y: 2015, date: '21 June 2015', icon: 'mat', col: 0xc9a7ff, india: true, title: 'International Day of Yoga', who: 'United Nations, proposed by India', where: 'Worldwide', text: 'The UN adopts India’s proposal in December 2014. Millions now do yoga together every 21 June.' },
  { y: 2018, date: '18 Nov 2018', icon: 'sun', col: 0xffd166, india: true, title: 'The first Naturopathy Day', who: 'Ministry of AYUSH', where: 'Across India', text: 'India marks 18 November, the day of Gandhi’s trust deed, as Naturopathy Day, with camps and talks on healthy living.' },
];
const GAP = 1.25, X0 = -((TL.length - 1) * GAP) / 2;
const xOf = (i) => X0 + i * GAP;

// ---------------------------------------------------------------- icons (small, about 0.5 m tall)
function icon(kind, col) {
  const g = new THREE.Group(), c = glowMat(col, 0.35), dark = M.matte(0x3a3f4c), wood = M.matte(0x7a4a2a), paper = M.matte(0xf1e6c8);
  if (kind === 'drop') {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 16), c); s.position.y = 0.2;
    const k = new THREE.Mesh(new THREE.ConeGeometry(0.139, 0.22, 24, 1, true), c); k.position.y = 0.37; g.add(s, k);
  } else if (kind === 'sun') {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 16), glowMat(col, 0.9)); s.position.y = 0.32; g.add(s);
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; const r = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.1, 0.03), glowMat(col, 0.9)); r.position.set(Math.cos(a) * 0.23, 0.32 + Math.sin(a) * 0.23, 0); r.rotation.z = a - Math.PI / 2; g.add(r); }
  } else if (kind === 'can') {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.26, 24), M.metal(0x8fa4b8)); b.position.y = 0.14;
    const sp = capsule([0.12, 0.12, 0], [0.33, 0.3, 0], 0.025, M.metal(0x8fa4b8));
    const h = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.018, 8, 24, Math.PI), M.metal(0x8fa4b8)); h.position.y = 0.27; h.rotation.y = Math.PI / 2;
    for (let i = 0; i < 5; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), c); d.position.set(0.36 + i * 0.02, 0.24 - i * 0.05, (i % 2 ? 1 : -1) * 0.02); g.add(d); }
    g.add(b, sp, h);
  } else if (kind === 'tub') {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.2, 0.2, 32, 1, true), M.metal(0xd8dde4, { side: THREE.DoubleSide })); t.position.y = 0.1;
    const bot = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), M.metal(0xd8dde4)); bot.rotation.x = -Math.PI / 2; bot.position.y = 0.005;
    const w = new THREE.Mesh(new THREE.CircleGeometry(0.245, 32), glowMat(col, 0.4, 0.8)); w.rotation.x = -Math.PI / 2; w.position.y = 0.17;
    const back = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.22, 32, 1, true, -Math.PI / 2, Math.PI), M.metal(0xd8dde4, { side: THREE.DoubleSide })); back.position.y = 0.31; back.rotation.y = Math.PI;
    g.add(t, bot, w, back);
  } else if (kind === 'book') {
    const a = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.4), c); a.position.set(-0.155, 0.3, 0); a.rotation.z = 0.25;
    const b = a.clone(); b.position.x = 0.155; b.rotation.z = -0.25;
    const pa = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.02, 0.37), paper); pa.position.set(-0.15, 0.33, 0); pa.rotation.z = 0.25;
    const pb = pa.clone(); pb.position.x = 0.15; pb.rotation.z = -0.25;
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.26, 10), dark); st.position.y = 0.13;
    g.add(a, b, pa, pb, st);
  } else if (kind === 'wheel') {
    // A spinning wheel (charkha) in outline: a wheel on a low frame, and the spindle.
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 0.16), wood); base.position.y = 0.02;
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.24, 0.04), wood); post.position.set(-0.12, 0.14, 0);
    const wh = new THREE.Group(); wh.position.set(-0.12, 0.28, 0.05);
    wh.add(new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.012, 8, 40), wood));
    for (let i = 0; i < 8; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.36, 0.008), wood); sp.rotation.z = (i / 8) * Math.PI; wh.add(sp); }
    const sp2 = capsule([0.14, 0.12, 0], [0.3, 0.12, 0], 0.01, M.metal());
    const thread = capsule([-0.1, 0.44, 0.05], [0.22, 0.12, 0], 0.003, M.glow(0xffffff));
    g.add(base, post, wh, sp2, thread); g.userData.spin = wh;
  } else if (kind === 'scroll') {
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.36), paper); sh.material.side = THREE.DoubleSide; sh.position.y = 0.3;
    const r1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 16), wood); r1.rotation.z = Math.PI / 2; r1.position.y = 0.49;
    const r2 = r1.clone(); r2.position.y = 0.11;
    for (let i = 0; i < 4; i++) { const l = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.012), M.glow(0x6a4a2a)); l.position.set(0, 0.4 - i * 0.06, 0.002); g.add(l); }
    const seal = new THREE.Mesh(new THREE.CircleGeometry(0.04, 20), M.glow(0xcc3333)); seal.position.set(0.1, 0.17, 0.003);
    g.add(sh, r1, r2, seal);
  } else if (kind === 'hut') {
    const w = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.26, 0.34), M.matte(0xe8dcc0)); w.position.y = 0.13;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.22, 4), M.matte(0xa0602e)); roof.position.y = 0.37; roof.rotation.y = Math.PI / 4;
    const door = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.16), dark); door.position.set(0, 0.08, 0.172);
    const tree = new THREE.Group(); tree.position.set(0.34, 0, 0.05);
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.3, 8), wood); tr.position.y = 0.15;
    const cr = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), M.matte(0x4f9a4a)); cr.position.y = 0.36; tree.add(tr, cr);
    g.add(w, roof, door, tree);
  } else if (kind === 'flask') {
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 16), M.clear(0xe6f6ff, 0.35)); f.position.y = 0.16;
    const liq = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55), glowMat(col, 0.6)); liq.position.y = 0.16;
    const n = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.2, 16, 1, true), M.clear(0xe6f6ff, 0.35)); n.position.y = 0.38;
    g.add(f, liq, n);
  } else if (kind === 'building') {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.26, 0.34), M.matte(0xefe6d6)); b.position.y = 0.13;
    const r = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.4), M.matte(0xa0602e)); r.position.y = 0.28;
    const up = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.26), M.matte(0xefe6d6)); up.position.y = 0.37;
    const r2 = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.1, 4), M.matte(0xa0602e)); r2.position.y = 0.49; r2.rotation.y = Math.PI / 4;
    for (let i = -2; i <= 2; i++) { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.1), glowMat(col, 0.5)); w.position.set(i * 0.12, 0.14, 0.171); g.add(w); }
    g.add(b, r, up, r2);
  } else if (kind === 'pillars') {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.3), M.matte(0xe9e4da)); base.position.y = 0.025;
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.05, 0.32), M.matte(0xe9e4da)); top.position.y = 0.35;
    const ped = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.12, 3), M.matte(0xe9e4da)); ped.rotation.x = Math.PI / 2; ped.rotation.z = Math.PI; ped.scale.set(1, 0.3, 1); ped.position.y = 0.42;
    for (let i = 0; i < 6; i++) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.28, 12), glowMat(col, 0.3)); p.position.set(-0.25 + i * 0.1, 0.19, 0); g.add(p); }
    g.add(base, top, ped);
  } else if (kind === 'mat') {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.015, 0.62), glowMat(col, 0.25)); m.position.y = 0.01;
    const p = makePerson({ pose: 'cross', cloth: 0x7a5ac0 }); p.scale.setScalar(0.42); p.position.set(0, 0.015, 0.05);
    g.add(m, p);
  }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

function drawCard(g, w, h, it, i) {
  panel(g, w, h, null, 0.92);
  const col = hex(it.col);
  g.fillStyle = col; g.fillRect(0, 26, 10, h - 52);
  g.font = '600 26px sans-serif'; g.fillStyle = col; g.fillText(it.date + (it.india ? '   ·   India' : ''), 34, 50);
  g.font = '600 40px sans-serif'; g.fillStyle = '#eef2f8'; g.fillText(it.title, 34, 100);
  g.font = '24px sans-serif'; g.fillStyle = 'rgba(232,238,248,.72)'; g.fillText(`${it.who} · ${it.where}`.slice(0, 64), 34, 140);
  g.font = '26px sans-serif'; g.fillStyle = 'rgba(232,238,248,.92)'; wrap(g, it.text, 34, 186, w - 64, 36);
  g.font = '20px sans-serif'; g.fillStyle = 'rgba(232,238,248,.45)'; g.fillText(`moment ${i + 1} of ${TL.length}`, 34, h - 22);
}

const VIEW_ALL = { pos: [1.2, 5.2, 13.5], target: [0.6, 0.9, 0] };
const NARROW_ALL = { pos: [0.4, 7, 20], target: [0.4, 0.9, 0] };
const isNarrow = (stage) => stage.host.clientWidth < 560 && !inReel();
const focusView = (i, narrow) => (inReel() ? { pos: [xOf(i) + 1.2, 1.6, 3.1], target: [xOf(i) + 1.2, 1.0, 0] } : narrow ? { pos: [xOf(i) + 0.75, 1.9, 4.0], target: [xOf(i) + 0.75, 0.95, 0] } : { pos: [xOf(i) + 0.2, 1.9, 4.9], target: [xOf(i) + 0.95, 1.2, 0] });

export default {
  id: 'roots',
  short: 'Roots',
  title: 'From a water cure to a village ashram',
  subtitle: 'European nature cure, Gandhi’s experiments, and naturopathy in India today.',
  view: VIEW_ALL,
  learn: `<p><b>Naturopathy</b>, or <b>nature cure</b>, treats illness without medicines. It uses <b>food, fasting, water, mud, sunlight, fresh air, massage and exercise</b>. In India it is the "N" in <b>AYUSH</b>, taught together with yoga as <b>Yoga & Naturopathy</b>. This box first explains it the way it explains itself. Chapters 4 and 5 then look, separately, at what scientific tests have found.</p>
    <p>Its roots are in 19th-century Europe. <b>Vincenz Priessnitz</b> ran a <b>water cure</b> in the Silesian mountains from 1822. The priest <b>Sebastian Kneipp</b> wrote <i>My Water Cure</i> (1886). <b>Louis Kuhne</b> of Leipzig taught that all illness has <b>one cause</b> and one cure (1891). In New York, <b>Benedict Lust</b> made the word <b>naturopathy</b> famous from about 1902.</p>
    <p>Kuhne’s book reached India fast: a <b>Telugu</b> translation appeared around <b>1894</b>. <b>Mahatma Gandhi</b> was its most famous follower. He tried hip baths and mud packs, wrote <i>Key to Health</i> in prison in 1942, and in <b>1946</b> opened a nature cure ashram for villagers at <b>Urulikanchan</b>, near Pune.</p>
    <p>Today India has a research council (<b>CCRYN</b>, 1978), the <b>National Institute of Naturopathy</b> in Pune (1986) in the house where Gandhi stayed, a 5½-year <b>BNYS</b> degree, and <b>Naturopathy Day</b> on <b>18 November</b>. Its sister systems have their own boxes: AyurvedaClear, SiddhaClear, UnaniClear, HomeopathyClear and MedicineClear.</p>
    <p class="tip"><b>Try it:</b> step through the moments one by one. Which ones happened in India? Then switch to the whole story.</p>`,
  terms: [
    { t: 'Naturopathy', d: 'A drug-free system of healing using diet, fasting, water, mud, sun, air, massage and exercise.' },
    { t: 'Nature cure', d: 'The older name for naturopathy, used by Gandhi and still common in India.' },
    { t: 'Hydrotherapy', d: 'Treatment with water at different temperatures: baths, packs, sprays and steam.' },
    { t: 'AYUSH', d: 'Ayurveda, Yoga & Naturopathy, Unani, Siddha, Sowa-Rigpa and Homoeopathy: India’s ministry for them since 2014.' },
    { t: 'BNYS', d: 'Bachelor of Naturopathy and Yogic Sciences: 4½ years of study plus a 1-year internship.' },
    { t: 'CCRYN', d: 'Central Council for Research in Yoga & Naturopathy, India’s research body for both, set up in 1978.' },
    { t: 'NIN Pune', d: 'The National Institute of Naturopathy, at Bapu Bhavan, Pune, since 1986.' },
  ],
  defaults: { i: 6, show: 'one', labels: true },
  controls: [
    { key: 'i', type: 'range', label: 'Step through time', min: 0, max: TL.length - 1, step: 1, ends: ['1822', '2018'], fmt: (v) => `${TL[Math.round(v)].date.split(' (')[0]}: ${TL[Math.round(v)].title}` },
    { key: 'show', type: 'seg', label: 'Camera', options: [{ v: 'one', label: 'Follow the moment' }, { v: 'all', label: 'Whole story' }] },
    { key: 'labels', type: 'toggle', label: 'Labels' },
  ],
  quiz: [
    { q: 'What does naturopathy use instead of medicines?', options: ['Surgery', 'Diet, fasting, water, mud, sun, air, massage and exercise', 'Very diluted remedies', 'Metal-based powders'], answer: 1, why: 'Nature cure is drug-free: it works with food, water, earth, sun, air and movement.' },
    { q: 'Where did Gandhi open a nature cure ashram for villagers in 1946?', options: ['Sabarmati', 'Urulikanchan, near Pune', 'Wardha', 'Leipzig'], answer: 1, why: 'Gandhi arrived at Urulikanchan in March 1946 to bring nature cure and village health to rural people.' },
    { q: 'Why is Naturopathy Day held on 18 November?', options: ['Kuhne’s birthday', 'Gandhi signed the All India Nature Cure Foundation Trust deed that day in 1945', 'The UN chose it', 'It is the shortest day'], answer: 1, why: 'On 18 November 1945 Gandhi became chairman for life of the trust, and AYUSH chose that date in 2018.' },
  ],
  reel: [
    { ms: 5200, caption: 'Naturopathy began as the "water cure" of 19th-century Europe: cold baths, fresh air and plain food.', set: { show: 'one', labels: false }, anim: { i: [0, 3] }, spin: 0 },
    { ms: 5400, caption: 'In India, Gandhi championed it and opened a nature cure ashram for villagers at Urulikanchan in 1946.', set: { show: 'one', labels: false }, anim: { i: [6, 8] }, spin: 0 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root);
    // The rail: a warm path of stone with a water channel along it.
    const rail = new THREE.Mesh(new THREE.BoxGeometry(TL.length * GAP + 0.6, 0.08, 1.1), M.matte(0x3a4152)); rail.position.y = 0.04; root.add(rail);
    const chan = new THREE.Mesh(new THREE.BoxGeometry(TL.length * GAP + 0.4, 0.02, 0.12), glowMat(0x5b9dff, 0.4, 0.8)); chan.position.set(0, 0.09, 0.5); root.add(chan);
    // The India section glows saffron-green beneath its moments.
    const firstIn = TL.findIndex((t) => t.india);
    const inBar = new THREE.Mesh(new THREE.BoxGeometry((TL.length - firstIn) * GAP, 0.02, 0.12), glowMat(0x9be08a, 0.45, 0.8)); inBar.position.set((xOf(firstIn) + xOf(TL.length - 1)) / 2, 0.09, -0.5); root.add(inBar);
    const L = (h, p, c, parent = root) => tint(stage.label(h, p, parent), c);
    const inLab = L('Moments in India', [xOf(firstIn) + 0.2, 0.1, -0.85], 'leaf');
    const items = TL.map((it, i) => {
      const g = new THREE.Group(); g.position.set(xOf(i), 0.08, 0); root.add(g);
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.1, 32), M.matte(0x4a5163)); plinth.position.y = 0.05; g.add(plinth);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.02, 8, 40), M.glow(it.col)); ring.rotation.x = Math.PI / 2; ring.position.y = 0.1; g.add(ring);
      const ic = icon(it.icon, it.col); ic.position.y = 0.1; g.add(ic);
      const yl = L(String(it.y), [0, -0.02, 0.62], it.india ? 'leaf' : 'muted', g);
      return { g, ic, ring, yl, lift: 0 };
    });
    // A card over the chosen moment.
    const st = { i: -1 };
    const ct = canvasTexture(900, 440, (g, w, h) => { if (st.i >= 0) drawCard(g, w, h, TL[st.i], st.i); });
    const card = board(ct, 2.6, 1.27); root.add(card);
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1, 6), M.ghost(0xffffff, 0.5)); root.add(pin);
    // Water drops trickle along the channel, left to right: the story flows from Europe to India.
    const ND = 40, drops = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 8, 6), M.glow(0x9fd0ff), ND); root.add(drops);
    const o = new THREE.Object3D();
    let cur = -1, t = 0, lastShow = null;
    return compactReadout(stage, {
      update(dt, s, time) {
        dt = Math.max(0, dt); t = time;
        const i = Math.round(s.i);
        if (i !== cur) {
          cur = i; st.i = i; ct.redraw();
          if (s.show === 'one' && (!stage.moved || inReel())) { const v = focusView(i, isNarrow(stage)); stage.setView(v.pos, v.target, inReel() ? 0.6 : 0.8); }
        }
        if (s.show !== lastShow) {
          const first = lastShow === null; lastShow = s.show;
          if (!first) { const v = s.show === 'all' ? (isNarrow(stage) ? NARROW_ALL : VIEW_ALL) : focusView(cur, isNarrow(stage)); stage.setView(v.pos, v.target, 0.9); }
          else if (s.show === 'one') { const v = focusView(cur, isNarrow(stage)); stage.setView(v.pos, v.target, 0.01); }
        }
        items.forEach((m, k) => {
          m.lift = approach(m.lift, k === i ? 1 : 0, 6, dt);
          m.ic.position.y = 0.1 + m.lift * 0.28;
          m.ic.rotation.y = k === i ? Math.sin(t * 0.8) * 0.5 : 0;
          m.ring.scale.setScalar(1 + m.lift * 0.25);
          m.ring.material.color.setHex(k === i ? 0xffffff : TL[k].col);
          if (m.ic.userData.spin) m.ic.userData.spin.rotation.z -= dt * (k === i ? 3 : 0.4);
        });
        const x = xOf(i);
        card.position.set(x + 1.45, 1.4, -0.6); card.lookAt(stage.camera.position.x, 1.4, stage.camera.position.z);
        pin.visible = false;
        for (let k = 0; k < ND; k++) {
          const u = (t * 0.06 + rnd(k)) % 1;
          o.position.set(-TL.length * GAP / 2 + u * TL.length * GAP, 0.12 + 0.01 * Math.sin(t * 4 + k), 0.5 + (rnd(k + 9) - 0.5) * 0.06); o.updateMatrix(); drops.setMatrixAt(k, o.matrix);
        }
        drops.instanceMatrix.needsUpdate = true;
        const narrow = isNarrow(stage), on = s.labels && !inReel();
        items.forEach((m, k) => { m.yl.visible = on && (!narrow || Math.abs(k - i) <= 1 || s.show === 'all'); });
        inLab.visible = on && !narrow;
      },
      readout: (s) => {
        const it = TL[Math.round(s.i)];
        return `<div class="big">${it.date.split(' (')[0]}</div>
          <div class="row"><span>Moment</span><b>${it.title}</b></div>
          <div class="row"><span>Who</span><b>${it.who}</b></div>
          <div class="row"><span>Where</span><b>${it.where}</b></div>
          <small>Evenly spaced moments, not to scale. Green: moments in India.</small>`;
      },
    });
  },
};
