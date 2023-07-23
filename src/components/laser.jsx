import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";

function Laser() {
  const meshes = useRef([]);
  const count = 100;
  const positions = useRef([]);

  useEffect(() => {
    const newPositions = [];
    for (let i = 0; i < count; i++) {
      newPositions.push({ x: spaceshipPosition.x, y: spaceshipPosition.y, z: spaceshipPosition.z });
    }
    positions.current = newPositions;
  }, [spaceshipPosition]);

  useFrame(() => {
    for (let i = 0; i < meshes.current.length; i++) {
      const mesh = meshes.current[i];
      const position = positions.current[i];
      mesh.position.set(position.x, position.y, position.z);
    }
  });

  return (
    <Physics>
        {Array.from({ length: count }).map((_, index) => (
          <mesh key={index} ref={(ref) => (meshes.current[index] = ref)} scale={0.03}>
            <cylinderGeometry attach="geometry" args={[1, 1, 1, 32]} />
            <meshStandardMaterial attach="material" color="red" />
          </mesh>
        ))}
    </Physics>
  );
}

export default Laser;


