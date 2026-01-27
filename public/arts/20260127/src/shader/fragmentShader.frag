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

float atan2(float y, float x){
  return x == 0.0 ? sign(y) * PI / 2.0 : atan(y, x);
}

float ease(float v) {
  if (v < 0.5) {
    return v;
  } else {
    return 1.0 - v;
  }
}

float sdArc(vec2 p, float startAngle, float aperture, float radius, float thickness) {
  // 回転
  float c = cos(startAngle + aperture * 0.5);
  float s = sin(startAngle + aperture * 0.5);
  p = mat2(c, s, -s, c) * p;

  // 角度制限
  p.x = abs(p.x);
  float halfAperture = aperture * 0.5;

  vec2 sc = vec2(sin(halfAperture), cos(halfAperture));

  float d;
  if (sc.y * p.x > sc.x * p.y) {
    // 円弧の端
    d = length(p - sc * radius) - thickness;
  } else {
    // 円弧の本体
    d = abs(length(p) - radius) - thickness;
  }

  return step(0.0, d);
}

void main() {
  vec2 uv = (vUv.xy * vResolution * 2.0 - vResolution.xy) / min(vResolution.x, vResolution.y);
  vec2 ratio = vResolution / min(vResolution.x, vResolution.y);

  float p = 30.0;
  uv = floor(uv * p) / p;

  float b = ease(milliseconds);
  float n = snoise(vec2(uv.x + b * time, uv.y + b + time));
  float v = step(0.5 + b * 0.5, length(uv + n * (0.1 + b * 0.3)));

  float d = sdArc(uv, 0.0, PI * 2.0 * minutes, 0.075 + b + n * 0.15, 0.07);

  // colors
  vec3 bgColor = vec3(0.025);
//  vec3 shapeColor = vec3(1.0, 0.9, 0.0) * (1.0 - length(uv)) * 3.0;
//  vec3 shapeColor2 = vec3(0.3, 0.5, 0.89);
  vec3 shapeColor = vec3(0.3, 0.5, 0.89) * (1.0 - length(uv)) * 3.0;
  vec3 shapeColor2 = vec3(1.0, 0.6, 0.0);
  shapeColor = mix(shapeColor, shapeColor2, 1.0 - d);
  shapeColor = mix(bgColor, shapeColor, b);
  vec3 color = mix(shapeColor, bgColor, v);

  gl_FragColor = vec4(color, 1.0);
}