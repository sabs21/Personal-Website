import React, { useEffect } from "react";
import * as THREE from "./three.module.js";
import { OrbitControls } from "./examples/jsm/controls/OrbitControls.js";
//import { Water } from "./examples/jsm/objects/Water.js";
import { Water2 } from "./examples/jsm/objects/Water2.js";
import { Water3 } from "./examples/jsm/objects/Water3.js";
import { LanternFlame } from "./examples/jsm/objects/LanternFlame.js";
//import { GLTFLoader } from "./examples/jsm/loaders/GLTFLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MarchingCubes } from "./examples/jsm/objects/MarchingCubes.js";
import { Sky } from "./examples/jsm/objects/Sky.js";
import Scene from "./scene.glb";
// Scene textures
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
import Landscape_Lightmap from "./textures/normal/landscape_normal.jpg";
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
import "./stylesheet.css";

//extend({ Water });

const NAV_BAR_HEIGHT = 80;

const Sunset = () => {
    useEffect(() => {
        //////////////////////////
        // THREE JS SCENE SETUP //
        //////////////////////////
        const threeDisplay = document.getElementById("threeDisplay");

        // DOM Globals
        const viewMapButton = document.getElementById("viewMap");
        const sunsetUI = document.getElementById("sunsetUI");
        const viewSunsetButton = document.getElementById("viewSunset");
        const mapUI = document.getElementById("mapUI");
        const shipWheelElem = document.getElementById("shipWheel");
        const bodyElem = document.getElementsByTagName("body")[0];

        // Three.JS Globals
        const balls = [];
        const isOrbitCameraOn = false;
        const textureLoader = new THREE.TextureLoader();
        const skySettings = {
            turbidity: 10,
            rayleigh: 3,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
            elevation: 0,
            azimuth: 180,
        };
        let screenDimensions = {
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            height:
                (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) -
                NAV_BAR_HEIGHT,
        };
        let objects = [];
        let newCameraPosition = null; // For movement CameraDirector
        let newCameraLookAt = null; // For lookAt CameraDirector
        let controls = null;
        let positionDirector = null;
        let lookAtDirector = null;
        let lastHoveredSkillIsland = null; // Used for navigating to different pages when the user clicks on an island.

        // Setup the loading manager such that the loading bar can reflect the total progress of the scene.
        // The onLoad event of the default loading manager fires twice, so we can't rely on that event to signify when everything's loaded.
        let loaded = 0;
        let totalToLoad = 49;
        THREE.DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
            //console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
            loaded++;
            shipWheelElem.setAttribute("totalLoaded", (loaded / totalToLoad) * 100); // Display loading progress
            //drawProgress(draw, loaded/totalToLoad);
        };

        // Stretch to fit height of screen
        threeDisplay.style.height = screenDimensions.height + "px";

        // Set the scene up
        const scene = new THREE.Scene();

        // Set the camera up
        const fov = 40;
        let aspect = screenDimensions.width / screenDimensions.height; // the canvas default
        let landscape = screenDimensions.width > screenDimensions.height;
        const near = 0.1;
        const far = 10000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 2.2, 1.25);
        camera.lookAt(0, 2.5, -1000);

        // On resize, adjust the camera
        window.addEventListener("resize", (e) => {
            screenDimensions = {
                width: e.target.innerWidth,
                height: e.target.innerHeight - NAV_BAR_HEIGHT,
            };
            // Update the canvas container
            threeDisplay.style.height = screenDimensions.height + "px";
            renderer.domElement.style.width = screenDimensions.width + "px";
            renderer.domElement.style.height = screenDimensions.height + "px";
            aspect = screenDimensions.width / screenDimensions.height;
            landscape = screenDimensions.width > screenDimensions.height;
            updateCameraAngledAtMap(3.5);
        });

        // Sky
        let sky = new Sky();
        sky.scale.setScalar(100000);
        scene.add(sky);
        updateSky(skySettings);

        // Lighting
        {
            const color = 0xfd5e53;
            const intensity = 0.3;
            const sunlight = new THREE.DirectionalLight(color, intensity);
            sunlight.position.set(0, 4, -10);
            sunlight.target.position.set(0, 0, 0);
            scene.add(sunlight);
        }

        // Lamp lighting
        {
            const color = 0xff9a02;
            const intensity = 2;
            const lampLight = new THREE.PointLight(color, intensity, 2);
            lampLight.position.set(-1.25, 2.13, -1.77);
        }

        {
            // Water in the bottle
            const width = 1.9;
            const height = 4.4;
            const segments = 48;
            const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
            let bottleWater = new Water2(geometry, {
                color: "#77a6ff",
                scale: 0.4,
                reflectivity: 0.1,
                flowDirection: new THREE.Vector2(1, 1),
                textureWidth: 1024,
                textureHeight: 1024,
                roundness: 0.1,
            });
            bottleWater.rotation.x = THREE.Math.degToRad(270);
            bottleWater.rotation.z = THREE.Math.degToRad(280);
            bottleWater.position.set(0.69, 2.023, -1.71);
            bottleWater.scale.set(0.1, 0.1, 0.1);
            bottleWater.renderOrder = 1; // allows the water to be visible through the bottle
            objects.push(bottleWater);
        }

        {
            // Ocean far
            const width = 10000;
            const height = 10000;
            const segments = 1;
            const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
            let ocean = new Water3(geometry, {
                color: "#6d808c",
                scale: 1000,
                reflectivity: 0.1,
                flowDirection: new THREE.Vector2(-1, 1),
                textureWidth: 2048,
                textureHeight: 2048,
            });
            ocean.rotation.x = THREE.Math.degToRad(270);
            ocean.position.set(0, -0.15, -50);
            ocean.renderOrder = 1; // allows the water to be visible through the bottle
            objects.push(ocean);
        }

        // Add geometries to hover over and click on for the skill islands map
        let clickables = [];
        let clickableGeometry = new THREE.PlaneGeometry(0.17, 0.17);
        let clickableMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
        });
        let clickablesData = [
            {
                name: "Programs",
                position: new THREE.Vector3(0.01, 1.93, -1.75),
                scale: new THREE.Vector2(1, 1),
                url: "./programs",
            },
            {
                name: "Chrome Extensions",
                position: new THREE.Vector3(0.24, 1.93, -1.8),
                scale: new THREE.Vector2(1.2, 1.2),
                url: "./extensions",
            },
            {
                name: "Graphics",
                position: new THREE.Vector3(0.14, 1.93, -1.52),
                scale: new THREE.Vector2(1, 1),
                url: "./graphics",
            },
            {
                name: "Other Skills",
                position: new THREE.Vector3(0.47, 1.93, -1.3),
                scale: new THREE.Vector2(2.2, 2.2),
                url: "./skills",
            },
            {
                name: "Web Components",
                position: new THREE.Vector3(-0.28, 1.93, -2),
                scale: new THREE.Vector2(2.2, 2),
                url: "./components",
            },
            {
                name: "Games",
                position: new THREE.Vector3(-0.575, 1.93, -1.8),
                scale: new THREE.Vector2(1.2, 1.2),
                url: "./games",
            },
            {
                name: "Websites",
                position: new THREE.Vector3(-0.68, 1.93, -2.16),
                scale: new THREE.Vector2(2.4, 2.5),
                url: "./websites",
            },
        ];
        lastHoveredSkillIsland = clickablesData[0]; // Set a default skill island just in case the user somehow clicks on the drawn circle before hovering an island.

        for (let i = 0; i < 7; i++) {
            clickables[i] = new THREE.Mesh(clickableGeometry, clickableMaterial);
            clickables[i].name = clickablesData[i].name;
            clickables[i].rotation.x = THREE.Math.degToRad(270);
            clickables[i].position.set(
                clickablesData[i].position.x,
                clickablesData[i].position.y,
                clickablesData[i].position.z
            );
            clickables[i].scale.set(clickablesData[i].scale.x, clickablesData[i].scale.y, clickablesData[i].scale.z);
            clickables[i].renderOrder = 2;
            scene.add(clickables[i]);
        }

        // Add drawn circle sprite
        let drawnCircleDiffuse = textureLoader.load(DrawnCircle_Diffuse);
        drawnCircleDiffuse.flipY = false;
        let drawnCircleAlpha = textureLoader.load(DrawnCircle_Alpha);
        drawnCircleAlpha.flipY = false;
        let drawnCircleGeometry = new THREE.PlaneGeometry(0.1, 0.1, 1, 1);
        let drawnCircleMaterial = new THREE.MeshBasicMaterial({
            alphaMap: drawnCircleAlpha,
            map: drawnCircleDiffuse,
            side: THREE.FrontSide,
            transparent: true,
        });
        let drawnCircle = new THREE.Mesh(drawnCircleGeometry, drawnCircleMaterial);
        drawnCircle.rotation.x = THREE.Math.degToRad(270);
        drawnCircle.position.set(0, -100, 0);
        drawnCircle.name = "Drawn Circle";
        scene.add(drawnCircle);

        // Add Raycast from mouse
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Add click events based on raycase
        bodyElem.addEventListener("click", (e) => {
            console.log(e);
            let intersections = getMouseRayIntersections();
            if (intersections[0].object.name.toString() === "Drawn Circle") {
                navigateToLastHoveredSkillIsland();
            }
        });

        // Clouds (Marching Cubes)
        const cloudResolution = 16;
        let colorTop = new THREE.Vector3(0.98, 0.961, 0.855);
        let colorBottom = new THREE.Vector3(0.376, 0.416, 0.482); //new THREE.Vector3(0.921, 0.486, 0.561);
        const cloudMaterial = cloudShadow(colorTop, colorBottom); // Custom cloud shader to avoid using lighting.
        const totalBalls = 7;
        initMarchingCubeBallSeeds(totalBalls); // Give each ball a random seed so that each ball's movement pattern differs.
        const clouds = new MarchingCubes(cloudResolution, cloudMaterial, false, false);
        clouds.position.set(0.71, 2.18, -1.72);
        clouds.rotation.y = THREE.Math.degToRad(10);
        clouds.scale.set(0.27, 0.1, 0.1);
        scene.add(clouds);

        // Sky clouds 1
        let skyCloud1Diffuse = textureLoader.load(Cloud1_Diffuse);
        let skyCloud1Material = new THREE.SpriteMaterial({ map: skyCloud1Diffuse });
        let skyCloud1 = new THREE.Sprite(skyCloud1Material);
        objects.push(skyCloud1);

        // Sky clouds 2
        let skyCloud2Diffuse = textureLoader.load(Cloud2_Diffuse);
        let skyCloud2Material = new THREE.SpriteMaterial({ map: skyCloud2Diffuse });
        let skyCloud2 = new THREE.Sprite(skyCloud2Material);
        objects.push(skyCloud2);

        // Sky clouds 3
        let skyCloud3Diffuse = textureLoader.load(Cloud2_Diffuse);
        let skyCloud3Material = new THREE.SpriteMaterial({ map: skyCloud3Diffuse });
        let skyCloud3 = new THREE.Sprite(skyCloud3Material);
        objects.push(skyCloud3);

        // Sky clouds 4
        let skyCloud4Diffuse = textureLoader.load(Cloud3_Diffuse);
        let skyCloud4Material = new THREE.SpriteMaterial({ map: skyCloud4Diffuse });
        let skyCloud4 = new THREE.Sprite(skyCloud4Material);
        objects.push(skyCloud4);

        // Load the scene and its objects
        loadScene(Scene).then((sceneObjects) => {
            // Merge both object arrays into one using the spread operator.
            objects = [...objects, ...sceneObjects];

            console.log(objects);
            // objects[0]:  Water in bottle
            // objects[1]:  Ocean water
            // objects[2]:  Sky clouds 1
            // objects[3]:  Sky clouds 2
            // objects[4]:  Sky clouds 3
            // objects[5]:  Sky clouds 4
            // objects[6]:  Right barrel
            // objects[7]:  Left barrel
            // objects[8]:  Bands (Hurricane Lantern)
            // objects[9]:  Bottle (Ship in a Bottle)
            // objects[10]: Cork (Ship in a Bottle)
            // objects[11]: Glass (Hurricane Lantern)
            // objects[12]: Holder (Ship in a Bottle)
            // objects[13]: Ship (Ship in a Bottle)
            // objects[14]: Tabletop
            // objects[15]: Ladder (Right, Closer)
            // objects[16]: Lightpole
            // objects[17]: Life Preserver
            // objects[18]: Life Preserver String
            // objects[19]: Ladder (Right, Further)
            // objects[20]: Ladder (Left, Closer)
            // objects[21]: Ladder (Left, Further)
            // objects[22 - 63]: Dock Supports (1 to 42)
            // objects[64]: Landscape
            // objects[65]: Plants Back
            // objects[66]: Plants Front
            // objects[67]: Tree_1
            // objects[68]: Tree_2
            // objects[69]: Dock
            // objects[70]: Distant Island
            // objects[71]: Distant Trees
            // objects[72]: Lighthouse
            // objects[73]: Map
            // objects[74]: Lantern Flame
            // objects[75]: Inner_Glass (Hurricane Lantern)
            // objects[76]: Base (Hurricane Lantern)

            // Bottle Cube Camera
            // Create cube render target. This holds the environment map texture that the CubeCamera generates.
            const bottleRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
                format: THREE.RGBFormat,
            });
            // Create cube camera
            const bottleCubeCamera = new THREE.CubeCamera(0.05, 100000, bottleRenderTarget);
            bottleCubeCamera.position.set(0.44, 2.023, -2.09);
            scene.add(bottleCubeCamera);

            // Lantern Glass Cube Camera
            // Create cube render target. This holds the environment map texture that the CubeCamera generates.
            const lanternRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
                format: THREE.RGBFormat,
            });
            // Create cube camera
            const lanternCubeCamera = new THREE.CubeCamera(0.05, 100000, lanternRenderTarget);
            lanternCubeCamera.position.set(-1.26, 2.1, -1.77);
            scene.add(lanternCubeCamera);

            // Sky Cloud 1
            objects[2].position.set(-870, 550, -5000);
            objects[2].scale.set(1800, 650);

            // Sky Cloud 2
            objects[3].position.set(2600, 750, -5000);
            objects[3].scale.set(3000, 700);

            // Sky Cloud 3
            objects[4].position.set(-2500, 950, -5000);
            objects[4].scale.set(2200, 1100);

            // Sky Cloud 4
            objects[5].position.set(300, 1100, -5000);
            objects[5].scale.set(3000, 500);

            // Right Barrel
            let barrelDiffuse = textureLoader.load(Barrel_Diffuse);
            barrelDiffuse.flipY = false;
            let barrelSpecular = textureLoader.load(Barrel_Specular);
            barrelSpecular.flipY = false;
            objects[6].material = new THREE.MeshPhongMaterial({
                map: barrelDiffuse,
                specularMap: barrelSpecular,
                shininess: 100,
                reflectivity: 0.2,
            });

            // Left Barrel
            let barrelLightmap = textureLoader.load(Barrel_Lightmap);
            barrelLightmap.flipY = false;
            objects[7].material = new THREE.MeshPhongMaterial({
                map: barrelDiffuse,
                lightMap: barrelLightmap,
                lightMapIntensity: 1,
                specularMap: barrelSpecular,
                shininess: 100,
                reflectivity: 0.2,
            });

            // Left Barrel
            objects[6].material = new THREE.MeshPhongMaterial({
                map: barrelDiffuse,
                specularMap: barrelSpecular,
                shininess: 100,
                reflectivity: 0.2,
            });

            // Hurricane Lantern
            // Bands
            objects[8].material = new THREE.MeshPhongMaterial({
                color: 0xffd700,
                shininess: 100,
            });

            // Bottle
            objects[9].material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                envMap: bottleRenderTarget.texture,
                refractionRatio: 0.985,
                reflectivity: 0.9,
                opacity: 0.4,
                shininess: 100,
                specular: 0xffffff,
                transparent: true,
            });
            objects[9].renderOrder = 2;

            // Hurricane Lantern glass
            objects[11].material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                envMap: lanternRenderTarget.texture,
                refractionRatio: 0.985,
                reflectivity: 0.9,
                opacity: 0.4,
                shininess: 100,
                specular: 0xffffff,
                transparent: true,
            });
            objects[11].renderOrder = 6;

            // Holder
            let holderDiffuse = textureLoader.load(Wood_Diffuse);
            holderDiffuse.flipY = false;
            objects[12].material = new THREE.MeshLambertMaterial({
                map: holderDiffuse,
            });

            // Ship (Ship in a Bottle)
            objects[13].position.set(0.73, 2.083, -1.7); // Place ship into correct position.
            let shipDiffuse = textureLoader.load(Ship_Diffuse);
            shipDiffuse.flipY = false;
            let shipLightmap = textureLoader.load(Ship_Lightmap);
            shipLightmap.flipY = false;
            generateUV2(objects[13].geometry);
            objects[13].material = new THREE.MeshLambertMaterial({
                map: shipDiffuse,
                lightMap: shipLightmap,
                lightMapIntensity: 1,
            });

            // Table top
            let tableDiffuse = textureLoader.load(Wood_Diffuse); // TODO: Should reuse holderDiffuse, but cloning is not working. Re-loading the texture for now.
            tableDiffuse.flipY = false;
            tableDiffuse.wrapS = THREE.RepeatWrapping;
            tableDiffuse.wrapT = THREE.RepeatWrapping;
            tableDiffuse.repeat.set(10, 6);
            let tableLightmap = textureLoader.load(Table_Lightmap);
            tableLightmap.flipY = false;
            objects[14].material = new THREE.MeshLambertMaterial({
                map: tableDiffuse,
                lightMap: tableLightmap,
                lightMapIntensity: 1,
            });

            // Life preserver
            let lifePreserverDiffuse = textureLoader.load(LifePreserver_Diffuse);
            lifePreserverDiffuse.flipY = false;
            objects[17].material = new THREE.MeshLambertMaterial({
                map: lifePreserverDiffuse,
            });

            // Dock Supports
            let dockSupportDiffuse = textureLoader.load(DockSupport_Diffuse);
            dockSupportDiffuse.flipY = false;
            for (let i = 22; i <= 63; i++) {
                objects[i].material = new THREE.MeshLambertMaterial({
                    map: dockSupportDiffuse,
                });
            }

            // Landscape
            let landscapeDiffuse = textureLoader.load(Landscape_Diffuse);
            landscapeDiffuse.flipY = false;
            let landscapeNormal = textureLoader.load(Landscape_Lightmap);
            landscapeNormal.flipY = false;
            objects[64].material = new THREE.MeshPhongMaterial({
                map: landscapeDiffuse,
                normalMap: landscapeNormal,
            });

            // Plants Back
            let backGrassDiffuse = textureLoader.load(Grass_Diffuse);
            backGrassDiffuse.flipY = false;
            let backGrassAlpha = textureLoader.load(Grass_Alpha);
            backGrassAlpha.flipY = false;
            let backGrassLightmap = textureLoader.load(Grass_Lightmap);
            backGrassLightmap.flipY = false;
            let grassUVArr = objects[65].geometry.getAttribute("uv").array;
            objects[65].geometry.setAttribute("uv2", new THREE.BufferAttribute(grassUVArr, 2));
            objects[65].material = new THREE.MeshLambertMaterial({
                alphaMap: backGrassAlpha,
                map: backGrassDiffuse,
                lightMap: backGrassLightmap,
                lightMapIntensity: 1,
                transparent: true,
            });
            objects[65].renderOrder = 3;

            // Plants Front
            let frontGrassDiffuse = textureLoader.load(Grass_Diffuse);
            frontGrassDiffuse.flipY = false;
            let frontGrassAlpha = textureLoader.load(Grass_Alpha);
            frontGrassAlpha.flipY = false;
            let frontGrassLightmap = textureLoader.load(Grass_Lightmap);
            frontGrassLightmap.flipY = false;
            grassUVArr = objects[66].geometry.getAttribute("uv").array;
            objects[66].geometry.setAttribute("uv2", new THREE.BufferAttribute(grassUVArr, 2));
            objects[66].material = new THREE.MeshLambertMaterial({
                alphaMap: frontGrassAlpha,
                map: frontGrassDiffuse,
                lightMap: frontGrassLightmap,
                lightMapIntensity: 1,
                transparent: true,
            });
            objects[66].renderOrder = 2;

            // Tree_1
            let frontTreeDiffuse = textureLoader.load(Tree1_Diffuse);
            frontTreeDiffuse.flipY = false;
            let frontTreeAlpha = textureLoader.load(Tree1_Alpha);
            frontTreeAlpha.flipY = false;
            let frontTreeLightmap = textureLoader.load(Tree_Lightmap);
            frontTreeLightmap.flipY = false;
            let treeUVArr = objects[67].geometry.getAttribute("uv").array;
            objects[67].geometry.setAttribute("uv2", new THREE.BufferAttribute(treeUVArr, 2));
            objects[67].material = new THREE.MeshLambertMaterial({
                alphaMap: frontTreeAlpha,
                map: frontTreeDiffuse,
                lightMap: frontTreeLightmap,
                lightMapIntensity: 1,
                transparent: true,
            });
            objects[67].renderOrder = 1;

            // Tree_2
            let backTreeDiffuse = textureLoader.load(Tree2_Diffuse);
            backTreeDiffuse.flipY = false;
            let backTreeAlpha = textureLoader.load(Tree2_Alpha);
            backTreeAlpha.flipY = false;
            let backTreeLightmap = textureLoader.load(Tree_Lightmap);
            backTreeLightmap.flipY = false;
            treeUVArr = objects[68].geometry.getAttribute("uv").array;
            objects[68].geometry.setAttribute("uv2", new THREE.BufferAttribute(treeUVArr, 2));
            objects[68].material = new THREE.MeshLambertMaterial({
                alphaMap: backTreeAlpha,
                map: backTreeDiffuse,
                lightMap: backTreeLightmap,
                lightMapIntensity: 0.9,
                transparent: true,
            });
            objects[68].renderOrder = 0;

            // Dock
            let dockDiffuse = textureLoader.load(Dock_Diffuse);
            dockDiffuse.flipY = false;
            dockDiffuse.wrapS = THREE.RepeatWrapping;
            dockDiffuse.wrapT = THREE.RepeatWrapping;
            dockDiffuse.repeat.set(12, 6);
            dockDiffuse.anisotropy = renderer.capabilities.getMaxAnisotropy();
            let dockSpecular = textureLoader.load(Dock_Specular);
            dockSpecular.flipY = false;
            dockSpecular.wrapS = THREE.RepeatWrapping;
            dockSpecular.wrapT = THREE.RepeatWrapping;
            dockSpecular.repeat.set(12, 6);
            let dockLightmap = textureLoader.load(Dock_Lightmap);
            dockLightmap.flipY = false;
            let dockAOmap = textureLoader.load(Dock_AO);
            dockAOmap.flipY = false;
            objects[69].material = new THREE.MeshPhongMaterial({
                map: dockDiffuse,
                aoMap: dockAOmap,
                aoMapIntensity: 3,
                lightMap: dockLightmap,
                lightMapIntensity: 1,
                specular: 0xff8133,
                specularMap: dockSpecular,
                reflectivity: 0.5,
                shininess: 40,
            });

            // Distant Island
            let distantIslandDiffuse = textureLoader.load(DistantIsland_Diffuse);
            distantIslandDiffuse.flipY = false;
            objects[70].material = new THREE.MeshLambertMaterial({
                map: distantIslandDiffuse,
            });

            // Distant Trees
            let distantTreesDiffuse = textureLoader.load(DistantTrees_Diffuse);
            distantTreesDiffuse.flipY = false;
            let distantTreesAlpha = textureLoader.load(DistantTrees_Alpha);
            distantTreesAlpha.flipY = false;
            let distantTreesLightmap = textureLoader.load(DistantTrees_Lightmap);
            distantTreesLightmap.flipY = false;
            let distantTreesUVArr = objects[71].geometry.getAttribute("uv").array;
            objects[71].geometry.setAttribute("uv2", new THREE.BufferAttribute(distantTreesUVArr, 2));
            objects[71].material = new THREE.MeshLambertMaterial({
                alphaMap: distantTreesAlpha,
                map: distantTreesDiffuse,
                lightMap: distantTreesLightmap,
                lightMapIntensity: 0.9,
                transparent: true,
            });
            objects[71].renderOrder = 1;

            // Lighthouse
            let lighthouseDiffuse = textureLoader.load(Lighthouse_Diffuse);
            lighthouseDiffuse.flipY = false;
            objects[72].material = new THREE.MeshLambertMaterial({
                map: lighthouseDiffuse,
            });

            // Map
            let mapDiffuse = textureLoader.load(Map_Diffuse);
            mapDiffuse.flipY = false;
            let mapLightmap = textureLoader.load(Map_Lightmap);
            mapLightmap.flipY = false;
            objects[73].material = new THREE.MeshLambertMaterial({
                map: mapDiffuse,
                lightMap: mapLightmap,
                lightMapIntensity: 0.5,
                side: THREE.DoubleSide,
            });

            // Lantern Flame
            objects[74] = new LanternFlame(objects[74].geometry);
            objects[74].renderOrder = 4;

            // Inner Glass (hurricane lantern)
            let sootDiffuse = textureLoader.load(Soot_Diffuse);
            sootDiffuse.flipY = false;
            let sootAlpha = textureLoader.load(Soot_Alpha);
            sootAlpha.flipY = false;
            let sootEmissive = textureLoader.load(Soot_Emissive);
            sootEmissive.flipY = false;
            objects[75].material = new THREE.MeshLambertMaterial({
                map: sootDiffuse,
                alphaMap: sootAlpha,
                emissive: 0xcd2a0a,
                emissiveMap: sootEmissive,
                //lightMap: sootEmissive,
                //lightMapIntensity: 10,
                //emissiveIntensity: 100.25,
                transparent: true,
            });
            objects[75].renderOrder = 5;

            // Base
            let lanternBaseLightmap = textureLoader.load(LanternBase_Lightmap);
            lanternBaseLightmap.flipY = false;
            objects[76].material = new THREE.MeshPhongMaterial({
                color: 0x1258f0,
                lightMap: lanternBaseLightmap,
                lightMapIntensity: 0.8,
                specular: 0x43431e,
                shininess: 100,
            });

            // Add all objects to the scene.
            objects.forEach((object) => scene.add(object));

            // Generate environment maps from each cube camera.
            objects[9].visible = false; // Hide the bottle
            bottleCubeCamera.update(renderer, scene);
            objects[9].visible = true;

            objects[11].visible = false; // Hide the lamp glass
            objects[7].visible = false; // Hide the bands
            lanternCubeCamera.update(renderer, scene);
            objects[11].visible = true;
            objects[7].visible = true;
        });

        // Setup WebGL renderer
        const renderer = initRenderer();
        threeDisplay.appendChild(renderer.domElement);

        if (isOrbitCameraOn) {
            // Orbit controls
            controls = new OrbitControls(camera, renderer.domElement);
            controls.minDistance = 1;
            controls.maxDistance = 50;
        } else {
            // Calculate how to position the camera to accomodate for various aspect ratios.
            let baseHeight = 3.5;
            let cameraHeight = 1 / aspect + baseHeight;
            if (!landscape) {
                cameraHeight = 1 / aspect + baseHeight * 1.25;
            }

            // Establish camera positioning plans (camera panning)
            positionDirector = new CameraDirector();
            positionDirector.addPlan(
                new CameraPlan(
                    new THREE.Vector3(-0.1, cameraHeight, -0.75),
                    new THREE.Vector3(-0.1, 2.5, 0.5),
                    2,
                    998,
                    true
                )
            );
            positionDirector.addPlan(
                new CameraPlan(
                    new THREE.Vector3(-0.1, 2.5, 0.5),
                    new THREE.Vector3(-0.1, cameraHeight, -0.75),
                    2,
                    998,
                    true
                )
            );

            // Establish camera lookAt plans (camera focal point)
            // For a smooth pan, take the movement and subtract the 'to' movement with the 'from' movement. Add this number to the 'from' lookAt numbers.
            // I.e.: lookAtTo = new THREE.Vector3((posTo.x - posFrom.x) + lookAtFrom.x, (posTo.y - posFrom.y) + lookAtFrom.y, (posTo.z - posFrom.z) + lookAtFrom.z)
            lookAtDirector = new CameraDirector();
            lookAtDirector.addPlan(
                new CameraPlan(new THREE.Vector3(-0.1, 2, -1.6), new THREE.Vector3(-0.1, 2, -5), 2, 998, true)
            );
            lookAtDirector.addPlan(
                new CameraPlan(new THREE.Vector3(-0.1, 2, -5), new THREE.Vector3(-0.1, 2, -1.6), 1.5, 998.5, true)
            );
        }

        window.addEventListener("mousemove", updateMouseRay, false);

        animate();

        // Handle DOM Events (Button presses and such)
        viewMapButton.addEventListener("click", () => {
            viewMap(positionDirector);
            viewMap(lookAtDirector);
            sunsetUI.className = "ui mostDefinitelyHidden";
            mapUI.className = "ui";
        });

        viewSunsetButton.addEventListener("click", () => {
            viewSunset(positionDirector);
            viewSunset(lookAtDirector);
            sunsetUI.className = "ui";
            mapUI.className = "ui mostDefinitelyHidden";
        });

        function addCameraWobble(cameraPosition, time) {
            return new THREE.Vector3(
                cameraPosition.x + Math.sin(time * 3) / 80,
                cameraPosition.y + Math.sin(time * 1.4) / 90,
                cameraPosition.z + Math.cos(time * 2) / 70
            );
        }

        function animate(time) {
            requestAnimationFrame(animate);
            time *= 0.001; // Convert time to seconds.

            // if the canvas's css dimensions and renderer resolution differs, resize the renderer to prevent blockiness.
            if (resizeRendererToDisplaySize(renderer)) {
                // Fix distortions when canvas gets resized
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }
            //backdrop.material.uniforms.time.value = time;

            updateCubes(clouds, balls, time);
            rockTheBoat(objects[13], time);

            // display that the user is hovering over a skill island
            let intersections = getMouseRayIntersections();
            if (intersections[0] && intersections[0].object.name) {
                switch (intersections[0].object.name.toString()) {
                    case "Programs":
                        //console.log("Programs Hovered");
                        drawnCircle.position.set(-0.02, 1.932, -1.75);
                        drawnCircle.scale.set(2.1, 2.1);
                        lastHoveredSkillIsland = clickablesData[0];
                        break;
                    case "Chrome Extensions":
                        //console.log("Chrome Extensions Hovered");
                        drawnCircle.position.set(0.21, 1.932, -1.79);
                        drawnCircle.scale.set(2, 2);
                        lastHoveredSkillIsland = clickablesData[1];
                        break;
                    case "Graphics":
                        //console.log("Graphics Hovered");
                        drawnCircle.position.set(0.13, 1.932, -1.51);
                        drawnCircle.scale.set(2, 2);
                        lastHoveredSkillIsland = clickablesData[2];
                        break;
                    case "Other Skills":
                        //console.log("Other Skills Hovered");
                        drawnCircle.position.set(0.47, 1.932, -1.33);
                        drawnCircle.scale.set(3, 3);
                        lastHoveredSkillIsland = clickablesData[3];
                        break;
                    case "Web Components":
                        //console.log("Web Components Hovered");
                        drawnCircle.position.set(-0.3, 1.932, -1.94);
                        drawnCircle.scale.set(3, 3);
                        lastHoveredSkillIsland = clickablesData[4];
                        break;
                    case "Games":
                        //console.log("Games Hovered");
                        drawnCircle.position.set(-0.575, 1.932, -1.79);
                        drawnCircle.scale.set(2, 2);
                        lastHoveredSkillIsland = clickablesData[5];
                        break;
                    case "Websites":
                        //console.log("Websites Hovered");
                        drawnCircle.position.set(-0.66, 1.932, -2.12);
                        drawnCircle.scale.set(4, 4);
                        lastHoveredSkillIsland = clickablesData[6];
                        break;
                    case "Drawn Circle":
                        //console.log("Drawn Circle Hovered");
                        break;
                    default:
                        drawnCircle.position.set(0, -100, 0);
                        drawnCircle.scale.set(2, 2);
                        break;
                }
            }

            if (!isOrbitCameraOn) {
                // Use the CameraPlans if the orbit camera isn't going to be used.
                newCameraPosition = positionDirector.update(time);
                if (newCameraPosition) {
                    camera.position.x = newCameraPosition.x;
                    camera.position.y = newCameraPosition.y;
                    camera.position.z = newCameraPosition.z;
                }

                newCameraLookAt = lookAtDirector.update(time);
                if (newCameraLookAt) {
                    newCameraLookAt = addCameraWobble(newCameraLookAt, time);
                    camera.lookAt(newCameraLookAt.x, newCameraLookAt.y, newCameraLookAt.z);
                }
            }

            renderer.render(scene, camera);
        }

        function cloudShadow(colorTop, colorBottom) {
            var material = new THREE.MeshNormalMaterial();
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
        }

        function generateUV2(geometry) {
            let UVArr = geometry.getAttribute("uv").array;
            geometry.setAttribute("uv2", new THREE.BufferAttribute(UVArr, 2));
        }

        // Return intersections calculated from raycasted mouse
        function getMouseRayIntersections() {
            // update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);

            // calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(scene.children);

            //console.log(intersects);
            return intersects;
        }

        function initMarchingCubeBallSeeds(totalBalls) {
            for (let i = 0; i < totalBalls; i++) {
                balls[i] = {
                    x: Math.random(),
                    y: Math.random() / 10 + 0.5, // 0.5 is the standard y height of where the clouds generally should be.
                    z: Math.random() / 2 + 0.25, // 0.25 is the standard z left and right locations of where the clouds generally should be.
                };
            }
        }

        function initRenderer() {
            let renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
                precision: "mediump",
            });
            renderer.setClearColor(0x000000, 0);
            //renderer.physicallyCorrectLights = true;
            //renderer.shadowMap.enabled = true;
            //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 0.8;

            // Ensure the height of the canvas matches the height of the div.
            let canvas = renderer.domElement;
            canvas.height = screenDimensions.height;
            canvas.style.height = screenDimensions.height + "px";

            return renderer;
        }

        // On success: Return an array of all the mesh's in the scene.
        // On fail: Return an error message.
        function loadScene(url) {
            let newObjects = [];
            return new Promise((resolve, reject) => {
                new GLTFLoader().load(
                    url,
                    function (object) {
                        // On Load
                        console.log(object);
                        object.scene.children.forEach((prop, i) => (newObjects[i] = prop)); // Add all props from the scene into the objects array.
                        //scene.add(object.scene);
                        resolve(newObjects);
                    },
                    function (XMLHttpRequest) {
                        // On Progress
                        console.log("Loading Scene... ", XMLHttpRequest);
                    },
                    function (err) {
                        // On Error
                        console.log(err);
                        reject(err);
                    }
                );
            });
        }

        // Uses global variable lastHoveredSkillIsland to determine which page to load for the user
        function navigateToLastHoveredSkillIsland() {
            console.log(lastHoveredSkillIsland.url);
            window.location.href = lastHoveredSkillIsland.url;
        }

        // Fix blockiness by ensuring the size of the canvas's resolution matches with the canvas's css dimensions.
        function resizeRendererToDisplaySize(renderer) {
            const canvas = renderer.domElement;
            const pixelRatio = window.devicePixelRatio; // For HD-DPI displays
            const width = (canvas.clientWidth * pixelRatio) | 0;
            const height = (canvas.clientHeight * pixelRatio) | 0;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
                renderer.setSize(width, height, false);
            }
            return needResize;
        }

        function rockTheBoat(ship, time) {
            if (ship) {
                ship.rotation.x = Math.sin(time) * 0.06;
                ship.rotation.y = Math.cos(time) * 0.04;
                ship.position.y = Math.cos(time) * 0.0025 + 2.055;
            }
        }

        function updateCameraAngledAtMap(baseHeight) {
            let planIndex = 1;
            if (positionDirector && positionDirector.getPlan(planIndex)) {
                // Calculate how to position the camera to accomodate for various aspect ratios.
                let cameraHeight = 1 / aspect + baseHeight;
                if (!landscape) {
                    cameraHeight = 1 / aspect + baseHeight * 1.25;
                }

                let plan = positionDirector.getPlan(planIndex); // Get the CameraPlan so that we can edit the height of the camera.
                let to = plan.getTo();
                to.y = cameraHeight;
                plan.setTo(to); // Since the plan variable references the same plan from the positionDirector, I don't have to directly update the positionDirector
                return true;
            }
            return false;
        }

        // this controls content of marching cubes voxel field
        function updateCubes(object, balls, time) {
            object.reset();

            // fill the field with some metaballs
            const subtract = 12;
            const strength = 1.2 / ((Math.sqrt(balls.length) - 1) / 4 + 1);

            for (let i = 0; i < balls.length; i++) {
                const ballx = (time * 0.1 + balls[i].x - 0.99) % 1;
                const bally = Math.sin(time) * 0.02 + balls[i].y;
                const ballz = balls[i].z;

                object.addBall(ballx, bally, ballz, strength, subtract);
            }
        }

        function updateMouseRay(e) {
            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        }

        function updateSky(settings) {
            const uniforms = sky.material.uniforms;
            uniforms["turbidity"].value = settings.turbidity;
            uniforms["rayleigh"].value = settings.rayleigh;
            uniforms["mieCoefficient"].value = settings.mieCoefficient;
            uniforms["mieDirectionalG"].value = settings.mieDirectionalG;

            const phi = THREE.MathUtils.degToRad(90 - settings.elevation);
            const theta = THREE.MathUtils.degToRad(settings.azimuth);

            let sun = new THREE.Vector3();
            sun.setFromSphericalCoords(1, phi, theta);
            sky.material.uniforms["sunPosition"].value.copy(sun);
        }

        function viewMap(director) {
            if (director.getIndex() !== 1) {
                director.setActive(1);
            }
        }

        function viewSunset(director) {
            if (director.getIndex(0) !== 0) {
                director.setActive(0);
            }
        }

        //////////////////////
        // LOADING OBSERVER //
        //////////////////////

        // Select the node that will be observed for mutations
        //const shipWheelElem = document.getElementById("shipWheel");
        let totalLoaded = 0;

        // Options for the observer (which mutations to observe)
        const config = { attributes: true };

        // Callback function to execute when mutations are observed
        const callback = function (mutationsList, observer) {
            for (const mutation of mutationsList) {
                //console.log(parseInt(shipWheelElem.getAttribute("totalLoaded")));
                if (parseInt(shipWheelElem.getAttribute("totalLoaded")) !== totalLoaded) {
                    totalLoaded = parseInt(shipWheelElem.getAttribute("totalLoaded"));
                    // Expand the gradient to display that the scene is loading
                    shipWheelElem.style =
                        "background: radial-gradient(#fc8c03 " + totalLoaded + "%, #ffffff " + totalLoaded * 2 + "%);";
                    //console.log("radial-gradient(#e66465 " + totalLoaded + "%, #9198e5 " + (totalLoaded*2) + "%);");
                }
                if (totalLoaded === 100) {
                    // Stop observing, the scene is loaded
                    observer.disconnect();

                    //addLoadingTransitionAnimationScript();

                    const loadingUI = document.getElementById("loadingUI");
                    const shipWheelElem = document.getElementById("shipWheel");
                    const welcomeTextElems = document.getElementsByClassName("welcomeText");
                    const skeletonAuraAnimationStyle =
                        "animation: 500ms ease-in 1 normal running skeletonButtonPresence; animation-fill-mode: backwards;";
                    const auraAnimationStyle =
                        "animation: 500ms ease-in 1 normal running buttonPresence; animation-fill-mode: backwards;";
                    const buttonAnimationStyle =
                        "animation: 500ms ease-in 1 normal running bouncy; animation-fill-mode: forwards;";
                    const delay = 750;

                    // Use canvas to achieve the border drawing effect.
                    let outerCanvas = document.getElementById("loadingOuterFrameBackingCanvas");
                    let outerDraw = outerCanvas.getContext("2d");
                    let innerCanvas = document.getElementById("loadingInnerFrameBackingCanvas");
                    let innerDraw = innerCanvas.getContext("2d");

                    let outerCanvasRect = outerCanvas.getBoundingClientRect();
                    // Ensure the size of the outer canvas matches the CSS size
                    outerCanvas.width = outerCanvasRect.width;
                    outerCanvas.height = outerCanvasRect.height;
                    // Move the origin point to the center
                    outerDraw.save();
                    outerDraw.translate(outerCanvasRect.width / 2, outerCanvasRect.height / 2);
                    let innerCanvasRect = innerCanvas.getBoundingClientRect();
                    // Ensure the size of the inner canvas matches the CSS size
                    innerCanvas.width = innerCanvasRect.width;
                    innerCanvas.height = innerCanvasRect.height;
                    // Move the origin point to the center
                    innerDraw.save();
                    innerDraw.translate(innerCanvasRect.width / 2, innerCanvasRect.height / 2);
                    //console.log(outerCanvasRect);

                    let skeletonButtons = document.getElementsByClassName("skeletonButton"); // The placeholder buttons shown in the loading UI
                    let skeletonAuras = document.getElementsByClassName("skeletonAura"); // The placeholder buttons shown in the loading UI
                    let navButtons = document.getElementsByClassName("navButton");
                    let attentionAuras = document.getElementsByClassName("attentionAura");

                    // Fade the ship wheel out
                    shipWheelElem.classList.add("certainlyInvisible");
                    setTimeout(() => {
                        shipWheelElem.classList.add("mostDefinitelyHidden");
                        shipWheelElem.style = "animation: none;"; // Stop the animation so that it's not running in the background.
                        // Now that the ship wheel is fully hidden, fade in the welcome text.
                        for (let text of welcomeTextElems) {
                            text.classList.add("active");
                        }
                        setTimeout(() => {
                            // Fade the welcome text out.
                            for (let text of welcomeTextElems) {
                                text.classList.remove("active");
                            }
                        }, 3000);
                    }, 600);

                    // Play the buttonPresence animation on the skeleton buttons on load.
                    for (let i = 0; i < skeletonButtons.length; i++) {
                        window.setTimeout(() => {
                            // Play these skeleton animations on load
                            skeletonButtons[i].style = buttonAnimationStyle;
                            skeletonAuras[i].style = skeletonAuraAnimationStyle;
                        }, delay * i);
                    }

                    // Play the buttonPresence animation just once on each navButton hover.
                    for (let i = 0; i < navButtons.length; i++) {
                        navButtons[i].addEventListener("mouseenter", () => {
                            attentionAuras[i].style = auraAnimationStyle;
                        });
                        navButtons[i].addEventListener("mouseleave", () => {
                            attentionAuras[i].style = "";
                        });
                    }

                    // Duration of both inner and outer animations
                    let animationDuration = 2000;

                    // Animate the thick outer border.
                    let start, previousTimeStamp;
                    function animateBorders(timestamp) {
                        if (start === undefined) {
                            start = timestamp;
                        }
                        const elapsed = timestamp - start;

                        if (previousTimeStamp !== timestamp) {
                            drawProgress(outerDraw, elapsed / animationDuration);
                            drawProgress(innerDraw, elapsed / animationDuration);
                        }

                        if (elapsed < animationDuration) {
                            // Stop the animation after 1.5 seconds
                            previousTimeStamp = timestamp;
                            window.requestAnimationFrame(animateBorders);
                        } else {
                            loadingUI.classList.add("certainlyInvisible");
                            setTimeout(() => {
                                loadingUI.classList.add("mostDefinitelyHidden");
                            }, 1000);
                        }
                    }
                    window.requestAnimationFrame(animateBorders);

                    function drawProgress(draw, progress) {
                        let startingAngle = 270;
                        draw.beginPath();
                        draw.lineWidth = 800;
                        //draw.lineCap = "round";
                        draw.strokeStyle = "#ffffff";
                        draw.arc(0, 0, 500, degToRad(startingAngle), degToRad(startingAngle + progress * 360), false);
                        draw.stroke();
                        draw.closePath();
                    }

                    function degToRad(deg) {
                        return deg * (Math.PI / 180);
                    }
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(shipWheelElem, config);

        const navButtons = document.getElementsByClassName("navButton");
        const selectionTextElems = document.getElementsByClassName("selectionText");
        const selectionTexts = ["SET SAIL", "ABOUT ME", "GITHUB PROFILE", "ENJOY THE SUN"];
        for (let i = 0; i < navButtons.length; i++) {
            navButtons[i].addEventListener("mouseenter", () => {
                // Replace old selectionText with the text that matches the button being hovered.
                for (let j = 0; j < selectionTextElems.length; j++) {
                    selectionTextElems[j].innerText = selectionTexts[i];
                    selectionTextElems[j].classList.add("active");
                }
            });
            navButtons[i].addEventListener("mouseleave", () => {
                // Replace old selectionText with the text that matches the button being hovered.
                for (let j = 0; j < selectionTextElems.length; j++) {
                    selectionTextElems[j].classList.remove("active");
                }
            });
        }
    }, []);

    return (
        <div>
            <div id="threeDisplay" style={{ zIndex: 0 }}></div>
            <div id="sunsetUI" className="ui">
                <div className="outerFrame">
                    <div className="innerFrame">
                        <div className="sideButtons">
                            <div className="attentionButton">
                                <button id="viewMap" className="navButton">
                                    <svg
                                        className="icon"
                                        style={{ marginBottom: "10px" }}
                                        width="80mm"
                                        height="97mm"
                                        version="1.1"
                                        viewBox="0 0 80 97"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="m29.51 96.648c-11.066-0.50853-19.375-2.0002-24.001-4.3086-2.202-1.0988-4.0257-2.7054-4.7482-4.1829-0.28673-0.58631-0.36831-1.0125-0.37264-1.9468-3e-3 -0.65789 0.06768-1.2694 0.15716-1.3589 0.11192-0.11192 0.54828-0.11496 1.3981-0.0097 2.1166 0.2621 9.1296 0.91151 13.352 1.2364 26.412 2.0323 48.218 1.4607 61.975-1.6246 2.0832-0.46723 2.1915-0.43685 2.169 0.60868-0.04251 1.9787-2.3715 4.3489-6.1218 6.2303-5.4663 2.7422-13.539 4.4316-24.855 5.2015-3.2334 0.21996-15.374 0.319-18.952 0.15458zm42.238-12.65c-0.03728-0.03728-1.0451-0.32047-2.2396-0.6293-7.3536-1.9013-15.533-2.3548-23.687-1.3135-2.1843 0.27893-5.4221 0.81952-6.0904 1.0169-0.20096 0.05934-0.075-0.32447 0.5215-1.589 1.0534-2.2333 2.556-6.1063 3.5483-9.1458 3.3178-10.164 5.1824-21.147 5.5393-32.63l0.10279-3.3073 1.4904 1.1812c2.4385 1.9327 3.5489 2.9721 5.1008 4.7748 2.5664 2.9811 4.4525 5.8523 6.48 9.8645 3.9265 7.77 6.9243 17.357 9.0111 28.817 0.21781 1.1962 0.43619 2.3671 0.48528 2.602 0.07795 0.37308-0.0597 0.56183-0.26212 0.35942zm-64.608-2.0082c0-0.1348 1.2787-2.7812 2.8416-5.8809 5.3187-10.549 8.4297-17.765 12.048-27.947 4.5184-12.715 8.8541-29.03 11.616-43.711 0.40183-2.136 0.78395-3.9449 0.84916-4.0197 0.22478-0.25791 2.7661 5.198 4.6943 10.078 3.54 8.9595 6.1645 18.612 7.814 28.739 0.50794 3.1185 0.54599 5.3971 0.15175 9.0877-1.1649 10.905-3.6748 21.259-7.2678 29.982-0.53499 1.2988-0.7407 1.641-1.0097 1.6795-0.18581 0.0266-1.5131-0.23432-2.9496-0.57982-4.8914-1.1765-6.0343-1.3237-10.301-1.327-2.9065-0.0022-4.2098 0.06211-5.5148 0.27219-4.4257 0.7125-7.9335 1.7531-12.777 3.7904-0.1078 0.04534-0.19418-0.02735-0.19418-0.16342z"
                                            strokeWidth=".15535"
                                        />
                                    </svg>
                                </button>
                                <span className="attentionAura"></span>
                            </div>
                            <div className="attentionButton">
                                <button className="navButton">
                                    <svg
                                        className="icon"
                                        style={{ width: "70%", height: "70%" }}
                                        width="100mm"
                                        height="120mm"
                                        version="1.1"
                                        viewBox="0 0 100 120"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="m95.087 116.64c-2.5675-5.404-4.4762-11.241-5.3216-16.274-0.18641-1.1098-0.36633-2.0452-0.39982-2.0787-0.14851-0.14851-0.25097 7.8028-0.16806 13.043l0.09099 5.7511-0.30245-0.47631c-0.46377-0.73037-2.8561-5.5682-3.7349-7.5528-2.2435-5.0665-3.8134-9.9355-4.4755-13.881-0.36759-2.1904-0.89699-8.911-0.89999-11.425-1.36e-4 -0.15314-0.6028 0.732-1.3392 1.967-2.4691 4.1411-5.447 8.7096-5.6772 8.7096-0.03521 0 0.17341-0.38274 0.4636-0.85054 1.4362-2.3153 3.4005-6.237 5.3781-10.737 1.3697-3.1169 1.583-4.1322 0.4818-2.2933-4.0804 6.8138-9.5669 13.016-16.233 18.35-3.2422 2.5943-7.2095 5.2189-10.648 7.0442l-1.4802 0.78576 2.3874-2.5091c13.034-13.699 21.217-25.71 25.998-38.164l0.7837-2.0413 0.81851-0.08053c1.3095-0.12885 1.7962-0.59078 2.7365-2.5974 1.2151-2.593 2.5842-8.7638 2.9844-13.451 0.14574-1.7072 0.3873-2.4441 1.087-3.3158l0.42463-0.52904v-2.2101c0-1.605-0.04657-2.2472-0.17011-2.3457-0.38302-0.30545-9.9502-1.3893-12.298-1.3932-0.77059-0.0014-0.91246-0.05322-1.8911-0.69211l-1.0581-0.69071 0.09235 0.7858c0.0508 0.43219 0.1057 0.79908 0.12201 0.81532 0.01631 0.01623 1.1932 0.0963 2.6153 0.17793 2.9881 0.17152 5.7298 0.43467 9.4124 0.90343 1.4344 0.18259 2.6439 0.33198 2.6877 0.33198 0.0438 0 0.07964 0.96915 0.07964 2.1537 0 2.0972-0.0086 2.1617-0.32649 2.4604-0.62104 0.58344-1.0501 1.8147-1.1826 3.3936-0.49024 5.8421-2.1737 12.623-3.6756 14.806-0.74198 1.0784-0.48083 1.0437-7.3392 0.97645l-6.074-0.05955-0.38381 1.437c-3.2814 12.286-9.0345 25.562-14.6 33.69-1.0685 1.5606-2.6106 3.5228-2.6991 3.4344-0.02816-0.0282 0.28971-0.65931 0.70637-1.4026 3.728-6.65 8.5055-18.086 11.935-28.569 0.95273-2.9123 2.6819-8.6752 2.6819-8.9381 0-0.0376-0.35212-0.14663-0.7825-0.24229-4.2615-0.94715-7.0209-3.4861-8.4944-7.8159-0.61671-1.8121-1.0042-3.6266-1.2165-5.6962-0.2069-2.0168-0.34096-2.5201-0.79126-2.9704-0.49817-0.49817-1.3405-0.70756-2.5912-0.64416-1.1899 0.06032-1.966 0.38008-2.3149 0.9538-0.15128 0.24877-0.29285 0.94421-0.39271 1.9291-0.83771 8.2629-3.5045 12.457-8.9177 14.026-2.3785 0.68926-3.5102 0.78516-10.098 0.85576-5.4992 0.05892-6.1816 0.04261-6.5676-0.15699-0.5125-0.26502-1.2424-1.3219-1.7118-2.4786-1.1822-2.9131-2.4102-8.7055-2.786-13.142-0.13063-1.5419-0.45268-2.4903-1.161-3.419-0.33844-0.44372-0.34865-0.51708-0.34865-2.5044v-2.0473l0.44228-0.0807c0.88092-0.16074 6.0105-0.76578 8.4371-0.99518 1.7687-0.1672 3.7966-0.23566 7.0428-0.23776 5.1941-0.0033 6.0226 0.07943 10.862 1.0854 6.4317 1.3368 9.2314 1.3497 15.372 0.07074 3.11-0.64772 4.8852-0.92102 7.0894-1.0914 0.92605-0.07159 1.7121-0.15854 1.7468-0.19322 0.09049-0.09049-0.5813-3.6197-0.9453-4.966l-0.30782-1.1386-2.3964-0.72652c-5.7685-1.7489-10.15-3.5842-12.136-5.0835l-0.75309-0.56859-1.135 0.91651c-4.185 3.3794-12.145 7.0374-20.541 9.4399l-1.5791 0.45182-0.61697 0.77103-0.61697 0.77103-1.8964 0.16615c-3.1431 0.27538-8.0683 0.93678-8.2792 1.1118-0.15802 0.13115-0.1977 0.60761-0.1977 2.3741v2.2101l0.42463 0.52904c0.70057 0.87282 0.94137 1.6082 1.0858 3.3158 0.16124 1.9067 0.55504 4.4515 1.0907 7.048 1.1141 5.4006 2.5981 8.6718 4.0674 8.9657 0.43558 0.08712 0.36585-0.36843 0.68427 4.4704 0.58344 8.8664 1.6954 14.281 3.2437 15.795l0.41173 0.40254-0.52074 1.854c-0.76065 2.7082-2.0877 6.4348-3.7245 10.459-1.0142 2.4935-1.317 3.1781-1.378 3.1152-0.02844-0.02931 0.03083-0.52587 0.13171-1.1035 0.60127-3.4424 1.016-8.5055 0.78329-9.5628l-0.1194-0.54254-0.42512 1.223c-0.23382 0.67264-0.92814 2.6927-1.543 4.4891-2.4803 7.2468-4.5831 11.606-6.4656 13.405-0.56003 0.53491-0.62958 0.56935-0.54975 0.27217 4.7703-17.758 6.7296-34.24 5.379-45.249-0.16224-1.3225-0.77089-4.3825-0.92729-4.662-0.05278-0.0943-0.19886 0.88545-0.32463 2.1772-1.2031 12.357-3.759 24.577-6.8972 32.975-0.6126 1.6395-1.8121 4.4246-1.8775 4.3592-0.02278-0.02278 0.22766-0.80018 0.55653-1.7276 1.7878-5.0413 3.6832-13.291 5.1241-22.303 0.71415-4.4666 1.0591-7.1238 1.1484-8.8457l0.07405-1.4289-0.3974 2.2454c-2.3368 13.204-6.7535 26.591-12.676 38.421-1.4875 2.9713-3.4746 6.3519-3.7336 6.3519-0.06507 0 0.209-0.72241 0.98096-2.5856 0.56386-1.361 1.1512-2.9536 2.158-5.8518 3.3352-9.6008 5.7945-20.532 7.4095-32.933 0.6564-5.0405 0.89072-7.2895 1.7724-17.011 1.0751-11.854 1.3167-13.33 3.0964-18.916 0.60812-1.9086 1.4193-4.5113 1.8026-5.7837 1.2142-4.0308 2.4495-6.1292 4.708-7.9973 2.4919-2.0612 7.8594-4.2842 12.516-5.1836 2.8677-0.55388 4.3103-0.68374 7.542-0.6789 3.3768 0.0051 5.5434 0.22321 8.1652 0.82218 1.8036 0.41204 1.7373 0.40905 2.7217 0.12285 2.8499-0.82858 7.9537-1.1404 11.441-0.69908 2.3062 0.2919 5.4541 1.0886 7.5533 1.9117 5.3495 2.0974 10.192 5.693 12.645 9.3888 0.73402 1.1058 2.325 4.3908 2.9659 6.1239 2.0784 5.6199 3.5207 13.734 4.1848 23.543 0.07602 1.1227 0.1949 6.818 0.26417 12.656 0.14135 11.912 0.31745 15.977 1.0317 23.815 0.64655 7.0955 2.0026 15.36 3.4712 21.156 0.36906 1.4564 0.67102 2.6779 0.67102 2.7144 0 0.0365-0.21946-0.14466-0.48769-0.40259-0.67866-0.65263-1.9967-2.6536-2.7926-4.2397-0.3678-0.73292-0.69726-1.3326-0.73213-1.3326-0.15131 0 0.92436 4.6345 1.7171 7.398 0.29762 1.0375 0.5167 1.9108 0.48685 1.9407-0.02985 0.0299-0.45466-0.78842-0.944-1.8184zm-16.58-56.653c0.75973-0.07796 1.5295-0.19808 1.7106-0.26692 1.2629-0.48017 2.845-8.3113 2.6101-12.92-0.13545-2.6574-0.42274-3.1824-1.8627-3.4036-1.0302-0.15825-5.148-0.40987-6.7547-0.41273l-1.107-2e-3 -0.09212 0.7825c-0.34822 2.9581-1.7904 10.764-2.6678 14.44-0.22078 0.92494-0.40143 1.7029-0.40143 1.7289 0 0.18387 6.877 0.22719 8.5651 0.05396zm-40.278-0.32769c2.1975-0.2782 3.8651-0.67908 4.5885-1.103 1.4372-0.84226 3.1906-4.3898 4.0089-8.111 0.40488-1.8412 0.44356-4.492 0.07931-5.4357-0.47508-1.2309-1.0498-1.4689-4.3014-1.7816-2.5479-0.24499-14.611-0.24277-16.687 0.0031-1.7275 0.2046-2.0689 0.33638-2.4161 0.93267-1.0583 1.8175-0.17276 10.918 1.4044 14.433 0.42509 0.9474 0.5999 1.0674 1.8282 1.2554 1.2853 0.19665 9.5085 0.05887 11.495-0.1926zm29.492-0.6873c0.09721-0.37424 0.41941-1.8746 0.71601-3.3341 0.91669-4.511 1.3689-8.1697 1.3691-11.077l1.15e-4 -1.6185-2.4155 0.09374c-4.1773 0.16211-6.7869 0.4512-7.5268 0.83384-1.4224 0.73557-1.5977 4.1027-0.42487 8.1611 0.75519 2.6132 1.7226 4.6563 2.7657 5.8414 0.80704 0.91685 1.5223 1.2265 3.7911 1.6412 1.471 0.26888 1.5184 0.25398 1.7252-0.54217z"
                                            strokeWidth=".13609"
                                        />
                                    </svg>
                                </button>
                                <span className="attentionAura"></span>
                            </div>
                            <div className="attentionButton">
                                <button className="navButton">
                                    <svg
                                        className="icon"
                                        style={{ width: "55%", height: "55%" }}
                                        width="100"
                                        height="97.54"
                                        version="1.1"
                                        viewBox="0 0 100 97.540001"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="m50.005 0c27.61 0 49.995 22.386 49.995 50.002 0 22.091-14.325 40.83-34.194 47.445-2.5016 0.45735-3.4132-1.0866-3.4132-2.4126 0-1.1848 0.04297-4.331 0.06754-8.5024 13.908 3.0204 16.842-6.7037 16.842-6.7037 2.2745-5.7767 5.5527-7.3145 5.5527-7.3145 4.5397-3.1002-0.34378-3.0388-0.34378-3.0388-5.0186 0.35299-7.6583 5.1536-7.6583 5.1536-4.4599 7.6399-11.704 5.4329-14.552 4.153-0.45428-3.2291-1.7435-5.4329-3.1738-6.6822 11.102-1.2615 22.775-5.5527 22.775-24.712 0-5.4575-1.9491-9.9205-5.1475-13.417 0.51567-1.2646 2.2315-6.3476-0.48804-13.232 0 0-4.199-1.3444-13.751 5.126-3.9872-1.1111-8.2661-1.6636-12.517-1.6821-4.2451 0.01842-8.5239 0.57092-12.517 1.6821-9.546-6.4704-13.736-5.126-13.736-5.126-2.7288 6.8848-1.0129 11.968-0.49725 13.232-3.2045 3.4961-5.1413 7.9591-5.1413 13.417 0 19.209 11.692 23.435 22.831 24.672-1.7956 1.5439-3.3948 4.595-3.3948 9.2606 0 6.6822 0.06139 12.075 0.06139 13.714 0 1.3383-0.89936 2.8945-3.4378 2.4065-19.853-6.627-34.166-25.354-34.166-47.439 0-27.616 22.389-50.002 50.005-50.002"
                                            fillRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                <span className="attentionAura"></span>
                            </div>
                        </div>
                        <span className="selectionText"></span>
                        <span className="welcomeText">WELCOME TO MY HAPPY PLACE</span>
                    </div>
                </div>
            </div>
            <div id="mapUI" className="ui mostDefinitelyHidden">
                <div className="outerFrame">
                    <div className="innerFrame">
                        <div className="sideButtons">
                            <div className="attentionButton">
                                <button id="viewSunset" className="navButton">
                                    <svg
                                        className="icon"
                                        width="100mm"
                                        height="100mm"
                                        version="1.1"
                                        viewBox="0 0 100 100"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="m49.829 98.604c-0.41322-0.18706-0.83999-0.70792-0.91336-1.1147-0.0326-0.18073-0.0459-3.8262-0.02957-8.1011 0.0293-7.6676 0.03254-7.7763 0.24007-8.0542 0.37704-0.50493 0.73391-0.70246 1.2691-0.70246 0.53521 0 0.8921 0.19755 1.2691 0.7025 0.20831 0.27901 0.21037 0.36052 0.21037 8.3273 0 7.9668-0.0021 8.0483-0.21037 8.3273-0.48361 0.64774-1.2191 0.89432-1.8353 0.61533zm-23.506-6.4108c-0.53987-0.28232-0.82381-0.76274-0.82381-1.3939 0-0.40174 0.38576-1.1151 3.8353-7.0928 2.1094-3.6554 3.9345-6.7538 4.0558-6.8854 0.7295-0.7917 1.9544-0.66902 2.495 0.24989 0.47382 0.80544 0.54826 0.64422-3.7113 8.0371-2.7708 4.809-3.9631 6.788-4.2011 6.973-0.47435 0.36878-1.0803 0.40997-1.6498 0.11215zm46.756 0.05856c-0.17819-0.08788-0.39151-0.23606-0.47405-0.32928-0.08254-0.09323-1.8843-3.1752-4.0039-6.8487-4.2441-7.3555-4.1707-7.1967-3.6965-8.0028 0.54057-0.91891 1.7655-1.0416 2.495-0.24989 0.12126 0.1316 1.9464 3.23 4.0558 6.8854 3.4496 5.9777 3.8353 6.6911 3.8353 7.0928 0 0.63199-0.28397 1.1125-0.81992 1.3873-0.52304 0.2682-0.94032 0.28773-1.3917 0.06515zm-63.803-16.594c-0.73737-0.50332-0.92344-1.5438-0.39782-2.2245 0.16904-0.21892 2.3286-1.52 6.977-4.2034 7.411-4.2782 7.2468-4.2022 8.0519-3.7286 1.012 0.59532 1.0344 1.9255 0.04482 2.6546-0.18716 0.13788-3.2607 1.9339-6.83 3.9911-6.1671 3.5544-6.5151 3.7404-6.9996 3.7404-0.3611 0-0.60803-0.06699-0.84621-0.22957zm74.228-3.6077c-3.6476-2.1076-6.7398-3.9316-6.8714-4.0532-0.7916-0.73156-0.6691-1.955 0.24989-2.4956 0.80506-0.47359 0.6409-0.54961 8.0519 3.7286 4.6484 2.6834 6.8079 3.9845 6.977 4.2034 0.33446 0.43314 0.39395 1.1618 0.13371 1.6378-0.29495 0.53959-0.76789 0.81675-1.3884 0.81367-0.49739-0.0025-0.81608-0.17333-7.1527-3.8347zm-36.068 3.4811c-8.2005-0.99504-15.343-5.7776-19.353-12.959-4.2662-7.6398-4.2662-17.154 0-24.794 2.6607-4.7647 6.8915-8.6586 11.803-10.863 3.6232-1.6262 7.2626-2.3478 11.173-2.2151 4.0793 0.13847 7.6151 1.0457 11.07 2.8406 6.6985 3.4795 11.526 9.7611 13.16 17.125 0.53371 2.4048 0.74737 5.6612 0.51882 7.9075-0.60894 5.9851-3.0312 11.187-7.1905 15.442-4.1593 4.2551-9.3968 6.818-15.365 7.5184-1.5242 0.17888-4.3315 0.17766-5.8165-0.0025zm34.227-23.866c-0.36892-0.16186-0.83668-0.6895-0.92571-1.0442-0.15146-0.60348 0.12972-1.2779 0.71498-1.7148 0.27901-0.20831 0.36052-0.21037 8.3273-0.21037s8.0483 0.0021 8.3273 0.21037c0.45973 0.34324 0.67716 0.71349 0.72584 1.236 0.05115 0.54903-0.18181 1.0027-0.7195 1.4012-0.2858 0.2118-0.34924 0.21362-8.2136 0.23594-6.4331 0.01826-7.9842-0.0032-8.2367-0.11402zm-78.769-0.10203c-0.70268-0.30828-1.0954-1.1405-0.86609-1.8353 0.14784-0.44795 0.70951-0.95181 1.1496-1.0312 0.18358-0.03313 3.8314-0.04687 8.1063-0.03054 7.6676 0.0293 7.7763 0.03254 8.0542 0.24007 0.50493 0.37704 0.70246 0.73391 0.70246 1.2691 0 0.53519-0.19753 0.89206-0.70246 1.2691-0.27825 0.20778-0.37935 0.21065-8.2073 0.23286-6.4331 0.01826-7.9842-0.0032-8.2367-0.11402zm19.329-16.784c-0.30252-0.16242-3.3738-1.9265-6.825-3.9203-4.3104-2.4901-6.3516-3.7242-6.5198-3.9418-0.33447-0.4329-0.39396-1.1615-0.13371-1.6377 0.29178-0.5338 0.76854-0.81626 1.3777-0.81626 0.48453 0 0.83256 0.18598 6.9996 3.7404 3.5694 2.0572 6.6429 3.8532 6.83 3.9911 0.98959 0.72901 0.96692 2.0686-0.04482 2.6486-0.54045 0.30984-1.0217 0.29154-1.6841-0.06405zm54.66 0.07c-1.012-0.59532-1.0344-1.9255-0.04482-2.6546 0.18716-0.13788 3.2607-1.9339 6.83-3.9911 6.1671-3.5544 6.5151-3.7404 6.9996-3.7404 0.6092 0 1.086 0.28246 1.3777 0.81626 0.26024 0.47609 0.20075 1.2047-0.13371 1.6378-0.16904 0.21892-2.3286 1.52-6.977 4.2034-7.411 4.2782-7.2468 4.2022-8.0519 3.7286zm-43.082-10.99c-0.17588-0.10725-0.43227-0.34813-0.56975-0.53529-0.13748-0.18716-1.9335-3.2621-3.9911-6.8333-3.3621-5.8352-3.7411-6.5382-3.7411-6.9398 0-1.3031 1.4679-2.0638 2.4736-1.2819 0.23796 0.185 1.4302 2.164 4.2011 6.973 4.2596 7.3929 4.1852 7.2317 3.7113 8.0371-0.42588 0.72396-1.4024 0.99577-2.0841 0.5801zm31.693 0.0066c-0.19554-0.10405-0.46075-0.36806-0.58936-0.58668-0.47382-0.80544-0.54826-0.64422 3.7113-8.0371 2.7708-4.809 3.9631-6.788 4.2011-6.973 1.0057-0.78188 2.4736-0.02126 2.4736 1.2817 0 0.40174-0.38576 1.1151-3.8353 7.0928-2.1094 3.6554-3.9345 6.7538-4.0558 6.8854-0.50312 0.54602-1.2608 0.67992-1.9056 0.3368zm-15.906-4.3167c-0.19125-0.13127-0.44378-0.3683-0.56118-0.52674-0.21233-0.28657-0.21345-0.33002-0.21345-8.3336 0-8.0036 0.0011-8.0471 0.21345-8.3336 0.39842-0.53771 0.8521-0.77069 1.4012-0.71954 0.5225 0.048679 0.89275 0.26611 1.236 0.72584 0.20831 0.27901 0.21037 0.36052 0.21037 8.3273 0 7.9668-0.0021 8.0483-0.21037 8.3273-0.34324 0.45973-0.71349 0.67716-1.236 0.72584-0.39716 0.037-0.55942-2.05e-4 -0.83998-0.1928z"
                                            strokeWidth=".10203"
                                        />
                                    </svg>
                                </button>
                                <span className="attentionAura"></span>
                            </div>
                        </div>
                        <span className="selectionText"></span>
                    </div>
                </div>
            </div>
            <div id="loadingUI" className="ui">
                <div id="loadingOuterFrameBacking">
                    <canvas id="loadingOuterFrameBackingCanvas" class="rawCanvasElem"></canvas>
                </div>
                <div id="loadingOuterFrame">
                    <div id="loadingInnerFrameBacking">
                        <canvas id="loadingInnerFrameBackingCanvas" class="rawCanvasElem"></canvas>
                    </div>
                    <div id="loadingInnerFrame">
                        <div className="sideButtons">
                            <div className="attentionButton">
                                <button
                                    className="skeletonButton"
                                    style={{ backgroundColor: "rgb(60, 60, 60)" }}
                                ></button>
                                <span className="skeletonAura"></span>
                            </div>
                            <div className="attentionButton">
                                <button
                                    className="skeletonButton"
                                    style={{ backgroundColor: "rgb(60, 60, 60)" }}
                                ></button>
                                <span className="skeletonAura"></span>
                            </div>
                            <div className="attentionButton">
                                <button
                                    className="skeletonButton"
                                    style={{ backgroundColor: "rgb(60, 60, 60)" }}
                                ></button>
                                <span className="skeletonAura"></span>
                            </div>
                        </div>
                        <div id="shipWheel"></div>
                        <span className="welcomeText">WELCOME TO MY HAPPY PLACE</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// make an array of these, then keep moving through the array
class CameraPlan {
    // from: Vector3
    // to: Vector3
    // duration: int or float
    // smooth: boolean (false for linear interpolation, true for smoothstep interpolation)
    constructor(from, to, duration, stall, ease = false) {
        // Points
        this.from = from;
        this.to = to;
        // Time
        this.duration = duration;
        this.stall = stall; // how long to stall far at the end of the movement.
        this.elapsed = 0;
        this.initialTime = null;
        // Boolean governing interpolation function
        this.ease = ease;
    }
    getFrom() {
        return this.from;
    }
    setFrom(vec3) {
        this.from = vec3;
    }

    getTo() {
        return this.to;
    }
    setTo(vec3) {
        this.to = vec3;
    }

    getDuration() {
        return this.duration;
    }
    setDuration(x) {
        this.duration = x;
    }

    getStall() {
        return this.stall;
    }
    setStall(x) {
        this.stall = x;
    }

    getEase() {
        return this.ease;
    }
    setEase(bool) {
        this.ease = bool;
    }

    /*duration() {
    return this.duration;
}

get elapsed() {
    return this.elapsed;
}

get from() {
    return this.from;
}

get to() {
    return this.to;
}*/

    // Linear interpolation between two values
    // x and y are the two values to interpolate between
    // t is the degree of interpolation between x and y.
    lerp(x, y, t) {
        t = Math.max(0, Math.min(1, t)); // Ensure t is normalized between 0 and 1.
        return y * t + x * (1 - t);
    }

    easeInOutSine(x) {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }

    reset() {
        this.initialTime = null;
    }

    // If the update returns false, the movement has ended.
    update(time) {
        // If initialTime is null, we are beginning the animation. Record the initial time.
        if (!this.initialTime) {
            this.initialTime = time;
        }

        this.elapsed = time - this.initialTime;
        let progress = this.elapsed / this.duration;
        // If the total time elapsed isn't greater than the duration, then move the camera.
        // Otherwise, return false and call reset().
        if (progress < 1) {
            if (this.ease) {
                // Easing
                return new THREE.Vector3(
                    this.lerp(this.from.x, this.to.x, this.easeInOutSine(progress)),
                    this.lerp(this.from.y, this.to.y, this.easeInOutSine(progress)),
                    this.lerp(this.from.z, this.to.z, this.easeInOutSine(progress))
                );
            } else {
                // Linear interpolation
                return new THREE.Vector3(
                    this.lerp(this.from.x, this.to.x, progress),
                    this.lerp(this.from.y, this.to.y, progress),
                    this.lerp(this.from.z, this.to.z, progress)
                );
            }
        } else if (this.elapsed < this.duration + this.stall) {
            // Wait a little while after the movement completes.
            return new THREE.Vector3(this.to.x, this.to.y, this.to.z);
        } else {
            this.reset();
            return false;
        }
    }
}

// A bunch of CameraPlans organized within this class.
class CameraDirector {
    // constructor takes an array of CameraPlans.
    constructor(plans = null) {
        this.plans = plans ? plans : []; // If plans is null, make an empty array.
        this.index = this.plans.length - 1; // This isn't simply 0 because the last plan in the list has to be "updated" in order for the 0th index plan to execute first. Not sure why.
    }

    addPlan(plan) {
        this.plans.push(plan);
        this.index++; // This is necessary for ensuring the 0th index plan actually goes first. Not sure why.
    }

    getPlan(index) {
        return this.plans[index];
    }

    setPlan(index, CameraPlan) {
        this.plan[index] = CameraPlan;
    }

    getIndex() {
        return this.index;
    }

    // Move onto the next CameraPlan in the plans array
    next() {
        if (this.index < this.plans.length - 1) {
            this.index++;
        } else {
            this.index = 0;
        }
    }

    // Tell the director to switch to a different CameraPlan
    setActive(index) {
        if (index < this.plans.length && index >= 0) {
            this.plans[this.index].reset();
            this.index = index;
        } else {
            console.error("Index " + index + " is out of bounds.");
        }
    }

    update(time) {
        let newPosition = this.plans[this.index].update(time);
        if (newPosition) {
            // Return the camera position as a Vector3.
            return newPosition;
        } else {
            // This CameraPlan reached its end. Move onto the next one.
            this.next();
        }
    }
}

export default Sunset;
