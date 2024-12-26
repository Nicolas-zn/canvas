_<!-- canvas 三菱汽车 -->
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

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 8;
    let circleRadius = canvas.width <= canvas.height
        ? canvas.width / 2 - ctx.lineWidth
        : canvas.height / 2 - ctx.lineWidth;
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.arc(0, 0, circleRadius, 0, Math.PI * 2)
    const angles = [Math.PI / 6, Math.PI / 6 * 5, Math.PI * 1.5]
    // const angles = [Math.PI / 6]
    ctx.beginPath()
    ctx.fillStyle = 'red'

    angles.forEach((angle, index) => {
        if (index == 0) ctx.moveTo(circleRadius * Math.cos(angle), circleRadius * Math.sin(angle))
        else ctx.lineTo(circleRadius * Math.cos(angle), circleRadius * Math.sin(angle))

    })

    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = 'white'
    const clip_angles = [Math.PI * 2 - Math.PI / 6, Math.PI / 2, Math.PI + Math.PI / 6]

    clip_angles.forEach((angle) => {
        const angle1 = angle - Math.PI / 6
        const angle2 = angle + Math.PI / 6

        ctx.moveTo(0, 0)
        ctx.lineTo(circleRadius * Math.cos(angle1), circleRadius * Math.sin(angle1))
        ctx.lineTo(circleRadius * Math.cos(angle2), circleRadius * Math.sin(angle2))
        ctx.closePath()
        ctx.fill()
    })

    // 设置为透明（可选）

    // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // const data = imageData.data;
    // for (let i = 0; i < data.length; i += 4) {
    //     const r = data[i];     // Red
    //     const g = data[i + 1]; // Green
    //     const b = data[i + 2]; // Blue
    //     const a = data[i + 3]; // Alpha

    //     if (r > 250 && g > 250 && b > 250 && a > 0) {
    //         // 设置为透明色
    //         data[i + 3] = 1; // Alpha = 0 (透明)
    //     }
    //     // if (r < 155) {
    //     //     data[i + 1] = data[i + 2] = 255
    //     // }
    // }
    // ctx.resetTransform()
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    // // 将修改后的数据重新绘制回 Canvas
    // ctx.putImageData(imageData, 0, 0);

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