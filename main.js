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

renderer.setAnimationLoop(() => {
  let delta = Math.min(clock.getDelta(), 0.05);

  Object.keys(planets).forEach(planetName => {
    const planetData = planets[planetName];
    planetData.time = (planetData.time + delta * planetData.currentSpeed) % 1;
    const pos = planetData.object.path.getPoint(planetData.time);
    planetData.object.mesh.position.set(pos.x, pos.y, 0);
  });

  renderer.render(scene, camera);
});