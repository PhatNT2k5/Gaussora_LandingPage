/**
 * BB-8 Interactive Robot – Enhanced Scene
 * Fixed: head tracking without detachment, smooth movement
 */

// ─── SCENE SETUP ─────────────────────────────────────────────────────────────
const container = document.getElementById('webgl-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x070b14, 0.035);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 5, 16);
camera.lookAt(0, 2, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// ─── LIGHTS ──────────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x1a2a4a, 1.5));

const keyLight = new THREE.DirectionalLight(0xfff5e0, 2.5);
keyLight.position.set(-8, 15, 10);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.near = 1;
keyLight.shadow.camera.far = 60;
keyLight.shadow.camera.left = -20;
keyLight.shadow.camera.right = 20;
keyLight.shadow.camera.top = 20;
keyLight.shadow.camera.bottom = -20;
keyLight.shadow.bias = -0.001;
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x4488ff, 1.2);
rimLight.position.set(10, 8, -15);
scene.add(rimLight);

const fillLight = new THREE.PointLight(0xff7a00, 1.5, 30);
fillLight.position.set(5, 3, 5);
scene.add(fillLight);

const bounceLight = new THREE.PointLight(0x88aaff, 0.8, 20);
bounceLight.position.set(0, -1, 0);
scene.add(bounceLight);

// ─── FLOOR ───────────────────────────────────────────────────────────────────
const floorGeo = new THREE.PlaneGeometry(60, 60);
floorGeo.rotateX(-Math.PI / 2);
const floorMat = new THREE.MeshStandardMaterial({
    color: 0x080d1a, roughness: 0.3, metalness: 0.6,
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.receiveShadow = true;
scene.add(floor);

const gridHelper = new THREE.GridHelper(60, 40, 0x1a2a4a, 0x0f1a30);
gridHelper.position.y = 0.002;
scene.add(gridHelper);

// Invisible plane for raycasting
const invisiblePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ visible: false })
);
scene.add(invisiblePlane);

// ─── PARTICLES ───────────────────────────────────────────────────────────────
function createParticles() {
    const count = 600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * 50;
        pos[i * 3 + 1] = Math.random() * 20;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
        color: 0x4488ff, size: 0.06, transparent: true, opacity: 0.5, sizeAttenuation: true,
    });
    return new THREE.Points(geo, mat);
}
const particles = createParticles();
scene.add(particles);

// ─── GLOW RING ───────────────────────────────────────────────────────────────
const glowRingGeo = new THREE.RingGeometry(0.8, 1.2, 64);
glowRingGeo.rotateX(-Math.PI / 2);
const glowRingMat = new THREE.MeshBasicMaterial({
    color: 0xff8c00, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false,
});
const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
glowRing.position.y = 0.01;
scene.add(glowRing);

const robotGlow = new THREE.PointLight(0xff7700, 1.5, 6);
robotGlow.position.set(0, 0.5, 0);
scene.add(robotGlow);

// ─── ROBOT STATE ─────────────────────────────────────────────────────────────
let robotGroup = null;
let headBone = null;   // The head bone/mesh – we only rotate it, never lookAt
let bodyMesh = null;

// Smooth target position (mouse on floor)
let targetX = 0;
let targetZ = 0;

// Robot velocity
let velX = 0;

// Head rotation (only subtle left/right yaw)
let headCurrentRotY = 0;

// Z movement
let velZ = 0;
const zNear = 3;     // closest Z (toward camera)
const zFar = -1;     // farthest Z (barely retreats)

const baseScale = 0.025;
const baseY = 2.5;
const moveLimit = 8;      // max X range ±8
const maxSpeed = 0.025;    // slower movement

const mouse2D = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();

// ─── INTERACTION STATE ────────────────────────────────────────────────────────
// Hover proximity
let hoverProximity = 0;       // 0 = far, 1 = close
let glowScale = 1.0;          // extra scale from hover

// Click squash spring
let squashY = 1.0;            // current Y scale multiplier
let squashVelY = 0;           // spring velocity
let isSquashing = false;

// Idle breathing
let breathScale = 1.0;

// Anticipation lean (opposite tilt before moving)
let anticipationTilt = 0;
let prevTargetX = 0;

// Dead zone micro-offset (prevent robotic precision)
let microOffsetX = 0;
let microOffsetTimer = 0;

// ─── LOAD ROBOT ──────────────────────────────────────────────────────────────
const loader = new THREE.GLTFLoader();
const loadingBar = document.getElementById('loading-bar');
const loadingText = document.getElementById('loading-text');

loader.load(
    'bb8.glb',
    function (gltf) {
        robotGroup = gltf.scene;

        robotGroup.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Find head and body by name
        headBone = robotGroup.getObjectByName('Head');
        bodyMesh = robotGroup.getObjectByName('Body');

        // Fallback: try to find them from mesh list
        if (!headBone || !bodyMesh) {
            const meshes = [];
            robotGroup.traverse(c => { if (c.isMesh) meshes.push(c); });
            console.log('All meshes:', meshes.map(m => m.name));
            if (meshes.length >= 2) {
                // Sort by world Y – topmost is head
                meshes.sort((a, b) => {
                    const pa = new THREE.Vector3(); a.getWorldPosition(pa);
                    const pb = new THREE.Vector3(); b.getWorldPosition(pb);
                    return pb.y - pa.y;
                });
                if (!headBone) headBone = meshes[0];
                if (!bodyMesh) bodyMesh = meshes[meshes.length - 1];
            }
        }

        // Store initial head rotation so we can add to it
        if (headBone) {
            headBone._initRotX = headBone.rotation.x;
            headBone._initRotY = headBone.rotation.y;
            headBone._initRotZ = headBone.rotation.z;
            // Push head forward so it doesn't look recessed
            headBone.position.z += 1.5;
        }

        robotGroup.scale.set(baseScale, baseScale, baseScale);
        robotGroup.position.set(0, baseY, 0);
        scene.add(robotGroup);

        console.log('BB-8 loaded! Head:', headBone?.name, 'Body:', bodyMesh?.name);
        finishLoading();
    },
    function (xhr) {
        if (xhr.total > 0) {
            const pct = Math.round((xhr.loaded / xhr.total) * 100);
            if (loadingBar) loadingBar.style.width = pct + '%';
            if (loadingText) loadingText.textContent = `Loading robot... ${pct}%`;
        }
    },
    function (err) {
        console.error('Error loading bb8.glb:', err);
        if (loadingText) loadingText.textContent = 'Load error';
    }
);

function finishLoading() {
    const el = document.getElementById('loading');
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => el.style.display = 'none', 800);
}

// ─── INPUT ───────────────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

// Normalized mouse position (-1 to 1)
let mouseNormX = 0;
let mouseNormY = 0;

window.addEventListener('mousemove', (e) => {
    if (cursor) { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }
    if (cursorDot) { cursorDot.style.left = e.clientX + 'px'; cursorDot.style.top = e.clientY + 'px'; }

    // Map mouse to -1..1 range (works everywhere on screen)
    mouseNormX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNormY = -(e.clientY / window.innerHeight) * 2 + 1;

    // Map to world X range directly (moveLimit range)
    targetX = mouseNormX * (moveLimit + 2);

    const hud = document.getElementById('hud-coords');
    if (hud) hud.textContent = `COORD: ${targetX.toFixed(2)} / ${mouseNormY.toFixed(2)}`;
});

window.addEventListener('mousedown', () => {
    if (cursor) { cursor.style.width = '32px'; cursor.style.height = '32px'; cursor.style.borderColor = 'rgba(255,149,0,1)'; }
    // Squash on click
    squashVelY = -0.018;
    isSquashing = true;
    // Try to show speech bubble if clicking near robot
    showSpeechBubble();
});
window.addEventListener('mouseup', () => {
    if (cursor) { cursor.style.width = '20px'; cursor.style.height = '20px'; cursor.style.borderColor = 'rgba(255,165,50,0.8)'; }
});

// ─── SPEECH BUBBLE ────────────────────────────────────────────────────────────
const bb8Phrases = [
    'Beep boop!',
    'BB-8 online!',
    'Where are we?',
    'I see you...',
    'Scanning...',
    'Bweeep!',
    'Stay close!',
    'All systems go!',
    'Whooop!',
    'Do not leave me!',
    'Resistance is futile',
    '...Boo!',
];
let phraseIndex = Math.floor(Math.random() * bb8Phrases.length);
let bubbleTimeout = null;
const speechBubble = document.getElementById('speech-bubble');
const bubbleText   = document.getElementById('bubble-text');

function showSpeechBubble() {
    if (!robotGroup) return;

    // Check if click is roughly near robot in screen space
    const robotPos3D = new THREE.Vector3();
    robotGroup.getWorldPosition(robotPos3D);
    const projected = robotPos3D.clone().project(camera);
    const robotScreenX = (projected.x * 0.5 + 0.5) * window.innerWidth;
    const robotScreenY = (-projected.y * 0.5 + 0.5) * window.innerHeight;
    const clickDistX = Math.abs(mouseNormX * window.innerWidth / 2 + window.innerWidth / 2 - robotScreenX);
    const clickDistY = Math.abs(((1 - mouseNormY) / 2) * window.innerHeight - robotScreenY);
    const clickRadius = 160; // pixels

    if (clickDistX > clickRadius || clickDistY > clickRadius) return;

    // Pick next phrase
    phraseIndex = (phraseIndex + 1) % bb8Phrases.length;
    bubbleText.textContent = bb8Phrases[phraseIndex];

    // Position above robot
    speechBubble.style.left = robotScreenX + 'px';
    speechBubble.style.top  = (robotScreenY - 130) + 'px';

    // Trigger re-animation by replacing bubble-box
    const box = speechBubble.querySelector('.bubble-box');
    box.style.animation = 'none';
    requestAnimationFrame(() => {
        box.style.animation = '';
    });

    speechBubble.classList.add('visible');

    clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => {
        speechBubble.classList.remove('visible');
    }, 2500);
}

// Update bubble position every frame (follows robot as it moves)
function updateBubblePosition() {
    if (!robotGroup || !speechBubble.classList.contains('visible')) return;
    const robotPos3D = new THREE.Vector3();
    robotGroup.getWorldPosition(robotPos3D);
    const projected = robotPos3D.clone().project(camera);
    const sx = (projected.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-projected.y * 0.5 + 0.5) * window.innerHeight;
    speechBubble.style.left = sx + 'px';
    speechBubble.style.top  = (sy - 130) + 'px';
}


// ─── ANIMATION ───────────────────────────────────────────────────────────────
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    time += dt;

    // Particles drift
    particles.rotation.y = time * 0.02;

    // Glow pulse
    glowRingMat.opacity = 0.18 + Math.sin(time * 2.5) * 0.07;
    robotGlow.intensity = 1.5 + Math.sin(time * 3) * 0.4;

    if (robotGroup) {
        const rx = robotGroup.position.x;

        // ── DEAD ZONE MICRO-OFFSET (prevent robotic precision) ──
        microOffsetTimer += dt;
        if (microOffsetTimer > 1.8 + Math.random() * 1.5) {
            microOffsetX = (Math.random() - 0.5) * 0.6;
            microOffsetTimer = 0;
        }
        const effectiveTargetX = targetX + microOffsetX;

        // ── ANTICIPATION LEAN (lean opposite before moving) ──
        const targetDelta = effectiveTargetX - prevTargetX;
        prevTargetX += (effectiveTargetX - prevTargetX) * 0.05;
        anticipationTilt += (-targetDelta * 0.4 - anticipationTilt) * 0.15;

        // ── HOVER PROXIMITY EFFECT ──
        // Estimate screen-space proximity: mouse X vs robot center
        const robotScreenX = robotGroup.position.x / (moveLimit + 2);
        const mouseDist = Math.abs(mouseNormX - robotScreenX);
        const targetProximity = mouseDist < 0.25 ? (1 - mouseDist / 0.25) : 0;
        hoverProximity += (targetProximity - hoverProximity) * 0.06;

        // ── MAGNETIC FEEL: boost acceleration when mouse is near ──
        const magnetBoost = 1.0 + hoverProximity * 1.2;

        // ── HORIZONTAL MOVEMENT (limited range, slower) ──
        const dx = effectiveTargetX - rx;
        const dist = Math.abs(dx);

        if (dist > 0.3) {
            velX += dx * 0.002 * magnetBoost;   // magnetic: closer = faster accel
        }
        velX *= 0.90;                       // strong damping
        velX = Math.max(-maxSpeed, Math.min(maxSpeed, velX));  // speed cap
        robotGroup.position.x += velX;

        // Clamp position to ±moveLimit
        robotGroup.position.x = Math.max(-moveLimit, Math.min(moveLimit, robotGroup.position.x));

        // ── DEPTH MOVEMENT (mouse bottom = approach camera, top = move back) ──
        const targetZ = zFar + (-mouseNormY * 0.5 + 0.5) * (zNear - zFar);
        const dz = targetZ - robotGroup.position.z;
        if (Math.abs(dz) > 0.05) {
            velZ += dz * 0.001;
        }
        velZ *= 0.90;
        velZ = Math.max(-0.025, Math.min(0.025, velZ));
        robotGroup.position.z += velZ;
        robotGroup.position.z = Math.max(zFar, Math.min(zNear, robotGroup.position.z));

        // Idle bob + breathing scale
        breathScale = 1.0 + Math.sin(time * 1.4) * 0.018 + Math.sin(time * 0.6) * 0.008;
        robotGroup.position.y = baseY + Math.sin(time * 1.8) * 0.04 + Math.sin(time * 0.5) * 0.02;

        // ── PERSPECTIVE SCALE + HOVER GLOW SCALE + BREATHING ──
        const zRange = zNear - zFar;
        const zNorm = (robotGroup.position.z - zFar) / zRange;
        const perspScale = baseScale * (0.7 + zNorm * 0.9);
        glowScale += (( 1.0 + hoverProximity * 0.12) - glowScale) * 0.07;

        // ── SQUASH SPRING (click interaction) ──
        if (isSquashing) {
            const stiffness = 0.18;
            const damp = 0.72;
            const equilibrium = 1.0;
            squashVelY += (equilibrium - squashY) * stiffness;
            squashVelY *= damp;
            squashY += squashVelY;
            if (Math.abs(squashY - equilibrium) < 0.001 && Math.abs(squashVelY) < 0.001) {
                squashY = equilibrium;
                isSquashing = false;
            }
        }

        // Final scale: perspective × hover × breathing × squash
        const finalScale = perspScale * glowScale * breathScale;
        robotGroup.scale.set(finalScale * (1 + (1 - squashY) * 0.5), finalScale * squashY, finalScale * (1 + (1 - squashY) * 0.5));

        // ── GLOW INTENSITY: hover + velocity ──
        const speed = Math.abs(velX);
        robotGlow.intensity = (1.5 + hoverProximity * 1.0 + speed * 6) + Math.sin(time * 3) * 0.3;
        glowRingMat.opacity = 0.18 + hoverProximity * 0.15 + Math.sin(time * 2.5) * 0.05;

        // ── BODY SPIN (360° multi-axis like movie BB-8) ──
        if (bodyMesh) {
            const speedX = Math.abs(velX);
            const speedZ = Math.abs(velZ);
            const totalSpeed = speedX + speedZ;

            if (totalSpeed > 0.001) {
                // Left/right movement → roll on Z
                bodyMesh.rotation.z -= velX * 3.5;
                // Forward/backward movement → roll on X
                bodyMesh.rotation.x -= velZ * 3.5;
                // Random wobble for character
                bodyMesh.rotation.y += totalSpeed * 0.5 * Math.sin(time * 1.3);
            }
        }

        // ── BODY TILT: movement lean + anticipation ──
        const targetTilt = -velX * 1.2 + anticipationTilt * 0.5;
        robotGroup.rotation.z += (targetTilt - robotGroup.rotation.z) * 0.08;

        // ── HEAD: strong mouse tracking + idle breathing ──
        if (headBone) {
            // Yaw: use mouse screen X directly for reliable left/right
            const headTargetY = mouseNormX * 1.2;

            // Smooth yaw (fast response)
            headCurrentRotY += (headTargetY - headCurrentRotY) * 0.12;

            // Idle breathing: gentle nod
            const idleNodX = Math.sin(time * 1.2) * 0.025 + Math.sin(time * 0.7) * 0.01;
            const idleSwayY = Math.sin(time * 0.9) * 0.01;

            // Pitch: track mouse Y – wider range
            const pitchFromMouse = -mouseNormY * 0.5;

            // Apply
            headBone.rotation.x = (headBone._initRotX || 0) + idleNodX + pitchFromMouse;
            headBone.rotation.y = (headBone._initRotY || 0) + headCurrentRotY + idleSwayY;
            headBone.rotation.z = (headBone._initRotZ || 0);
        }

        // ── GLOW follows robot (X, Z fully, Y stays on floor) ──
        glowRing.position.x = robotGroup.position.x;
        glowRing.position.z = robotGroup.position.z;   // full Z tracking
        // Scale ring larger as robot approaches (perspective)
        const glowRingScale = 0.7 + zNorm * 0.8;
        glowRing.scale.set(glowRingScale, 1, glowRingScale);
        robotGlow.position.set(robotGroup.position.x, 0.3, robotGroup.position.z);

        // HUD status
        const hudStatus = document.getElementById('hud-status');
        if (hudStatus) {
            if (dist > 1.5) {
                hudStatus.textContent = 'MOVING';
                hudStatus.style.color = '#ff9500';
            } else if (hoverProximity > 0.5) {
                hudStatus.textContent = 'CURIOUS';
                hudStatus.style.color = '#44ffcc';
            } else {
                hudStatus.textContent = 'TRACKING';
                hudStatus.style.color = '#00ff88';
            }
        }
    }

    // Subtle camera sway
    camera.position.x = Math.sin(time * 0.1) * 0.2;
    camera.position.y = 5 + Math.sin(time * 0.15) * 0.1;
    camera.lookAt(0, 2, 0);

    // Update speech bubble position to follow robot
    updateBubblePosition();

    renderer.render(scene, camera);
}

// ─── RESIZE ──────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
