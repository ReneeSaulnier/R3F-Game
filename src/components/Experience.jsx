import React, { useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import "../App.css";
import Spaceship from "./spaceship";
import Particles from "./particles";

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
        <Particles />
        <Spaceship />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Experience;
