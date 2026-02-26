import { CameraControls } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import { Avatar } from "./Avatar";

export const Scenario = () => {
  const cameraControls = useRef();
  useEffect(() => {
    cameraControls.current.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
  }, []);
  return (
    <>
      <CameraControls ref={cameraControls} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Avatar />
    </>
  );
};
