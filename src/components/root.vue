<!-- canvas 绘制文字 -->
<script lang="ts" setup>

import { utils } from '@/utils';
import { CanvasTexture, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { onMounted, ref } from 'vue';
let canvasCon = ref()
let canvas: HTMLCanvasElement
function draw() {
  canvas = document.createElement('canvas')
  canvas.height = 512
  canvas.width = 300
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  canvasCon.value.appendChild(canvas)

}
onMounted(() => {
  draw()
  three_logic()
})

// 3d逻辑
let threeCon = ref()
let canvas_texture: CanvasTexture
let scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer, controls: OrbitControls
function three_logic() {
  let domElement = threeCon.value as HTMLDivElement
  ({ scene, camera, renderer, controls } = utils.initScene(domElement))
  camera.position.set(0, 10, 0)
  camera.lookAt(0, 0, 0)
  controls.addEventListener('change', () => {
    renderer.render(scene, camera)
  })


  canvas_texture = new CanvasTexture(canvas)
  renderer.render(scene, camera)
}
</script>
<template>
  <div class="container">
    <div ref="canvasCon" class="canvasCon">
    </div>
    <div ref="threeCon" class="threeCon"></div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;

  >div {
    width: 50%;
    height: 100%;
  }
}
</style>