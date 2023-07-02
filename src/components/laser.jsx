import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function Laser() {
    //Arrtibutes of the laser
    const count = 20;
    const radiusTop = 0.05;
    const radiusBottom = 0.05;
    const height = 1;
    const radialSegments = 8;
    const heightSegments = 1;
    const openEnded = false;
    const thetaStart = 0;
    const thetaLength = Math.PI;

    const laserGeometry = new THREE.CylinderGeometry(
        radiusTop,
        radiusBottom,
        height,
        radialSegments,
        heightSegments,
        openEnded,
        thetaStart,
        thetaLength
    );
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }

    laserGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    const laserRef = useRef();
    useFrame(() => {
        const positions = laserGeometry.attributes.position.array;
        for (let i = 0; i < count * 3; i += 3) {
            positions[i + 2] += 0.1;
            if (positions[i + 2] > 10) {
                positions[i + 2] = -3;
            }
        }
        laserGeometry.attributes.position.needsUpdate = true;
    });

  return (
    <points>
        <bufferGeometry attach="geometry" {...laserGeometry} />
        <pointsMaterial
            attach="material"
            color="red"
            size={0.15}
            sizeAttenuation
        />
    </points>
  );
}

