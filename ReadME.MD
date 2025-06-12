# Solar System 3D Visualization

This project is a 3D visualization of the solar system built using [Three.js](https://threejs.org/). It includes interactive features such as speed control for planets, camera movement, zoom functionality, and orbit visualization.

---

## Features

1. **3D Solar System**:
   - Realistic representation of planets and their orbits.
   - Textures applied to planets for a detailed look.

2. **Interactive Controls**:
   - Speed control for individual planets.
   - Camera movement using `W`, `A`, `S`, `D` keys.
   - Zoom functionality using the scroll wheel.

3. **Responsive Design**:
   - UI adapts to different screen sizes.
   - Landscape mode enforced for mobile devices.

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/solar-system.git
   cd solar-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the project using `npx serve`:

   ```bash
   npx serve
   ```

4. Open the project in your browser:

   ```
   http://localhost:5000
   ```

---

## Folder Structure

```
solar-system/
├── assets/                # Contains textures and images (e.g., planet textures, nav.png)
├── index.html             # Main HTML file
├── style.css              # CSS for styling the UI
├── main.js                # Main JavaScript file for rendering the scene
├── cameraControls.js      # Handles camera movement and zoom functionality
├── planet.js              # Defines planet creation and orbit logic
└── README.md              # Project documentation
```

---

## Controls
   ```
   Keyboard Controls
      W: Move camera up.
      S: Move camera down.
      A: Move camera left.
      D: Move camera right.

   Mouse Controls
      Scroll Wheel: Zoom in/out.
      Drag: Rotate the camera.
   ```

## How It Works

### Planets and Orbits

* Planets are created using `THREE.SphereGeometry` and textured using `THREE.TextureLoader`.
* Orbits are visualized using `THREE.Line` with elliptical paths.

### Camera Controls

* Camera movement and zoom are handled in `cameraControls.js` using event listeners for keyboard and mouse inputs.

### Responsive Design

* Media queries in `style.css` ensure the UI adapts to different screen sizes.
* Portrait mode displays a message prompting users to rotate their device.

---

## Dependencies
Three.js (CDN)
npx serve for local development.