import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// For SUN
const sun_geometry = new THREE.SphereGeometry(15, 32, 16);
const sun_material = new THREE.MeshBasicMaterial( { color: 0xFFFF00 } );
const sun = new THREE.Mesh(sun_geometry, sun_material );
scene.add( sun );

// For Mercury
const mercury_path = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	140, 135,           // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);

const mercury_points = mercury_path.getPoints( 200 );
const mercury_ellipse_geometry = new THREE.BufferGeometry().setFromPoints( mercury_points );
const mercury_ellipse_material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
const mercury_ellipse = new THREE.Line( mercury_ellipse_geometry, mercury_ellipse_material );
scene.add( mercury_ellipse );

const mercury_geometry = new THREE.SphereGeometry(5, 32, 32);
const mercury_material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
const mercury = new THREE.Mesh(mercury_geometry, mercury_material);
scene.add(mercury);

//camera.position.x = 100;
camera.position.y = -500;
camera.position.z = 200;
camera.lookAt(0, 0, 0);

let clock = new THREE.Clock();
let time = 0;
let speedFactor = 0.1;

function animate() {
  requestAnimationFrame(animate);

  let delta = clock.getDelta(); // Time since last frame in seconds
  time = (time + delta * speedFactor) % 1;

  if (time > 1) time = 0;

  const pos = mercury_path.getPoint(time);
  mercury.position.set(pos.x, pos.y, 0);

  renderer.render(scene, camera)
}
renderer.setAnimationLoop( animate );