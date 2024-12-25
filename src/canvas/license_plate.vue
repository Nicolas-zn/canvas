<!-- canvas 绘制文字 -->
<script lang="ts" setup>

import { utils } from '@/utils';
import { CanvasTexture, DoubleSide, Mesh, MeshPhongMaterial, PerspectiveCamera, PlaneGeometry, Scene, SRGBColorSpace, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { onMounted, ref } from 'vue';
let canvasCon = ref()
let canvas: HTMLCanvasElement
function draw() {
    canvas = document.createElement('canvas')
    canvas.height = 140
    canvas.width = 440
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    drawSign(ctx)
    canvasCon.value.appendChild(canvas)

}

function drawSign(ctx: CanvasRenderingContext2D) {
    let baseColor = 'rgb(4,18,183)'
    ctx.fillStyle = baseColor
    ctx.lineWidth = 3
    ctx.roundRect(10, 10, canvas.width - 10, canvas.height - 10, [20])
    ctx.fill()
    ctx.strokeStyle = 'white'
    ctx.roundRect(20, 20, canvas.width - 30, canvas.height - 30, [20])
    ctx.stroke();
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'white'
    ctx.font = `${canvas.height * 0.55}px Arial`;
    ctx.textAlign = 'center'
    ctx.fillText('京N•88888', canvas.width / 2, canvas.height / 2 + 10)
    convertToGrayscale()
}

function convertToGrayscale(): void {
    const canvas_gray = document.createElement('canvas')
    canvas_gray.height = 140
    canvas_gray.width = 440
    const ctx = canvas_gray.getContext('2d') as CanvasRenderingContext2D;
    const ctx_old = canvas.getContext('2d') as CanvasRenderingContext2D;

    // 获取像素数据
    const imageData = ctx_old.getImageData(0, 0, canvas_gray.width, canvas_gray.height);
    const data = imageData.data;

    // 转化为灰度
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];     // Red
        const g = data[i + 1]; // Green
        const b = data[i + 2]; // Blue

        // 灰度公式：Gray = 0.299 * R + 0.587 * G + 0.114 * B
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;

        // 将 RGB 设置为灰度值
        data[i] = gray;        // Red
        data[i + 1] = gray;    // Green
        data[i + 2] = gray;    // Blue
        // Alpha 通道保持不变
    }

    // 将处理后的像素数据重新写回 Canvas
    ctx.putImageData(imageData, 0, 0);

    canvasCon.value.appendChild(canvas_gray)
    three_logic(canvas_gray)

}

onMounted(() => {
    draw()
    create_gui()
})

// 3d逻辑
let threeCon = ref()
let canvas_texture: CanvasTexture
let scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer, controls: OrbitControls
function three_logic(displacementMapCanvas: HTMLCanvasElement) {
    let domElement = threeCon.value as HTMLDivElement
    ({ scene, camera, renderer, controls } = utils.initScene(domElement))
    camera.position.set(5, 3, 0)
    camera.lookAt(0, 0, 0)
    controls.addEventListener('change', () => {
        renderer.render(scene, camera)
    })


    canvas_texture = new CanvasTexture(canvas)
    let displacementMap = new CanvasTexture(displacementMapCanvas)

    canvas_texture.colorSpace = SRGBColorSpace
    const plane = new PlaneGeometry(4.4, 1.4, 440, 140)
    plane.rotateX(-Math.PI / 2)
    const material = new MeshPhongMaterial({

        side: DoubleSide, transparent: true,
        map: canvas_texture,
        displacementMap: displacementMap,
        displacementScale: 0.05,
        displacementBias: 1
    })
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
    string = string.replace(`convertToGrayscale()`, `${convertToGrayscale.toString()} ${convertToGrayscale.name}()`);
    string = string.replace('canvasCon.value.appendChild(canvas_gray)', 'return canvas')
    string = string.replace('three_logic(canvas_gray)', '')
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