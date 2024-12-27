<!-- canvas 绘制文字 -->
<script lang="ts" setup>

import { utils } from '@/utils';
import { CanvasTexture, Clock, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, RepeatWrapping, Scene, SRGBColorSpace, WebGLRenderer } from 'three';
import { onBeforeUnmount, onMounted, ref } from 'vue';
let canvasCon = ref()
let canvas: HTMLCanvasElement
function draw() {
    canvas = document.createElement('canvas')
    canvas.style.border = '3px solid black'
    canvas.height = 450
    canvas.width = 300
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.fillStyle = 'rgb(255, 255, 255,0)'; // 完全透明
    ctx.fillRect(0, 0, canvas.width, canvas.height)
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
        let ratio = 5, x2R = 4, y2 = canvas.height / 3;
        let x1 = canvas.width / 2, y1 = canvas.height / 6,
            x2 = canvas.width / ratio * x2R, x3 = canvas.width / ratio * (ratio - x2R)
        drawTriangle(x1, y1, x2, y2, x3, y2)
        function drawSquare(height: number) {
            let offset = (x2 - x3) / 3
            ctx.beginPath()
            ctx.moveTo(x3 + offset, y2)
            ctx.lineTo(x2 - offset, y2)
            ctx.lineTo(x2 - offset, y2 + height)
            ctx.lineTo(x3 + offset, y2 + height)
            ctx.closePath()
            ctx.fillStyle = 'red'
            ctx.fill()
        }
        drawSquare(180)
    }
    drawArrow()
    canvasCon.value.appendChild(canvas)
}

onMounted(() => {
    draw()
    three_logic()
})
onBeforeUnmount(() => {
    renderer.dispose()
})
// 3d逻辑
let threeCon = ref()
let canvas_texture: CanvasTexture
let scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer
function three_logic() {
    let domElement = threeCon.value as HTMLDivElement
    ({ scene, camera, renderer } = utils.initScene(domElement))
    camera.position.set(0, 20, 0)
    camera.lookAt(0, 0, 0)

    canvas_texture = new CanvasTexture(canvas)
    canvas_texture.colorSpace = SRGBColorSpace
    canvas_texture.colorSpace = SRGBColorSpace;
    canvas_texture.wrapS = RepeatWrapping
    canvas_texture.wrapT = RepeatWrapping
    const plane = new PlaneGeometry(3, 5)
    plane.rotateX(-Math.PI / 2)
    const material = new MeshBasicMaterial({ map: canvas_texture, side: 2, color: 'rgba(255,255,255,1)', })
    const mesh = new Mesh(plane, material)
    mesh.translateX(-5)

    scene.add(mesh)


    const plane_2 = new PlaneGeometry(3, 15)
    const material_2 = new MeshBasicMaterial({ map: canvas_texture.clone(), side: 2, transparent: true, opacity: 1 })
    material_2.map?.repeat.set(1, 5)
    const mesh_2 = new Mesh(plane_2, material_2)
    plane_2.rotateX(-Math.PI / 2)
    scene.add(mesh_2)
    mesh_2.translateX(5)
    const clock = new Clock()
    function animate() {
        requestAnimationFrame(animate)
        material_2.map?.offset.set(0, -clock.getElapsedTime())
        renderer.render(scene, camera)

    }
    animate()
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