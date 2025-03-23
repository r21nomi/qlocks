precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform float hours;
uniform float minutes;
uniform float seconds;
uniform float milliseconds;

varying vec2 vUv;
varying vec2 vResolution;

float circle(vec2 p) {
    return length(p);
}

float rect(vec2 p, vec2 ratio, vec2 scale) {
    vec2 adjusted = p / (ratio * scale);
    return max(abs(adjusted.x), abs(adjusted.y));
}

void main() {
    vec2 uv = (vUv.xy * vResolution * 2.0 - vResolution.xy) / min(vResolution.x, vResolution.y);
    vec2 ratio = vResolution / min(vResolution.x, vResolution.y);

    float shapeH = 0.015;
    float shapeMargin = 0.02;
    vec2 shapeUv = uv;
    shapeUv.y -= (shapeH * 2.0 + shapeMargin);

    // Hours
    vec2 hoursUv = shapeUv;
    hoursUv.x = hoursUv.x + ratio.x - hours * ratio.x;
    float hoursShape = 1.0 - step(1.0, rect(hoursUv, ratio, vec2(hours, shapeH)));

    // Minutes
    vec2 minutesUv = shapeUv;
    minutesUv.x = minutesUv.x + ratio.x - minutes * ratio.x;
    minutesUv.y += (shapeH * 2.0 + shapeMargin);
    float minutesShape = 1.0 - step(1.0, rect(minutesUv, ratio, vec2(minutes, shapeH)));

    // Seconds
    vec2 secondsUv = shapeUv;
    secondsUv.x = secondsUv.x + ratio.x - seconds * ratio.x;
    secondsUv.y += ((shapeH * 2.0 + shapeMargin) * 2.0);
    float secondsShape = 1.0 - step(1.0, rect(secondsUv, ratio, vec2(seconds, shapeH)));

    // Milliseconds
    float _circle = circle(uv);
    float _rect = rect(uv, ratio, vec2(milliseconds));
    float shapeMilliseconds = mix(_circle, _rect, milliseconds);
    shapeMilliseconds = 1.0 - smoothstep(milliseconds - 0.0001, milliseconds, shapeMilliseconds);

    // colors
    vec4 bgColor = vec4(0.8, 0.8, 0.8, 1.0);
    float contentAlpha = 1.0;
    vec4 hoursColor = vec4(1.0, 1.0, 1.0, contentAlpha);
    vec4 minutesColor = vec4(1.0, 1.0, 1.0, contentAlpha);
    vec4 secondsColor = vec4(1.0, 1.0, 1.0, contentAlpha);
    vec4 millisecondsColor = vec4(0.0, 0.0, 0.99, contentAlpha);

    vec4 color = bgColor;
    color = mix(color, vec4(millisecondsColor.rgb, 1.0), shapeMilliseconds * millisecondsColor.a);
    color = mix(color, vec4(hoursColor.rgb, 1.0), hoursShape* hoursColor.a);
    color = mix(color, vec4(minutesColor.rgb, 1.0), minutesShape* minutesColor.a);
    color = mix(color, vec4(secondsColor.rgb, 1.0), secondsShape* secondsColor.a);

    gl_FragColor = color;
}