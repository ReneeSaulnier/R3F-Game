import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

export default function Spaceship() {
  const model = useGLTF("./models/model.gltf");
  const rock = useGLTF("./models/rock.gltf");
  const spaceshipRef = useRef();
  const controlsRef = useRef();
  const laserSpeed = 1;
  const laserMaxDistance = 30;
  const [activeLasers, setActiveLasers] = useState([]);

  useEffect(() => {
    const camera = new THREE.PerspectiveCamera();
    const controls = new PointerLockControls(camera, document.body);
    controlsRef.current = controls;

    const onMouseDown = () => controls.lock();
    const onKeyDown = (event) => {
      const { key } = event;
      if (key === "w") {
        controls.moveUpState = "UP";
      }
      if (key === "s") {
        controls.moveUpState = "DOWN";
      }
      if (key === "a") {
        controls.moveRightState = "LEFT";
      }
      if (key === "d") {
        controls.moveRightState = "RIGHT";
      }
      if (key === " ") {
        fireLaser();
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
    const controls = controlsRef.current;

    if (controls && controls.isLocked) {
      const direction = new THREE.Vector3();
      spaceship.getWorldDirection(direction);

      const moveSpeed = 0.2;

      if (controls.moveUpState === "UP") {
        spaceship.position.add(new THREE.Vector3(0, moveSpeed, 0));
      }
      if (controls.moveUpState === "DOWN") {
        spaceship.position.add(new THREE.Vector3(0, -moveSpeed, 0));
      }
      if (controls.moveRightState === "RIGHT") {
        const spaceshipRight = new THREE.Vector3().crossVectors(
          direction,
          new THREE.Vector3(0, 1, 0)
        ).normalize();
        spaceship.position.add(spaceshipRight.multiplyScalar(moveSpeed));
      }
      if (controls.moveRightState === "LEFT") {
        const spaceshipRight = new THREE.Vector3().crossVectors(
          direction,
          new THREE.Vector3(0, 1, 0)
        ).normalize();
        spaceship.position.sub(spaceshipRight.multiplyScalar(moveSpeed));
      }

      const updatedLasers = activeLasers.filter((laser) => {
        const newPosition = laser.position.clone().add(
          direction.clone().multiplyScalar(laserSpeed)
        );
        const distance = spaceship.position.distanceTo(newPosition);

        if (distance > laserMaxDistance) {
          return false;
        }

        laser.position.copy(newPosition);
        checkCollision(laser); // Check collision with rock
        return true;
      });

      setActiveLasers(updatedLasers);
    }
  });

  const checkCollision = (laser) => {
    const laserRaycaster = new THREE.Raycaster();
    laserRaycaster.set(laser.position, laser.getWorldDirection(new THREE.Vector3()));
    const intersects = laserRaycaster.intersectObject(rock.scene, true);
    if (intersects.length > 0) {
      rock.scene.visible = false;
    }
  };

  const fireLaser = () => {
    const spaceship = spaceshipRef.current;
    const controls = controlsRef.current;
    const direction = new THREE.Vector3();
    spaceship.getWorldDirection(direction);

    const laserGeometry = new THREE.BoxGeometry(0.1, 0.1, 1);
    const laserMaterial = new THREE.MeshBasicMaterial({ color: "red" });
    const laserMesh = new THREE.Mesh(laserGeometry, laserMaterial);
    laserMesh.position.copy(spaceship.position);

    setActiveLasers((prevLasers) => [...prevLasers, laserMesh]);

    if (!controls.isLocked) {
      controls.lock();
    }
  };

  return (
    <>
      {model && (
        <>
          <primitive
            object={model.scene}
            ref={spaceshipRef}
            position={[0, -1, 0]}
            rotation={[-0.15, Math.PI, 0]}
            scale={0.5}
          />
          {activeLasers.map((laser, index) => (
            <mesh key={index} position={laser.position}>
              <primitive object={laser} />
            </mesh>
          ))}
          {rock && (
            <mesh position={[0, 0, -10]}>
              <primitive object={rock.scene} scale={0.5} />
            </mesh>
          )}
        </>
      )} 
    </>
  );
}
