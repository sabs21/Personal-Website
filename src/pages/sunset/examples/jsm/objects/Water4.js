import {
    Mesh,
    Vector3,
    Color,
    DoubleSide,
    RGBFormat,
    Plane,
    Matrix4,
    Vector4,
    PerspectiveCamera,
    WebGLRenderTarget,
    MathUtils,
    UniformsUtils,
    UniformsLib,
    ShaderMaterial,
    LinearFilter,
} from "three";

/**
 * Work based on :
 * http://slayvin.net : Flat mirror for three.js
 * http://www.adelphi.edu/~stemkoski : An implementation of water shader based on the flat mirror
 * http://29a.ch/ && http://29a.ch/slides/2012/webglwater/ : Water shader explanations in WebGL
 */

class Water4 extends Mesh {
    constructor(geometry, options = {}) {
        super(geometry);
        const scope = this;
        const textureWidth = options.textureWidth !== undefined ? options.textureWidth : 512;
        const textureHeight = options.textureHeight !== undefined ? options.textureHeight : 512;
        const clipBias = options.clipBias !== undefined ? options.clipBias : 0.0;
        const alpha = options.alpha !== undefined ? options.alpha : 1.0;
        const time = options.time !== undefined ? options.time : 0.0;
        const normalSampler = options.waterNormals !== undefined ? options.waterNormals : null;
        const sunDirection =
            options.sunDirection !== undefined ? options.sunDirection : new Vector3(0.70707, 0.70707, 0.0);
        const sunColor = new Color(options.sunColor !== undefined ? options.sunColor : 0xffffff);
        const waterColor = new Color(options.waterColor !== undefined ? options.waterColor : 0x7f7f7f);
        const eye = options.eye !== undefined ? options.eye : new Vector3(0, 0, 0);
        const distortionScale = options.distortionScale !== undefined ? options.distortionScale : 20.0;
        const side = options.side !== undefined ? options.side : DoubleSide;
        const fog = options.fog !== undefined ? options.fog : false;
        const format = options.format !== undefined ? options.format : RGBFormat; //
        const roundness = options.roundness || 0.5;

        const mirrorPlane = new Plane();
        const normal = new Vector3();
        const mirrorWorldPosition = new Vector3();
        const cameraWorldPosition = new Vector3();
        const rotationMatrix = new Matrix4();
        const lookAtPosition = new Vector3(0, 0, -1);
        const clipPlane = new Vector4();
        const view = new Vector3();
        const target = new Vector3();
        const q = new Vector4();
        const textureMatrix = new Matrix4();
        const mirrorCamera = new PerspectiveCamera();
        const parameters = {
            minFilter: LinearFilter,
            magFilter: LinearFilter,
            format,
        };
        const renderTarget = new WebGLRenderTarget(textureWidth, textureHeight, parameters);

        if (!MathUtils.isPowerOfTwo(textureWidth) || !MathUtils.isPowerOfTwo(textureHeight)) {
            renderTarget.texture.generateMipmaps = false;
        }

        const mirrorShader = {
            uniforms: UniformsUtils.merge([
                UniformsLib["fog"],
                UniformsLib["lights"],
                {
                    normalSampler: {
                        value: null,
                    },
                    mirrorSampler: {
                        value: null,
                    },
                    alpha: {
                        value: 1.0,
                    },
                    time: {
                        value: 0.0,
                    },
                    size: {
                        value: 1.0,
                    },
                    distortionScale: {
                        value: 20.0,
                    },
                    textureMatrix: {
                        value: new Matrix4(),
                    },
                    sunColor: {
                        value: new Color(0x7f7f7f),
                    },
                    sunDirection: {
                        value: new Vector3(0.70707, 0.70707, 0),
                    },
                    eye: {
                        value: new Vector3(),
                    },
                    waterColor: {
                        value: new Color(0x555555),
                    },
                    roundness: {
                        value: 0.5,
                    },
                },
            ]),
            vertexShader:
                /* glsl */
                `
                #include <common>
				#include <fog_pars_vertex>
				#include <shadowmap_pars_vertex>
				#include <logdepthbuf_pars_vertex>

				uniform mat4 textureMatrix;
				uniform float time;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;
                varying vec2 vUv;

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
					mirrorCoord = modelMatrix * vec4( position, 1.0 );
                    //mirrorCoord.y += snoise(position.xy + (time/2.0)) / 150.0;
					worldPosition = modelMatrix * vec4( position, 1.0 );
					//worldPosition.y = sin(time/3.0);
					mirrorCoord = textureMatrix * mirrorCoord;
					vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
                    //mvPosition.y = sin(time/3.0);
					gl_Position = projectionMatrix * mvPosition;
                    gl_Position.y += snoise(position.xy + time) / 50.0;

				#include <beginnormal_vertex>
				#include <defaultnormal_vertex>
				#include <logdepthbuf_vertex>
				#include <fog_vertex>
				#include <shadowmap_vertex>
			}`,
            fragmentShader:
                /* glsl */
                `
				uniform sampler2D mirrorSampler;
				uniform float alpha;
				uniform float time;
				uniform float size;
				uniform float distortionScale;
				uniform sampler2D normalSampler;
				uniform vec3 sunColor;
				uniform vec3 sunDirection;
				uniform vec3 eye;
				uniform vec3 waterColor;
                uniform float roundness;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;
                varying vec2 vUv;

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

				vec4 getNoise( vec2 uv ) {
					vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
					vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
					vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
					vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
					vec4 noise = texture2D( normalSampler, uv0 ) +
						texture2D( normalSampler, uv1 ) +
						texture2D( normalSampler, uv2 ) +
						texture2D( normalSampler, uv3 );
					return noise * 0.5 - 1.0;
				}

				void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
					vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );
					float direction = max( 0.0, dot( eyeDirection, reflection ) );
					specularColor += pow( direction, shiny ) * sunColor * spec;
					diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;
				}

				#include <common>
				#include <packing>
				#include <bsdfs>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <lights_pars_begin>
				#include <shadowmap_pars_fragment>
				#include <shadowmask_pars_fragment>

				void main() {

					#include <logdepthbuf_fragment>
					vec4 noise = getNoise( worldPosition.xz * size );
					vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );

					vec3 diffuseLight = vec3(0.0);
					vec3 specularLight = vec3(0.0);

                    float roundOffCenterX = 0.45;
					float roundOffRadiusX = roundness*1.7;
					float roundOffCenterY = roundness;
					float roundOffRadiusY = roundness;
		
					// Round off the corners near the front of the bottle
					vec2 positionRelativeToCenterPoint = vec2(roundOffRadiusX*(roundOffCenterX - vUv.x), roundOffCenterY - vUv.y);
					// Find theta (the angle).
					float angle = 0.0;
					if (positionRelativeToCenterPoint.x == 0.0 && positionRelativeToCenterPoint.y == 0.0) {
						angle = 0.0;
					}
					else if (positionRelativeToCenterPoint.x == 0.0) {
						// Account for edge cases where x is 0
						if (positionRelativeToCenterPoint.y > 0.0) {
							angle = PI/2.0;
						}
						else {
							angle = 3.0*PI/2.0;
						}
					}
					else {
						angle = atan(positionRelativeToCenterPoint.y, positionRelativeToCenterPoint.x);
					}
					// Find point on the curve using the angle
					vec2 curvePoint = vec2(roundOffRadiusX*cos(angle), roundOffRadiusY*sin(angle));
					// Check if the original point is beyond this point on the curve.
					bool isBeyond = abs(positionRelativeToCenterPoint.y) > abs(curvePoint.y);
					// Make sure that only the positive y hemisphere is checked
					bool yIsNegative = positionRelativeToCenterPoint.y < 0.0;
					// If the point is beyond the curve point, remove it.
					if (!yIsNegative && isBeyond) {
                    //if ((snoise(worldPosition.xz + (time/2.0)) / 150.0) > 0.0) {
                    //if (worldPosition.z > -1.71) {
                    //if (vUv.x > 0.2 && vUv.x < 0.4) {
						discard;
					}

					vec3 worldToEye = eye-worldPosition.xyz;
					vec3 eyeDirection = normalize( worldToEye );
					sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );

					float distance = length(worldToEye);

					vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;
					vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );

					float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
					float rf0 = 0.3;
					float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );
					vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;
					vec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance);
					vec3 outgoingLight = albedo;
					gl_FragColor = vec4( outgoingLight, alpha );

					#include <tonemapping_fragment>
					#include <fog_fragment>
				}`,
        };
        const material = new ShaderMaterial({
            fragmentShader: mirrorShader.fragmentShader,
            vertexShader: mirrorShader.vertexShader,
            uniforms: UniformsUtils.clone(mirrorShader.uniforms),
            lights: true,
            side: side,
            fog: fog,
        });
        material.uniforms["mirrorSampler"].value = renderTarget.texture;
        material.uniforms["textureMatrix"].value = textureMatrix;
        material.uniforms["alpha"].value = alpha;
        material.uniforms["time"].value = time;
        material.uniforms["normalSampler"].value = normalSampler;
        material.uniforms["sunColor"].value = sunColor;
        material.uniforms["waterColor"].value = waterColor;
        material.uniforms["sunDirection"].value = sunDirection;
        material.uniforms["distortionScale"].value = distortionScale;
        material.uniforms["eye"].value = eye;
        material.uniforms["roundness"].value = roundness;
        scope.material = material;

        scope.onBeforeRender = function (renderer, scene, camera) {
            mirrorWorldPosition.setFromMatrixPosition(scope.matrixWorld);
            cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);
            rotationMatrix.extractRotation(scope.matrixWorld);
            normal.set(0, 0, 1);
            normal.applyMatrix4(rotationMatrix);
            view.subVectors(mirrorWorldPosition, cameraWorldPosition); // Avoid rendering when mirror is facing away

            if (view.dot(normal) > 0) return;
            view.reflect(normal).negate();
            view.add(mirrorWorldPosition);
            rotationMatrix.extractRotation(camera.matrixWorld);
            lookAtPosition.set(0, 0, -1);
            lookAtPosition.applyMatrix4(rotationMatrix);
            lookAtPosition.add(cameraWorldPosition);
            target.subVectors(mirrorWorldPosition, lookAtPosition);
            target.reflect(normal).negate();
            target.add(mirrorWorldPosition);
            mirrorCamera.position.copy(view);
            mirrorCamera.up.set(0, 1, 0);
            mirrorCamera.up.applyMatrix4(rotationMatrix);
            mirrorCamera.up.reflect(normal);
            mirrorCamera.lookAt(target);
            mirrorCamera.far = camera.far; // Used in WebGLBackground

            mirrorCamera.updateMatrixWorld();
            mirrorCamera.projectionMatrix.copy(camera.projectionMatrix); // Update the texture matrix

            textureMatrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
            textureMatrix.multiply(mirrorCamera.projectionMatrix);
            textureMatrix.multiply(mirrorCamera.matrixWorldInverse); // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
            // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf

            mirrorPlane.setFromNormalAndCoplanarPoint(normal, mirrorWorldPosition);
            mirrorPlane.applyMatrix4(mirrorCamera.matrixWorldInverse);
            clipPlane.set(mirrorPlane.normal.x, mirrorPlane.normal.y, mirrorPlane.normal.z, mirrorPlane.constant);
            const projectionMatrix = mirrorCamera.projectionMatrix;
            q.x = (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
            q.y = (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
            q.z = -1.0;
            q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14]; // Calculate the scaled plane vector

            clipPlane.multiplyScalar(2.0 / clipPlane.dot(q)); // Replacing the third row of the projection matrix

            projectionMatrix.elements[2] = clipPlane.x;
            projectionMatrix.elements[6] = clipPlane.y;
            projectionMatrix.elements[10] = clipPlane.z + 1.0 - clipBias;
            projectionMatrix.elements[14] = clipPlane.w;
            eye.setFromMatrixPosition(camera.matrixWorld); // Render

            const currentRenderTarget = renderer.getRenderTarget();
            const currentXrEnabled = renderer.xr.enabled;
            const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
            scope.visible = false;
            renderer.xr.enabled = false; // Avoid camera modification and recursion

            renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

            renderer.setRenderTarget(renderTarget);
            renderer.state.buffers.depth.setMask(true); // make sure the depth buffer is writable so it can be properly cleared, see #18897

            if (renderer.autoClear === false) renderer.clear();
            renderer.render(scene, mirrorCamera);
            scope.visible = true;
            renderer.xr.enabled = currentXrEnabled;
            renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
            renderer.setRenderTarget(currentRenderTarget); // Restore viewport

            const viewport = camera.viewport;

            if (viewport !== undefined) {
                renderer.state.viewport(viewport);
            }
        };
    }
}

Water4.prototype.isWater = true;

export { Water4 };
