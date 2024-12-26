_<!-- canvas 禁止直行 -->
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

    let ratio = 0.88
    ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius * ratio, Math.PI / 3, Math.PI * 2 + Math.PI / 3);
    ctx.lineWidth = 35;

    ctx.strokeStyle = 'red'
    ctx.stroke();

    ctx.translate(canvas.width / 2, canvas.height / 2)

    // 绘制斜线
    const line_angle = Math.PI / 3
    ctx.beginPath()
    let line_radius = circleRadius * 0.9
    ctx.moveTo(line_radius * Math.sin(line_angle), line_radius * Math.cos(line_angle))
    ctx.lineTo(line_radius * Math.sin(line_angle + Math.PI), line_radius * Math.cos(line_angle + Math.PI))
    ctx.lineWidth = 25
    ctx.strokeStyle = 'red'
    ctx.stroke()
    // 绘制直行箭头
    ctx.fillStyle = 'black'

    let rectX = 20, rectY = 60
    ctx.fillRect(-rectX, -rectY, rectX * 2, 160)

    let angle = Math.PI / 4, len = 80, height = 40 // 45度角
    let fiveCoords = [
        [0, -rectY],
        [0, -(rectY + len / 2 * Math.sin(angle) + height)],
        [-(len * Math.cos(angle)), -(rectY + len / 2 * Math.sin(angle) + height - len * Math.sin(angle))],
        [-(len * Math.cos(angle)), -(rectY + len / 2 * Math.sin(angle) - len * Math.sin(angle))],
        [-rectX, -rectY]
    ]

    fiveCoords.forEach((item, index) => {
        if (index == 0) {
            ctx.beginPath()
            ctx.moveTo(item[0], item[1])
        } else {

            ctx.lineTo(item[0], item[1])
        }
    })
    ctx.fill()

    let fiveCoords_r = [
        [0, -rectY],
        [0, -(rectY + len / 2 * Math.sin(angle) + height)],
        [len * Math.cos(angle), -(rectY + len / 2 * Math.sin(angle) + height - len * Math.sin(angle))],
        [len * Math.cos(angle), -(rectY + len / 2 * Math.sin(angle) - len * Math.sin(angle))],
        [rectX, -rectY]
    ]

    fiveCoords_r.forEach((item, index) => {
        if (index == 0) {
            ctx.beginPath()
            ctx.moveTo(item[0], item[1])
        } else {

            ctx.lineTo(item[0], item[1])
        }
    })
    ctx.fill()



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