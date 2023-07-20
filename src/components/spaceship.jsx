import React, { useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom/client';
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

export default function Spaceship() {
  const model = useGLTF("./models/model.gltf");
  const rock = useGLTF("./models/rock.gltf");
  const rock1 = useGLTF("./models/rock1.gltf");
  const rock2 = useGLTF("./models/rock2.gltf");
  const rock3 = useGLTF("./models/rock3.gltf");
  const spaceshipRef = useRef();
  const controlsRef = useRef();
  const laserSpeed = 1;
  const laserMaxDistance = 30;
  const [activeLasers, setActiveLasers] = useState([]);
  const [rocks, setRocks] = useState([rock.scene, rock1.scene, rock2.scene, rock3.scene]);

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
        checkCollision(laser); 
        return true;
      });

      setActiveLasers(updatedLasers);
    }

    rocks.forEach((rock) => {
      rock.position.z += 0.1;
      rock.rotation.x += 0.01;
      if (rock.position.z > 14) {
        rock.position.z = -30;
        rock.position.x = (Math.random() - 0.5) * 10;
      }
    }
    );

  });

const checkCollision = (laser) => {
  const laserRaycaster = new THREE.Raycaster();
  laserRaycaster.set(laser.position, laser.getWorldDirection(new THREE.Vector3()));

  const intersects = laserRaycaster.intersectObjects(rocks, true);

  if (intersects.length > 0) {
    const intersectedRock = intersects[0].object;
    intersectedRock.visible = false;
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
          /**
           * Rocks That are Flying
           */
          {rock && (
            <mesh position={[0, 0, -10]}>
              <primitive object={rock.scene} scale={0.5} />
            </mesh>
          )}
          {rock1 && (
            <mesh position={[3, 6, -8]}>
              <primitive object={rock1.scene} scale={0.4} />
              </mesh>
          )}
          {rock2 && (
            <mesh position={[-3, 8, -12]}>
              <primitive object={rock2.scene} scale={0.5} />
              </mesh>
          )}
          {rock3 && (
            <mesh position={[-4, 2, -14]}>
              <primitive object={rock3.scene} scale={0.7} />
              </mesh>
          )}
        </>
      )} 
    </>
  );
}