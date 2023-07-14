import React,  { Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import "../App.css";
import Spaceship from "./spaceship";
import Particles from "./particles";
// import Laser from "./laser";

const Experience = () => {
  /**
   * Canvas
   */
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        margin: -10,
        padding: 0,
        position: "relative",
      }}
    >
      <Canvas>
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Particles />
        <group>
          <Suspense>
            <Physics>
              <Spaceship />
              {/* <Laser /> */}
            </Physics>
          </Suspense>
        </group>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Experience;
