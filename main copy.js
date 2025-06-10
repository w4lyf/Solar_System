import * as THREE from 'three';
import { Planet } from './planet.js';

const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;
const viewSize = 4000;

const camera = new THREE.OrthographicCamera(
  -aspect * viewSize / 2, aspect * viewSize / 2,
  viewSize / 2, -viewSize / 2,
  0.1, 15000
);
camera.position.set(0, -2500, 1200);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load textures
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('./assets/sun.png');
const mercuryTexture = textureLoader.load('./assets/mercury.jpg');
const venusTexture = textureLoader.load('./assets/venus.jpg');
const earthTexture = textureLoader.load('./assets/earth.jpg');
const marsTexture = textureLoader.load('./assets/mars.jpg');
const jupiterTexture = textureLoader.load('./assets/jupiter.jpg');
const saturnTexture = textureLoader.load('./assets/saturn.jpg');
const uranusTexture = textureLoader.load('./assets/uranus.jpg');
const neptuneTexture = textureLoader.load('./assets/neptune.jpg');

// Space background
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 200; 
const vertices = new Float32Array(particlesCount * 3); 

for (let i = 0; i < particlesCount * 3; i++) {
  vertices[i] = (Math.random() - 0.5) * 6000; 
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

const particleTexture = textureLoader.load('/assets/star.png');
const particlesMaterial = new THREE.PointsMaterial({
  map: particleTexture,
  size: 2,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.8,
});
const stars = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(stars);

// For SUN
const sun_geometry = new THREE.SphereGeometry(35, 32, 16);
const sun_material = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sun_geometry, sun_material);
scene.add(sun);

// Light source (Sun)
const sunLight = new THREE.PointLight(0xffffff, 5, 10000);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Ambient light (optional, low intensity)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
//scene.add(ambientLight);

const lightHelper = new THREE.PointLightHelper(sunLight, 10);
scene.add(lightHelper);

// Planet configuration
const planetConfigs = [
  { name: 'mercury', semiMajor: 39, semiMinor: 38, color: 0xff0000, size: 0.122 * 35, defaultSpeed: 1.6, texture: mercuryTexture },
  { name: 'venus', semiMajor: 72, semiMinor: 71, color: 0xffffff, size: 0.304 * 35, defaultSpeed: 1.2, texture: venusTexture },
  { name: 'earth', semiMajor: 100, semiMinor: 99, color: 0x0000ff, size: 0.32 * 35, defaultSpeed: 1.0, texture: earthTexture },
  { name: 'mars', semiMajor: 152, semiMinor: 150, color: 0xff0000, size: 0.17 * 35, defaultSpeed: 0.8, texture: marsTexture },
  { name: 'jupiter', semiMajor: 520, semiMinor: 515, color: 0xFFD700, size: 3.51 * 35, defaultSpeed: 0.4, texture: jupiterTexture },
  { name: 'saturn', semiMajor: 958, semiMinor: 950, color: 0x00008B, size: 2.92 * 35, defaultSpeed: 0.3, texture: saturnTexture },
  { name: 'uranus', semiMajor: 1918, semiMinor: 1900, color: 0x00FFFF, size: 1.27 * 35, defaultSpeed: 0.2, texture: uranusTexture },
  { name: 'neptune', semiMajor: 3007, semiMinor: 2990, color: 0x00008B, size: 1.24 * 35, defaultSpeed: 0.1, texture: neptuneTexture }
];

const planets = {};

planetConfigs.forEach(config => {
  const planet = new Planet(config.semiMajor, config.semiMinor, config.color, config.size, config.texture);
  scene.add(planet.ellipse);
  scene.add(planet.mesh);
  
  planets[config.name] = {
    object: planet,
    time: 0,
    currentSpeed: config.defaultSpeed,
    savedSpeed: config.defaultSpeed
  };
});

const clock = new THREE.Clock();
let isPaused = false;

planetConfigs.forEach(config => {
  const speedControl = document.getElementById(`${config.name}-speed`);
  if (speedControl) {
    speedControl.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      const speed = isNaN(value) ? 0 : value;
      planets[config.name].currentSpeed = speed;
      planets[config.name].savedSpeed = speed;
    });
  }
});

const pausePlayBtn = document.getElementById('pause-play-btn');
if (pausePlayBtn) {
  pausePlayBtn.addEventListener('click', () => {
    if (isPaused) {
      Object.keys(planets).forEach(planetName => {
        planets[planetName].currentSpeed = planets[planetName].savedSpeed;
      });
      pausePlayBtn.textContent = 'Pause';
      isPaused = false;
    } else {
      Object.keys(planets).forEach(planetName => {
        planets[planetName].savedSpeed = planets[planetName].currentSpeed;
        planets[planetName].currentSpeed = 0;
      });
      pausePlayBtn.textContent = 'Play';
      isPaused = true;
    }
  });
}

// Variables for camera movement
const cameraSpeed = 10; // Speed of camera movement
let keysPressed = {}; // Track pressed keys
let isDragging = false; // Track mouse dragging state
let previousMousePosition = { x: 0, y: 0 };

// Event listener for keydown
window.addEventListener('keydown', (event) => {
  keysPressed[event.key.toLowerCase()] = true;
});

// Event listener for keyup
window.addEventListener('keyup', (event) => {
  keysPressed[event.key.toLowerCase()] = false;
});

// Event listener for mousedown (start dragging)
window.addEventListener('mousedown', (event) => {
  isDragging = true;
  previousMousePosition = { x: event.clientX, y: event.clientY };
});

// Event listener for mousemove (dragging)
window.addEventListener('mousemove', (event) => {
  if (isDragging) {
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    // Rotate camera based on mouse movement
    camera.rotation.y -= deltaX * 0.002; // Horizontal rotation
    camera.rotation.x -= deltaY * 0.002; // Vertical rotation

    previousMousePosition = { x: event.clientX, y: event.clientY };
  }
});

// Event listener for mouseup (stop dragging)
window.addEventListener('mouseup', () => {
  isDragging = false;
});

// Update camera position based on pressed keys
function updateCameraMovement() {
  if (keysPressed['w']) {
    camera.zoom += 0.05; // Zoom in
    camera.updateProjectionMatrix(); // Update the projection matrix after changing zoom
  }
  if (keysPressed['s']) {
    camera.zoom -= 0.05; // Zoom out
    camera.zoom = Math.max(camera.zoom, 0.1); // Prevent zooming out too far
    camera.updateProjectionMatrix(); // Update the projection matrix after changing zoom
  }
  if (keysPressed['a']) {
    camera.position.x -= cameraSpeed; // Move left
  }
  if (keysPressed['d']) {
    camera.position.x += cameraSpeed; // Move right
  }
  if (keysPressed['q']) {
    camera.position.y += cameraSpeed; // Move up
  }
  if (keysPressed['e']) {
    camera.position.y -= cameraSpeed; // Move down
  }
}

const testPlanet = new THREE.Mesh(
  new THREE.SphereGeometry(35, 64, 32),
  new THREE.MeshStandardMaterial({ map: earthTexture, metalness: 0.1, roughness: 1.0 })
);
testPlanet.position.set(100, 0, 0); // Shift to the side of the Sun
testPlanet.receiveShadow = true;
scene.add(testPlanet);

// Animation loop
renderer.setAnimationLoop(() => {
  let delta = Math.min(clock.getDelta(), 0.05);

  Object.keys(planets).forEach(planetName => {
    const planetData = planets[planetName];
    planetData.time = (planetData.time + delta * planetData.currentSpeed) % 1;
    const pos = planetData.object.path.getPoint(planetData.time);
    planetData.object.mesh.position.set(pos.x, pos.y, 0);
  });

  updateCameraMovement(); // Update camera movement based on keys
  renderer.render(scene, camera);
});