_<!-- canvas  停车让行标志 -->
<script lang="ts" setup>

import { utils } from '@/utils';
import { CanvasTexture, DoubleSide, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, SRGBColorSpace, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { onMounted, ref } from 'vue';
let canvasCon = ref()
let canvas: HTMLCanvasElement
function draw() {
    canvas = document.createElement('canvas')
    canvas.height = 400
    canvas.width = 400
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    drawCrossInCircle(ctx)
    canvasCon.value.appendChild(canvas)
}


function drawCrossInCircle(ctx: CanvasRenderingContext2D) {
    let centerX = canvas.width / 2, centerY = canvas.height / 2
    let radius = canvas.width <= canvas.height ? canvas.width / 2 - ctx.lineWidth : canvas.height / 2 - ctx.lineWidth
    let sides = 8
    // 底部填充
    let scale = 0.9
    ctx.beginPath()
    ctx.lineWidth = 1;        // 边框宽度
    for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 / sides) * i + Math.PI / sides; // 当前点的角度
        const x = centerX + radius * Math.cos(angle); // 点的X坐标
        const y = centerY + radius * Math.sin(angle); // 点的Y坐标
        if (i == 0) {
            ctx.moveTo(x, y); // 移动
        } else {
            ctx.lineTo(x, y); // 绘制到下一个点
        }

    }
    ctx.fillStyle = 'red'; // 填充颜色
    ctx.fill();
    ctx.closePath()
    ctx.beginPath()

    for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 / sides) * i + Math.PI / sides; // 当前点的角度
        const x = centerX + radius * scale * Math.cos(angle); // 点的X坐标
        const y = centerY + radius * scale * Math.sin(angle); // 点的Y坐标
        if (i == 0) {
            ctx.moveTo(x, y); // 移动
        } else {
            ctx.lineTo(x, y); // 绘制到下一个点
        }

    }
    ctx.closePath()
    ctx.strokeStyle = 'white'; // 边框颜色
    ctx.lineWidth = 15;        // 边框宽度
    ctx.stroke();             // 绘制边框
    ctx.textBaseline = 'middle'
    ctx.font = `bold ${canvas.height / 2}px Arial`;
    ctx.textAlign = 'center'
    ctx.fillStyle = 'white'
    ctx.fillText('停', centerX, centerY + ctx.lineWidth / 2)

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
    camera.position.set(0, 10, 0)
    camera.lookAt(0, 0, 0)
    controls.addEventListener('change', () => {
        renderer.render(scene, camera)
    })
    canvas_texture = new CanvasTexture(canvas)
    canvas_texture.colorSpace = SRGBColorSpace
    const plane = new PlaneGeometry(5, 5)
    plane.rotateX(-Math.PI / 2)
    const material = new MeshBasicMaterial({ map: canvas_texture, side: DoubleSide, transparent: true })
    canvas_texture.needsUpdate = true
    const mesh = new Mesh(plane, material)
    scene.add(mesh)
    renderer.render(scene, camera)
}

// Gui逻辑啊
let params = {
    log: () => {
        logCode()
    },
    print: () => {
        const imageDataUrl = canvas.toDataURL()
        const link = document.createElement('a');
        link.href = imageDataUrl;
        link.download = `${window.current_pic_name}.png`;
        link.click();
        link.remove()
    }
}
function create_gui() {
    const gui = new GUI()
    canvasCon.value.appendChild(gui.domElement)
    gui.title('样式')
    gui.domElement.style.position = 'relative'
    gui.domElement.style.top = '0px'
    gui.domElement.style.right = '0px'
    gui.add(params, 'print').name('保存')
    gui.add(params, 'log').name('输出此图形绘制代码(console.log())')
}

function logCode() {
    let string = draw.toString()
    string = string.replace(`canvas = document.createElement`, `let canvas = document.createElement`);
    string = string.replace(`drawCrossInCircle(ctx)`, `${drawCrossInCircle.toString()} ${drawCrossInCircle.name}()`);
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