<!-- canvas 绘制文字 -->
<script lang="ts" setup>

import { utils } from '@/utils';
import { CanvasTexture, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, RepeatWrapping, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { onMounted, ref } from 'vue';
let canvasCon = ref()
let canvas: HTMLCanvasElement
function draw() {
    canvas = document.createElement('canvas')
    canvas.height = 535
    canvas.width = 300
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const brickWidth = 50
    const brickHeight = 25
    const gap = 5

    ctx.fillStyle = 'rgb(255,0,0)'
    ctx.strokeStyle = '#000'

    for (let y = 0; y < canvas.height; y += brickHeight + gap) {
        for (let x = gap; x < canvas.width; x += brickWidth) {
            ctx.fillRect(x, y, brickWidth - gap, brickHeight);
            ctx.strokeRect(x, y, brickWidth - gap, brickHeight);
        }
    }

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
    canvas_texture.wrapS = RepeatWrapping
    canvas_texture.wrapT = RepeatWrapping
    canvas_texture.repeat.set(1, 1);
    const plane = new PlaneGeometry(10, 10)
    plane.rotateX(-Math.PI / 2)
    const material = new MeshBasicMaterial({ map: canvas_texture, side: 2 })
    const mesh = new Mesh(plane, material)
    scene.add(mesh)
    renderer.render(scene, camera)

}
</script>
<template>
    <div class="container">
        <div ref="canvasCon" class="canvasCon"></div>
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