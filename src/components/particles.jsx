import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import "../App.css";

export default function Particles() {

  /**
   * Particles
   */

  //Creates a new buffer geometry
  const particlesGeometry = new THREE.BufferGeometry();
  //Number of particles
  const count = 800;
  //Creates a new array of positions (x, y, z)
  const positions = new Float32Array(count * 3);
  //Creates a new array of movements (x, y, z)
  const movement = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    //This creates a random position for each particle
    positions[i] = (Math.random() - 0.5) * 10;
    //This creates a random movement for each particle
    movement[i] = Math.random() * 0.02 + 0.01;

  }
  //Sets the position attribute to the positions array
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

const particlesRef = useRef();
  useFrame(() => {
    //Creating an array of positions
    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < count * 3; i += 3) {
        //Setting the x position to the x position + the movement
        positions[i + 2] += movement[i + 2];
        //Resetting the position to the bottom so its a loop
        if (positions[i + 2] > 10) {
            //This sets the transition time
            positions[i + 2] = -3;
        }
    }
    particlesGeometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
        <points ref={particlesRef}>
          <bufferGeometry attach="geometry" {...particlesGeometry} />
          <pointsMaterial
            attach="material"
            color="white"
            size={0.005}
            depthWrite={false}
            transparent={true}
          />
        </points>
    </>
    );

}
