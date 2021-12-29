import React, { useRef, useMemo, useContext } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import diamond from "./assets/diamond-block-texture.png";
import { DarkModeContext } from "../DarkModeContext";

const Box = (props) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  //mesh.current.rotation.y = -1;
  ///mesh.current.rotation.x = 0.6;

  // Set up state for the hovered and active state 
  //const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(({clock}) => {
    //mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
    mesh.current.position.y = Math.sin(clock.getElapsedTime()) / 16;
  });
  
  const texture = useMemo(() => new THREE.TextureLoader().load(diamond), []);
  
  return (
    <mesh
        {...props}
        ref={mesh}
        scale={[1.8, 1.8, 1.8]}
        castShadow={true} receiveShadow={true}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" side={THREE.FrontSide}>
        <primitive attach="map" object={texture} />
      </meshStandardMaterial>
    </mesh>
  );
}

const Floor = (props) => {
  //const mesh = useRef();

  return (
    <mesh castShadow={true} receiveShadow={true} rotation={[-Math.PI/2, 0, 0]} position={[0, -1.25, 0]}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshStandardMaterial attach="material" color="white" />
    </mesh>
  );
}

const MinecraftBlock = ({className}) => {
  const { darkMode } = useContext(DarkModeContext)
  const fogColor = darkMode ? "#0A1A1D" : "#EDF8F9";
  const intensity = darkMode ? 2 : 1;
  return (
    <div className={className}>
      <Canvas 
        colorManagement 
        shadows 
        shadowMap 
        orthographic={true} 
        camera={{zoom: 80, position: [50, 15, 100]}}
      >
        <fog attach="fog" args={[fogColor, 100, 130]} />
        <ambientLight intensity={0.1} />
        <spotLight 
          position={[5, 20, 5]} 
          angle={0.14}
          intensity={intensity}
          penumbra={1} 
          castShadow={true} 
        />
        <Box />
        <Floor />
      </Canvas>
    </div>
  );
}

export default MinecraftBlock;