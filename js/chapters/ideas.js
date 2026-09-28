// Chapter 2: the ideas, as naturopathy describes them. A person sits cross-legged inside a ring
// of the five elements (pancha mahabhuta). Each element is paired with its therapies, following
// Indian naturopathy teaching (Ministry of Ayush "Naturopathy"; NIN Pune; Gandhi, "Key to Health").
// The "load" inside the body is Kuhne's "foreign matter" or "morbid matter" idea, and the four
// exits are naturopathy's four channels of elimination (skin, lungs, kidneys, bowels). This is a
// model of the IDEA, clearly labelled: the load is not a measured quantity. The readout sets
// what physiology says beside it (Guyton & Hall, 14th ed.; LiverClear and KidneyClear).
import { THREE, M, clamp, approach } from '../kit.js';
import { tint, fitNarrow, compactReadout, inReel, makePerson, skinMat, orb, ELEMENTS, EL_ORDER, rnd } from '../nature.js';

const SCIENCE = {
  akasha: 'In a fast the body switches from sugar to fat and ketones (chapter 5). Short fasts are fine for most healthy adults, but not for everyone.',
  vayu: 'Fresh air and exercise help everyone. Slow breathing can calm the heart rate a little (see RespirationClear).',
  agni: 'Sunlight on skin makes vitamin D and sets your body clock. Too much burns and raises skin cancer risk (see SkinClear).',
  jala: 'Hot and cold water really do change blood flow in the skin, as chapter 3 shows. They do not wash toxins out.',
  prithvi: 'Cool mud cools and soothes the skin. Plain, fresh, mostly plant food is good for you (chapter 4).',
};
const EXITS = ['skin', 'lungs', 'kidneys', 'bowels'];
const S = 1.5;                 // the figure is drawn 1.5× life size to read clearly

export default {
  id: 'ideas',
  short: 'The ideas',
  title: 'Five elements and a body that heals itself',
  subtitle: 'Naturopathy’s own model: pancha mahabhuta, vitality, "toxins" and their four exits.',
  view: { pos: [0.1, 2.5, 5.4], target: [-0.5, 1.3, 0] },
  learn: `<p>This chapter shows naturopathy <b>as it describes itself</b>. It is a model of the ideas, not of measured things.</p>
    <p>Indian naturopathy says the body is made of the five great elements, the <b>pancha mahabhuta</b>: <b>akasha</b> (space), <b>vayu</b> (air), <b>agni</b> (fire), <b>jala</b> (water) and <b>prithvi</b> (earth). Health means they are in balance. Each element has its therapies: <b>fasting</b> for space, <b>air baths</b> and <b>pranayama</b> for air, <b>sun baths</b> for fire, <b>hydrotherapy</b> for water, <b>mud</b> and <b>diet</b> for earth. The same five appear in Ayurveda and Siddha (see AyurvedaClear and SiddhaClear).</p>
    <p>Its core belief is <b>vis medicatrix naturae</b>, Latin for "the healing power of nature": the body heals itself if you remove what blocks it. Louis Kuhne went further. He taught that all illness has <b>one cause</b>, a build-up of <b>"foreign matter"</b> from wrong food and living, and so <b>one cure</b>: help the body push it out through the <b>skin, lungs, kidneys and bowels</b>. A fever or rash during treatment is read as a <b>healing crisis</b>.</p>
    <p>Physiology agrees on part of this: the body really does repair itself, and it clears waste all day, mainly through the <b>liver</b> and <b>kidneys</b>. But no one has found a single "foreign matter" behind all disease. Germs, genes, injuries and worn parts cause different illnesses. The readout puts the two views side by side.</p>
    <p class="tip"><b>Try it:</b> raise the load, then pick an element and switch on its therapy. Watch the model’s four exits, then read the physiology line below.</p>`,
  terms: [
    { t: 'Pancha mahabhuta', d: 'The five great elements, space, air, fire, water and earth, that Indian systems say make up the body.' },
    { t: 'Vis medicatrix naturae', d: '"The healing power of nature": the idea that the body tends to heal itself.' },
    { t: 'Foreign matter', d: 'Kuhne’s name for the waste he believed builds up and causes every disease. Not something measured.' },
    { t: 'Healing crisis', d: 'Naturopathy’s name for symptoms that flare during treatment, read as the body throwing out waste.' },
    { t: 'Elimination', d: 'Getting rid of waste. In physiology, mostly the work of the kidneys (urine), liver (bile) and lungs (carbon dioxide).' },
    { t: 'Pranayama', d: 'Yoga’s breathing practices: slow, controlled breaths, holds and alternate-nostril breathing.' },
  ],
  defaults: { el: 'jala', load: 0.7, therapy: true, labels: true },
  controls: [
    { key: 'el', type: 'seg', label: 'Element', options: EL_ORDER.map((k) => ({ v: k, label: ELEMENTS[k].name })), fmt: (v) => `${ELEMENTS[v].en}: ${ELEMENTS[v].therapy}` },
    { key: 'load', type: 'range', label: 'Lifestyle "load" (as naturopathy describes it)', min: 0, max: 1, step: 0.01, ends: ['light', 'heavy'], fmt: (v) => Math.round(v * 100) + '%', hint: 'An idea, not a measurement. No lab test measures it.' },
    { key: 'therapy', type: 'toggle', label: 'Apply the element’s therapy' },
    { key: 'labels', type: 'toggle', label: 'Labels' },
  ],
  quiz: [
    { q: 'Which therapy does naturopathy pair with akasha (space)?', options: ['Mud packs', 'Fasting', 'Sun baths', 'Steam'], answer: 1, why: 'Fasting is said to give the body "space" to rest and heal.' },
    { q: 'What does "vis medicatrix naturae" mean?', options: ['Water is medicine', 'The healing power of nature', 'Like cures like', 'Balance of the humours'], answer: 1, why: 'It is the belief that the body tends to heal itself, which naturopathy puts at its centre.' },
    { q: 'What does physiology say about Kuhne’s "one cause of all disease"?', options: ['It has been measured in the blood', 'No single cause has been found: germs, genes, injuries and wear cause different illnesses', 'It is the same as cholesterol', 'It is proven by fasting'], answer: 1, why: 'Different diseases have different causes. The body does clear waste, mainly through the liver and kidneys, but there is no one "foreign matter".' },
  ],
  reel: [
    { ms: 5600, caption: 'Naturopathy pairs five elements with five therapies: fasting, fresh air, sun, water, and mud with diet.', set: { load: 0.7, therapy: true, labels: false }, anim: { el: ['akasha', 'prithvi'] }, view: { pos: [0.9, 1.7, 2.5], target: [0, 0.95, 0] }, spin: 0.6 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root);
    const L = (h, p, c, parent = root) => tint(stage.label(h, p, parent), c);
    // A mat and the seated person, see-through so the "load" inside shows.
    const mat = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.05, 0.05, 48), M.matte(0x5a3f7a)); mat.position.y = 0.025; root.add(mat);
    const body = makePerson({ pose: 'cross', mat: skinMat({ opacity: 0.55 }), cloth: 0xe8e0cc });
    body.setOpacity(0.45); body.scale.setScalar(S); body.position.y = 0.05; root.add(body);
    const H = body.heights;
    const chest = new THREE.Vector3(0, 0.05 + H.chest * S, 0);
    // The load: amber specks inside the trunk, each with a route out through one channel.
    const N = 70, spk = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.028, 0), M.glow(0xc8923a), N); spk.frustumCulled = false; root.add(spk);
    const home = [], exitP = [];
    for (let i = 0; i < N; i++) {
      const a = rnd(i) * Math.PI * 2, r = Math.sqrt(rnd(i + 50)), y = 0.05 + (H.pelvis + 0.02 + rnd(i + 99) * 0.44) * S;
      home.push(new THREE.Vector3(Math.cos(a) * r * 0.22, y, Math.sin(a) * r * 0.13));
      const ex = EXITS[i % 4];
      exitP.push(ex === 'skin' ? new THREE.Vector3(Math.cos(a) * 0.75, y + 0.1, Math.sin(a) * 0.6)
        : ex === 'lungs' ? new THREE.Vector3(0, 0.05 + (H.head + 0.1) * S, 0.55)
        : ex === 'kidneys' ? new THREE.Vector3(0.12, 0.06, 0.55)
        : new THREE.Vector3(-0.12, 0.06, -0.45));
    }
    // Five element orbs in a ring.
    const R = 1.55;
    const orbs = EL_ORDER.map((k, i) => {
      const a = (i / 5) * Math.PI * 2, e = ELEMENTS[k];
      const o = orb(e.col, 0.2); o.position.set(Math.cos(a) * R, 1.15 + 0.25 * Math.sin(a), Math.sin(a) * R * 0.75 - 0.1); root.add(o);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, o.position.y, 6), M.ghost(e.col, 0.35)); base.position.set(o.position.x, o.position.y / 2, o.position.z); root.add(base);
      const lab = L(`${e.name}: ${e.en}`, [o.position.x, o.position.y + 0.3 + (i % 2) * 0.28, o.position.z], e.css);
      return { k, o, lab, glow: 0 };
    });
    // A stream from the chosen orb into the body.
    const NS = 26, stream = new THREE.InstancedMesh(new THREE.SphereGeometry(0.025, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), NS); stream.frustumCulled = false; root.add(stream);
    const ban = L('As described in naturopathy: a model of the idea, not measured', [0, -0.05, 1.25], 'gold');
    const exL = {
      skin: L('Skin: sweat', [0.95, 1.1, 0.4], 'muted'), lungs: L('Lungs: breath', [-0.55, 0.05 + H.chest * S, 0.5], 'muted'),
      kidneys: L('Kidneys: urine', [0.7, 0.12, 0.8], 'muted'), bowels: L('Bowels', [-0.6, 0.12, -0.6], 'muted'),
    };
    const therL = L('', [0, 0.05 + (H.head + 0.45) * S, 0], 'sky');
    const o3 = new THREE.Object3D(), tmp = new THREE.Vector3();
    let inside = 0.7, t = 0, lastEl = '';
    const fit = fitNarrow(stage, { pos: [0, 2.2, 3.6], target: [0, 1.35, 0] });
    return compactReadout(stage, {
      update(dt, s, time) {
        dt = Math.max(0, dt); t = time;
        // The "load": rises towards the lifestyle setting; the therapy drains it (as the model tells it).
        const target = s.therapy ? s.load * 0.25 : s.load;
        inside = approach(inside, target, s.therapy ? 0.35 : 1.2, dt);
        const n = Math.round(clamp(inside, 0, 1) * N);
        for (let i = 0; i < N; i++) {
          if (i >= n) { o3.position.set(0, -50, 0); o3.scale.setScalar(0.01); }
          else {
            const moving = s.therapy && rnd(i + 7) < 0.4;
            if (moving) { const u = (t * 0.25 + rnd(i + 3)) % 1; tmp.lerpVectors(home[i], exitP[i], u); o3.position.copy(tmp); o3.scale.setScalar(1 - u * 0.8); }
            else { o3.position.copy(home[i]).add(tmp.set(Math.sin(t + i) * 0.01, Math.cos(t * 1.3 + i) * 0.01, 0)); o3.scale.setScalar(1); }
          }
          o3.updateMatrix(); spk.setMatrixAt(i, o3.matrix);
        }
        spk.instanceMatrix.needsUpdate = true;
        // Orbs and stream.
        const el = typeof s.el === 'string' && ELEMENTS[s.el] ? s.el : 'jala';
        if (el !== lastEl) { lastEl = el; stream.material.color.setHex(ELEMENTS[el].col); therL.element.innerHTML = `${ELEMENTS[el].name} → ${ELEMENTS[el].therapy}`; tint(therL, ELEMENTS[el].css); }
        let src = null;
        orbs.forEach((b) => {
          b.glow = approach(b.glow, b.k === el ? 1 : 0, 5, dt);
          b.o.scale.setScalar(1 + b.glow * 0.5 + (b.k === el ? 0.05 * Math.sin(t * 3) : 0));
          b.o.halo.material.opacity = 0.15 + b.glow * 0.3;
          if (b.k === el) src = b.o.position;
        });
        for (let i = 0; i < NS; i++) {
          const u = (t * 0.45 + i / NS) % 1;
          if (!s.therapy) o3.position.set(0, -50, 0);
          else { tmp.lerpVectors(src, chest, u); tmp.y += Math.sin(u * Math.PI) * 0.25; o3.position.copy(tmp); }
          o3.scale.setScalar(1 - 0.5 * u); o3.updateMatrix(); stream.setMatrixAt(i, o3.matrix);
        }
        stream.instanceMatrix.needsUpdate = true;
        const narrow = fit(), on = s.labels && !inReel();
        orbs.forEach((b) => { b.lab.visible = on && (!narrow || b.k === el); });
        Object.values(exL).forEach((l) => { l.visible = on && !narrow && s.therapy; });
        therL.visible = false;
      },
      readout: (s) => {
        const e = ELEMENTS[s.el] || ELEMENTS.jala;
        const pct = Math.round(clamp(inside, 0, 1) * 100);
        return `<div class="big" style="color:${e.css}">${e.name} → ${e.therapy}</div>
          <div class="row"><span>"Load" in the model</span><b>${pct}%${s.therapy ? ', draining (as told)' : ''}</b></div>
          <div class="row"><span>What physiology says</span></div><div style="color:var(--text);font-size:13px;margin:1px 0 6px">${SCIENCE[s.el] || ''}</div>
          <small>Naturopathy’s own picture. The load is an idea, not a lab value.</small>`;
      },
    });
  },
};
