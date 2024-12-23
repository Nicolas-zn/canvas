<!-- canvas 十字架 -->
<script lang="ts" setup>

import { utils } from '@/utils';
import { CanvasTexture, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { onMounted, ref } from 'vue';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

let canvasCon = ref()
let canvas: HTMLCanvasElement
function draw() {
    canvas = document.createElement('canvas')
    canvas.height = 300
    canvas.width = 300
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.fillStyle = 'rgb(255, 255, 255,0)'; // 完全透明
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'red'
    ctx.moveTo(canvas.width / 3, 0)
    ctx.lineTo(canvas.width * 2 / 3, 0)
    ctx.lineTo(canvas.width * 2 / 3, canvas.height)
    ctx.lineTo(canvas.width / 3, canvas.height)
    ctx.fill()
    ctx.moveTo(0, canvas.height / 3)
    ctx.lineTo(0, canvas.height * 2 / 3)
    ctx.lineTo(canvas.width, canvas.height * 2 / 3,)
    ctx.lineTo(canvas.width, canvas.height / 3,)
    ctx.fill()
    canvasCon.value.appendChild(canvas)
}

onMounted(() => {
    draw()
    three_logic()
    create_gui()
})


// 3d逻辑
let threeCon = ref()
let canvas_texture: CanvasTexture
let scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer, controls: OrbitControls
function three_logic() {
    let domElement = threeCon.value as HTMLDivElement
    ({ scene, camera, renderer, controls } = utils.initScene(domElement))
    camera.position.set(0, 20, 0)
    camera.lookAt(0, 0, 0)
    controls.addEventListener('change', () => {
        renderer.render(scene, camera)
    })
    canvas_texture = new CanvasTexture(canvas)
    const plane = new PlaneGeometry(10, 10)
    plane.rotateX(-Math.PI / 2)
    const material = new MeshBasicMaterial({ map: canvas_texture, side: 2, transparent: true })
    const mesh = new Mesh(plane, material)
    scene.add(mesh)
    renderer.render(scene, camera)
}
// Gui逻辑啊
let style_list = ['样式1', '样式2']
let params = {
    style: '样式1',
    log: () => {
        logCode()
    }
}
function create_gui() {
    const gui = new GUI()
    canvasCon.value.appendChild(gui.domElement)
    gui.title('样式')
    gui.domElement.style.position = 'relative'
    gui.domElement.style.top = '0px'
    gui.domElement.style.right = '0px'
    gui.add(params, 'log').name('输出此图形绘制代码(console.log())')
}

function logCode() {
    let string = draw.toString()
    string = string.replace(`canvas = document.createElement`, `let canvas = document.createElement`);
    string = string.replace('canvasCon.value.appendChild(canvas)', 'return canvas')
    console.log(string);
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