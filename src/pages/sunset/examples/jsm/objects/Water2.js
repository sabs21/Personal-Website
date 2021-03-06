import {
    Clock,
    Color,
    LinearEncoding,
    Matrix4,
    Mesh,
    RepeatWrapping,
    ShaderMaterial,
    TextureLoader,
    UniformsLib,
    UniformsUtils,
    Vector2,
    Vector4,
} from "../../../three.module.js";
import { Reflector } from "./Reflector.js";
import { Refractor } from "./Refractor.js";
import { DoubleSide } from "../../../src/constants.js";
import WaterMap1 from "../../../textures/normal/Water_1_M_Normal.jpg";
import WaterMap2 from "../../../textures/normal/Water_2_M_Normal.jpg";

/**
 * References:
 *	http://www.valvesoftware.com/publications/2010/siggraph2010_vlachos_waterflow.pdf
 * 	http://graphicsrunner.blogspot.de/2010/08/water-using-flow-maps.html
 *
 */

class Water2 extends Mesh {
    constructor(geometry, options = {}) {
        super(geometry);

        this.type = "Water2";

        const scope = this;

        const color = options.color !== undefined ? new Color(options.color) : new Color(0xffffff);
        const textureWidth = options.textureWidth || 512;
        const textureHeight = options.textureHeight || 512;
        const clipBias = options.clipBias || 0;
        const flowDirection = options.flowDirection || new Vector2(1, 0);
        const flowSpeed = options.flowSpeed || 0.03;
        const reflectivity = options.reflectivity || 0.02;
        const scale = options.scale || 1;
        const shader = options.shader || Water2.WaterShader;
        const encoding = options.encoding !== undefined ? options.encoding : LinearEncoding;

        /*const roundOffCenter = options.roundOffCenter || new Vector2(0, 0);
		const roundOffRadiusX = options.roundOffRadiusX || 1;
		const roundOffRadiusZ = options.roundOffRadiusZ || 1;
		const roundOffBoundingBox = options.roundOffBoundingBox || null;*/
        const roundness = options.roundness || 0.5;

        const textureLoader = new TextureLoader();

        const flowMap = options.flowMap || undefined;
        const normalMap0 = options.normalMap0 || textureLoader.load(WaterMap1);
        const normalMap1 = options.normalMap1 || textureLoader.load(WaterMap2);

        const cycle = 0.15; // a cycle of a flow map phase
        const halfCycle = cycle * 0.5;
        const textureMatrix = new Matrix4();
        const clock = new Clock();

        // internal components

        if (Reflector === undefined) {
            console.error("THREE.Water2: Required component Reflector not found.");
            return;
        }

        if (Refractor === undefined) {
            console.error("THREE.Water2: Required component Refractor not found.");
            return;
        }

        const reflector = new Reflector(geometry, {
            textureWidth: textureWidth,
            textureHeight: textureHeight,
            clipBias: clipBias,
            encoding: encoding,
        });

        const refractor = new Refractor(geometry, {
            textureWidth: textureWidth,
            textureHeight: textureHeight,
            clipBias: clipBias,
            encoding: encoding,
        });

        reflector.matrixAutoUpdate = false;
        refractor.matrixAutoUpdate = false;

        // material

        this.material = new ShaderMaterial({
            uniforms: UniformsUtils.merge([UniformsLib["fog"], shader.uniforms]),
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            transparent: true,
            fog: true,
            side: DoubleSide,
        });

        if (flowMap !== undefined) {
            this.material.defines.USE_FLOWMAP = "";
            this.material.uniforms["tFlowMap"] = {
                type: "t",
                value: flowMap,
            };
        } else {
            this.material.uniforms["flowDirection"] = {
                type: "v2",
                value: flowDirection,
            };
        }

        // maps

        normalMap0.wrapS = normalMap0.wrapT = RepeatWrapping;
        normalMap1.wrapS = normalMap1.wrapT = RepeatWrapping;

        this.material.uniforms["tReflectionMap"].value = reflector.getRenderTarget().texture;
        this.material.uniforms["tRefractionMap"].value = refractor.getRenderTarget().texture;
        this.material.uniforms["tNormalMap0"].value = normalMap0;
        this.material.uniforms["tNormalMap1"].value = normalMap1;

        // water

        this.material.uniforms["time"].value = clock.getDelta();
        this.material.uniforms["color"].value = color;
        this.material.uniforms["reflectivity"].value = reflectivity;
        this.material.uniforms["textureMatrix"].value = textureMatrix;

        // Clipping
        /*this.material.uniforms[ 'roundOffCenter' ].value = roundOffCenter
		this.material.uniforms[ 'roundOffRadiusX' ].value = roundOffRadiusX;
		this.material.uniforms[ 'roundOffRadiusZ' ].value = roundOffRadiusZ;
		this.material.uniforms[ 'roundOffBoundingBox' ].value = roundOffBoundingBox;*/
        this.material.uniforms["roundness"].value = roundness;

        // inital values

        this.material.uniforms["config"].value.x = 0; // flowMapOffset0
        this.material.uniforms["config"].value.y = halfCycle; // flowMapOffset1
        this.material.uniforms["config"].value.z = halfCycle; // halfCycle
        this.material.uniforms["config"].value.w = scale; // scale

        // functions

        function updateTextureMatrix(camera) {
            textureMatrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);

            textureMatrix.multiply(camera.projectionMatrix);
            textureMatrix.multiply(camera.matrixWorldInverse);
            textureMatrix.multiply(scope.matrixWorld);
        }

        function updateFlow() {
            const delta = clock.getDelta();
            const config = scope.material.uniforms["config"];

            config.value.x += flowSpeed * delta; // flowMapOffset0
            config.value.y = config.value.x + halfCycle; // flowMapOffset1

            // Important: The distance between offsets should be always the value of "halfCycle".
            // Moreover, both offsets should be in the range of [ 0, cycle ].
            // This approach ensures a smooth water flow and avoids "reset" effects.

            if (config.value.x >= cycle) {
                config.value.x = 0;
                config.value.y = halfCycle;
            } else if (config.value.y >= cycle) {
                config.value.y = config.value.y - cycle;
            }
        }

        //

        this.onBeforeRender = function (renderer, scene, camera) {
            updateTextureMatrix(camera);
            updateFlow();

            scope.material.uniforms["time"].value = clock.getElapsedTime();
            //console.log(clock.getDelta());

            scope.visible = false;

            reflector.matrixWorld.copy(scope.matrixWorld);
            refractor.matrixWorld.copy(scope.matrixWorld);

            reflector.onBeforeRender(renderer, scene, camera);
            refractor.onBeforeRender(renderer, scene, camera);

            scope.visible = true;
        };
    }
}

Water2.prototype.isWater = true;

Water2.WaterShader = {
    uniforms: {
        time: {
            type: "f",
            value: 0.0,
        },

        color: {
            type: "c",
            value: null,
        },

        reflectivity: {
            type: "f",
            value: 0,
        },

        tReflectionMap: {
            type: "t",
            value: null,
        },

        tRefractionMap: {
            type: "t",
            value: null,
        },

        tNormalMap0: {
            type: "t",
            value: null,
        },

        tNormalMap1: {
            type: "t",
            value: null,
        },

        textureMatrix: {
            type: "m4",
            value: null,
        },

        config: {
            type: "v4",
            value: new Vector4(),
        },

        // For clipping the plane
        /*'roundOffCenter': {
			type: 'v2',
			value: new Vector2()
		},

		'roundOffRadiusX': {
			type: 'f',
			value: 1.0
		},

		'roundOffRadiusZ': {
			type: 'f',
			value: 1.0
		},

		'roundOffBoundingBox': {
			type: 'v2',
			value: new Vector2()
		}*/
        roundness: {
            type: "f",
            value: 0.5,
        },
    },

    vertexShader: /* glsl */ `

		#include <common>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>

		uniform mat4 textureMatrix;
		uniform float time;

		varying vec4 vCoord;
		varying vec2 vUv;
		varying vec3 vToEye;
		varying vec4 worldPosition;

		// Simplex helper functions
		vec3 mod289(vec3 x) {
			return x - floor(x * (1.0 / 289.0)) * 289.0;
		}
		  
		vec2 mod289(vec2 x) {
			return x - floor(x * (1.0 / 289.0)) * 289.0;
		}
		  
		vec3 permute(vec3 x) {
			return mod289(((x*34.0)+10.0)*x);
		}
		  
		// Simplex noise
		float snoise(vec2 v) {
			const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
								0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
							   -0.577350269189626,  // -1.0 + 2.0 * C.x
								0.024390243902439); // 1.0 / 41.0
		  	// First corner
			vec2 i  = floor(v + dot(v, C.yy) );
			vec2 x0 = v -   i + dot(i, C.xx);
		  
		  	// Other corners
			vec2 i1;
			//i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
			//i1.y = 1.0 - i1.x;
			i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
			// x0 = x0 - 0.0 + 0.0 * C.xx ;
			// x1 = x0 - i1 + 1.0 * C.xx ;
			// x2 = x0 - 1.0 + 2.0 * C.xx ;
			vec4 x12 = x0.xyxy + C.xxzz;
			x12.xy -= i1;
		  
		  	// Permutations
			i = mod289(i); // Avoid truncation effects in permutation
			vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
				  + i.x + vec3(0.0, i1.x, 1.0 ));
		  
			vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
			m = m*m ;
			m = m*m ;
		  
		 	 // Gradients: 41 points uniformly over a line, mapped onto a diamond.
		  	// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
		  
			vec3 x = 2.0 * fract(p * C.www) - 1.0;
			vec3 h = abs(x) - 0.5;
			vec3 ox = floor(x + 0.5);
			vec3 a0 = x - ox;
		  
		  	// Normalise gradients implicitly by scaling m
		  	// Approximation of: m *= inversesqrt( a0*a0 + h*h );
			m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
		  
		  	// Compute final noise value at P
			vec3 g;
			g.x  = a0.x  * x0.x  + h.x  * x0.y;
			g.yz = a0.yz * x12.xz + h.yz * x12.yw;
			return 130.0 * dot(m, g);
		}

		void main() {

			vUv = uv;
			vCoord = textureMatrix * vec4( position , 1.0 );

			worldPosition = modelMatrix * vec4( position, 1.0 );
			worldPosition.y += snoise(position.xy + (time/2.0)) / 150.0;
			vToEye = cameraPosition - worldPosition.xyz;

			vec4 mvPosition =  viewMatrix * worldPosition; // used in fog_vertex
			gl_Position = projectionMatrix * mvPosition;

			#include <logdepthbuf_vertex>
			#include <fog_vertex>

		}`,

    fragmentShader: /* glsl */ `

		#include <common>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>

		uniform sampler2D tReflectionMap;
		uniform sampler2D tRefractionMap;
		uniform sampler2D tNormalMap0;
		uniform sampler2D tNormalMap1;

		#ifdef USE_FLOWMAP
			uniform sampler2D tFlowMap;
		#else
			uniform vec2 flowDirection;
		#endif

		uniform vec3 color;
		uniform float reflectivity;
		uniform vec4 config;

		//uniform vec2 roundOffCenter;
		//uniform float roundOffRadiusX;
		//uniform float roundOffRadiusZ;
		//uniform vec2 roundOffBoundingBox;*
		uniform float roundness;

		varying vec4 vCoord;
		varying vec2 vUv;
		varying vec3 vToEye;
		varying vec4 worldPosition;

		void main() {

			#include <logdepthbuf_fragment>

			float flowMapOffset0 = config.x;
			float flowMapOffset1 = config.y;
			float halfCycle = config.z;
			float scale = config.w;

			vec3 toEye = normalize( vToEye );

			float roundOffCenterX = 0.5;
			float roundOffRadiusX = roundness*2.0;
			float roundOffCenterY = roundness;
			float roundOffRadiusY = roundness;

			// Round off the corners near the front of the bottle
			vec2 positionRelativeToCenterPoint = vec2(roundOffRadiusX*(roundOffCenterX - vUv.x), roundOffCenterY - vUv.y);
			// Find theta.
			float theta = 0.0;
			if (positionRelativeToCenterPoint.x == 0.0 && positionRelativeToCenterPoint.y == 0.0) {
				theta = 0.0;
			}
			else if (positionRelativeToCenterPoint.x == 0.0) {
				// Account for edge cases where x is 0
				if (positionRelativeToCenterPoint.y > 0.0) {
					theta = PI/2.0;
				}
				else {
					theta = 3.0*PI/2.0;
				}
			}
			else {
				theta = atan(positionRelativeToCenterPoint.y, positionRelativeToCenterPoint.x);
			}
			// Find point on the curve using theta
			vec2 curvePoint = vec2(roundOffRadiusX*cos(theta), roundOffRadiusY*sin(theta));
			// Check if the original point is beyond this point on the curve.
			bool isBeyond = abs(positionRelativeToCenterPoint.y) > abs(curvePoint.y);
			// Make sure that only the positive y hemisphere is checked
			bool yIsNegative = positionRelativeToCenterPoint.y < 0.0;
			// If the point is beyond the curve point, remove it.
			if (!yIsNegative && isBeyond) {
				discard;
			}

			// determine flow direction
			vec2 flow;
			#ifdef USE_FLOWMAP
				flow = texture2D( tFlowMap, vUv ).rg * 2.0 - 1.0;
			#else
				flow = flowDirection;
			#endif
			flow.x *= - 1.0;

			// sample normal maps (distort uvs with flowdata)
			vec4 normalColor0 = texture2D( tNormalMap0, ( vUv * scale ) + flow * flowMapOffset0 );
			vec4 normalColor1 = texture2D( tNormalMap1, ( vUv * scale ) + flow * flowMapOffset1 );

			// linear interpolate to get the final normal color
			float flowLerp = abs( halfCycle - flowMapOffset0 ) / halfCycle;
			vec4 normalColor = mix( normalColor0, normalColor1, flowLerp );

			// calculate normal vector
			vec3 normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );

			// calculate the fresnel term to blend reflection and refraction maps
			theta = max( dot( toEye, normal ), 0.0 );
			float reflectance = reflectivity + ( 1.0 - reflectivity ) * pow( ( 1.0 - theta ), 5.0 );

			// calculate final uv coords
			vec3 coord = vCoord.xyz / vCoord.w;
			vec2 uv = coord.xy + coord.z * normal.xz * 0.05;

			vec4 reflectColor = texture2D( tReflectionMap, vec2( 1.0 - uv.x, uv.y ) );
			vec4 refractColor = texture2D( tRefractionMap, uv );

			// multiply water color with the mix of both textures
			gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );

			#include <tonemapping_fragment>
			#include <encodings_fragment>
			#include <fog_fragment>

		}`,
};

export { Water2 };
