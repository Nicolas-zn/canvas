_<!-- canvas  监控摄像头-->
<script lang="ts" setup>

import { utils } from '@/utils';
import { CanvasTexture, DoubleSide, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, SRGBColorSpace, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
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
    ctx.fillStyle = 'white'
    // ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 10
    ctx.strokeStyle = 'red'
    ctx.roundRect(10, 10, canvas.width - 20, canvas.height - 20, [20])
    ctx.fill()
    ctx.stroke()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    let circleRadius = canvas.width <= canvas.height
        ? canvas.width / 2 - ctx.lineWidth
        : canvas.height / 2 - ctx.lineWidth;
    ctx.beginPath();
    // ctx.fillStyle = "white";
    const y = canvas.height / 2
    const x = canvas.width / 2
    ctx.arc(0, -y * 0.2, circleRadius * 0.6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();


    ctx.translate(0, -y * 0.2)

    let new_y = circleRadius * 0.6
    ctx.fillStyle = 'black'

    let height = 40
    ctx.roundRect(-x * 0.3, new_y * 0.3, 10, height, [0, 5, 5, 0])
    ctx.fill()

    let height_2 = 10, width_2 = 40
    ctx.fillRect(-x * 0.3 + height_2, new_y * 0.3 + (height - height_2) / 2, width_2, height_2)


    let radius = 10
    ctx.arc(-x * 0.3 + height_2 + width_2 + radius / 2, new_y * 0.3 + (height - height_2) / 2 + height_2 / 2, radius, 0, Math.PI * 2)
    ctx.fill()
    let height_3 = 50
    ctx.fillRect(-x * 0.3 + height_2 + width_2, new_y * 0.3 + (height - height_2) / 2 - height_3, 10, height_3)

    ctx.save();
    ctx.translate(2, 0)
    ctx.rotate(Math.PI / 8)

    ctx.roundRect(-x * 0.3 + height_2 + width_2 + 5 - width_2 / 2, new_y * 0.3 + (height - height_2) / 2 - height_3, width_2, height_2, [0, 0, 5, 5])
    ctx.fill()

    ctx.fillRect(0, 0, 10, 10)
    let top_width = new_y * 0.7, top_height = new_y * 0.5
    ctx.roundRect(-top_width, -top_height, top_width * 2, top_height - 10, [5])
    ctx.fill()

    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.moveTo(top_width + 1, -9)
    ctx.lineTo(top_width * 0.7 + 1, -9)
    ctx.lineTo(top_width + 1, -top_height)
    ctx.closePath()
    ctx.fill()

    //  随机两个两个四边形

    ctx.beginPath()
    ctx.fillStyle = 'black'

    let base = -12
    ctx.moveTo(top_width + base, -9 - 5)
    ctx.lineTo(top_width + 15 + base, -9 - 5)
    ctx.lineTo(top_width + 15 + base, -9 - 35)
    ctx.lineTo(top_width + 10 + base, -9 - 35)
    ctx.closePath()
    ctx.fill()


    ctx.beginPath()
    let base_2 = 12
    ctx.moveTo(top_width + 10 + base + base_2, -9 - 5)
    ctx.lineTo(top_width + 15 + base + base_2, -9 - 5)
    ctx.lineTo(top_width + 15 + base + base_2, -9 - 35)
    ctx.lineTo(top_width + 10 + base + base_2, -9 - 35)
    ctx.closePath()
    ctx.fill()

    ctx.resetTransform()
    ctx.fillStyle = 'red'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `bold ${canvas.width * 0.15}px Arial`;
    ctx.fillText('24小时监控', canvas.width / 2, canvas.height * 0.85)

}

onMounted(() => {
    draw()
    three_logic()
    create_gui()
})


onBeforeUnmount(() => {
    renderer.dispose()
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

    gui.add(params, 'append_new_canvas').name('打开调试页面')
    di = gui.add(params, 'load_canvas').name('载入内容').disable()
    // <create_gui_slot>
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