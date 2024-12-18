<script setup lang="ts">
import { Scene, PerspectiveCamera, WebGLRenderer, DirectionalLight, AmbientLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { onBeforeUnmount, onMounted, ref } from 'vue';
const three= ref()
let scene: Scene,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
  controls: OrbitControls;
let init_scene = async () => {
  scene = new Scene();
  camera = new PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
  let vHeight = 3;
  camera.position.set(30, vHeight + 2, 20).setLength(15);
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  three.value.appendChild(renderer.domElement);
  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, vHeight, 0);
  controls.update();
  controls.minPolarAngle = Math.PI * 0.4;
  controls.maxPolarAngle = Math.PI * 0.5;
  controls.minDistance = 10;
  controls.maxDistance = 20;
  controls.enableDamping = true;
  controls.enablePan = false;
  let light = new DirectionalLight(0xffffff, 0.25);
  light.position.setScalar(1);
  scene.add(light, new AmbientLight(0xffffff, 0.75));
  // add_helper();
};
onMounted(()=>{
  init_scene()
  render()
})
let rf: number;
const render = () => {
  renderer.render(scene, camera);
  rf = requestAnimationFrame(render);
};
onBeforeUnmount(() => {
  cancelAnimationFrame(rf);
});
</script>

<template>
  <div class="three-container" ref="three">

  </div>
</template>

<style scoped></style>
