import * as THREE from 'three';
// @ts-expect-error avoid warnings.
import vertexShader from '~/shader/vertexShader.vert';
// @ts-expect-error avoid warnings.
import fragmentShader from '~/shader/fragmentShader.frag';
import { CustomClock } from '~/CustomClock';
import { CLOCK_TYPE } from '~/types/dto';
import { easing } from '~/easing';

const clock = new CustomClock();
const scene = new THREE.Scene();

const PADDING = 0.0;
const SHADER_QUALITY = 1.0;

let geometry, mesh;
let elapsedTime = 0;
const vertices: number[] = [];
const uvs: number[] = [];
const indices: number[] = [];
const paddings: number[] = [];
const size: number[] = [];

const getWindowSize = () => {
  return {
    w: window.innerWidth,
    h: window.innerHeight,
  };
};

// Camera
const fov = 45;
const aspect = getWindowSize().w / getWindowSize().h;
const camera = new THREE.PerspectiveCamera(fov, aspect, 1, 10000);
const stageHeight = getWindowSize().h;
// Make camera distance same as actual pixel value.
const z = stageHeight / Math.tan((fov * Math.PI) / 360) / 2;
camera.position.z = z;

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

const uniforms = {
  time: { type: 'f', value: 1.0 },
  resolution: { type: 'v2', value: new THREE.Vector2() },
  hours: { type: 'f', value: 1.0 },
  minutes: { type: 'f', value: 1.0 },
  seconds: { type: 'f', value: 1.0 },
  milliseconds: { type: 'f', value: 1.0 },
};

const getRatioFromCurrentTime = (clockType: CLOCK_TYPE, ratio) => {
  const coefficient = 1.0;
  const timeScale = coefficient + (1.0 - coefficient) * ratio;
  const date = new Date();
  const scaledDate = new Date(date.getTime() * timeScale);
  let degree = 0;
  switch (clockType) {
    case CLOCK_TYPE.HOURS:
      degree = ((scaledDate.getHours() % 12) + scaledDate.getMinutes() / 60) / 12;
      break;
    case CLOCK_TYPE.MINUTES:
      degree = (scaledDate.getMinutes() + scaledDate.getSeconds() / 60) / 60;
      break;
    case CLOCK_TYPE.SECONDS:
      degree = (scaledDate.getSeconds() + scaledDate.getMilliseconds() / 1000) / 60;
      break;
    case CLOCK_TYPE.MILLISECONDS:
      degree = scaledDate.getMilliseconds() / 1000;
      break;
  }
  return degree;
};

const init = () => {
  for (let j = 0; j < 4; j++) {
    const { x, y, z, w, h } = getPositionAndSize(j);
    vertices.push(x, y, z);
    size.push(w, h);
    paddings.push(PADDING, PADDING);
  }

  uvs.push(0, 0, 1, 0, 1, 1, 0, 1);

  // polygon order
  // 3 -- 2
  // |    |
  // 0 -- 1
  const vertexIndex = 0;
  indices.push(
    vertexIndex + 0,
    vertexIndex + 1,
    vertexIndex + 2,
    vertexIndex + 2,
    vertexIndex + 3,
    vertexIndex + 0
  );

  geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Uint16BufferAttribute(uvs, 2));
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(size, 2));
  geometry.setAttribute('padding', new THREE.Float32BufferAttribute(paddings, 2));

  const material = new THREE.RawShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    blending: THREE.NormalBlending,
    side: THREE.DoubleSide,
    glslVersion: THREE.GLSL1,
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  render();

  window.addEventListener('resize', onResize);
};

const render = () => {
  elapsedTime = clock.getElapsedTime();

  uniforms.time.value = elapsedTime;
  uniforms.hours.value = getRatioFromCurrentTime(CLOCK_TYPE.HOURS, 1.0);
  uniforms.minutes.value = getRatioFromCurrentTime(CLOCK_TYPE.MINUTES, 1.0);
  uniforms.seconds.value = getRatioFromCurrentTime(CLOCK_TYPE.SECONDS, 1.0);
  uniforms.milliseconds.value = easing.easeOutExpo(
    getRatioFromCurrentTime(CLOCK_TYPE.MILLISECONDS, 1.0)
  );

  renderer.render(scene, camera);

  requestAnimationFrame(render);
};

const onResize = () => {
  const width = getWindowSize().w;
  const height = getWindowSize().h;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  uniforms.resolution.value = new THREE.Vector2(width, height);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width * SHADER_QUALITY, height * SHADER_QUALITY, false);
};

const getPositionAndSize = (vertexIndex) => {
  const windowSize = getWindowSize();
  const w = windowSize.w - PADDING * 2;
  const h = windowSize.h - PADDING * 2;
  const originX = -windowSize.w / 2;
  const originY = -windowSize.h / 2;
  const x = vertexIndex === 0 || vertexIndex === 3 ? originX + PADDING : originX + PADDING + w;
  const y = vertexIndex === 0 || vertexIndex === 1 ? originY + PADDING : originY + PADDING + h;
  const z = 0;

  return {
    x,
    y,
    z,
    w,
    h,
  };
};

document.addEventListener('DOMContentLoaded', () => {
  init();
  onResize();
});
