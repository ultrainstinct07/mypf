import * as THREE from 'three';

export type ParticleCloudTheme = 'dark' | 'light' | 'matrix';

export interface ParticleCloudOptions {
  particleMultiplier?: number;
  maxConnectionDist?: number;
  radius?: number;
  theme?: ParticleCloudTheme;
}

export interface ParticleCloudCameraView {
  distance: number;
  orbitX: number;
  orbitY: number;
}

export interface ParticleCloudInstance {
  start: () => void;
  stop: () => void;
  dispose: () => void;
  setOpacity: (opacity: number) => void;
  setTheme: (theme: ParticleCloudTheme) => void;
  setRotationSpeed: (speed: number) => void;
  setCameraView: (view: ParticleCloudCameraView) => void;
  triggerScanBurst: (count?: number) => void;
  resize: () => void;
}

const DEFAULT_CAMERA_VIEW: ParticleCloudCameraView = {
  distance: 600,
  orbitX: 0,
  orbitY: 0,
};

const CAMERA_LERP = 0.12;

const CRIMSON = new THREE.Color(217 / 255, 4 / 255, 41 / 255);
const MATRIX_GREEN = new THREE.Color(0x00ff78);
const MATRIX_GREEN_BRIGHT = new THREE.Color(0x39ff14);
const PARTICLE_DARK = new THREE.Color(0xe5e5e5);
const PARTICLE_LIGHT = new THREE.Color(0x0a0a0a);

const GLOW_DECAY_RATE = 0.0012;
const GLOW_RESPAWN_THRESHOLD = 0.08;
const GLOW_LINE_BOOST_THRESHOLD = 0.3;

function getBaseParticleColor(currentTheme: ParticleCloudTheme): THREE.Color {
  if (currentTheme === 'matrix') return MATRIX_GREEN_BRIGHT;
  if (currentTheme === 'dark') return PARTICLE_DARK;
  return PARTICLE_LIGHT;
}

function getBaseParticleSize(currentTheme: ParticleCloudTheme): number {
  if (currentTheme === 'matrix') return 2;
  if (currentTheme === 'dark') return 1.5;
  return 1.75;
}
function lineColorForTheme(
  currentTheme: ParticleCloudTheme,
  alpha: number
): [number, number, number] {
  if (currentTheme === 'matrix') {
    const r = MATRIX_GREEN.r * 0.85 + CRIMSON.r * 0.15;
    const g = MATRIX_GREEN.g * 0.92 + CRIMSON.g * 0.08;
    const b = MATRIX_GREEN.b * 0.85 + CRIMSON.b * 0.15;
    return [r * alpha, g * alpha, b * alpha];
  }

  if (currentTheme === 'light') {
    const r = 0.06 + CRIMSON.r * 0.55 * alpha;
    const g = 0.06 + CRIMSON.g * 0.35 * alpha;
    const b = 0.06 + CRIMSON.b * 0.35 * alpha;
    return [r * alpha, g * alpha, b * alpha];
  }

  const r = 0.75 + CRIMSON.r * 0.25 * alpha;
  const g = 0.75 + CRIMSON.g * 0.25 * alpha;
  const b = 0.75 + CRIMSON.b * 0.25 * alpha;
  return [r * alpha, g * alpha, b * alpha];
}

export function createParticleCloud(
  canvas: HTMLCanvasElement,
  options: ParticleCloudOptions = {}
): ParticleCloudInstance {
  const particleMultiplier = options.particleMultiplier ?? 40;
  const numVertices = particleMultiplier * 3;
  const maxDist = options.maxConnectionDist ?? 35;
  const radius = options.radius ?? 350;
  const halfRadius = radius / 2;

  let theme: ParticleCloudTheme = options.theme ?? 'dark';
  let opacity = 1;
  let rotationSpeed = 0.001;
  let running = false;
  let rafId = 0;
  let lowFpsFrames = 0;
  let reducedParticles = false;

  let targetCameraView: ParticleCloudCameraView = { ...DEFAULT_CAMERA_VIEW };
  let currentCameraView: ParticleCloudCameraView = { ...DEFAULT_CAMERA_VIEW };

  const winWidth = canvas.clientWidth || window.innerWidth;
  const winHeight = canvas.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(75, winWidth / winHeight, 1, 1000);
  camera.position.z = 600;

  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(winWidth, winHeight, false);
  renderer.setClearColor(0x050505, 0);

  const positions = new Float32Array(numVertices * 3);
  const glowLevels = new Float32Array(numVertices);
  const pointColors = new Float32Array(numVertices * 3);
  const velocities: THREE.Vector3[] = [];
  let baseParticleSize = getBaseParticleSize(theme);

  function respawnParticle(index: number) {
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.random() * Math.PI;
    positions[index * 3] = radius * Math.sin(theta) * Math.cos(phi);
    positions[index * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
    positions[index * 3 + 2] = radius * Math.cos(theta);
    velocities[index].set(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    );
    glowLevels[index] = 0;
  }

  function writeParticleColor(index: number, glow: number) {
    const base = getBaseParticleColor(theme);
    const t = Math.max(0, Math.min(1, glow));
    const i3 = index * 3;
    pointColors[i3] = base.r + (CRIMSON.r - base.r) * t;
    pointColors[i3 + 1] = base.g + (CRIMSON.g - base.g) * t;
    pointColors[i3 + 2] = base.b + (CRIMSON.b - base.b) * t;
  }

  function initAllParticleColors() {
    for (let i = 0; i < numVertices; i++) {
      writeParticleColor(i, glowLevels[i]);
    }
  }

  for (let i = 0; i < numVertices; i++) {
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.random() * Math.PI;
    positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = radius * Math.cos(theta);
    velocities.push(
      new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
    );
  }

  initAllParticleColors();

  const pointsGeometry = new THREE.BufferGeometry();
  const pointsPositions = new THREE.BufferAttribute(positions, 3);
  pointsPositions.setUsage(THREE.DynamicDrawUsage);
  pointsGeometry.setAttribute('position', pointsPositions);
  const pointsColorAttr = new THREE.BufferAttribute(pointColors, 3);
  pointsColorAttr.setUsage(THREE.DynamicDrawUsage);
  pointsGeometry.setAttribute('color', pointsColorAttr);

  const pointsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: baseParticleSize,
    transparent: true,
    opacity: 1,
    vertexColors: true,
  });

  const particleCloud = new THREE.Points(pointsGeometry, pointsMaterial);
  scene.add(particleCloud);

  const maxLineVertices = numVertices * numVertices * 2;
  const linePositions = new Float32Array(maxLineVertices * 3);
  const lineColors = new Float32Array(maxLineVertices * 3);

  const lineGeometry = new THREE.BufferGeometry();
  const linePosAttr = new THREE.BufferAttribute(linePositions, 3);
  linePosAttr.setUsage(THREE.DynamicDrawUsage);
  const lineColorAttr = new THREE.BufferAttribute(lineColors, 3);
  lineColorAttr.setUsage(THREE.DynamicDrawUsage);
  lineGeometry.setAttribute('position', linePosAttr);
  lineGeometry.setAttribute('color', lineColorAttr);

  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 1,
  });

  const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lineMesh);

  let lastFrameTime = performance.now();

  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  function applyCameraFromView(view: ParticleCloudCameraView) {
    const d = view.distance;
    const { orbitX, orbitY } = view;
    camera.position.x = d * Math.sin(orbitY) * Math.cos(orbitX);
    camera.position.y = d * Math.sin(orbitX);
    camera.position.z = d * Math.cos(orbitY) * Math.cos(orbitX);
    camera.lookAt(scene.position);
  }

  function updateCameraLerp() {
    currentCameraView = {
      distance: lerp(currentCameraView.distance, targetCameraView.distance, CAMERA_LERP),
      orbitX: lerp(currentCameraView.orbitX, targetCameraView.orbitX, CAMERA_LERP),
      orbitY: lerp(currentCameraView.orbitY, targetCameraView.orbitY, CAMERA_LERP),
    };
    applyCameraFromView(currentCameraView);
  }

  function getEffectiveCount() {
    return reducedParticles ? Math.floor(numVertices * 0.6) : numVertices;
  }

  function boostLineColor(
    r: number,
    g: number,
    b: number,
    glowA: number,
    glowB: number,
    alpha: number
  ): [number, number, number] {
    const glow = Math.max(glowA, glowB);
    if (glow <= GLOW_LINE_BOOST_THRESHOLD) {
      return [r, g, b];
    }
    const t = Math.min(1, (glow - GLOW_LINE_BOOST_THRESHOLD) / 0.7);
    return [
      (r + (CRIMSON.r - r) * t) * alpha,
      (g + (CRIMSON.g - g) * t) * alpha,
      (b + (CRIMSON.b - b) * t) * alpha,
    ];
  }

  function updateGlowAndColors(effectiveCount: number, frameDelta: number) {
    let maxGlow = 0;

    for (let i = 0; i < effectiveCount; i++) {
      const prevGlow = glowLevels[i];
      if (prevGlow > 0) {
        glowLevels[i] = Math.max(0, prevGlow - frameDelta * GLOW_DECAY_RATE);
        if (prevGlow > GLOW_RESPAWN_THRESHOLD && glowLevels[i] <= GLOW_RESPAWN_THRESHOLD) {
          respawnParticle(i);
        }
      }
      maxGlow = Math.max(maxGlow, glowLevels[i]);
      writeParticleColor(i, glowLevels[i]);
    }

    pointsMaterial.size = baseParticleSize * (1 + maxGlow * 0.6);
    pointsMaterial.needsUpdate = true;
    particleCloud.geometry.attributes.color.needsUpdate = true;
  }

  function animate() {
    if (!running) return;

    const now = performance.now();
    const delta = now - lastFrameTime;
    lastFrameTime = now;

    if (delta > 22) {
      lowFpsFrames += 1;
      if (lowFpsFrames >= 3 && !reducedParticles) {
        reducedParticles = true;
      }
    } else {
      lowFpsFrames = Math.max(0, lowFpsFrames - 1);
    }

    let vertexPos = 0;
    let colorPos = 0;
    let connections = 0;
    const effectiveCount = getEffectiveCount();
    const maxConnections = 800;

    scene.rotation.y += rotationSpeed;
    updateGlowAndColors(effectiveCount, delta);

    for (let i = 0; i < effectiveCount; i++) {
      positions[i * 3] += velocities[i].x;
      positions[i * 3 + 1] += velocities[i].y;
      positions[i * 3 + 2] += velocities[i].z;

      if (positions[i * 3] < -halfRadius || positions[i * 3] > halfRadius) {
        velocities[i].x = -velocities[i].x;
      }
      if (positions[i * 3 + 1] < -halfRadius || positions[i * 3 + 1] > halfRadius) {
        velocities[i].y = -velocities[i].y;
      }
      if (positions[i * 3 + 2] < -halfRadius || positions[i * 3 + 2] > halfRadius) {
        velocities[i].z = -velocities[i].z;
      }

      for (let j = i + 1; j < effectiveCount; j++) {
        if (connections >= maxConnections) break;

        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDist) {
          const alpha = (maxDist - dist) * 0.025;
          let [r, g, b] = lineColorForTheme(theme, alpha);
          [r, g, b] = boostLineColor(
            r,
            g,
            b,
            glowLevels[i],
            glowLevels[j],
            1
          );

          linePositions[vertexPos++] = positions[i * 3];
          linePositions[vertexPos++] = positions[i * 3 + 1];
          linePositions[vertexPos++] = positions[i * 3 + 2];
          linePositions[vertexPos++] = positions[j * 3];
          linePositions[vertexPos++] = positions[j * 3 + 1];
          linePositions[vertexPos++] = positions[j * 3 + 2];

          lineColors[colorPos++] = r;
          lineColors[colorPos++] = g;
          lineColors[colorPos++] = b;
          lineColors[colorPos++] = r;
          lineColors[colorPos++] = g;
          lineColors[colorPos++] = b;

          connections++;
        }
      }
    }

    lineGeometry.setDrawRange(0, connections * 2);
    lineMesh.geometry.attributes.position.needsUpdate = true;
    lineMesh.geometry.attributes.color.needsUpdate = true;
    particleCloud.geometry.attributes.position.needsUpdate = true;

    updateCameraLerp();
    renderer.render(scene, camera);

    rafId = requestAnimationFrame(animate);
  }

  function applyOpacity(value: number) {
    opacity = value;
    pointsMaterial.opacity = value;
    lineMaterial.opacity = value;
  }

  function applyTheme(next: ParticleCloudTheme) {
    theme = next;
    baseParticleSize = getBaseParticleSize(next);
    pointsMaterial.color.set(0xffffff);
    pointsMaterial.size = baseParticleSize;
    initAllParticleColors();
    pointsMaterial.needsUpdate = true;
    particleCloud.geometry.attributes.color.needsUpdate = true;
  }

  applyOpacity(opacity);
  applyTheme(theme);

  return {
    start() {
      if (running) return;
      running = true;
      lastFrameTime = performance.now();
      rafId = requestAnimationFrame(animate);
    },
    stop() {
      running = false;
      cancelAnimationFrame(rafId);
    },
    dispose() {
      this.stop();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    },
    setOpacity(value: number) {
      applyOpacity(Math.max(0, Math.min(1, value)));
    },
    setTheme(next: ParticleCloudTheme) {
      applyTheme(next);
    },
    setRotationSpeed(speed: number) {
      rotationSpeed = Math.max(0, speed);
    },
    setCameraView(view: ParticleCloudCameraView) {
      targetCameraView = {
        distance: view.distance,
        orbitX: view.orbitX,
        orbitY: view.orbitY,
      };
    },
    triggerScanBurst(count?: number) {
      const effectiveCount = getEffectiveCount();
      const maxBurst = reducedParticles ? 8 : 16;
      const burstCount = Math.min(
        count ?? 12 + Math.floor(Math.random() * 5),
        maxBurst,
        effectiveCount
      );
      const chosen = new Set<number>();
      while (chosen.size < burstCount) {
        chosen.add(Math.floor(Math.random() * effectiveCount));
      }
      chosen.forEach((index) => {
        glowLevels[index] = 1;
      });
    },
    resize() {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    },
  };
}
