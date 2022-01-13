import * as THREE from "../../../three.module.js";
import React, { useRef, useMemo } from "react";
import { extend, useThree, useLoader, useFrame } from "@react-three/fiber";
//import { OrbitControls, Sky } from "@react-three/drei";
//import Water_Normal_1 from "../../../textures/normal/Water_1_M_Normal.jpg";
import Water_Normal_2 from "../../../textures/normal/Water_2_M_Normal.jpg";
import { Water4 } from "./Water4";

extend({ Water4 });

const BottledWater = () => {
    const ref = useRef();
    const gl = useThree((state) => state.gl);
    const waterNormals = useLoader(THREE.TextureLoader, Water_Normal_2);
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
    const geom = useMemo(() => new THREE.PlaneGeometry(0.2, 0.45, 48, 48), []);
    /*const config = useMemo(
        () => ({
            color: "#77a6ff",
            scale: 0.4,
            reflectivity: 0.1,
            flowDirection: new THREE.Vector2(1, 1),
            textureWidth: 1024,
            textureHeight: 1024,
            roundness: 0.1,
        }),
        []
    );*/
    const config = useMemo(
        () => ({
            textureWidth: 512,
            textureHeight: 512,
            waterNormals,
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 1,
            fog: false,
            format: gl.encoding,
            size: 2,
        }),
        [waterNormals]
    );
    useFrame((state, delta) => (ref.current.material.uniforms.time.value += delta / 4));
    return (
        <water4
            ref={ref}
            args={[geom, config]}
            rotation={[-Math.PI / 2, 0, THREE.Math.degToRad(280)]}
            position={[0.69, 2.023, -1.71]}
        />
    );
};

export default BottledWater;
