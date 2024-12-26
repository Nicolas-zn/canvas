_<!-- canvas 太极图案 -->
<script lang="ts" setup>

import { utils } from '@/utils';
import { CanvasTexture, Clock, DoubleSide, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, SRGBColorSpace, WebGLRenderer } from 'three';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { onBeforeUnmount, onMounted, ref } from 'vue';
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
    ctx.lineWidth = 8;
    let circleRadius = canvas.width <= canvas.height
        ? canvas.width / 2 - ctx.lineWidth
        : canvas.height / 2 - ctx.lineWidth;

    // 填充圆的内部
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius, Math.PI / 3, Math.PI * 2 + Math.PI / 3);
    ctx.stroke();
    ctx.fill()
    ctx.closePath();
    ctx.beginPath();
    // 中心点坐标
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.translate(centerX, centerY)
    ctx.beginPath()
    ctx.lineWidth = 1;
    ctx.fillStyle = 'black'
    ctx.arc(0, -circleRadius / 2, circleRadius / 2, -Math.PI / 2, Math.PI / 2)
    ctx.arc(0, circleRadius / 2, circleRadius / 2, -Math.PI / 2, Math.PI / 2, true)
    ctx.arc(0, 0, circleRadius, Math.PI / 2, Math.PI * 1.5)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.arc(0, -circleRadius / 2, circleRadius / 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()

    ctx.fillStyle = 'black'
    ctx.arc(0, circleRadius / 2, circleRadius / 6, 0, Math.PI * 2)
    ctx.fill()


}


// 输出为svg
// import { Canvg } from 'canvg';
// function export_svg() {
//     const ctx = canvas.getContext('2d')

// }
onMounted(() => {
    draw()
    three_logic()
    create_gui()
})
onBeforeUnmount(() => {
    renderer.setAnimationLoop(null)
})
// 3d逻辑
let threeCon = ref()
let canvas_texture: CanvasTexture
let scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer
function three_logic() {
    let domElement = threeCon.value as HTMLDivElement
    ({ scene, camera, renderer } = utils.initScene(domElement))
    camera.position.set(0, 10, 0)
    camera.lookAt(0, 0, 0)
    // controls.addEventListener('change', () => {
    //     renderer.render(scene, camera)
    // })

    canvas_texture = new CanvasTexture(canvas)
    canvas_texture.colorSpace = SRGBColorSpace
    const plane = new PlaneGeometry(5, 5)
    plane.rotateX(-Math.PI / 2)
    const material = new MeshBasicMaterial({ map: canvas_texture, side: DoubleSide, transparent: true })
    canvas_texture.needsUpdate = true
    const mesh = new Mesh(plane, material)
    scene.add(mesh)
    renderer.render(scene, camera)
    let clock = new Clock()
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera)
        // mesh.rotation.y = clock.getElapsedTime()
        mesh.rotateY(-clock.getDelta())

    })
}

// Gui逻辑啊
let new_canvas: HTMLCanvasElement
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
    },
    append_new_canvas: () => {
        new_canvas = utils.drawAxes(canvas)
        canvasCon.value.appendChild(new_canvas)
        di.enable()
    },
    load_canvas: () => {
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const new_ctx = new_canvas.getContext('2d') as CanvasRenderingContext2D
        new_ctx.clearRect(0, 0, new_canvas.width, new_canvas.height)
        new_ctx.putImageData(imageData, 0, 0);
        utils.drawGrid(new_canvas)
    },
    svg: () => {
        // const canvas = document.getElementById('yourCanvasId');
        const imageDataUrl = canvas.toDataURL();

        // 构建包含图像的 SVG
        const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
            <image href="${imageDataUrl}" width="${canvas.width}" height="${canvas.height}" />
        </svg>
    `;

        // 下载 SVG 文件
        const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${window.current_pic_name}.svg`;
        link.click();
        URL.revokeObjectURL(url);
    }
}
let di: any
function create_gui() {
    const gui = new GUI()
    canvasCon.value.appendChild(gui.domElement)
    gui.title('样式')
    gui.domElement.style.position = 'relative'
    gui.domElement.style.top = '0px'
    gui.domElement.style.right = '0px'

    gui.add(params, 'append_new_canvas').name('打开调试页面')
    di = gui.add(params, 'load_canvas').name('载入内容').disable()
    // <create_gui_slot>
    gui.add(params, 'print').name('保存')
    gui.add(params, 'svg').name('导出svg')
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