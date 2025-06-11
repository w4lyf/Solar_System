import * as THREE from 'three';

export class Planet {
  constructor(xRadius, yRadius, color, size, texture) {
    this.path = new THREE.EllipseCurve(
      0, 0, // ax, aY
      xRadius, yRadius, // xRadius, yRadius
      0, 2 * Math.PI, // aStartAngle, aEndAngle
      false, // aClockwise
      0 // aRotation
    );

    const points = this.path.getPoints(200);  // 200 points along the ellipse
    const ellipseGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const ellipseMaterial = new THREE.LineBasicMaterial({ color });
    this.ellipse = new THREE.Line(ellipseGeometry, ellipseMaterial);

    const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({ map: texture, metalness: 0.1, roughness: 1.0, emissive: 0x222244, emissiveIntensity: 0.1});
    this.mesh = new THREE.Mesh(planetGeometry, planetMaterial);
  }
}