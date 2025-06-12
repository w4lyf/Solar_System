export function setupCameraControls(camera, cameraSpeed) {
  let keysPressed = {};
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  window.addEventListener('keydown', (event) => {
    keysPressed[event.key.toLowerCase()] = true; // Store the key pressed state
  });

  window.addEventListener('keyup', (event) => {
    keysPressed[event.key.toLowerCase()] = false; // Remove the key pressed state
  });

  window.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
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

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Add scroll wheel event for zooming
  window.addEventListener('wheel', (event) => {
    if (event.deltaY < 0) {
      camera.zoom += 0.05;
      camera.updateProjectionMatrix();
    } else if (event.deltaY > 0) {
      camera.zoom -= 0.05;
      camera.zoom = Math.max(camera.zoom, 0.1); // Prevent zooming out too far
      camera.updateProjectionMatrix();
    }
  });

  function updateCameraMovement() {
    if (keysPressed['a']) {
      camera.position.x -= cameraSpeed;
    }
    if (keysPressed['d']) {
      camera.position.x += cameraSpeed;
    }
    if (keysPressed['w']) {
      camera.position.y += cameraSpeed;
    }
    if (keysPressed['s']) {
      camera.position.y -= cameraSpeed;
    }
  }

  return updateCameraMovement;
}