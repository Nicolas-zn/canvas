_<!-- canvas 限宽标识 -->
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
    drawSign(ctx)
    canvasCon.value.appendChild(canvas)
}


function drawSign(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 35;
    let circleRadius = canvas.width <= canvas.height
        ? canvas.width / 2 - ctx.lineWidth
        : canvas.height / 2 - ctx.lineWidth;

    // 填充圆的内部
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius, Math.PI / 3, Math.PI * 2 + Math.PI / 3);
    ctx.fill();
    ctx.closePath();

    // 上下三角
    // 左三角
    let centerY = canvas.height / 2, centerX = canvas.width / 2;
    let yRatio = 0.55; // 调整半径比例
    let arcRadius = circleRadius * yRatio; // 使用相对比例
    ctx.beginPath();
    ctx.moveTo(centerX * yRatio, centerY); // 确保从正确的起点开始
    ctx.arc(centerX * yRatio, centerY, arcRadius, Math.PI * 0.7, Math.PI * 1.3);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
    // 右三角
    ctx.beginPath();
    let yRatio_2 = 1.45; // 调整半径比例

    ctx.moveTo(centerX * yRatio_2, centerY); // 确保从正确的起点开始
    ctx.arc(centerX * yRatio_2, centerY, arcRadius, -Math.PI * 0.3, Math.PI * 0.3);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
    // 绘制外部圆弧
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius, Math.PI / 3, Math.PI * 2 + Math.PI / 3);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();

    // 绘制文字
    let part = 5;
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.font = `bold ${canvas.height / 2}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText("3", (canvas.width / part) * 1.8, canvas.height / 2 + (ctx.lineWidth / 2 - 10));
    ctx.font = `bold ${canvas.height / 2 * 0.5}px Arial`;
    ctx.fillText("m", (canvas.width / part) * 3.1, canvas.height / 2 + (ctx.lineWidth / 2) + 10);
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
    string = string.replace(`drawSign(ctx)`, `${drawSign.toString()} ${drawSign.name}()`);
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