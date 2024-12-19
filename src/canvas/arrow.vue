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
    canvas.style.border = '3px solid black'
    canvas.height = 512
    canvas.width = 300
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    // 绘制箭头的函数
    function drawArrow() {
        function drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.lineTo(x3, y3)
            ctx.closePath()
            ctx.fillStyle = 'red'
            ctx.fill()
        }
        let x1 = canvas.width / 2, y1 = canvas.height / 6, x2 = canvas.width / 6 * 4, y2 = canvas.height / 4, x3 = canvas.width / 6 * 2, y3 = canvas.height / 4
        drawTriangle(x1, y1, x2, y2, x3, y3)
        function drawSquare(height = 30) {
            let offset = (x2 - x3) / 3
            ctx.beginPath()
            ctx.moveTo(x3 + offset, y3)
            ctx.lineTo(x2 - offset, y3)
            ctx.lineTo(x2 - offset, y3 + height)
            ctx.lineTo(x3 + offset, y3 + height)
            ctx.closePath()
            ctx.fillStyle = 'red'
            ctx.fill()
        }
        drawSquare(80)
    }
    drawArrow()
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