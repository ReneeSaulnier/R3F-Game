import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

export default function Spaceship() {
  /**
   * Load Model
   */
  const model = useGLTF("./models/model.gltf");

  /**
   * Create a reference for the spaceship so we can keep updating it
   */
  const spaceshipRef = useRef();
  const controlsRef = useRef();

  /**
   * Pointer Lock Controls for the spaceship
   */
  useEffect(() => {
    const camera = new THREE.PerspectiveCamera();
    const controls = new PointerLockControls(camera, document.body);
    controlsRef.current = controls;

    const onMouseDown = () => controls.lock();
    const onKeyDown = (event) => {
      const { key } = event;
      if (key === "w") {
        //Setting the state to forward
        controls.moveUpState = "UP";
        //Making the soaceship rotate in the direction it is moving
        spaceshipRef.current.rotation.x = Math.max(spaceshipRef.current.rotation.x - 0.1, -0.3);
      }
      if (key === "s") {
        controls.moveUpState = "DOWN";
        spaceshipRef.current.rotation.x = Math.min(spaceshipRef.current.rotation.x + 0.1, 0.3);
      }
      if (key === "a") {
        controls.moveRightState = "LEFT";
        spaceshipRef.current.rotation.z = Math.min(spaceshipRef.current.rotation.z + 0.1, 0.3);
      }
      if (key === "d") {
        controls.moveRightState = "RIGHT";
        spaceshipRef.current.rotation.z = Math.max(spaceshipRef.current.rotation.z - 0.1, -0.1);
      }
    };
    const onKeyUp = (event) => {
      const { key } = event;
      if (key === "w" || key === "s") {
        controls.moveUpState = null;
      }
      if (key === "a" || key === "d") {
        controls.moveRightState = null;
      }
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

useFrame(() => {
  const spaceship = spaceshipRef.current;
  // Access the PointerLockControls instance
  const controls = controlsRef.current;
  // Check for pressed keys and update movement
  if (controls && controls.isLocked) {
      const direction = controls.getDirection(new THREE.Vector3());
      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3();
      right.crossVectors(direction, up).normalize();

      const moveSpeed = 0.1;
      if (controls.moveUpState === "UP") {
        spaceship.position.add(new THREE.Vector3(0, moveSpeed, 0));
      }
      if (controls.moveUpState === "DOWN") {
        spaceship.position.add(new THREE.Vector3(0, -moveSpeed, 0));
      }
      if (controls.moveRightState === "RIGHT") {
        spaceship.position.add(right.clone().multiplyScalar(moveSpeed));
      }
      if (controls.moveRightState === "LEFT") {
        spaceship.position.add(right.clone().multiplyScalar(-moveSpeed));
      }
    }
  });


//   /**
//    * Mouse movements
//    */

//   const [mouseMovement, setMouseMovement] = useState({ x: 0, y: 0 });
//   const onMouseMove = (event) => {
//     const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
//     const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
//     setMouseMovement({ x: movementX, y: movementY });
//   };

//   useEffect(() => {
//     window.addEventListener("mousemove", onMouseMove);
//     return () => {
//       window.removeEventListener("mousemove", onMouseMove);
//     };
//   }, []);

//   useFrame(() => {
//   const controls = controlsRef.current;
//   if (controls && controls.isLocked) {
//     const { x, y } = mouseMovement;
//     const rotationSpeed = 0.002;
//     controlsRef.current.getObject().rotation.y -= x * rotationSpeed;
//     controlsRef.current.getObject().rotation.x -= y * rotationSpeed;
//     setMouseMovement({ x: 0, y: 0 }); // Reset mouse movement
//   }
// });

  return (
    <>
        {model && (
          <primitive
            object={model.scene}
            ref={spaceshipRef}
            position={[0, -1, 0.3]}
            rotation={[-0.15, Math.PI, 0]}
            scale={ 0.6 }
          />
        )}
    </>
  );
}
