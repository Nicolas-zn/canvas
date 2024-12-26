_<!-- canvas 禁止通行 -->
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
    let radius = canvas.width <= canvas.height
        ? canvas.width - ctx.lineWidth
        : canvas.height - ctx.lineWidth;

    // 填充圆的内部
    ctx.fillStyle = 'rgb(148,158,174)'

    ctx.roundRect(0, 0, radius * 0.8, radius * 0.8, [radius * 0.25])
    ctx.fill()


    ctx.beginPath()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.fillStyle = 'black'

    // ctx.fillRect(0, -100, 20, 100)

    // ctx.fill()


    const total_w = canvas.width * 0.6, offset = total_w / 9

    const startX = canvas.height / 2 * 0.5
    // ctx.beginPath()
    //  ctx.fillStyle = 'black'

    let h_arr = [100, 55, 80, 100]
    let ii = 0
    for (let i = 0; i < 7; i++) {
        if (i % 2 == 0) {
            ctx.fillRect(-startX + (i - 1) * offset, -100 + (100 - h_arr[ii]), 20, h_arr[ii]);


            ii = ii + 1
        }
        if (i == 0) {
            ctx.fillRect(-startX + (i - 1) * offset, -100, 110, 20);

        }

        if (i == 4) {
            ctx.moveTo(-startX + (i - 1) * offset, -100 + (100 - h_arr[ii]) + 20)
            ctx.arc(-startX + (i - 1) * offset, -100 + (100 - h_arr[ii]) + 20, 20, 0, -Math.PI / 2, true)
            ctx.fill()
        }

    }

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