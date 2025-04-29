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

// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float circle(vec2 p) {
    return length(p);
}

float rect(vec2 p, vec2 ratio, vec2 scale) {
    vec2 adjusted = p / (ratio * scale);
    return max(abs(adjusted.x), abs(adjusted.y));
}

float atan2(float y, float x){
    return x == 0.0 ? sign(y) * PI / 2.0 : atan(y, x);
}

/**
 * Reference
 * https://karanokan.info/2019/03/31/post-2465
 */
float polygon(vec2 p, float n, float size){
    float a = atan2(p.x, p.y) + PI;
    float r = 2.0 * PI / n;
    return cos(floor(0.5 + a / r) * r - a) * length(p) - size;
}

float star(vec2 p, float n, float t, float size){
    float a = 2.0 * PI / float(n) / 2.0;
    float c = cos(a);
    float s = sin(a);
    vec2 r = p * mat2(c, -s, s, c);
    return (polygon(p, n, size) - polygon(r, n, size) * t) / (1.0 - t);
}

float ease(float v) {
    if (v < 0.5) {
        return v;
    } else {
        return 1.0 - v;
    }
}

void main() {
    vec2 uv = (vUv.xy * vResolution * 2.0 - vResolution.xy) / min(vResolution.x, vResolution.y);
    vec2 ratio = vResolution / min(vResolution.x, vResolution.y);

    float shapeH = 0.007;
    vec2 shapeUv = uv;

    vec2 _uv = shapeUv;
    float ee = floor(30.0 * seconds) * ease(milliseconds);
    float n = snoise(vec2(uv.x * 1.0, ee)) * (0.05 * ee);
    float shape = 1.0 - step(1.0, rect(vec2(_uv.x, _uv.y + n), ratio, vec2(1.0, shapeH)));

    // colors
    vec4 bgColor = vec4(0.95, 0.88, 0.88, 1.0);
    float contentAlpha = 1.0;
    vec4 secondsColor = mix(vec4(0.88, 0.0, 0.0, contentAlpha), vec4(bgColor.r * 0.85, bgColor.g * 0.85, bgColor.b * 0.85, contentAlpha), step(hours, vUv.x));
    vec4 color = bgColor;
    color = mix(color, vec4(secondsColor.rgb, 1.0), shape* secondsColor.a);

    gl_FragColor = color;
}