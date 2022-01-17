import React, { useRef, useState } from "react";
import * as THREE from "./three.module.js";
import { useLoader, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import Scene from "./scene.glb";
// Textures
import Barrel_Diffuse from "./textures/diffuse/barrel_diffuse.jpg";
import Barrel_Specular from "./textures/specular/barrel_specular.png";
import Barrel_Lightmap from "./textures/lightmap/barrel_lightmap.png";
import Wood_Diffuse from "./textures/diffuse/wood_diffuse.jpg";
import Ship_Diffuse from "./textures/diffuse/ship_diffuse.png";
import Ship_Lightmap from "./textures/lightmap/ship_lightmap.png";
import Table_Lightmap from "./textures/lightmap/table_lightmap.png";
import LifePreserver_Diffuse from "./textures/diffuse/life_preserver_diffuse.png";
import DockSupport_Diffuse from "./textures/diffuse/dock_support_diffuse.jpg";
import Landscape_Diffuse from "./textures/diffuse/landscape_diffuse.jpg";
import Landscape_Normal from "./textures/normal/landscape_normal.jpg";
import Grass_Diffuse from "./textures/diffuse/grass_diffuse.jpg";
import Grass_Alpha from "./textures/alpha/grass_alpha.jpg";
import Grass_Lightmap from "./textures/lightmap/grass_lightmap.jpg";
import Tree1_Diffuse from "./textures/diffuse/tree_diffuse.jpg";
import Tree1_Alpha from "./textures/alpha/tree_alpha.jpg";
import Tree2_Diffuse from "./textures/diffuse/tree2_diffuse.jpg";
import Tree2_Alpha from "./textures/alpha/tree2_alpha.jpg";
import Tree_Lightmap from "./textures/lightmap/tree_lightmap.jpg";
import Dock_Diffuse from "./textures/diffuse/dock_diffuse.jpg";
import Dock_Specular from "./textures/specular/dock_specular.png";
import Dock_Lightmap from "./textures/lightmap/dock_lightmap.png";
import Dock_AO from "./textures/ao/dock_ao.png";
import DistantIsland_Diffuse from "./textures/diffuse/distant_island_diffuse.png";
import DistantTrees_Diffuse from "./textures/diffuse/distant_trees_diffuse.jpg";
import DistantTrees_Alpha from "./textures/alpha/distant_trees_alpha.jpg";
import DistantTrees_Lightmap from "./textures/lightmap/distant_tree_lightmap.jpg";
import Lighthouse_Diffuse from "./textures/diffuse/lighthouse_diffuse.png";
import Map_Diffuse from "./textures/diffuse/map_diffuse.jpg";
import Map_Lightmap from "./textures/lightmap/map_lightmap.png";
import Soot_Diffuse from "./textures/diffuse/soot_diffuse.jpg";
import Soot_Alpha from "./textures/alpha/soot_alpha.jpg";
import Soot_Emissive from "./textures/emissive/soot_emissive.jpg";
import LanternBase_Lightmap from "./textures/lightmap/lantern_lightmap.jpg";
import Cloud1_Diffuse from "./textures/diffuse/cloud1_diffuse.png";
import Cloud2_Diffuse from "./textures/diffuse/cloud2_diffuse.png";
import Cloud3_Diffuse from "./textures/diffuse/cloud3_diffuse.png";
import DrawnCircle_Diffuse from "./textures/diffuse/circle.png";
import DrawnCircle_Alpha from "./textures/alpha/circle_alpha.png";
import { LanternFlame } from "./examples/jsm/objects/LanternFlame.js";
import LanternFlame2 from "./examples/jsm/objects/LanternFlame2.js";

const generateUV2 = (geometry) => {
    let UVArr = geometry.getAttribute("uv").array;
    geometry.setAttribute("uv2", new THREE.BufferAttribute(UVArr, 2));
    return geometry;
};

const SunsetScene = () => {
    const group = useRef();
    const { nodes, materials } = useGLTF(Scene);
    const ship = useRef();
    let shipRotation = [0, 0, 0];
    let shipPosition = [0.73, 2.053, -1.7];

    // Bottle CubeCamera reflection setup
    const [bottleRenderTarget] = useState(
        new THREE.WebGLCubeRenderTarget(128, {
            format: THREE.RGBFormat,
        })
    );
    const bottleCubeCamera = useRef();
    const bottle = useRef();

    // Lantern CubeCamera reflection setup
    const [lanternGlassRenderTarget] = useState(
        new THREE.WebGLCubeRenderTarget(128, {
            format: THREE.RGBFormat,
        })
    );
    const lanternGlassCubeCamera = useRef();
    const lanternGlass = useRef();

    const bands = useRef();

    useFrame(({ gl, scene, clock }) => {
        ship.current.position.y = Math.cos(clock.getElapsedTime()) * 0.0025 + shipPosition[1];
        ship.current.rotation.x = Math.sin(clock.getElapsedTime()) * 0.06;
        ship.current.rotation.y = Math.cos(clock.getElapsedTime()) * 0.04;

        bottle.current.visible = false;
        bottleCubeCamera.current.update(gl, scene);
        bottle.current.visible = true;
        lanternGlass.current.visible = false;
        bands.current.visible = false;
        lanternGlassCubeCamera.current.update(gl, scene);
        bands.current.visible = true;
        lanternGlass.current.visible = true;
    });

    //let lanternFlame = new LanternFlame2(nodes.Flame_Plane.geometry);

    const Cloud = ({ diffuse, position, scale, renderOrder }) => {
        const cloudDiffuse = useLoader(THREE.TextureLoader, diffuse);
        return (
            <sprite position={position} scale={scale} renderOrder={renderOrder}>
                <spriteMaterial map={cloudDiffuse} />
            </sprite>
        );
    };

    const barrelDiffuse = () => {
        let x = new THREE.TextureLoader().load(Barrel_Diffuse);
        x.flipY = false;
        return x;
    };

    const barrelSpecular = () => {
        let x = new THREE.TextureLoader().load(Barrel_Specular);
        x.flipY = false;
        return x;
    };

    const barrelLightmap = () => {
        let x = new THREE.TextureLoader().load(Barrel_Lightmap);
        x.flipY = false;
        return x;
    };

    const holderDiffuse = () => {
        let x = new THREE.TextureLoader().load(Wood_Diffuse);
        x.flipY = false;
        return x;
    };

    const shipDiffuse = () => {
        let x = new THREE.TextureLoader().load(Ship_Diffuse);
        x.flipY = false;
        return x;
    };

    const shipLightmap = () => {
        let x = new THREE.TextureLoader().load(Ship_Lightmap);
        x.flipY = false;
        return x;
    };

    const tableDiffuse = () => {
        let x = new THREE.TextureLoader().load(Wood_Diffuse);
        x.flipY = false;
        x.wrapS = THREE.RepeatWrapping;
        x.wrapT = THREE.RepeatWrapping;
        x.repeat.set(10, 6);
        return x;
    };

    const tableLightmap = () => {
        let x = new THREE.TextureLoader().load(Table_Lightmap);
        x.flipY = false;
        return x;
    };

    const lifePreserverDiffuse = () => {
        let x = new THREE.TextureLoader().load(LifePreserver_Diffuse);
        x.flipY = false;
        return x;
    };

    const dockSupportDiffuse = () => {
        let x = new THREE.TextureLoader().load(DockSupport_Diffuse);
        x.flipY = false;
        return x;
    };

    const landscapeDiffuse = () => {
        let x = new THREE.TextureLoader().load(Landscape_Diffuse);
        x.flipY = false;
        return x;
    };

    const landscapeNormal = () => {
        let x = new THREE.TextureLoader().load(Landscape_Normal);
        x.flipY = false;
        return x;
    };

    const grassDiffuse = () => {
        let x = new THREE.TextureLoader().load(Grass_Diffuse);
        x.flipY = false;
        return x;
    };

    const grassLightmap = () => {
        let x = new THREE.TextureLoader().load(Grass_Lightmap);
        x.flipY = false;
        return x;
    };

    const grassAlpha = () => {
        let x = new THREE.TextureLoader().load(Grass_Alpha);
        x.flipY = false;
        return x;
    };

    const treeLightmap = () => {
        let x = new THREE.TextureLoader().load(Tree_Lightmap);
        x.flipY = false;
        return x;
    };

    const tree1Diffuse = () => {
        let x = new THREE.TextureLoader().load(Tree1_Diffuse);
        x.flipY = false;
        return x;
    };

    const tree1Alpha = () => {
        let x = new THREE.TextureLoader().load(Tree1_Alpha);
        x.flipY = false;
        return x;
    };

    const tree2Diffuse = () => {
        let x = new THREE.TextureLoader().load(Tree2_Diffuse);
        x.flipY = false;
        return x;
    };

    const tree2Alpha = () => {
        let x = new THREE.TextureLoader().load(Tree2_Alpha);
        x.flipY = false;
        return x;
    };

    const dockDiffuse = () => {
        let x = new THREE.TextureLoader().load(Dock_Diffuse);
        x.flipY = false;
        x.wrapS = THREE.RepeatWrapping;
        x.wrapT = THREE.RepeatWrapping;
        x.repeat.set(12, 6);
        //x.anisotropy = renderer.capabilities.getMaxAnisotropy();
        return x;
    };

    const dockLightmap = () => {
        let x = new THREE.TextureLoader().load(Dock_Lightmap);
        x.flipY = false;
        return x;
    };

    const dockSpecular = () => {
        let x = new THREE.TextureLoader().load(Dock_Specular);
        x.flipY = false;
        x.wrapS = THREE.RepeatWrapping;
        x.wrapT = THREE.RepeatWrapping;
        x.repeat.set(12, 6);
        return x;
    };

    const dockAO = () => {
        let x = new THREE.TextureLoader().load(Dock_AO);
        x.flipY = false;
        return x;
    };
    const distantIslandDiffuse = () => {
        let x = new THREE.TextureLoader().load(DistantIsland_Diffuse);
        x.flipY = false;
        return x;
    };

    const distantTreesDiffuse = () => {
        let x = new THREE.TextureLoader().load(DistantTrees_Diffuse);
        x.flipY = false;
        return x;
    };

    const distantTreesAlpha = () => {
        let x = new THREE.TextureLoader().load(DistantTrees_Alpha);
        x.flipY = false;
        return x;
    };

    const distantTreesLightmap = () => {
        let x = new THREE.TextureLoader().load(DistantTrees_Lightmap);
        x.flipY = false;
        return x;
    };

    const lighthouseDiffuse = () => {
        let x = new THREE.TextureLoader().load(Lighthouse_Diffuse);
        x.flipY = false;
        return x;
    };

    const mapDiffuse = () => {
        let x = new THREE.TextureLoader().load(Map_Diffuse);
        x.flipY = false;
        return x;
    };

    const mapLightmap = () => {
        let x = new THREE.TextureLoader().load(Map_Lightmap);
        x.flipY = false;
        return x;
    };

    const sootDiffuse = () => {
        let x = new THREE.TextureLoader().load(Soot_Diffuse);
        x.flipY = false;
        return x;
    };

    const sootAlpha = () => {
        let x = new THREE.TextureLoader().load(Soot_Alpha);
        x.flipY = false;
        return x;
    };

    const sootEmissive = () => {
        let x = new THREE.TextureLoader().load(Soot_Emissive);
        x.flipY = false;
        return x;
    };

    const lanternBaseLightmap = () => {
        let x = new THREE.TextureLoader().load(LanternBase_Lightmap);
        x.flipY = false;
        return x;
    };

    return (
        <group ref={group}>
            <Cloud diffuse={Cloud1_Diffuse} position={[-870, 550, -4999]} scale={[1800, 650]} />
            <Cloud diffuse={Cloud2_Diffuse} position={[2600, 750, -5000]} scale={[3000, 700]} />
            <Cloud diffuse={Cloud2_Diffuse} position={[-2500, 950, -5001]} scale={[2200, 1100]} />
            <Cloud diffuse={Cloud3_Diffuse} position={[300, 1100, -5002]} scale={[3000, 500]} />
            <mesh castShadow receiveShadow geometry={nodes.Barrel.geometry}>
                <meshPhongMaterial
                    map={barrelDiffuse()}
                    specularMap={barrelSpecular()}
                    shininess={100}
                    reflectivity={0.2}
                />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Barrel_2.geometry}>
                <meshPhongMaterial
                    map={barrelDiffuse()}
                    specularMap={barrelSpecular()}
                    lightMap={barrelLightmap()}
                    lightMapIntensity={1}
                    shininess={100}
                    reflectivity={0.2}
                />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Bands.geometry} ref={bands}>
                <meshPhongMaterial color={0xffd700} shininess={100} />
            </mesh>
            <cubeCamera
                name="bottleCubeCamera"
                ref={bottleCubeCamera}
                position={[0.44, 2.023, -2.09]}
                args={[0.05, 100000, bottleRenderTarget]}
            />
            <mesh castShadow receiveShadow geometry={nodes.Bottle.geometry} renderOrder={2} ref={bottle}>
                <meshPhongMaterial
                    color={0xffffff}
                    envMap={bottleRenderTarget.texture}
                    refractionRatio={0.985}
                    reflectivity={0.9}
                    opacity={0.4}
                    shininess={100}
                    specular={0xffffff}
                    transparent={true}
                />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Cork.geometry} material={nodes.Cork.material} />
            <mesh castShadow receiveShadow geometry={nodes.Glass.geometry} renderOrder={6} ref={lanternGlass}>
                <meshPhongMaterial
                    color={0xffffff}
                    envMap={lanternGlassRenderTarget.texture}
                    refractionRatio={0.985}
                    reflectivity={0.9}
                    opacity={0.4}
                    shininess={100}
                    specular={0xffffff}
                    transparent={true}
                />
            </mesh>
            <cubeCamera
                name="lanternGlassCubeCamera"
                ref={lanternGlassCubeCamera}
                position={[-1.26, 2.1, -1.77]}
                args={[0.05, 100000, lanternGlassRenderTarget]}
            />
            <mesh castShadow receiveShadow geometry={nodes.Holder.geometry}>
                <meshLambertMaterial map={holderDiffuse()} />
            </mesh>
            <mesh
                ref={ship}
                castShadow
                receiveShadow
                geometry={generateUV2(nodes.Ship.geometry)}
                position={shipPosition}
                rotation={shipRotation}
            >
                <meshLambertMaterial map={shipDiffuse()} lightMap={shipLightmap()} lightMapIntensity={1} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Tabletop.geometry}>
                <meshLambertMaterial map={tableDiffuse()} lightMap={tableLightmap()} lightMapIntensity={1} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Ladder.geometry} material={nodes.Ladder.material} />
            <mesh castShadow receiveShadow geometry={nodes.Lightpole.geometry} material={nodes.Lightpole.material} />
            <mesh castShadow receiveShadow geometry={nodes.Life_Preserver.geometry}>
                <meshLambertMaterial map={lifePreserverDiffuse()} />
            </mesh>
            <mesh geometry={nodes.Life_Preserver_String.geometry} material={nodes.Life_Preserver_String.material} />
            <mesh castShadow receiveShadow geometry={nodes.Ladder004.geometry}>
                <meshPhongMaterial color={0x999999} reflectivity={0.7} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Ladder003.geometry}>
                <meshPhongMaterial color={0x999999} reflectivity={0.7} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Ladder001.geometry}>
                <meshPhongMaterial color={0x999999} reflectivity={0.7} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support001.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support002.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support003.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support004.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support005.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support006.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support007.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support008.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support009.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support010.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support011.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support012.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support013.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support014.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support015.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support016.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support017.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support018.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support019.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support020.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support021.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support022.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support023.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support024.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support025.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support026.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support027.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support028.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support029.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support030.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support031.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support032.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support033.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support034.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support035.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support036.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support037.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support038.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support039.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support040.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support041.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock_Support042.geometry}>
                <meshLambertMaterial map={dockSupportDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Landscape.geometry}>
                <meshPhongMaterial map={landscapeDiffuse()} normalMap={landscapeNormal()} />
            </mesh>
            <mesh
                geometry={generateUV2(nodes.Plants_Back.geometry)}
                material={nodes.Plants_Back.material}
                renderOrder={3}
            >
                <meshLambertMaterial
                    map={grassDiffuse()}
                    alphaMap={grassAlpha()}
                    lightMap={grassLightmap()}
                    lightMapIntensity={1}
                    transparent={true}
                />
            </mesh>
            <mesh
                geometry={generateUV2(nodes.Plants_Front.geometry)}
                material={nodes.Plants_Front.material}
                renderOrder={2}
            >
                <meshLambertMaterial
                    map={grassDiffuse()}
                    alphaMap={grassAlpha()}
                    lightMap={grassLightmap()}
                    lightMapIntensity={1}
                    transparent={true}
                />
            </mesh>
            <mesh geometry={generateUV2(nodes.Tree_1.geometry)} renderOrder={1}>
                <meshLambertMaterial
                    map={tree1Diffuse()}
                    alphaMap={tree1Alpha()}
                    lightMap={treeLightmap()}
                    lightMapIntensity={1}
                    transparent={true}
                />
            </mesh>
            <mesh geometry={generateUV2(nodes.Tree_2.geometry)} renderOrder={0}>
                <meshLambertMaterial
                    map={tree2Diffuse()}
                    alphaMap={tree2Alpha()}
                    lightMap={treeLightmap()}
                    lightMapIntensity={0.9}
                    transparent={true}
                />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Dock.geometry} material={nodes.Dock.material}>
                <meshPhongMaterial
                    map={dockDiffuse()}
                    aoMap={dockAO()}
                    aoMapIntensity={3}
                    lightMap={dockLightmap()}
                    lightMapIntensity={1}
                    specular={0xff8133}
                    specularMap={dockSpecular()}
                    reflectivity={0.5}
                    shininess={40}
                />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Distant_Island.geometry}>
                <meshLambertMaterial map={distantIslandDiffuse()} />
            </mesh>
            <mesh
                geometry={generateUV2(nodes.Distant_Trees.geometry)}
                position={[689.95, 14.55, -531.14]}
                renderOrder={1}
            >
                <meshLambertMaterial
                    map={distantTreesDiffuse()}
                    lightMap={distantTreesLightmap()}
                    alphaMap={distantTreesAlpha()}
                    lightMapIntensity={0.9}
                    transparent={true}
                />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Lighthouse.geometry}>
                <meshLambertMaterial map={lighthouseDiffuse()} />
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.Map.geometry}>
                <meshLambertMaterial
                    map={mapDiffuse()}
                    lightMap={mapLightmap()}
                    lightMapIntensity={0.5}
                    side={THREE.DoubleSide}
                />
            </mesh>
            {/*<mesh
                castShadow
                receiveShadow
                geometry={lanternFlame.geometry}
                material={lanternFlame.material}
                renderOrder={4}
            />*/}
            <LanternFlame2 geometry={nodes.Flame_Plane.geometry} renderOrder={4} />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Inner_Glass.geometry}
                material={nodes.Inner_Glass.material}
                renderOrder={5}
            >
                <meshLambertMaterial
                    map={sootDiffuse()}
                    alphaMap={sootAlpha()}
                    emissiveMap={sootEmissive()}
                    emissive={0xcd2a0a}
                    transparent={true}
                />
            </mesh>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Base.geometry}
                material={nodes.Base.material}
                position={[-1.26, 2.16, -1.77]}
                rotation={[0, Math.PI / 4, 0]}
                scale={[0.16, 0.16, 0.16]}
            >
                <meshPhongMaterial
                    color={0x1258f0}
                    lightMapIntensity={0.8}
                    lightMap={lanternBaseLightmap()}
                    specular={0x43431e}
                    shininess={100}
                />
            </mesh>
        </group>
    );
};

useGLTF.preload("/scene.glb");
export default SunsetScene;
