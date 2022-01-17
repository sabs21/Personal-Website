import { useCallback, useRef } from "react";
import { MeshNormalMaterial, Vector3 } from "three";
import { useFrame, extend } from "@react-three/fiber";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes";
//import { MeshLambertMaterial, DoubleSide } from "three";

extend({ MarchingCubes });

const Clouds = ({ position, rotation, scale, colorTop, colorBottom, resolution }) => {
    const marchingCubesRef = useRef(null);
    const cloudResolution = resolution ? resolution : 16;
    const cloudColorTop = colorTop ? colorTop : new Vector3(0.98, 0.961, 0.855);
    const cloudColorBottom = colorBottom ? colorBottom : new Vector3(0.376, 0.416, 0.482);

    const initMarchingCubeBallSeeds = (totalBalls) => {
        const a = [];
        for (let i = 0; i < totalBalls; i++) {
            a[i] = {
                x: Math.random(),
                y: Math.random() / 10 + 0.5, // 0.5 is the standard y height of where the clouds generally should be.
                z: Math.random() / 2 + 0.25, // 0.25 is the standard z left and right locations of where the clouds generally should be.
            };
        }
        return a;
    };

    const cloudShadow = (colorTop, colorBottom) => {
        var material = new MeshNormalMaterial();
        material.onBeforeCompile = function (shader) {
            shader.uniforms.colorTop = { value: colorTop };
            shader.uniforms.colorBottom = { value: colorBottom };
            //shader.vertexShader.replace(

            //)
            // Fragment Code
            shader.fragmentShader = shader.fragmentShader.replace(
                `#include <clipping_planes_pars_fragment>`,
                `#include <clipping_planes_pars_fragment>
                
                uniform vec3 colorTop;
                uniform vec3 colorBottom;`
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                `gl_FragColor = vec4( packNormalToRGB( normal ), opacity );`,
                `vec3 cloudGradient = mix(colorBottom, colorTop, normal.y);
                gl_FragColor = vec4( cloudGradient, opacity );`
            );

            //console.log(shader);

            material.userData.shader = shader;
        };

        // Make sure WebGLRenderer doesnt reuse a single program
        material.customProgramCacheKey = function () {
            return [colorTop, colorBottom];
        };

        return material;
    };

    const totalBalls = 7;
    const balls = initMarchingCubeBallSeeds(totalBalls); // Holds all balls which the marching cubes algorithm renders.

    const onFrame = useCallback(
        ({ clock }) => {
            if (marchingCubesRef.current !== null) {
                const time = clock.getElapsedTime();
                marchingCubesRef.current.reset();

                // fill the field with some metaballs
                const subtract = 12;
                const strength = 1.2 / ((Math.sqrt(balls.length) - 1) / 4 + 1);

                for (let i = 0; i < balls.length; i++) {
                    const ballx = (time * 0.1 + balls[i].x - 0.99) % 1;
                    const bally = Math.sin(time) * 0.02 + balls[i].y;
                    const ballz = balls[i].z;

                    marchingCubesRef.current.addBall(ballx, bally, ballz, strength, subtract);
                }
            }
        },
        [marchingCubesRef, balls]
    );

    useFrame(onFrame);

    return (
        <marchingCubes
            ref={marchingCubesRef}
            position={position}
            rotation={rotation}
            scale={scale}
            args={[cloudResolution, cloudShadow(cloudColorTop, cloudColorBottom), false, false]}
        />
    );
};

export default Clouds;
