import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { extend, useThree, useLoader, useFrame } from "@react-three/fiber";
//import { OrbitControls, Sky } from "@react-three/drei";
import Water_Normal_1 from "../../../textures/normal/Water_1_M_Normal.jpg";
//import Water_Normal_2 from "../../../textures/normal/Water_2_M_Normal.jpg";
import { Water } from "three-stdlib";

extend({ Water });

const Ocean = () => {
    const ref = useRef();
    const gl = useThree((state) => state.gl);
    const waterNormals = useLoader(THREE.TextureLoader, Water_Normal_1);
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
    const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);
    const config = useMemo(
        () => ({
            textureWidth: 1024,
            textureHeight: 1024,
            waterNormals,
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: false,
            format: gl.encoding,
            size: 2,
        }),
        [waterNormals]
    );
    useFrame((state, delta) => (ref.current.material.uniforms.time.value += delta / 4));
    return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} />;
};

export default Ocean;
