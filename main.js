import * as THREE from 'three';
import { Planet } from './planet.js';

const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;
const viewSize = 1200;

const camera = new THREE.OrthographicCamera(
  -aspect * viewSize / 2, aspect * viewSize / 2,
  viewSize / 2, -viewSize / 2,
  0.1, 2000
);
camera.position.set(0, -900, 400);
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
const particlesCount = 100; 
const vertices = new Float32Array(particlesCount * 3); 

for (let i = 0; i < particlesCount * 3; i++) {
  vertices[i] = (Math.random() - 0.5) * 2000; 
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
  { name: 'mercury', semiMajor: 140, semiMinor: 135, color: 0xff0000, size: 7, defaultSpeed: 0.7, texture: mercuryTexture },
  { name: 'venus', semiMajor: 240, semiMinor: 235, color: 0xffffff, size: 13, defaultSpeed: 0.4, texture: venusTexture },
  { name: 'earth', semiMajor: 340, semiMinor: 335, color: 0x0000ff, size: 15, defaultSpeed: 0.6, texture: earthTexture },
  { name: 'mars', semiMajor: 500, semiMinor: 450, color: 0xff0000, size: 10, defaultSpeed: 0.2, texture: marsTexture },
  { name: 'jupiter', semiMajor: 700, semiMinor: 600, color: 0xFFD700, size: 25, defaultSpeed: 0.1, texture: jupiterTexture },
  { name: 'saturn', semiMajor: 800, semiMinor: 700, color: 0x00008B, size: 22, defaultSpeed: 0.05, texture: saturnTexture },
  { name: 'uranus', semiMajor: 950, semiMinor: 800, color: 0x00FFFF, size: 20, defaultSpeed: 0.03, texture: uranusTexture },
  { name: 'neptune', semiMajor: 1100, semiMinor: 1000, color: 0x00008B, size: 17, defaultSpeed: 0.02, texture: neptuneTexture }
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