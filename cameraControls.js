export function setupCameraControls(camera, cameraSpeed) {
  let keysPressed = {};
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  
  window.addEventListener('keydown', (event) => {
    keysPressed[event.key.toLowerCase()] = true;
  });
  
  window.addEventListener('keyup', (event) => {
    keysPressed[event.key.toLowerCase()] = false;
  });
  
  window.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
  });
  
  window.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;
  
      camera.rotation.y -= deltaX * 0.002;
      camera.rotation.x -= deltaY * 0.002; 
  
      previousMousePosition = { x: event.clientX, y: event.clientY };
    }
  });
  
  window.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  function updateCameraMovement() {
    if (keysPressed['w']) {
      camera.zoom += 0.05;
      camera.updateProjectionMatrix();
    }
    if (keysPressed['s']) {
      camera.zoom -= 0.05; 
      camera.zoom = Math.max(camera.zoom, 0.1); 
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