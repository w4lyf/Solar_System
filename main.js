import * as THREE from 'three';
import { Planet } from './planet.js';
import { setupCameraControls } from './cameraControls.js';

const scene = new THREE.Scene();  // Create a new scene
const aspect = window.innerWidth / window.innerHeight;
const viewSize = 4000;  // Size of the view

const camera = new THREE.OrthographicCamera(  // Create an orthographic camera
  -aspect * viewSize / 2, aspect * viewSize / 2,
  viewSize / 2, -viewSize / 2,
  0.1, 15000
);
camera.position.set(0, -2500, 1200);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer(); // Create a WebGL renderer

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
const vertices = new Float32Array(particlesCount * 3); // Create an array for the vertices

for (let i = 0; i < particlesCount * 3; i++) {
  vertices[i] = (Math.random() - 0.5) * 6000; // Random positions for the vectors
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3)); // Create a buffer attribute for stars

const particleTexture = textureLoader.load('/assets/star.png');
const particlesMaterial = new THREE.PointsMaterial({map: particleTexture, size: 2, sizeAttenuation: true, transparent: true, opacity: 0.8});
const stars = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(stars);

// For SUN
const sun_geometry = new THREE.SphereGeometry(35, 32, 16);
const sun_material = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sun_geometry, sun_material);
scene.add(sun);

// Light source (Sun)
const sunLight = new THREE.PointLight(0xffffff, 20000, 5000); // Color, intensity, distance
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // ambience for soft light on the scene
scene.add(ambientLight);

//Planet configuration, sets ellipse path, color, size, speed, texture, axial tilt and spins per orbit
const planetConfig = [
  { name: 'mercury', semiMajor: 39, semiMinor: 38, color: 0xff0000, size: 0.122 * 35, defaultSpeed: 1.6, texture: mercuryTexture,  axialTilt: 0.034, spinsPerOrbit : 0.0625},
  { name: 'venus',   semiMajor: 72, semiMinor: 71, color: 0xffffff, size: 0.304 * 35, defaultSpeed: 1.2, texture: venusTexture,    axialTilt: 177.4, spinsPerOrbit : -0.0386},
  { name: 'earth',   semiMajor: 100, semiMinor: 99, color: 0x0000ff, size: 0.32 * 35,  defaultSpeed: 1.0, texture: earthTexture,    axialTilt: 23.44, spinsPerOrbit : 365.25},
  { name: 'mars',    semiMajor: 152, semiMinor: 150, color: 0xff0000, size: 0.17 * 35, defaultSpeed: 0.8, texture: marsTexture,     axialTilt: 25.19, spinsPerOrbit : 701.22},
  { name: 'jupiter', semiMajor: 520, semiMinor: 515, color: 0xFFD700, size: 3.51 * 35, defaultSpeed: 0.4, texture: jupiterTexture,  axialTilt: 3.13,  spinsPerOrbit : 10500},
  { name: 'saturn',  semiMajor: 958, semiMinor: 950, color: 0x00008B, size: 2.92 * 35, defaultSpeed: 0.3, texture: saturnTexture,   axialTilt: 26.73, spinsPerOrbit : 24135},
  { name: 'uranus',  semiMajor: 1918, semiMinor: 1900, color: 0x00FFFF, size: 1.27 * 35, defaultSpeed: 0.2, texture: uranusTexture,   axialTilt: 97.77, spinsPerOrbit : -42825},
  { name: 'neptune', semiMajor: 3007, semiMinor: 2990, color: 0x00008B, size: 1.24 * 35, defaultSpeed: 0.1, texture: neptuneTexture,  axialTilt: 28.32, spinsPerOrbit : 89800}
];


const planets = {};

planetConfig.forEach(config => {  // Create planets
  const planet = new Planet(config.semiMajor, config.semiMinor, config.color, config.size, config.texture);
  scene.add(planet.ellipse);
  scene.add(planet.mesh);

  const tiltRad = THREE.MathUtils.degToRad(config.axialTilt || 0);
  planet.mesh.rotation.y = tiltRad;

  if (config.name === 'saturn') { // Add rings to Saturn
    const ringGeometry = new THREE.RingGeometry(
      config.size * 1.1, 
      config.size * 1.6,
      64
    );
  
    const ringTexture = textureLoader.load('./assets/saturn.jpg');
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: ringTexture,
      color: 0x888888,
      side: THREE.DoubleSide,
      transparent: true
    });
  
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.z = Math.PI / 2; 
    planet.mesh.add(ring); 
  }
  
  
  planets[config.name] = {  // Store planet data
    object: planet,
    time: 0,
    currentSpeed: config.defaultSpeed,
    savedSpeed: config.defaultSpeed,
    rotationSpeed: config.spinsPerOrbit / 365.25 * config.defaultSpeed,
  };
});

const clock = new THREE.Clock();
let isPaused = false;

planetConfig.forEach(config => {  // Speed Control
  const speedControl = document.getElementById(`${config.name}-speed`);
  if (speedControl) {
    speedControl.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      const speed = isNaN(value) ? 0 : value;
      planets[config.name].currentSpeed = speed;
      planets[config.name].savedSpeed = speed;
      planets[config.name].rotationSpeed = config.spinsPerOrbit / 365.25 * speed;
    });
  }
});

const pausePlayBtn = document.getElementById('pause-play-btn');
if (pausePlayBtn) { // Pause/Play Button logic
  pausePlayBtn.addEventListener('click', () => {
    if (isPaused) { // Play
      Object.keys(planets).forEach(planetName => {
        planets[planetName].currentSpeed = planets[planetName].savedSpeed;  // Restore saved speed
        planets[planetName].rotationSpeed = planetConfig.find(p => p.name === planetName).rotationSpeed;
      });
      pausePlayBtn.textContent = 'Pause';
      isPaused = false;
    } else {  // Pause
      Object.keys(planets).forEach(planetName => {
        planets[planetName].savedSpeed = planets[planetName].currentSpeed;
        planets[planetName].currentSpeed = 0;  // Stop the planet
        planets[planetName].rotationSpeed = 0;
      });
      pausePlayBtn.textContent = 'Play';
      isPaused = true;
    }
  });
}

const updateCameraMovement = setupCameraControls(camera, 10); // Initialize camera controls

// Animation loop
renderer.setAnimationLoop(() => {
  let delta = Math.min(clock.getDelta(), 0.05); // Limit delta time to avoid large jumps

  Object.keys(planets).forEach(planetName => {  // Update each planet's position and rotation
    const planetData = planets[planetName];
    planetData.time = (planetData.time + delta * planetData.currentSpeed) % 1;
    const pos = planetData.object.path.getPoint(planetData.time);
    planetData.object.mesh.position.set(pos.x, pos.y, 0);

    planetData.object.mesh.rotation.z += planetData.rotationSpeed; 
  });

  updateCameraMovement(); 
  renderer.render(scene, camera);
});