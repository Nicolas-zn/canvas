<!-- canvas 十字架 -->
<script lang="ts" setup>

import { utils } from '@/utils';
import { CanvasTexture, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, SRGBColorSpace, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { onMounted, ref } from 'vue';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

let canvasCon = ref()
let canvas: HTMLCanvasElement
function draw() {
    canvas = document.createElement('canvas')
    canvas.height = 300
    canvas.width = 300
    drawStyle(params.style)
    canvasCon.value.appendChild(canvas)
}

// drawCircle
function drawCrossInCircle(ctx: CanvasRenderingContext2D) {
    // ctx.fillStyle = 'rgb(255, 255, 255,1)'; // 完全透明
    // ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 5;
    let circleRadius = canvas.width <= canvas.height ? canvas.width / 2 - ctx.lineWidth : canvas.height / 2 - ctx.lineWidth


    function drawInCross() {
        // const len = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height)
        const l1 = circleRadius * Math.cos(Math.PI / 6)
        const l1_1 = circleRadius * Math.sin(Math.PI / 6)
        const l2 = circleRadius * Math.cos(Math.PI / 3)
        const l2_2 = circleRadius * Math.sin(Math.PI / 3)
        const halfWidth = canvas.width / 2
        const halfHeight = canvas.height / 2
        // 第一象限到第三象限
        let coords = [
            [halfWidth + l1, halfHeight - l1_1],
            [halfWidth + l2, halfHeight - l2_2],
            [halfWidth - l1, halfHeight + l1_1],
            [halfWidth - l2, halfHeight + l1]
        ]
        ctx.moveTo(halfWidth + l1, halfHeight - l1_1)
        coords.map((item, index) => {
            if (index > 0) {
                ctx.lineTo(item[0], item[1])
            }
        })


        ctx.fillStyle = 'red'
        ctx.fill()
        // 第二象限到第四项
        let coords_2 = [
            [halfWidth - l1, halfHeight - l1_1],
            [halfWidth - l2, halfHeight - l2_2],
            [halfWidth + l1, halfHeight + l1_1],
            [halfWidth + l2, halfHeight + l2_2],
        ]
        ctx.moveTo(halfWidth - l1, halfHeight - l1_1)
        coords_2.map((item, index) => {
            if (index > 0) {
                ctx.lineTo(item[0], item[1])
            }
        })
        ctx.fill()
        // ctx.restore()
        ctx.fillStyle = 'blue'

    }
    drawInCross()

    // ctx.moveTo(0, 0)

    ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius, Math.PI / 3, Math.PI * 2 + Math.PI / 3)
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    ctx.stroke();
}

function drawCross(ctx: CanvasRenderingContext2D) {
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D
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
    /// ctx.save()
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
    canvas_texture.colorSpace = SRGBColorSpace
    const plane = new PlaneGeometry(10, 10)
    plane.rotateX(-Math.PI / 2)
    const material = new MeshBasicMaterial({ map: canvas_texture, side: 2, transparent: true })
    const mesh = new Mesh(plane, material)
    scene.add(mesh)
    renderer.render(scene, camera)
}
// Gui逻辑啊
let style_list = ['方形', '圆形']
let params = {
    style: '圆形',
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
    gui.add(params, 'log').name('输出此图形绘制代码(console.log())');
    gui.add(params, 'style', style_list).onChange((v) => {
        drawStyle(v)
        canvas_texture.needsUpdate = true
        renderer.render(scene, camera)
    })
}
let current_draw_fun: any
function drawStyle(style: string) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.reset()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    switch (style) {
        case "圆形":
            drawCrossInCircle(ctx)
            current_draw_fun = drawCrossInCircle

            break;
        case "方形":
            drawCross(ctx)
            current_draw_fun = drawCross
            break;
        default:
            break;
    }

}
function logCode() {

    let string = draw.toString()
    string = string.replace(`canvas = document.createElement`, `let canvas = document.createElement`);
    string = string.replace(`drawStyle(params.style)`, `${current_draw_fun.toString()}\n${current_draw_fun.name}()`);

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