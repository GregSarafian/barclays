// White Barclays Center logo painted across the green roof, as in aerial photos of the arena.
// app.js doesn't expose three.js, so the classes come from objects already in its scene.
Promise.resolve(window.__barclaysReady).then(() => {
  const B = window.__barclays, scene = B.scene;
  let Mesh, Basic, Tex;
  scene.traverse(o => {
    if (o.isMesh) Mesh ||= o.constructor;
    if (o.material?.type === 'MeshBasicMaterial') Basic ||= o.material.constructor;
    if (o.material?.map?.image instanceof HTMLCanvasElement) Tex ||= o.material.map.constructor;
  });
  const Plane = scene.children.find(o => o.isMesh && o.geometry.type === 'PlaneGeometry')?.geometry.constructor
    || (() => { let g; scene.traverse(o => { if (!g && o.geometry?.type === 'PlaneGeometry') g = o.geometry.constructor; }); return g; })();
  if (!Mesh || !Basic || !Tex || !Plane) return console.warn('roof logo: three.js classes not found');

  // logo.svg turned white; its white parts (the eagle) become cut-outs so the green roof shows through, like the real one
  const c = document.createElement('canvas'); c.width = 4096; c.height = 500;
  const tex = new Tex(c); tex.colorSpace = 'srgb'; tex.anisotropy = 8;
  const img = new Image();
  img.onload = () => {
    const g = c.getContext('2d'); g.drawImage(img, 0, 0, 4096, 500);
    const d = g.getImageData(0, 0, 4096, 500), p = d.data;
    for (let i = 0; i < p.length; i += 4) { if (Math.min(p[i], p[i + 1], p[i + 2]) > 200) p[i + 3] = 0; p[i] = p[i + 1] = p[i + 2] = 245; }
    g.putImageData(d, 0, 0); tex.needsUpdate = true;
  };
  img.src = 'logo.svg';

  // Lay the logo across the dome, reading from the plaza side (front view direction), draped over the roof surface.
  // Dome measured from the scene: centre (-3.25, 9.05), half-extents 57.35 × 53.75 m, rising 32.6 → 35 m.
  const dir = [0.665, 0.747], right = [-dir[1], dir[0]];          // front camera's look direction on the ground
  const W = 72, H = W * 222 / 1819, centre = [-3.25 - dir[0] * 8, 9.05 - dir[1] * 8];
  const height = (x, z) => { const k = 1 - ((x + 3.25) / 57.35) ** 2 - ((z - 9.05) / 53.75) ** 2; return 32.6 + Math.max(0, 2.4 * k) + 0.12; };
  const geo = new Plane(1, 1, 96, 12), pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const s = pos.getX(i) * W, t = pos.getY(i) * H;
    const x = centre[0] + right[0] * s + dir[0] * t, z = centre[1] + right[1] * s + dir[1] * t;
    pos.setXYZ(i, x, height(x, z), z);
  }
  pos.needsUpdate = true; geo.computeVertexNormals(); geo.computeBoundingSphere();
  const logo = new Mesh(geo, new Basic({ map: tex, transparent: true, depthWrite: false, side: 2, polygonOffset: true, polygonOffsetFactor: -2 }));
  logo.raycast = () => {};   // not a selectable ad surface
  scene.add(logo);
});
