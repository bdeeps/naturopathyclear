// Chapter 3: the therapies, and what the body really does in them. The working model is
// hydrotherapy: a person in a foot bath, a hip bath (Kuhne's sitz bath) or a full bath. The
// water's temperature sets how wide the skin's blood vessels open (shown magnified, with flow
// ∝ radius⁴ as Poiseuille's law says), how much heat crosses the skin, and how much the core
// temperature would change. The heat model and its sources are in js/nature.js (hydro()).
// Other facts:
//  - Kuhne's hip bath: water about 10–14 °C, sitting with the legs out (Wikipedia "Louis Kuhne").
//  - Contrast baths: usually about 3–4 min hot (38–44 °C) then about 1 min cold (10–15 °C),
//    repeated (Fiscus et al., J Orthop Sports Phys Ther 35:1, 2005 review of use;
//    Stanton et al., J Hand Ther 22:57, 2009: evidence weak).
//  - Cold shock: sudden immersion of most of the body in water under about 15 °C makes you gasp
//    and breathe fast and raises heart rate and blood pressure in the first 1–3 minutes (Tipton,
//    Clin Sci 77:581, 1989; Tipton et al., Exp Physiol 102:1335, 2017).
//  - Hot baths: a 40 °C full bath raises core temperature about 1 °C in 20–30 min and widens skin
//    vessels, dropping blood pressure; people can faint on standing up. Very hot tubs are advised
//    against in early pregnancy (hyperthermia; Chambers, Birth Defects Res A 76:569, 2006).
import { THREE, M, clamp, lerp, approach, arrow } from '../kit.js';
import { tint, fitNarrow, compactReadout, inReel, board, panel, wrap, makePerson, skinMat, hydro, BATHS, rnd } from '../nature.js';
import { canvasTexture } from '../kit.js';

const OTHERS = [
  ['#e0bd7a', 'Mud packs', 'Cool, wet mud on the belly or eyes. It cools and soothes the skin; it does not pull out toxins.'],
  ['#ffa06a', 'Sun baths', 'Sunlight lets skin make vitamin D and sets the body clock. Short, early spells; too much burns.'],
  ['#8ab4ff', 'Steam and packs', 'Heat opens skin vessels and makes you sweat. Sweat is mostly water and salt.'],
  ['#c9a7ff', 'Massage', 'Can ease muscle tension and help people relax; it does not "move toxins".'],
  ['#9be08a', 'Diet and fasting', 'Plain whole food helps (chapter 4). Fasting is safe for some, risky for others (chapter 5).'],
  ['#8ef0ff', 'Yoga and pranayama', 'Stretching, strength, balance and slow breathing. Some real benefits (chapter 4).'],
];
function drawOthers(g, w, h) {
  panel(g, w, h, 'The other therapies, honestly');
  let y = 100;
  OTHERS.forEach(([c, a, b]) => {
    g.fillStyle = c; g.fillRect(28, y - 24, 8, 58);
    g.font = '600 26px sans-serif'; g.fillText(a, 50, y);
    g.fillStyle = 'rgba(232,238,248,.8)'; g.font = '22px sans-serif'; y = wrap(g, b, 50, y + 30, w - 80, 27) + 22;
  });
}

const waterCol = (T) => {
  const k = clamp((T - 10) / 32, 0, 1);
  return new THREE.Color().setRGB(lerp(0.25, 0.95, k), lerp(0.6, 0.45, k), lerp(1.0, 0.35, k));
};
const HOT = 40, COLD = 15;
const tempNow = (s, t) => (s.contrast ? ((t % 8) < 6 ? HOT : COLD) : s.T);
function stateText(h, T) {
  if (h.shock) return { t: 'Cold shock risk: gasping, racing heart', c: '#ff8a8a' };
  if (T < 20) return { t: 'Cold: skin vessels clamp down', c: '#7fc4ff' };
  if (T < 30) return { t: 'Cool: vessels narrow a little', c: '#9db4ff' };
  if (T <= 36) return { t: 'Neutral: little heat moves', c: '#6ee7a8' };
  return { t: 'Hot: skin vessels open wide', c: '#ff9a6a' };
}

export default {
  id: 'therapies',
  short: 'Therapies',
  title: 'What hot and cold water really do',
  subtitle: 'Hip baths, foot baths and full baths: blood flow, heat and your core temperature.',
  view: { pos: [0.8, 1.75, 5.0], target: [1.15, 1.3, 0] },
  learn: `<p>A naturopathy centre runs on simple therapies: <b>fasting</b>, <b>diet</b>, <b>hydrotherapy</b> (hip baths, foot baths, steam, wet packs), <b>mud packs</b>, <b>sun and air baths</b>, <b>massage</b>, and <b>yoga with pranayama</b>. Kuhne’s famous <b>hip bath</b> has you sit in cool water up to the navel, legs out, for a few minutes.</p>
    <p>Here is what the body really does in water. Your <b>skin blood vessels</b> are the dial, the same one SkinClear shows for sweating. <b>Cold</b> water makes them <b>narrow</b>, keeping warm blood deep inside: the skin turns pale and quickly drops to nearly the water’s temperature. <b>Hot</b> water makes them <b>open wide</b>: the skin flushes, and flow there can rise several-fold. Because flow grows with the vessel’s radius to the <b>fourth power</b>, a vessel only about 1.6 times wider carries about 7 times the blood (see CirculationClear for how blood moves).</p>
    <p>Water conducts heat about <b>25 times better</b> than air, so even a hip bath moves real heat. But your <b>core</b> barely changes: shivering, narrowing vessels and your own 100 watts of body heat defend it. Only a long full bath shifts it by a degree. Hot and cold baths do change <b>circulation in the skin</b>; there is no evidence they flush out toxins.</p>
    <p>Two cautions. Jumping fully into water below about <b>15 °C</b> causes <b>cold shock</b>: a gasp and a racing heart, dangerous for people with heart disease. Very <b>hot</b> baths drop blood pressure (you may faint when you stand) and are best avoided in pregnancy. Ask a doctor first if you have a heart condition, diabetes with numb feet, or are pregnant.</p>
    <p class="tip"><b>Try it:</b> set a hip bath at 12 °C, then warm it to 40 °C and watch the magnified vessel. Switch to a full bath below 15 °C, then try the contrast bath.</p>`,
  terms: [
    { t: 'Hip bath', d: 'Sitting in a tub of water up to the navel with the legs outside; Kuhne’s favourite therapy.' },
    { t: 'Contrast bath', d: 'Switching between hot and cold water, often 3 to 4 minutes hot and 1 minute cold, several times.' },
    { t: 'Vasoconstriction', d: 'Blood vessels narrowing in the cold, so less warm blood reaches the skin.' },
    { t: 'Vasodilation', d: 'Blood vessels widening in the heat, so more blood reaches the skin to lose heat.' },
    { t: 'Poiseuille’s law', d: 'Flow through a tube rises with the fourth power of its radius: double the width, 16 times the flow.' },
    { t: 'Cold shock', d: 'The gasp, fast breathing and racing heart when most of the body hits cold water suddenly.' },
  ],
  defaults: { bath: 'hip', T: 14, min: 10, contrast: false, labels: true },
  controls: [
    { key: 'bath', type: 'seg', label: 'Bath', options: Object.entries(BATHS).map(([v, b]) => ({ v, label: b.name })), fmt: (v) => BATHS[v].note },
    { key: 'T', type: 'range', label: 'Water temperature', min: 10, max: 42, step: 0.5, ends: ['10 °C', '42 °C'], fmt: (v) => v.toFixed(0) + ' °C' },
    { key: 'min', type: 'range', label: 'How long', min: 1, max: 30, step: 1, ends: ['1 min', '30 min'], fmt: (v) => v + ' min' },
    { key: 'contrast', type: 'toggle', label: 'Contrast bath: 40 °C, then 15 °C, repeated' },
    { key: 'labels', type: 'toggle', label: 'Labels' },
  ],
  onChange(s, key) { if (key === 'T') s.contrast = false; },
  quiz: [
    { q: 'What happens to skin blood vessels in cold water?', options: ['They widen', 'They narrow, keeping warm blood deep inside', 'They fill with water', 'Nothing'], answer: 1, why: 'Vasoconstriction cuts blood flow to the skin, which is why it goes pale and cold.' },
    { q: 'A vessel widens to 1.6 times its radius. Roughly how much more blood can flow?', options: ['1.6 times', 'About 2.5 times', 'About 7 times', '100 times'], answer: 2, why: 'Flow scales with radius to the fourth power: 1.6⁴ ≈ 6.6.' },
    { q: 'Why is jumping into water below about 15 °C risky?', options: ['It removes toxins too fast', 'Cold shock: a gasp and a racing heart', 'Skin absorbs the water', 'It is not risky'], answer: 1, why: 'The cold shock response in the first minutes can make you inhale water or strain the heart.' },
  ],
  reel: [
    { ms: 5200, caption: 'In a cold hip bath, skin vessels clamp shut and keep warm blood deep inside.', set: { bath: 'hip', min: 10, contrast: false, labels: false }, anim: { T: [34, 12] }, view: { pos: [0.5, 1.25, 2.0], target: [0.55, 0.85, 0] }, spin: 0 },
    { ms: 5200, caption: 'In hot water they open wide: 1.6 times wider carries about 7 times the blood.', set: { bath: 'hip', min: 10, contrast: false, labels: false }, anim: { T: [12, 42] }, view: { pos: [0.85, 1.25, 2.3], target: [0.75, 0.85, 0.1] }, spin: 0 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root);
    const L = (h, p, c, parent = root) => tint(stage.label(h, p, parent), c);
    // The person on a low stool.
    const skin = skinMat();
    const person = makePerson({ pose: 'sit', mat: skin, cloth: 0x3f6fa8 }); root.add(person);
    const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.42, 24), M.matte(0x7a4a2a)); stool.position.set(0, 0.21, -0.02);
    // Three vessels, one shown at a time.
    const tubM = M.metal(0xdfe4ea, { side: THREE.DoubleSide, metalness: 0.3, roughness: 0.35 });
    const wM = new THREE.MeshPhysicalMaterial({ color: 0x66aaff, transparent: true, opacity: 0.55, roughness: 0.1, depthWrite: false, side: THREE.DoubleSide });
    const V = {
      foot: (() => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.26, 40, 1, true), tubM); b.position.set(0, 0.13, 0.52); const w = new THREE.Mesh(new THREE.CylinderGeometry(0.285, 0.25, 0.2, 40), wM); w.position.set(0, 0.1, 0.52); g.add(b, w, stool.clone()); g.water = w; g.lvl = 0.2; return g; })(),
      hip: (() => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.36, 0.5, 40, 1, true), tubM); b.position.set(0, 0.55, 0.1); const bot = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.02, 40), tubM); bot.position.set(0, 0.3, 0.1);
        const legs = [[-0.3, -0.2], [0.3, -0.2], [-0.3, 0.35], [0.3, 0.35]].map(([x, z]) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.3, 8), M.metal()); l.position.set(x, 0.15, z); return l; });
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.36, 0.38, 40), wM); w.position.set(0, 0.5, 0.1); g.add(b, bot, w, ...legs); g.water = w; g.lvl = 0.69; return g; })(),
      full: (() => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.68, 1.05, 48, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xcfd8e2, transparent: true, opacity: 0.25, roughness: 0.2, side: THREE.DoubleSide, depthWrite: false })); b.position.set(0, 0.525, 0.2);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.025, 8, 64), tubM); rim.rotation.x = Math.PI / 2; rim.position.set(0, 1.05, 0.2);
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.67, 0.95, 48), wM); w.position.set(0, 0.475, 0.2); g.add(b, rim, w, stool.clone()); g.water = w; g.lvl = 0.95; return g; })(),
    };
    Object.values(V).forEach((g) => root.add(g));
    // Heat arrows across the waterline, pointing out of (cold) or into (hot) the body.
    const arrows = [0, 1, 2, 3, 4, 5].map((i) => { const a = arrow(0xffb547, 0.3, 0.08, 0.018); root.add(a); return a; });
    // Steam over hot water.
    const NS = 50, steam = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 8, 6), M.ghost(0xffffff, 0.35), NS); steam.frustumCulled = false; root.add(steam);
    // The magnified skin vessel: a glass tube whose radius follows flow^(1/4), with red cells.
    const mag = new THREE.Group(); mag.position.set(1.4, 0.72, 0.3); mag.scale.setScalar(0.7); root.add(mag);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.012, 8, 64), M.glow(0x8ef0ff)); mag.add(ring);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.61, 64), M.ghost(0x0a1422, 0.75)); disc.position.z = -0.02; mag.add(disc);
    const tissue = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.8), M.ghost(0xe0a58a, 0.35)); tissue.position.z = -0.01; mag.add(tissue);
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1.1, 32, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xff8080, transparent: true, opacity: 0.35, roughness: 0.3, side: THREE.DoubleSide, depthWrite: false }));
    wall.rotation.z = Math.PI / 2; mag.add(wall);
    const smooth = new THREE.Mesh(new THREE.TorusGeometry(1, 0.08, 8, 32), M.plastic(0xd06060)); smooth.rotation.y = Math.PI / 2; const sm2 = smooth.clone(); smooth.position.x = -0.25; sm2.position.x = 0.25; mag.add(smooth, sm2);
    const NR = 40, rbc = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.035, 0.035, 0.012, 14), M.glow(0xff4a4a), NR); rbc.frustumCulled = false; mag.add(rbc);
    const leader = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 1, 6), M.ghost(0x8ef0ff, 0.5)); root.add(leader);
    // Board of the other therapies.
    const ob = board(canvasTexture(700, 760, drawOthers), 1.55, 1.68); ob.position.set(2.45, 1.35, -0.9); ob.rotation.y = -0.35; ob.scale.setScalar(0.9); root.add(ob);
    const labs = {
      mag: L('A skin vessel under the water, magnified', [1.4, 0.18, 0.35], 'sky'),
      heat: L('', [-0.75, 1.0, 0.3], 'warn'),
      skin: L('', [-0.55, 0.3, 0.4], 'muted'),
    };
    const o3 = new THREE.Object3D(), baseCol = new THREE.Color(0xb98a6a), pale = new THREE.Color(0xc9a594), flush = new THREE.Color(0xc4705a);
    let rad = 0.3, t = 0, Tw = 14, lastBath = '';
    const fit = fitNarrow(stage, { pos: [0.9, 1.5, 3.6], target: [0.9, 0.95, 0] });
    return compactReadout(stage, {
      update(dt, s, time) {
        dt = Math.max(0, dt); t = time;
        const bath = BATHS[s.bath] ? s.bath : 'hip';
        const Tt = tempNow(s, t);
        Tw = approach(Tw, Tt, s.contrast ? 4 : 3, dt);
        const hy = hydro(Tw, bath);
        if (bath !== lastBath) { lastBath = bath; Object.entries(V).forEach(([k, g]) => { g.visible = k === bath; }); }
        const g = V[bath];
        g.water.material.color.copy(waterCol(Tw));
        g.water.position.y += Math.sin(t * 2) * 0.0003;
        // Skin tone: pale in cold, flushed in heat, weighted by how much skin is in the water.
        const k = BATHS[bath].area / 1.5;
        const target = Tw < 34 ? pale : flush, amt = Tw < 34 ? clamp((34 - Tw) / 22, 0, 1) : clamp((Tw - 34) / 8, 0, 1);
        skin.color.copy(baseCol).lerp(target, amt * (0.35 + 0.65 * k));
        // Vessel radius from flow: r ∝ flow^(1/4) (Poiseuille), cells speed ∝ flow / r².
        const rT = 0.3 * Math.pow(hy.flow, 0.25);
        rad = approach(rad, rT, 3, dt);
        wall.scale.set(rad, 1, rad); smooth.scale.setScalar(rad * 1.02); sm2.scale.setScalar(rad * 1.02);
        const v = 0.25 * hy.flow / Math.pow(rad / 0.3, 2);
        const nr = Math.round(clamp(8 + 32 * (rad / 0.49) ** 2, 8, NR));
        for (let i = 0; i < NR; i++) {
          if (i >= nr) { o3.position.set(0, -50, 0); o3.scale.setScalar(0.01); }
          else { const u = (t * v * 0.5 + rnd(i)) % 1, a = rnd(i + 3) * Math.PI * 2, rr = Math.sqrt(rnd(i + 5)) * rad * 0.75; o3.position.set(-0.55 + u * 1.1, Math.cos(a) * rr, Math.sin(a) * rr); o3.rotation.set(0, 0, Math.PI / 2 + Math.sin(t + i) * 0.4); o3.scale.setScalar(1); }
          o3.updateMatrix(); rbc.setMatrixAt(i, o3.matrix);
        }
        rbc.instanceMatrix.needsUpdate = true;
        leader.position.set(0.72, 0.68, 0.25); leader.scale.y = 0.5; leader.rotation.z = Math.PI / 2 + 0.15;
        // Heat arrows at the waterline.
        const lvl = g.lvl, R0 = bath === 'full' ? 0.25 : bath === 'hip' ? 0.2 : 0.1, zc = bath === 'foot' ? 0.52 : bath === 'hip' ? 0.05 : 0.05;
        const mag2 = clamp(Math.abs(hy.q) / (bath === 'full' ? 350 : bath === 'hip' ? 110 : 40), 0, 1);
        arrows.forEach((a, i) => {
          const ang = (i / 6) * Math.PI * 2 + 0.3, len = 0.08 + 0.3 * mag2;
          const out = hy.q > 0;
          const y = bath === 'foot' ? 0.12 : lvl - 0.12;
          const dir = new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang));
          const start = out ? dir.clone().multiplyScalar(R0) : dir.clone().multiplyScalar(R0 + len);
          a.position.set(start.x, y, start.z + zc);
          a.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), out ? dir : dir.clone().negate());
          a.set(Math.abs(hy.q) < 3 ? 0 : len);
          a.children.forEach((c) => c.material.color.setHex(out ? 0x7fc4ff : 0xff9a6a));
        });
        // Steam.
        const ns = Math.round(clamp((Tw - 35) / 7, 0, 1) * NS), rw = bath === 'full' ? 0.65 : bath === 'hip' ? 0.36 : 0.26;
        for (let i = 0; i < NS; i++) {
          if (i >= ns) { o3.position.set(0, -50, 0); }
          else { const u = (t * 0.3 + rnd(i)) % 1, a = rnd(i + 11) * Math.PI * 2, r = Math.sqrt(rnd(i + 13)) * rw; o3.position.set(Math.cos(a) * r + Math.sin(u * 5 + i) * 0.04, lvl + 0.02 + u * 0.6, Math.sin(a) * r + (bath === 'foot' ? 0.52 : bath === 'full' ? 0.2 : 0.1)); }
          o3.rotation.set(0, 0, 0); o3.scale.setScalar(1 + (i < ns ? ((t * 0.3 + rnd(i)) % 1) * 1.5 : 0)); o3.updateMatrix(); steam.setMatrixAt(i, o3.matrix);
        }
        steam.instanceMatrix.needsUpdate = true;
        const narrow = fit(), on = s.labels && !inReel();
        labs.mag.visible = on && !narrow;
        labs.heat.visible = on && Math.abs(hy.q) > 3;
        labs.heat.element.innerHTML = hy.q > 0 ? `Heat out: about ${Math.round(hy.q)} W` : `Heat in: about ${Math.round(-hy.q)} W`;
        labs.heat.position.set(-0.75, bath === 'foot' ? 0.35 : lvl + 0.05, 0.3);
        labs.skin.visible = on && !narrow;
        labs.skin.element.innerHTML = rad < 0.26 ? 'Pale: vessels narrowed' : rad > 0.34 ? 'Flushed: vessels open' : 'Normal skin colour';
      },
      readout: (s) => {
        const bath = BATHS[s.bath] ? s.bath : 'hip';
        const hy = hydro(Tw, bath, s.min), st = stateText(hy, Tw);
        const dT = hy.dT, dTs = Math.abs(dT) < 0.05 ? 'under 0.1 °C' : `${dT > 0 ? '+' : '−'}${Math.abs(dT).toFixed(1)} °C`;
        return `<div class="big" style="color:${st.c}">${st.t}</div>
          <div class="row"><span>Water${s.contrast ? ' (contrast)' : ''}</span><b>${Tw.toFixed(0)} °C, ${BATHS[bath].name.toLowerCase()}</b></div>
          <div class="row"><span>Skin under the water</span><b>about ${hy.Tskin.toFixed(0)} °C</b></div>
          <div class="row"><span>Skin blood flow there</span><b>about ${hy.flow < 0.95 ? hy.flow.toFixed(1) : hy.flow.toFixed(0)}× normal</b></div>
          <div class="row"><span>${hy.q >= 0 ? 'Heat flowing out' : 'Heat flowing in'}</span><b>about ${Math.round(Math.abs(hy.q))} W</b></div>
          <div class="row"><span>Core after ${s.min} min, if nothing compensated</span><b>${dTs}</b></div>
          <small>Simple heat balance: 65 kg adult making 100 W, still water. Shivering and blood-vessel changes keep the real core change smaller in the cold.</small>`;
      },
    });
  },
};
