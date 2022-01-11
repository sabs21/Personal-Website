import React, { useRef, useMemo, useContext } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import diamond from "./assets/diamond-block-texture.png";
import { DarkModeContext } from "../DarkModeContext";

// Handles cube movement without re-rendering the scene
const pos = new THREE.Vector2();

const Box = (props) => {
    // This reference will give us direct access to the mesh
    const mesh = useRef();

    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(({ clock }) => {
        mesh.current.position.y = Math.sin(clock.getElapsedTime()) / 12;
        mesh.current.rotation.y = pos.x;
    });

    const texture = useMemo(() => new THREE.TextureLoader().load(diamond), []);

    return (
        <mesh {...props} ref={mesh} scale={[1.7, 1.7, 1.7]} castShadow={true} receiveShadow={true}>
            <boxBufferGeometry args={[1, 1, 1]} />
            <meshStandardMaterial attach="material" side={THREE.FrontSide}>
                <primitive attach="map" object={texture} />
            </meshStandardMaterial>
        </mesh>
    );
};

const Floor = () => {
    return (
        <mesh castShadow={true} receiveShadow={true} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]}>
            <planeBufferGeometry attach="geometry" args={[500, 500]} />
            <meshStandardMaterial attach="material" color="white" />
        </mesh>
    );
};

const MinecraftBlock = ({ className }) => {
    const { darkMode } = useContext(DarkModeContext);
    const fogColor = darkMode ? "#0A1A1D" : "#EDF8F9";
    const intensity = darkMode ? 2 : 1;
    const handleMouseMove = (e) => {
        // Normalize the position of the mouse in the element
        pos.x = e.clientX / e.target.width;
        pos.y = e.clientY / e.target.height;
    };

    return (
        <div className={className} onMouseMove={handleMouseMove}>
            <Canvas
                colorManagement
                shadows
                shadowMap
                orthographic={true}
                camera={{ zoom: 80, position: [50, 15, 100] }}
            >
                <fog attach="fog" args={[fogColor, 100, 130]} />
                <ambientLight intensity={0.1} />
                <spotLight position={[5, 20, 5]} angle={0.14} intensity={intensity} penumbra={1} castShadow={true} />
                <Box />
                <Floor />
            </Canvas>
        </div>
    );
};

export default MinecraftBlock;
