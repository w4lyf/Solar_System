export function setupCameraControls(camera, cameraSpeed) {
  let keysPressed = {};
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let isLeftClick = false; 
  let isRightClick = false; 

  window.addEventListener('keydown', (event) => {
    keysPressed[event.key.toLowerCase()] = true; // Store the key pressed state
  });

  window.addEventListener('keyup', (event) => {
    keysPressed[event.key.toLowerCase()] = false; // Remove the key pressed state
  });

  window.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
      isLeftClick = true; 
    } else if (event.button === 2) {
      isRightClick = true;
    }
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY }; // Store the mouse position
  });

  window.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const deltaX = event.clientX - previousMousePosition.x; // Calculate the change in mouse position
      const deltaY = event.clientY - previousMousePosition.y;

      camera.rotation.y -= deltaX * 0.002; // Adjust camera rotation
      camera.rotation.x -= deltaY * 0.002;

      previousMousePosition = { x: event.clientX, y: event.clientY }; // Update the previous mouse position
    }
  });

  window.addEventListener('mouseup', (event) => {
    if (event.button === 0) {
      isLeftClick = false;
    } else if (event.button === 2) {
      isRightClick = false; 
    }
    isDragging = false;
  });

  function updateCameraMovement() {
    if (keysPressed['w'] || isLeftClick) {
      camera.zoom += 0.05;
      camera.updateProjectionMatrix(); // Update the camera projection
    }
    if (keysPressed['s'] || isRightClick) {
      camera.zoom -= 0.05;
      camera.zoom = Math.max(camera.zoom, 0.1); // Prevent zooming out too far
      camera.updateProjectionMatrix();
    }
    if (keysPressed['a']) {
      camera.position.x -= cameraSpeed;
    }
    if (keysPressed['d']) {
      camera.position.x += cameraSpeed;
    }
    if (keysPressed['q']) {
      camera.position.y += cameraSpeed;
    }
    if (keysPressed['e']) {
      camera.position.y -= cameraSpeed;
    }
  }

  return updateCameraMovement;
}