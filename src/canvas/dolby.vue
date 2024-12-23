<!-- canvas 杜比音效 -->
<script lang="ts" setup>

import { utils } from '@/utils';
import { CanvasTexture, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { onMounted, ref } from 'vue';
let canvasCon = ref()
let canvas: HTMLCanvasElement
function draw(slotColor: string) {

    // 绘制杜比音效标志
    let radio = 0.618
    canvas ? '' : canvas = document.createElement('canvas')
    canvas.height = 512
    canvas.width = 300
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(155,155,155,0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 上部分
    ctx.fillStyle = slotColor
    let w = canvas.width * 0.95, h = 200, rectX = (canvas.width - w) / 2, rectY = 50;
    ctx.fillRect(rectX, rectY, w, h)
    // 两个椭圆
    // 左侧白色椭圆
    ctx.fillStyle = 'white';
    ctx.fillRect(rectX + 20, rectY + 20, 40, 160)
    ctx.arc(rectX + 40 + canvas.width * 0.05 / 2 + 5, h / 2 + 50, 80, -Math.PI / 2, Math.PI / 2)
    ctx.fill()
    // ctx.closePath()
    ctx.restore()
    ctx.beginPath()
    ctx.fillRect(canvas.width - (rectX + 60), rectY + 20, 40, 160)

    ctx.arc(canvas.width - (rectX + 40 + canvas.width * 0.05 / 2 + 5), h / 2 + 50, 80, Math.PI / 2, -Math.PI / 2,)
    ctx.closePath()
    ctx.fill()

    // 下部分
    ctx.fillStyle = slotColor
    ctx.textBaseline = 'middle'
    ctx.font = "bold 80px Arial";
    ctx.textAlign = 'center'
    ctx.fillText('DOLBY', canvas.width / 2, canvas.height * radio)
    ctx.font = "80px Arial";
    ctx.fillText('AUDIO', canvas.width / 2, canvas.height * radio + 80)
    canvasCon.value.hasChildNodes() ? '' : canvasCon.value.appendChild(canvas)

}
onMounted(() => {
    draw("black")
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
    renderer.render(scene, camera)
}

// Gui逻辑啊
let params = {
    log: () => {
        logCode()
    },
    style: '黑色'
}
let style_list = ['黑色', "银色"]
function create_gui() {
    const gui = new GUI()
    canvasCon.value.appendChild(gui.domElement)
    gui.title('样式')
    gui.domElement.style.position = 'relative'
    gui.domElement.style.top = '0px'
    gui.domElement.style.right = '0px'
    gui.add(params, 'log').name('输出此图形绘制代码(console.log())')
    gui.add(params, 'style', style_list).onFinishChange(v => {
        console.log(v);
        if (v == '银色') {
            draw('silver')
        } else {
            draw('black')
        }
    })
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

.canvasCon {
    canvas {
        border: 1px black solid;
    }
}
</style>