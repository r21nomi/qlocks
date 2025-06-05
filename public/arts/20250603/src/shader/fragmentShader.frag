precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform float hours;
uniform float minutes;
uniform float seconds;
uniform float milliseconds;

varying vec2 vUv;
varying vec2 vResolution;

const float PI = 3.1415926535897932384626433832795;

float ease(float v) {
    if (v < 0.5) {
        return v;
    } else {
        return 1.0 - v;
    }
}

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

float timeStep(float t) {
    if (t < 0.5) {
        return t * 2.0;
    } else {
        return (1.0 - t) * 2.0;
    }
}

void main() {
    vec2 uv = (vUv.xy * vResolution * 2.0 - vResolution.xy) / min(vResolution.x, vResolution.y);
    vec2 ratio = vResolution / min(vResolution.x, vResolution.y);

    float t = hours;
    float size = 0.35;
    float offsetY = ratio.y + size;
    vec2 pos = vec2(
        -cos(t * 180.0 * PI / 180.0) * ratio.x * 0.8,
        -sin(t * 180.0 * PI / 180.0) * offsetY + offsetY
    );
    uv += pos;

    float shape = step(size, length(uv));
    vec3 bgColor = mix(vec3(0.0), vec3(1.0), timeStep(t));
    vec3 sunColor = mix(vec3(1.0, 0.9, 0.0), vec3(1.0, 0.0, 0.0), timeStep(t));
    vec4 color = vec4(mix(sunColor, bgColor, shape), 1.0);

    gl_FragColor = color;
}