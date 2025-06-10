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

// For SUN
const sun_geometry = new THREE.SphereGeometry(35, 32, 16);
const sun_material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
const sun = new THREE.Mesh(sun_geometry, sun_material);
scene.add(sun);

// For Mercury
const mercury = new Planet(140, 135, 0xff0000, 7);
scene.add(mercury.ellipse);
scene.add(mercury.mesh);

// For Venus
const venus = new Planet(240, 235, 0xffffff, 13);
scene.add(venus.ellipse);
scene.add(venus.mesh);

// For Earth
const earth = new Planet(340, 335, 0x0000ff, 15);
scene.add(earth.ellipse);
scene.add(earth.mesh);

// For Mars
const mars = new Planet(500, 450, 0xff0000, 10);
scene.add(mars.ellipse);
scene.add(mars.mesh);

// For Jupiter
const jupiter = new Planet(700, 600, 0xFFD700, 25);
scene.add(jupiter.ellipse);
scene.add(jupiter.mesh);

// For Saturn
const saturn = new Planet(800, 700, 0x00008B, 22);
scene.add(saturn.ellipse);
scene.add(saturn.mesh);

// For Uranus
const uranus = new Planet(950, 800, 0x00FFFF, 20);
scene.add(uranus.ellipse);
scene.add(uranus.mesh);

// For Neptune
const neptune = new Planet(1100, 1000, 0x00008B, 17);
scene.add(neptune.ellipse);
scene.add(neptune.mesh);

const clock = new THREE.Clock();

let mercuryTime = 0;
let venusTime = 0;
let earthTime = 0;
let marsTime = 0;
let jupiterTime = 0;
let saturnTime = 0;
let uranusTime = 0;
let neptuneTime = 0;

const mercurySpeed = 0.7;
const venusSpeed = 0.4;
const earthSpeed = 0.6;
const marsSpeed = 0.2 ;
const jupiterSpeed = 0.1;
const saturnSpeed = 0.05;
const uranusSpeed = 0.03;
const neptuneSpeed = 0.02;

renderer.setAnimationLoop(() => {
  let delta = Math.min(clock.getDelta(), 0.05); 

  mercuryTime = (mercuryTime + delta * mercurySpeed) % 1;
  const mercuryPos = mercury.path.getPoint(mercuryTime);
  mercury.mesh.position.set(mercuryPos.x, mercuryPos.y, 0);

  venusTime = (venusTime + delta * venusSpeed) % 1;
  const venusPos = venus.path.getPoint(venusTime);
  venus.mesh.position.set(venusPos.x, venusPos.y, 0);

  earthTime = (earthTime + delta * earthSpeed) % 1;
  const earthPos = earth.path.getPoint(earthTime);
  earth.mesh.position.set(earthPos.x, earthPos.y, 0);

  marsTime = (marsTime + delta * marsSpeed) % 1;
  const marsPos = mars.path.getPoint(marsTime);
  mars.mesh.position.set(marsPos.x, marsPos.y, 0);

  jupiterTime = (jupiterTime + delta * jupiterSpeed) % 1;
  const jupiterPos = jupiter.path.getPoint(jupiterTime);
  jupiter.mesh.position.set(jupiterPos.x, jupiterPos.y, 0);

  saturnTime = (saturnTime + delta * saturnSpeed) % 1;
  const saturnPos = saturn.path.getPoint(saturnTime);
  saturn.mesh.position.set(saturnPos.x, saturnPos.y, 0);

  uranusTime = (uranusTime + delta * uranusSpeed) % 1;
  const uranusPos = uranus.path.getPoint(uranusTime);
  uranus.mesh.position.set(uranusPos.x, uranusPos.y, 0);

  neptuneTime = (neptuneTime + delta * neptuneSpeed) % 1;
  const neptunePos = neptune.path.getPoint(neptuneTime);
  neptune.mesh.position.set(neptunePos.x, neptunePos.y, 0);

  renderer.render(scene, camera);
});
