import React, { Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import SunsetScene from "./SunsetScene";
import { Sky } from "./examples/jsm/objects/Sky.js";
//import { Sky } from "@react-three/drei";
import Ocean from "./examples/jsm/objects/Ocean";
import BottledWater from "./examples/jsm/objects/BottledWater";
import Clouds from "./examples/jsm/objects/Clouds";
import "./stylesheet.css";

//extend({ Water3 });

const BuildupScene = () => {
    const NAV_BAR_HEIGHT = 80;
    let screenDimensions = {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height:
            (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) -
            NAV_BAR_HEIGHT,
    };

    THREE.DefaultLoadingManager.onLoad = function () {
        console.log("Loading Complete!");
    };

    THREE.DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
        console.log("Loading file: " + url + ".\nLoaded " + itemsLoaded + " of " + itemsTotal + " files.");
    };

    const SunsetCamera = () => {
        useThree(({ camera }) => {
            //let aspect = screenDimensions.width / screenDimensions.height; // the canvas default
            //let landscape = screenDimensions.width > screenDimensions.height;
            camera.fov = 40;
            camera.near = 0.1;
            camera.far = 10000;
            camera.position.set(-0.2, 2.3, 0.3);
            camera.lookAt(0, 2.5, -1000);
        });

        return null;
    };

    const CameraWobble = () => {
        useFrame((state) => {
            state.camera.position.x = state.camera.position.x + Math.sin(state.clock.getElapsedTime() * 3) / 8960;
            state.camera.position.y = state.camera.position.y + Math.sin(state.clock.getElapsedTime() * 1.4) / 16980;
            state.camera.position.z = state.camera.position.z + Math.cos(state.clock.getElapsedTime() * 2) / 8940;
            state.camera.updateProjectionMatrix();
        });
        return null;
    };

    return (
        <div className="relative block w-full" style={{ height: screenDimensions.height + "px" }}>
            <Canvas>
                <SunsetCamera />
                {/*<CameraWobble />*/}
                {/*<OrbitControls />*/}
                <CameraWobble />
                <Suspense
                    fallback={
                        <Html>
                            <h1>Loading sunset...</h1>
                        </Html>
                    }
                >
                    <SunsetScene />
                </Suspense>
                {/*(<Sky distance={450000} sunPosition={[5, 1, 8]} inclination={0} azimuth={0.25} />*/}
                <Sky
                    distance={100000}
                    inclination={0}
                    azimuth={180}
                    elevation={0}
                    mieCoefficient={0.005}
                    mieDirectionalG={0.7}
                    rayleigh={3}
                    turbidity={10}
                    sunPosition={[0, 2, -10000]}
                />
                <Suspense fallback={null}>
                    <Ocean />
                    <BottledWater />
                    <Clouds
                        position={[0.722, 2.177, -1.705]}
                        rotation={[0, THREE.Math.degToRad(10), 0]}
                        scale={[0.27, 0.1, 0.1]}
                    />
                </Suspense>
                <directionalLight color={0xffa29c} intensity={0.2} position={[0, 4, -10]} />
                <pointLight color={0xff9a02} intensity={2} distance={2} position={[-1.25, 2.13, -1.77]} />
            </Canvas>
        </div>
    );
};

export default BuildupScene;
