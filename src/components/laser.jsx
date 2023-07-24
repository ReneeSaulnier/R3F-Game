import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useBox, Physics } from "@react-three/cannon";

function Cylinder() {
  const meshes = useRef([]);
  const count = 100;
  const positions = useRef([]);

  useEffect(() => {
    const newPositions = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      newPositions.push({ x, y, z });
    }
    positions.current = newPositions;
  }, []);

  useFrame(() => {
    for (let i = 0; i < meshes.current.length; i++) {
      const mesh = meshes.current[i];
      const position = positions.current[i];
        //This makes the laser appear and disappear
        mesh.position.z += 0.1;
        //This makes the laser grow
        mesh.scale.y += 0.05;
        //This makes the laser roate to face the spaceship
        mesh.rotation.x = Math.PI / 1.8;
        //Controls how the laser reacts when it hits the end of the screen
        if (mesh.position.z > 5) {
            mesh.position.z = -6;
            mesh.scale.y = 0.05;
            mesh.material.opacity = 0;
        }
            position.z += 0.1;
        if (position.z > 10) {
            position.z = -3;
         }

      mesh.position.set(position.x, position.y, position.z);
    }
  });

  const [laserColliderRef, laserColliderApi] = useBox(() => ({
    args: [1, 1, 1],
    collisionFilterGroup: 1,
    collisionFilterMask: 2,
    onCollide: (e) => {
      console.log("Laser collided");
    },
  }));

  return (
    <Physics>
        {Array.from({ length: count }).map((_, index) => (
          <mesh key={index} ref={(ref) => (meshes.current[index] = ref)} scale={0.03}>
            <cylinderGeometry attach="geometry" args={[1, 1, 1, 32]} />
            <meshStandardMaterial attach="material" color="red" />
            <mesh ref={laserColliderRef} />
          </mesh>
        ))}
    </Physics>
  );
}

export default Cylinder;