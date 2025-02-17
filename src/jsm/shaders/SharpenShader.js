import {
	Vector2
} from '../../../build/three.module.js';

/**
 * Sobel Edge Detection (see https://youtu.be/uihBwtPIBxM)
 *
 * As mentioned in the video the Sobel operator expects a grayscale image as input.
 *
 */

const SharpenShader = {

	uniforms: {

		'tDiffuse': { value: null },
		'resolution': { value: new Vector2() },
		'kernel': { value: [-1, -1, -1, -1, 9, -1, -1, -1, -1] }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;
		uniform float kernel[9];

		void main() {

			vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );

			vec2 offset[9];
			offset[0] = vec2(-texel.x, -texel.y);
			offset[1] = vec2(0.0, -texel.y);
			offset[2] = vec2(texel.x, -texel.y);
			offset[3] = vec2(-texel.x, 0.0);
			offset[4] = vec2(0.0, 0.0);
			offset[5] = vec2(texel.x, 0.0);
			offset[6] = vec2(-texel.x, texel.y);
			offset[7] = vec2(0.0, texel.y);
			offset[8] = vec2(texel.x, texel.y);
		   	vec3 sum = vec3(0.0);

		   for( int i=0; i<9; i++ ) sum += texture2D( tDiffuse, vUv + offset[i] ).rgb * kernel[i];

		   gl_FragColor = vec4(sum,1.0);

		}`

};

export { SharpenShader };
