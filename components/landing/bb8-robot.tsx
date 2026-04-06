"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useLanguage, type Language } from "@/lib/language-context";

const BB8_PHRASE_POOLS: Record<Language, Record<string, string[]>> = {
  en: {
    default: [
      "Beep boop!",
      "BB-8 online!",
      "Scanning...",
      "All systems go!",
      "Stay close!",
    ],
    hero: ["Welcome back!", "Ready to roll.", "Hero mode active."],
    features: ["Feature scan complete.", "Systems optimized.", "Nice capabilities!"],
    "use-cases": ["Live use cases detected.", "Workflow simulation on.", "This is practical AI."],
    "why-us": ["Trust protocol engaged.", "Partnership mode active.", "Reliability confirmed."],
    "about-us": ["Meet the crew.", "Mission data loaded.", "This is our story."],
    contact: ["I can relay your message.", "Ready to connect.", "Let's build together."],
    nav: ["On my way!", "Switching scene.", "Route acknowledged."],
    celebration: ["Message received!", "Transmission confirmed!", "Great, we will talk soon."],
  },
  vi: {
    default: [
      "Bíp bíp!",
      "BB-8 đã sẵn sàng!",
      "Đang quét...",
      "Hệ thống ổn định!",
      "Đi cùng mình nhé!",
    ],
    hero: ["Chào mừng quay lại!", "Sẵn sàng lăn bánh.", "Chế độ Hero đang bật."],
    features: ["Đã quét xong tính năng.", "Hệ thống được tối ưu.", "Năng lực rất ổn!"],
    "use-cases": ["Đang hiển thị use case.", "Mô phỏng workflow đang chạy.", "AI ứng dụng thực tế đây."],
    "why-us": ["Kích hoạt chế độ tin cậy.", "Sẵn sàng đồng hành.", "Độ ổn định đã xác nhận."],
    "about-us": ["Cùng gặp đội ngũ nhé.", "Dữ liệu sứ mệnh đã tải.", "Đây là câu chuyện của tụi mình."],
    contact: ["Mình có thể chuyển lời nhắn.", "Sẵn sàng kết nối.", "Cùng xây dựng giải pháp nhé."],
    nav: ["Đang di chuyển!", "Đổi cảnh ngay đây.", "Đã nhận lệnh điều hướng."],
    celebration: ["Đã nhận thông tin!", "Truyền tín hiệu thành công!", "Tuyệt, tụi mình sẽ liên hệ sớm."],
  },
};

type HeadInitRotation = {
  x: number;
  y: number;
  z: number;
};

type SectionSceneState = {
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  lookX: number;
  lookY: number;
  lookZ: number;
  ambientIntensity: number;
  fillIntensity: number;
  rimIntensity: number;
  fogDensity: number;
  floorColor: number;
  gridMajorColor: number;
  gridMinorColor: number;
  robotYOffset: number;
  robotDepthBias: number;
  robotScaleBias: number;
};

type ViewportProfile = {
  cameraYOffset: number;
  cameraZOffset: number;
  scaleMultiplier: number;
  moveLimit: number;
  baseY: number;
  zNear: number;
  zFar: number;
  bubbleOffsetY: number;
  maxPixelRatio: number;
  pointerReach: number;
};

const SECTION_SCENE_STATES: Record<string, SectionSceneState> = {
  hero: {
    cameraX: 0,
    cameraY: 5,
    cameraZ: 16,
    lookX: 0,
    lookY: 2,
    lookZ: 0,
    ambientIntensity: 1.55,
    fillIntensity: 1.62,
    rimIntensity: 1.3,
    fogDensity: 0.026,
    floorColor: 0xd6dce6,
    gridMajorColor: 0xa7b1bf,
    gridMinorColor: 0xc6ceda,
    robotYOffset: 0,
    robotDepthBias: 0,
    robotScaleBias: 1,
  },
  features: {
    cameraX: -0.6,
    cameraY: 5.8,
    cameraZ: 19,
    lookX: 0,
    lookY: 1.7,
    lookZ: 0.8,
    ambientIntensity: 1.35,
    fillIntensity: 1.45,
    rimIntensity: 1.45,
    fogDensity: 0.029,
    floorColor: 0xcfd6e2,
    gridMajorColor: 0x98a6bb,
    gridMinorColor: 0xbbc6d6,
    robotYOffset: -0.12,
    robotDepthBias: -0.38,
    robotScaleBias: 0.94,
  },
  "use-cases": {
    cameraX: 0.5,
    cameraY: 6.3,
    cameraZ: 21,
    lookX: 0,
    lookY: 1.5,
    lookZ: 1.3,
    ambientIntensity: 1.25,
    fillIntensity: 1.38,
    rimIntensity: 1.58,
    fogDensity: 0.032,
    floorColor: 0xc4ccd9,
    gridMajorColor: 0x8fa0ba,
    gridMinorColor: 0xafbfd4,
    robotYOffset: -0.18,
    robotDepthBias: -0.62,
    robotScaleBias: 0.9,
  },
  "why-us": {
    cameraX: -0.35,
    cameraY: 6.7,
    cameraZ: 23,
    lookX: 0,
    lookY: 1.3,
    lookZ: 1.6,
    ambientIntensity: 1.18,
    fillIntensity: 1.24,
    rimIntensity: 1.7,
    fogDensity: 0.035,
    floorColor: 0xbec8d6,
    gridMajorColor: 0x879bb7,
    gridMinorColor: 0xa6b9d0,
    robotYOffset: -0.24,
    robotDepthBias: -0.82,
    robotScaleBias: 0.86,
  },
  "about-us": {
    cameraX: 0.3,
    cameraY: 6.95,
    cameraZ: 24,
    lookX: 0,
    lookY: 1.22,
    lookZ: 1.75,
    ambientIntensity: 1.14,
    fillIntensity: 1.21,
    rimIntensity: 1.76,
    fogDensity: 0.036,
    floorColor: 0xbac5d4,
    gridMajorColor: 0x8398b4,
    gridMinorColor: 0xa2b7cf,
    robotYOffset: -0.27,
    robotDepthBias: -0.9,
    robotScaleBias: 0.84,
  },
  contact: {
    cameraX: 0,
    cameraY: 7.2,
    cameraZ: 25,
    lookX: 0,
    lookY: 1.1,
    lookZ: 1.9,
    ambientIntensity: 1.12,
    fillIntensity: 1.18,
    rimIntensity: 1.82,
    fogDensity: 0.037,
    floorColor: 0xb7c2d1,
    gridMajorColor: 0x8095b2,
    gridMinorColor: 0x9db3cc,
    robotYOffset: -0.3,
    robotDepthBias: -1,
    robotScaleBias: 0.82,
  },
};

const SECTION_ORDER = ["hero", "features", "use-cases", "why-us", "about-us", "contact"] as const;

const CINEMATIC_TRANSITION_SECONDS = 0.82;
const SECTION_OBSERVER_THRESHOLD = [0.3, 0.45, 0.6, 0.75];
const SECTION_OBSERVER_ROOT_MARGIN = "-8% 0px -42% 0px";

function getBlendFactor(deltaTime: number, transitionSeconds: number) {
  const tau = Math.max(transitionSeconds / 3, 0.001);
  return 1 - Math.exp(-deltaTime / tau);
}

function getSectionIndex(sectionId: string) {
  const index = SECTION_ORDER.indexOf(sectionId as (typeof SECTION_ORDER)[number]);
  return index < 0 ? 0 : index;
}

function easeInOutCubic(t: number) {
  if (t < 0.5) return 4 * t * t * t;
  return 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getViewportProfile(width: number, height: number): ViewportProfile {
  const safeWidth = Math.max(width, 1);
  const safeHeight = Math.max(height, 1);
  const portrait = safeHeight > safeWidth;

  if (safeWidth < 640) {
    return {
      cameraYOffset: portrait ? 0.7 : 0.35,
      cameraZOffset: portrait ? 2.4 : 1.2,
      scaleMultiplier: portrait ? 0.9 : 0.95,
      moveLimit: portrait ? 4.5 : 5.4,
      baseY: portrait ? 2.2 : 2.35,
      zNear: portrait ? 2.1 : 2.35,
      zFar: portrait ? -1.4 : -1.2,
      bubbleOffsetY: portrait ? 108 : 116,
      maxPixelRatio: 1.5,
      pointerReach: portrait ? 5.5 : 6.3,
    };
  }

  if (safeWidth < 1024) {
    return {
      cameraYOffset: 0.35,
      cameraZOffset: 1,
      scaleMultiplier: 0.96,
      moveLimit: 6.6,
      baseY: 2.42,
      zNear: 2.6,
      zFar: -1.1,
      bubbleOffsetY: 124,
      maxPixelRatio: 1.8,
      pointerReach: 7.3,
    };
  }

  return {
    cameraYOffset: 0,
    cameraZOffset: 0,
    scaleMultiplier: 1,
    moveLimit: 8,
    baseY: 2.5,
    zNear: 3,
    zFar: -1,
    bubbleOffsetY: 130,
    maxPixelRatio: 1.5,
    pointerReach: 8,
  };
}

type GPUTier = "high" | "medium" | "low";

function getGPUTier(gl: WebGLRenderingContext | WebGL2RenderingContext): GPUTier {
  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  if (!debugInfo) return "medium";
  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
  const gpuLower = renderer.toLowerCase();
  // Low-end: Intel integrated, Mali, Adreno 5xx or lower, software renderers
  if (
    gpuLower.includes("intel") ||
    gpuLower.includes("mali") ||
    gpuLower.includes("swiftshader") ||
    gpuLower.includes("llvmpipe") ||
    gpuLower.includes("software") ||
    /adreno.*[0-5]\d{2}/.test(gpuLower)
  ) {
    return "low";
  }
  // High-end: modern discrete NVIDIA/AMD
  if (
    gpuLower.includes("nvidia") ||
    gpuLower.includes("geforce") ||
    gpuLower.includes("radeon") ||
    gpuLower.includes("amd")
  ) {
    return "high";
  }
  return "medium";
}

function getPhrasePool(language: Language, sectionId: string, fallbackKey = "default") {
  const langPools = BB8_PHRASE_POOLS[language] ?? BB8_PHRASE_POOLS.en;
  return langPools[sectionId] ?? langPools[fallbackKey] ?? BB8_PHRASE_POOLS.en.default;
}

function disposeMaterial(material: THREE.Material) {
  const anyMaterial = material as THREE.Material & {
    map?: THREE.Texture;
    normalMap?: THREE.Texture;
    roughnessMap?: THREE.Texture;
    metalnessMap?: THREE.Texture;
    emissiveMap?: THREE.Texture;
    aoMap?: THREE.Texture;
    alphaMap?: THREE.Texture;
  };

  anyMaterial.map?.dispose();
  anyMaterial.normalMap?.dispose();
  anyMaterial.roughnessMap?.dispose();
  anyMaterial.metalnessMap?.dispose();
  anyMaterial.emissiveMap?.dispose();
  anyMaterial.aoMap?.dispose();
  anyMaterial.alphaMap?.dispose();
  material.dispose();
}

export function BB8Robot() {
  const { lang } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const bubbleTimeoutRef = useRef<number | null>(null);
  const bubbleVisibleRef = useRef(false);
  const langRef = useRef<Language>(lang);
  const [isLoaded, setIsLoaded] = useState(false);
  const [bubbleText, setBubbleText] = useState(() => getPhrasePool(lang, "hero")[0] ?? "BB-8 online!");
  const [bubbleVisible, setBubbleVisible] = useState(false);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    const root = rootRef.current;
    const canvasHost = canvasHostRef.current;
    if (!root || !canvasHost) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c1322, 0.026);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 500);
    let viewportProfile = getViewportProfile(window.innerWidth, window.innerHeight);
    camera.position.set(
      SECTION_SCENE_STATES.hero.cameraX,
      SECTION_SCENE_STATES.hero.cameraY + viewportProfile.cameraYOffset,
      SECTION_SCENE_STATES.hero.cameraZ + viewportProfile.cameraZOffset
    );
    camera.lookAt(
      SECTION_SCENE_STATES.hero.lookX,
      SECTION_SCENE_STATES.hero.lookY,
      SECTION_SCENE_STATES.hero.lookZ
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    const gpuTier = getGPUTier(renderer.getContext());
    const isLowGPU = gpuTier === "low";
    const isHighGPU = gpuTier === "high";
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isLowGPU ? 1 : viewportProfile.maxPixelRatio));
    renderer.shadowMap.enabled = !isLowGPU;
    renderer.shadowMap.type = isHighGPU ? THREE.PCFSoftShadowMap : THREE.BasicShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    canvasHost.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0x34466a, 1.55);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffefd8, 2.2);
    keyLight.position.set(-8, 15, 10);
    keyLight.castShadow = !isLowGPU;
    const shadowRes = isHighGPU ? 1024 : 512;
    keyLight.shadow.mapSize.set(shadowRes, shadowRes);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 60;
    keyLight.shadow.camera.left = -20;
    keyLight.shadow.camera.right = 20;
    keyLight.shadow.camera.top = 20;
    keyLight.shadow.camera.bottom = -20;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const rim = new THREE.DirectionalLight(0x7da5ff, 1.3);
    rim.position.set(10, 8, -15);
    scene.add(rim);

    const fill = new THREE.PointLight(0xff9a4e, 1.62, 32);
    fill.position.set(5, 3, 5);
    scene.add(fill);

    // Skip bounce light on low GPU (4 lights instead of 5)
    if (!isLowGPU) {
      const bounce = new THREE.PointLight(0x9ebfff, 1.05, 22);
      bounce.position.set(0, -1, 0);
      scene.add(bounce);
    }

    const floorGeo = new THREE.PlaneGeometry(60, 60);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xd6dce6,
      roughness: 0.62,
      metalness: 0.18,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.receiveShadow = true;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(60, 40, 0xa7b1bf, 0xc6ceda);
    gridHelper.position.y = 0.002;
    scene.add(gridHelper);

    const gridMaterials = Array.isArray(gridHelper.material)
      ? gridHelper.material
      : [gridHelper.material];

    let targetSceneState: SectionSceneState = { ...SECTION_SCENE_STATES.hero };
    let currentSceneState: SectionSceneState = { ...SECTION_SCENE_STATES.hero };
    let targetFloorColor = new THREE.Color(targetSceneState.floorColor);
    let targetGridMajorColor = new THREE.Color(targetSceneState.gridMajorColor);
    let targetGridMinorColor = new THREE.Color(targetSceneState.gridMinorColor);

    let particleCount = isLowGPU ? 120 : 300;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x6ea2ff,
      size: 0.06,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- FPS auto-downgrade monitor ---
    let fpsFrameCount = 0;
    let fpsAccumulator = 0;
    let lowFpsDuration = 0;
    let hasDowngraded = false;
    const FPS_CHECK_INTERVAL = 1; // seconds
    const LOW_FPS_THRESHOLD = 28;
    const DOWNGRADE_AFTER_SECONDS = 3;

    const glowRingGeo = new THREE.RingGeometry(0.8, 1.2, 64);
    glowRingGeo.rotateX(-Math.PI / 2);
    const glowRingMat = new THREE.MeshBasicMaterial({
      color: 0xff8d2a,
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
    glowRing.position.y = 0.01;
    scene.add(glowRing);

    const robotGlow = new THREE.PointLight(0xff8422, 1.5, 6);
    robotGlow.position.set(0, 0.5, 0);
    scene.add(robotGlow);

    let robotGroup: THREE.Group | null = null;
    let bodyMesh: THREE.Object3D | null = null;
    let headBone: THREE.Object3D | null = null;
    let headInit: HeadInitRotation | null = null;
    const phraseCursor = new Map<string, number>();
    let raf = 0;
    let disposed = false;
    let bubbleCooldownUntil = 0;
    let navAcknowledge = 0;
    let celebrationEnergy = 0;
    let canvasVisible = true;
    let isScrolling = false;
    let scrollTimeout: number | null = null;
    let lastPointerMoveTime = 0;

    let targetX = 0;
    let velX = 0;
    let velZ = 0;
    let headCurrentRotY = 0;
    let hoverProximity = 0;
    let glowScale = 1;
    let squashY = 1;
    let squashVelY = 0;
    let isSquashing = false;
    let anticipationTilt = 0;
    let prevTargetX = 0;
    let microOffsetX = 0;
    let microOffsetTimer = 0;
    let mouseNormX = 0;
    let mouseNormY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let time = 0;
    let robotLogicalZ = 0;
    let activeSectionId = "hero";
    let sectionTravelProgress = 1;
    let sectionTravelDirection = 1;

    const baseScale = 0.025;
    const maxSpeed = 0.025;
    const clock = new THREE.Clock();
    const robotWorldPosition = new THREE.Vector3();

    const toScreenPoint = (world: THREE.Vector3) => {
      const projected = world.clone().project(camera);
      const { width, height } = root.getBoundingClientRect();
      return {
        x: (projected.x * 0.5 + 0.5) * width,
        y: (-projected.y * 0.5 + 0.5) * height,
      };
    };

    const setBubbleXY = (x: number, y: number) => {
      const bubble = bubbleRef.current;
      if (!bubble) return;
      bubble.style.left = `${x}px`;
      bubble.style.top = `${y}px`;
    };

    const applyViewportProfile = (width: number, height: number) => {
      viewportProfile = getViewportProfile(width, height);
      targetX = THREE.MathUtils.clamp(targetX, -viewportProfile.moveLimit, viewportProfile.moveLimit);
      prevTargetX = THREE.MathUtils.clamp(prevTargetX, -viewportProfile.moveLimit, viewportProfile.moveLimit);
      robotLogicalZ = THREE.MathUtils.clamp(robotLogicalZ, viewportProfile.zFar, viewportProfile.zNear);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, viewportProfile.maxPixelRatio));

      if (robotGroup) {
        robotGroup.position.x = THREE.MathUtils.clamp(
          robotGroup.position.x,
          -viewportProfile.moveLimit,
          viewportProfile.moveLimit
        );
      }
    };

    const getNextPhrase = (context: string, sectionId: string) => {
      const sectionAwareContext = context === "tap" ? sectionId : context;
      const pool = getPhrasePool(langRef.current, sectionAwareContext, "default");
      const key = `${sectionAwareContext}:${langRef.current}`;
      const cursor = phraseCursor.get(key) ?? Math.floor(Math.random() * pool.length);
      const next = (cursor + 1) % pool.length;
      phraseCursor.set(key, next);
      return pool[next] ?? getPhrasePool(langRef.current, "default")[0] ?? "BB-8 online!";
    };

    const showSpeechBubble = ({
      force = false,
      context = "tap",
      durationMs = 2500,
      sectionId = activeSectionId,
    }: {
      force?: boolean;
      context?: string;
      durationMs?: number;
      sectionId?: string;
    } = {}) => {
      if (!robotGroup) return;
      const now = performance.now();
      if (!force && now < bubbleCooldownUntil) return;

      robotGroup.getWorldPosition(robotWorldPosition);
      const p = toScreenPoint(robotWorldPosition);
      const dx = Math.abs(pointerX - p.x);
      const dy = Math.abs(pointerY - p.y);
      if (!force && (dx > 170 || dy > 170)) return;

      setBubbleText(getNextPhrase(context, sectionId));
      setBubbleXY(p.x, p.y - viewportProfile.bubbleOffsetY);
      bubbleVisibleRef.current = true;
      setBubbleVisible(true);
      bubbleCooldownUntil = now + (force ? 1600 : 2200);

      if (bubbleTimeoutRef.current) {
        window.clearTimeout(bubbleTimeoutRef.current);
      }
      bubbleTimeoutRef.current = window.setTimeout(() => {
        bubbleVisibleRef.current = false;
        setBubbleVisible(false);
      }, durationMs);
    };

    const updateSize = () => {
      const { width, height } = root.getBoundingClientRect();
      if (!width || !height) return;
      applyViewportProfile(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const setTargetSection = (sectionId: string) => {
      const previousSectionId = activeSectionId;
      const next = SECTION_SCENE_STATES[sectionId] ?? SECTION_SCENE_STATES.hero;
      const returningToHero = activeSectionId !== "hero" && sectionId === "hero";
      activeSectionId = sectionId;
      targetSceneState = { ...next };
      targetFloorColor.setHex(next.floorColor);
      targetGridMajorColor.setHex(next.gridMajorColor);
      targetGridMinorColor.setHex(next.gridMinorColor);

      if (previousSectionId !== sectionId) {
        const previousIndex = getSectionIndex(previousSectionId);
        const nextIndex = getSectionIndex(sectionId);
        sectionTravelDirection = nextIndex >= previousIndex ? 1 : -1;
        sectionTravelProgress = 0;
      }

      if (returningToHero) {
        mouseNormX = 0;
        mouseNormY = 0;
        targetX = 0;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      // Throttle pointermove to ~30fps to reduce main thread work
      const now = performance.now();
      if (now - lastPointerMoveTime < 33) return;
      lastPointerMoveTime = now;

      const rect = root.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;

      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
      if (rect.width <= 0 || rect.height <= 0) return;

      const nextMouseNormX = (pointerX / rect.width) * 2 - 1;
      const nextMouseNormY = -(pointerY / rect.height) * 2 + 1;
      mouseNormX = THREE.MathUtils.clamp(nextMouseNormX, -1, 1);
      mouseNormY = THREE.MathUtils.clamp(nextMouseNormY, -1, 1);
      targetX = mouseNormX * viewportProfile.pointerReach;
    };

    const onPointerDown = () => {
      squashVelY = -0.018;
      isSquashing = true;
      showSpeechBubble();
    };

    const onNavigateEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ target?: string }>;
      const target = customEvent.detail?.target?.replace("#", "") ?? "";
      const nextSection = SECTION_SCENE_STATES[target] ? target : activeSectionId;
      if (nextSection !== activeSectionId) {
        setTargetSection(nextSection);
      }
      navAcknowledge = 1;
      squashVelY = -0.012;
      isSquashing = true;
      showSpeechBubble({ force: true, context: "nav", durationMs: 1700, sectionId: nextSection });
    };

    const onCelebrateEvent = () => {
      celebrationEnergy = 1;
      navAcknowledge = 0.6;
      squashVelY = -0.024;
      isSquashing = true;
      showSpeechBubble({ force: true, context: "celebration", durationMs: 2600 });
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("bb8:navigate", onNavigateEvent as EventListener);
    window.addEventListener("bb8:celebrate", onCelebrateEvent as EventListener);
    canvasHost.addEventListener("pointerdown", onPointerDown);
    canvasHost.addEventListener("contextmenu", onContextMenu);

    // Visibility-based rAF pause: stop rendering when scrolled off-screen
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        canvasVisible = entry.isIntersecting;
        if (canvasVisible && !disposed) {
          clock.getDelta(); // flush stale delta
        }
      },
      { threshold: 0, rootMargin: "100px 0px 100px 0px" }
    );
    visibilityObserver.observe(root);

    // Detect active scrolling to reduce rendering work
    const onScroll = () => {
      isScrolling = true;
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        isScrolling = false;
      }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(root);
    updateSize();

    const sectionIds = Object.keys(SECTION_SCENE_STATES);
    const observedSections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const intersectionRatios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!id) return;
          intersectionRatios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let bestId = activeSectionId;
        let bestRatio = -1;
        intersectionRatios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestId !== activeSectionId) {
          setTargetSection(bestId);
        }
      },
      {
        threshold: SECTION_OBSERVER_THRESHOLD,
        rootMargin: SECTION_OBSERVER_ROOT_MARGIN,
      }
    );

    observedSections.forEach((section) => {
      observer.observe(section);
      intersectionRatios.set(section.id, 0);
    });

    const heroRect = root.getBoundingClientRect();
    if (heroRect.top <= window.innerHeight * 0.6) {
      setTargetSection("hero");
    }

    const loader = new GLTFLoader();
    loader.load(
      "/models/bb8.glb",
      (gltf) => {
        if (disposed) return;
        robotGroup = gltf.scene;

        robotGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        headBone = robotGroup.getObjectByName("Head") ?? null;
        bodyMesh = robotGroup.getObjectByName("Body") ?? null;

        if (!headBone || !bodyMesh) {
          const meshes: THREE.Mesh[] = [];
          robotGroup.traverse((child) => {
            if (child instanceof THREE.Mesh) meshes.push(child);
          });
          if (meshes.length >= 2) {
            meshes.sort((a, b) => {
              const ap = new THREE.Vector3();
              const bp = new THREE.Vector3();
              a.getWorldPosition(ap);
              b.getWorldPosition(bp);
              return bp.y - ap.y;
            });
            const topMesh = meshes[0];
            const bottomMesh = meshes[meshes.length - 1];
            if (!headBone && topMesh) headBone = topMesh;
            if (!bodyMesh && bottomMesh) bodyMesh = bottomMesh;
          }
        }

        if (headBone) {
          headInit = {
            x: headBone.rotation.x,
            y: headBone.rotation.y,
            z: headBone.rotation.z,
          };
          headBone.position.z += 1.5;
        }

        robotGroup.scale.set(baseScale, baseScale, baseScale);
        robotGroup.position.set(0, viewportProfile.baseY, 0);
        scene.add(robotGroup);
        setIsLoaded(true);
      },
      undefined,
      () => {
        setIsLoaded(true);
      }
    );

    const animate = () => {
      raf = window.requestAnimationFrame(animate);

      // Skip rendering entirely when off-screen
      if (!canvasVisible) return;

      const dt = clock.getDelta();
      // Clamp dt to avoid large jumps after pause
      const clampedDt = Math.min(dt, 0.1);
      time += clampedDt;

      // FPS auto-downgrade logic
      if (!hasDowngraded) {
        fpsFrameCount++;
        fpsAccumulator += dt;
        if (fpsAccumulator >= FPS_CHECK_INTERVAL) {
          const avgFps = fpsFrameCount / fpsAccumulator;
          if (avgFps < LOW_FPS_THRESHOLD) {
            lowFpsDuration += fpsAccumulator;
          } else {
            lowFpsDuration = 0;
          }
          if (lowFpsDuration >= DOWNGRADE_AFTER_SECONDS) {
            hasDowngraded = true;
            renderer.shadowMap.enabled = false;
            keyLight.castShadow = false;
            particleMat.opacity = 0.25;
            renderer.setPixelRatio(1);
          }
          fpsFrameCount = 0;
          fpsAccumulator = 0;
        }
      }

      sectionTravelProgress = Math.min(1, sectionTravelProgress + dt / 0.84);
      navAcknowledge += (0 - navAcknowledge) * 0.08;
      celebrationEnergy += (0 - celebrationEnergy) * 0.06;
      const transitionDamping = getBlendFactor(dt, CINEMATIC_TRANSITION_SECONDS);
      const travelEase = easeInOutCubic(sectionTravelProgress);
      const travelPulse = Math.sin(Math.PI * travelEase);
      const travelShiftX = sectionTravelDirection * travelPulse * 0.28;
      const travelLiftY = travelPulse * 0.19;
      const travelPushZ = -travelPulse * 1.45;
      const travelLookX = sectionTravelDirection * travelPulse * 0.2;
      const travelLookY = -travelPulse * 0.08;
      const travelLookZ = travelPulse * 0.35;
      const travelFogBoost = travelPulse * 0.007;
      currentSceneState.cameraX = THREE.MathUtils.lerp(
        currentSceneState.cameraX,
        targetSceneState.cameraX,
        transitionDamping
      );
      currentSceneState.cameraY = THREE.MathUtils.lerp(
        currentSceneState.cameraY,
        targetSceneState.cameraY,
        transitionDamping
      );
      currentSceneState.cameraZ = THREE.MathUtils.lerp(
        currentSceneState.cameraZ,
        targetSceneState.cameraZ,
        transitionDamping
      );
      currentSceneState.lookX = THREE.MathUtils.lerp(
        currentSceneState.lookX,
        targetSceneState.lookX,
        transitionDamping
      );
      currentSceneState.lookY = THREE.MathUtils.lerp(
        currentSceneState.lookY,
        targetSceneState.lookY,
        transitionDamping
      );
      currentSceneState.lookZ = THREE.MathUtils.lerp(
        currentSceneState.lookZ,
        targetSceneState.lookZ,
        transitionDamping
      );
      currentSceneState.ambientIntensity = THREE.MathUtils.lerp(
        currentSceneState.ambientIntensity,
        targetSceneState.ambientIntensity,
        transitionDamping
      );
      currentSceneState.fillIntensity = THREE.MathUtils.lerp(
        currentSceneState.fillIntensity,
        targetSceneState.fillIntensity,
        transitionDamping
      );
      currentSceneState.rimIntensity = THREE.MathUtils.lerp(
        currentSceneState.rimIntensity,
        targetSceneState.rimIntensity,
        transitionDamping
      );
      currentSceneState.fogDensity = THREE.MathUtils.lerp(
        currentSceneState.fogDensity,
        targetSceneState.fogDensity,
        transitionDamping
      );
      currentSceneState.robotYOffset = THREE.MathUtils.lerp(
        currentSceneState.robotYOffset,
        targetSceneState.robotYOffset,
        transitionDamping
      );
      currentSceneState.robotDepthBias = THREE.MathUtils.lerp(
        currentSceneState.robotDepthBias,
        targetSceneState.robotDepthBias,
        transitionDamping
      );
      currentSceneState.robotScaleBias = THREE.MathUtils.lerp(
        currentSceneState.robotScaleBias,
        targetSceneState.robotScaleBias,
        transitionDamping
      );

      floorMat.color.lerp(targetFloorColor, transitionDamping);
      const majorGridMat = gridMaterials[0];
      const minorGridMat = gridMaterials[1] ?? gridMaterials[0];
      majorGridMat.color.lerp(targetGridMajorColor, transitionDamping);
      minorGridMat.color.lerp(targetGridMinorColor, transitionDamping);

      const fog = scene.fog;
      if (fog instanceof THREE.FogExp2) {
        fog.density = currentSceneState.fogDensity + travelFogBoost;
      }
      ambient.intensity = currentSceneState.ambientIntensity;
      fill.intensity = currentSceneState.fillIntensity;
      rim.intensity = currentSceneState.rimIntensity;

      const sectionTravel = currentSceneState.cameraZ - SECTION_SCENE_STATES.hero.cameraZ;
      const travelProgress = THREE.MathUtils.clamp(sectionTravel / 9, 0, 1);

      particles.rotation.y = time * 0.02 + travelProgress * 0.2 + travelPulse * 0.18;
      particles.position.y = -travelProgress * 0.8 + travelPulse * 0.22;
      glowRingMat.opacity = 0.18 + Math.sin(time * 2.5) * 0.06;
      floor.position.z = travelProgress * 0.9 + travelPulse * 0.5;
      gridHelper.position.z = travelProgress * 1.15 + travelPulse * 0.62;

      if (robotGroup) {
        const rx = robotGroup.position.x;
        microOffsetTimer += dt;
        if (microOffsetTimer > 1.8 + Math.random() * 1.5) {
          microOffsetX = (Math.random() - 0.5) * 0.6;
          microOffsetTimer = 0;
        }

        const effectiveTargetX = targetX + microOffsetX;
        const targetDelta = effectiveTargetX - prevTargetX;
        prevTargetX += (effectiveTargetX - prevTargetX) * 0.05;
        anticipationTilt += (-targetDelta * 0.4 - anticipationTilt) * 0.15;

        const robotScreenX = robotGroup.position.x / (viewportProfile.moveLimit + 2);
        const mouseDist = Math.abs(mouseNormX - robotScreenX);
        const targetProximity = mouseDist < 0.25 ? 1 - mouseDist / 0.25 : 0;
        hoverProximity += (targetProximity - hoverProximity) * 0.06;

        const magnetBoost = 1 + hoverProximity * 1.2;
        const dx = effectiveTargetX - rx;
        const dist = Math.abs(dx);
        if (dist > 0.3) velX += dx * 0.002 * magnetBoost;
        velX *= 0.9;
        velX = Math.max(-maxSpeed, Math.min(maxSpeed, velX));
        robotGroup.position.x += velX;
        robotGroup.position.x = Math.max(
          -viewportProfile.moveLimit,
          Math.min(viewportProfile.moveLimit, robotGroup.position.x)
        );

        const targetZ =
          viewportProfile.zFar +
          (-mouseNormY * 0.5 + 0.5) * (viewportProfile.zNear - viewportProfile.zFar);
        const dz = targetZ - robotGroup.position.z;
        if (Math.abs(dz) > 0.05) velZ += dz * 0.001;
        velZ *= 0.9;
        velZ = Math.max(-0.025, Math.min(0.025, velZ));
        robotLogicalZ += velZ;
        robotLogicalZ = Math.max(viewportProfile.zFar, Math.min(viewportProfile.zNear, robotLogicalZ));
        robotGroup.position.z = robotLogicalZ + currentSceneState.robotDepthBias;

        const breathScale = 1 + Math.sin(time * 1.4) * 0.018 + Math.sin(time * 0.6) * 0.008;
        robotGroup.position.y =
          viewportProfile.baseY +
          Math.sin(time * 1.8) * 0.04 +
          Math.sin(time * 0.5) * 0.02 +
          currentSceneState.robotYOffset;

        const zRange = viewportProfile.zNear - viewportProfile.zFar;
        const zNorm = THREE.MathUtils.clamp((robotGroup.position.z - viewportProfile.zFar) / zRange, 0, 1);
        const perspectiveScale = baseScale * viewportProfile.scaleMultiplier * (0.72 + zNorm * 0.88);
        glowScale += (1 + hoverProximity * 0.12 - glowScale) * 0.07;

        if (isSquashing) {
          const stiffness = 0.18;
          const damp = 0.72;
          squashVelY += (1 - squashY) * stiffness;
          squashVelY *= damp;
          squashY += squashVelY;
          if (Math.abs(squashY - 1) < 0.001 && Math.abs(squashVelY) < 0.001) {
            squashY = 1;
            isSquashing = false;
          }
        }

        const scrollScale = currentSceneState.robotScaleBias;
        const finalScale = perspectiveScale * glowScale * breathScale * scrollScale;
        robotGroup.scale.set(
          finalScale * (1 + (1 - squashY) * 0.5),
          finalScale * squashY,
          finalScale * (1 + (1 - squashY) * 0.5)
        );

        const speed = Math.abs(velX);
        robotGlow.intensity =
          1.45 + hoverProximity * 0.95 + speed * 6 + Math.sin(time * 3) * 0.22 + celebrationEnergy * 1.15;
        glowRingMat.opacity = THREE.MathUtils.clamp(
          0.18 + hoverProximity * 0.16 + Math.sin(time * 2.4) * 0.04 + celebrationEnergy * 0.14,
          0.14,
          0.62
        );

        if (bodyMesh) {
          const totalSpeed = Math.abs(velX) + Math.abs(velZ);
          if (totalSpeed > 0.001 && bodyMesh instanceof THREE.Object3D) {
            bodyMesh.rotation.z -= velX * 3.5;
            bodyMesh.rotation.x -= velZ * 3.5;
            bodyMesh.rotation.y += totalSpeed * 0.5 * Math.sin(time * 1.3);
          }
        }

        const targetTilt = -velX * 1.2 + anticipationTilt * 0.5;
        robotGroup.rotation.z += (targetTilt - robotGroup.rotation.z) * 0.08;

        if (headBone && headInit) {
          const headTargetY = mouseNormX * 1.2;
          headCurrentRotY += (headTargetY - headCurrentRotY) * 0.12;
          const acknowledgeNod = Math.sin(time * 16) * 0.045 * navAcknowledge;
          const idleNodX =
            Math.sin(time * 1.2) * 0.025 + Math.sin(time * 0.7) * 0.01 + acknowledgeNod + celebrationEnergy * 0.03;
          const idleSwayY = Math.sin(time * 0.9) * 0.01;
          const pitchFromMouse = THREE.MathUtils.clamp(-mouseNormY * 0.5, -0.5, 0.5);
          headBone.rotation.x = headInit.x + idleNodX + pitchFromMouse;
          headBone.rotation.y = headInit.y + headCurrentRotY + idleSwayY;
          headBone.rotation.z = headInit.z;
        }

        glowRing.position.x = robotGroup.position.x;
        glowRing.position.z = robotGroup.position.z;
        const glowRingScale = (0.7 + zNorm * 0.8) * (1 + celebrationEnergy * 0.22);
        glowRing.scale.set(glowRingScale, 1, glowRingScale);
        robotGlow.position.set(robotGroup.position.x, 0.3, robotGroup.position.z);

        if (bubbleVisibleRef.current) {
          robotGroup.getWorldPosition(robotWorldPosition);
          const p = toScreenPoint(robotWorldPosition);
          setBubbleXY(p.x, p.y - viewportProfile.bubbleOffsetY);
        }
      }

      camera.position.x = currentSceneState.cameraX + Math.sin(time * 0.1) * 0.16 + travelShiftX;
      camera.position.y =
        currentSceneState.cameraY + viewportProfile.cameraYOffset + Math.sin(time * 0.15) * 0.08 + travelLiftY;
      camera.position.z = currentSceneState.cameraZ + viewportProfile.cameraZOffset + travelPushZ;
      camera.lookAt(
        currentSceneState.lookX + travelLookX,
        currentSceneState.lookY + travelLookY,
        currentSceneState.lookZ + travelLookZ
      );

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      observer.disconnect();
      visibilityObserver.disconnect();
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("bb8:navigate", onNavigateEvent as EventListener);
      window.removeEventListener("bb8:celebrate", onCelebrateEvent as EventListener);
      canvasHost.removeEventListener("pointerdown", onPointerDown);
      canvasHost.removeEventListener("contextmenu", onContextMenu);

      if (bubbleTimeoutRef.current) {
        window.clearTimeout(bubbleTimeoutRef.current);
      }

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => disposeMaterial(m));
          } else {
            disposeMaterial(obj.material);
          }
        }
      });

      particleGeo.dispose();
      particleMat.dispose();
      glowRingGeo.dispose();
      glowRingMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      renderer.dispose();
      renderer.forceContextLoss();

      if (renderer.domElement.parentElement === canvasHost) {
        canvasHost.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0 h-full w-full">
      <div
        ref={canvasHostRef}
        className="absolute inset-0 z-0 h-full w-full"
        style={{ willChange: "transform" }}
        aria-hidden
      />

      {!isLoaded ? (
        <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
          <div className="rounded-full border border-amber-300/30 bg-slate-950/40 px-4 py-2 text-xs tracking-[0.18em] text-amber-200/75 backdrop-blur-sm">
            LOADING BB-8
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(14,24,44,0)_35%,rgba(14,24,44,0.26)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,rgba(14,20,36,0.12),rgba(14,20,36,0.04)_35%,rgba(14,20,36,0.18))]" />

      <div
        ref={bubbleRef}
        className={`pointer-events-none absolute z-[2] -translate-x-1/2 -translate-y-full transition-opacity duration-200 ${bubbleVisible ? "opacity-100" : "opacity-0"}`}
        style={{ left: 0, top: 0 }}
      >
        <div className="rounded-xl border border-amber-300/60 bg-slate-950/85 px-4 py-2 shadow-[0_0_24px_rgba(255,149,0,0.24)] backdrop-blur-md">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
            {bubbleText}
          </span>
        </div>
      </div>
    </div>
  );
}
