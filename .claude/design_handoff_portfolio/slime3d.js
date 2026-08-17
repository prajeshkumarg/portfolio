// <slime-3d> — interactive wobbly blob. Fills its container; drag/hover to poke it.
(() => {
  class Slime3D extends HTMLElement {
    connectedCallback() {
      this.style.cssText = 'display:block;width:100%;height:100%;cursor:grab';
      this._canvas = document.createElement('canvas');
      this._canvas.style.cssText = 'width:100%;height:100%;display:block';
      this.appendChild(this._canvas);
      this._pointer = { x: 0, y: 0, active: false, down: false };
      this._init();
    }
    disconnectedCallback() {
      cancelAnimationFrame(this._raf);
      if (this._ro) this._ro.disconnect();
      if (this._renderer) this._renderer.dispose();
    }
    async _init() {
      const THREE = await import('https://esm.sh/three@0.160.0');
      if (!this.isConnected) return;

      const renderer = new THREE.WebGLRenderer({ canvas: this._canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      this._renderer = renderer;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0, 4.4);

      const setSize = () => {
        const w = Math.max(1, this.clientWidth), h = Math.max(1, this.clientHeight);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      setSize();
      this._ro = new ResizeObserver(setSize);
      this._ro.observe(this);

      scene.add(new THREE.AmbientLight(0x8fa0ff, 0.55));
      const key = new THREE.DirectionalLight(0xc4ceff, 1.3);
      key.position.set(2, 3, 4);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x8e5bff, 0.9);
      rim.position.set(-3, -1, -2);
      scene.add(rim);

      const geo = new THREE.IcosahedronGeometry(1.15, 42);
      const basePos = geo.attributes.position.array.slice();
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x3546e0, roughness: 0.25, metalness: 0.1,
        clearcoat: 0.9, clearcoatRoughness: 0.2,
        emissive: 0x1c2470, emissiveIntensity: 0.25,
        transparent: true, opacity: 0.94,
      });
      const blob = new THREE.Mesh(geo, mat);
      scene.add(blob);

      // simple 3D value-noise (cheap, good enough for organic wobble)
      const hash = (x, y, z) => {
        const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
        return s - Math.floor(s);
      };
      const noise3 = (x, y, z) => {
        const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
        const xf = x - xi, yf = y - yi, zf = z - zi;
        const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
        const lerp = (a, b, t) => a + (b - a) * t;
        const c000 = hash(xi, yi, zi), c100 = hash(xi + 1, yi, zi);
        const c010 = hash(xi, yi + 1, zi), c110 = hash(xi + 1, yi + 1, zi);
        const c001 = hash(xi, yi, zi + 1), c101 = hash(xi + 1, yi, zi + 1);
        const c011 = hash(xi, yi + 1, zi + 1), c111 = hash(xi + 1, yi + 1, zi + 1);
        const x00 = lerp(c000, c100, u), x10 = lerp(c010, c110, u);
        const x01 = lerp(c001, c101, u), x11 = lerp(c011, c111, u);
        const y0 = lerp(x00, x10, v), y1 = lerp(x01, x11, v);
        return lerp(y0, y1, w) * 2 - 1;
      };

      const raycaster = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      const setNdc = (clientX, clientY) => {
        const r = this._canvas.getBoundingClientRect();
        ndc.x = ((clientX - r.left) / r.width) * 2 - 1;
        ndc.y = -((clientY - r.top) / r.height) * 2 + 1;
      };
      const pokePoint = new THREE.Vector3(999, 999, 999);
      let pokeStrength = 0, targetPoke = 0;
      let lastMove = { x: 0, y: 0, t: 0 }, dragVel = 0;

      const droplets = [];
      const dropGeo = new THREE.SphereGeometry(1, 12, 12);
      const spawnDroplets = (origin, dir, speed) => {
        const count = 5 + Math.floor(Math.random() * 4);
        for (let i = 0; i < count; i++) {
          const spread = new THREE.Vector3(
            (Math.random() - 0.5) * 1.4,
            Math.random() * 0.6,
            (Math.random() - 0.5) * 1.4
          );
          const vel = dir.clone().multiplyScalar(speed * (0.4 + Math.random() * 0.6)).add(spread);
          const size = 0.06 + Math.random() * 0.09;
          const mesh = new THREE.Mesh(dropGeo, new THREE.MeshPhysicalMaterial({
            color: 0x3546e0, roughness: 0.2, metalness: 0.1,
            clearcoat: 0.9, emissive: 0x1c2470, emissiveIntensity: 0.3,
            transparent: true, opacity: 0.94,
          }));
          mesh.scale.setScalar(size);
          mesh.position.copy(origin);
          scene.add(mesh);
          droplets.push({ mesh, vel, life: 1, max: 1.1 + Math.random() * 0.6 });
        }
      };

      const updatePoke = (clientX, clientY) => {
        const now = performance.now();
        setNdc(clientX, clientY);
        raycaster.setFromCamera(ndc, camera);
        const hit = raycaster.intersectObject(blob)[0];
        if (hit) {
          if (this._pointer.down && lastMove.t) {
            const dt = Math.max(1, now - lastMove.t);
            const dist = Math.hypot(clientX - lastMove.x, clientY - lastMove.y);
            dragVel = dragVel * 0.6 + (dist / dt) * 0.4;
          }
          pokePoint.copy(hit.point);
          this._pointer.active = true;
        } else this._pointer.active = false;
        lastMove = { x: clientX, y: clientY, t: now };
      };
      this._onMove = (e) => { updatePoke(e.clientX, e.clientY); };
      this._onDown = (e) => { this._pointer.down = true; targetPoke = 1; dragVel = 0; updatePoke(e.clientX, e.clientY); this.style.cursor = 'grabbing'; };
      this._onUp = () => {
        if (this._pointer.down && dragVel > 0.55 && this._pointer.active) {
          const dir = pokePoint.clone().normalize();
          spawnDroplets(pokePoint.clone(), dir, Math.min(3, dragVel * 2));
        }
        this._pointer.down = false; targetPoke = 0; dragVel = 0; this.style.cursor = 'grab';
      };
      this._onLeave = () => { this._pointer.active = false; targetPoke = 0; };
      addEventListener('pointermove', this._onMove, { passive: true });
      this._canvas.addEventListener('pointerdown', this._onDown);
      addEventListener('pointerup', this._onUp);
      this._canvas.addEventListener('pointerleave', this._onLeave);

      const clock = new THREE.Clock();
      const pos = geo.attributes.position;
      const v = new THREE.Vector3(), n = new THREE.Vector3();
      const loop = () => {
        this._raf = requestAnimationFrame(loop);
        const t = clock.getElapsedTime();
        pokeStrength += (targetPoke - pokeStrength) * 0.12;

        for (let i = 0; i < pos.count; i++) {
          const bx = basePos[i * 3], by = basePos[i * 3 + 1], bz = basePos[i * 3 + 2];
          n.set(bx, by, bz).normalize();
          const idle = noise3(bx * 1.4 + t * 0.35, by * 1.4, bz * 1.4 + t * 0.35) * 0.09;
          v.set(bx, by, bz);
          let disp = idle;
          if (pokeStrength > 0.001) {
            const d = v.distanceTo(pokePoint.clone().normalize().multiplyScalar(1.15));
            const falloff = Math.max(0, 1 - d * 1.6);
            disp -= falloff * falloff * pokeStrength * 0.5;
          }
          const scale = 1 + disp;
          pos.setXYZ(i, bx * scale, by * scale, bz * scale);
        }
        pos.needsUpdate = true;
        geo.computeVertexNormals();

        blob.rotation.y = t * 0.15;
        blob.rotation.x = Math.sin(t * 0.2) * 0.08;

        const dt = clock.getDelta();
        for (let i = droplets.length - 1; i >= 0; i--) {
          const d = droplets[i];
          d.vel.y -= 1.6 * dt;
          d.mesh.position.addScaledVector(d.vel, dt);
          d.life -= dt / d.max;
          d.mesh.material.opacity = Math.max(0, d.life) * 0.94;
          if (d.life <= 0) {
            scene.remove(d.mesh);
            d.mesh.material.dispose();
            droplets.splice(i, 1);
          }
        }

        renderer.render(scene, camera);
      };
      loop();
    }
  }
  if (!customElements.get('slime-3d')) customElements.define('slime-3d', Slime3D);
})();
