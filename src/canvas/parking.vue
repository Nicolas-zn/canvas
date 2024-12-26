<!-- canvas 绘制文字 -->
<script lang="ts" setup>

import { utils } from '@/utils';
import { CanvasTexture, DoubleSide, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, SRGBColorSpace, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI, { FunctionController } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { onMounted, ref } from 'vue';
let canvasCon = ref()
let canvas: HTMLCanvasElement
function draw() {
    canvas = document.createElement('canvas')
    canvas.height = 512
    canvas.width = 300
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.fillStyle = 'blue'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'red'
    ctx.font = "bold 80px Arial";
    ctx.textAlign = 'center'
    let text = "停车位"
    for (let i = 0; i < text.length; i++) {
        ctx.fillText(text[i], canvas.width / 2, i * 150 + canvas.height / 5)
    }
    canvasCon.value.appendChild(canvas)

}

// 
// function drawAxes(canvas: HTMLCanvasElement) {
//     const new_canvas = document.createElement('canvas')
//     new_canvas.width = canvas.width
//     new_canvas.height = canvas.height
//     const ctx = new_canvas.getContext('2d') as CanvasRenderingContext2D
//     ctx.clearRect(0, 0, new_canvas.width, new_canvas.height);
//     ctx.fillStyle = 'white'
//     ctx.fillRect(0, 0, new_canvas.width, new_canvas.height)

//     ctx.lineWidth = 1
//     for (let x = 0; x < new_canvas.width; x += 5) {
//         ctx.beginPath();
//         ctx.moveTo(x, 0)
//         ctx.lineTo(x, canvas.height)
//         ctx.stroke()
//     }
//     for (let y = 0; y < new_canvas.height; y += 5) {
//         ctx.beginPath();
//         ctx.moveTo(0, y)
//         ctx.lineTo(canvas.width, y)
//         ctx.stroke()
//     }
//     return new_canvas
// }
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
    const plane = new PlaneGeometry(2.7, 5, 5)
    plane.rotateX(-Math.PI / 2)
    const material = new MeshBasicMaterial({ map: canvas_texture, side: DoubleSide, transparent: true })
    canvas_texture.needsUpdate = true
    const mesh = new Mesh(plane, material)
    scene.add(mesh)
    renderer.render(scene, camera)

}

let style_list = ['样式1', '样式2']
let new_canvas: HTMLCanvasElement
let params = {
    style: '样式1',
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
let di: FunctionController<{ style: string; append_new_canvas: () => void; load_canvas: () => void; }, "load_canvas">
function create_gui() {
    let gui = new GUI()
    canvasCon.value.appendChild(gui.domElement)
    gui.title('样式')
    gui.domElement.style.position = 'relative'
    gui.domElement.style.top = '0px'
    gui.domElement.style.right = '0px'
    gui.add(params, 'style', [...style_list]).onChange((st) => {
        change_canvas(st)
    })
    gui.add(params, 'append_new_canvas').name('打开调试页面')
    di = gui.add(params, 'load_canvas').name('载入内容').disable()
}

// 样式更改
function change_canvas(style: string) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.fillStyle = 'rgb(255, 255, 255,0)'; // 完全透明
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    let text
    switch (style) {
        case '样式1':
            ctx.fillStyle = 'blue'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.textBaseline = 'middle'
            ctx.fillStyle = 'red'
            ctx.font = "bold 80px Arial";
            ctx.textAlign = 'center'
            text = "停车位"
            for (let i = 0; i < text.length; i++) {
                ctx.fillText(text[i], canvas.width / 2, i * 150 + canvas.height / 5)
            }
            break;
        case '样式2':
            ctx.fillStyle = 'pink'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.clearRect(10, 10, canvas.width - 20, canvas.height - 20)
            ctx.textBaseline = 'middle'
            ctx.fillStyle = 'red'
            ctx.font = "bold 80px Arial";
            ctx.textAlign = 'center'
            text = "停车位"
            for (let i = 0; i < text.length; i++) {
                ctx.fillText(text[i], canvas.width / 2, i * 150 + canvas.height / 5)
            }
            break
        default:
            console.log('没有这个样式');
            break;
    }

    canvas_texture.needsUpdate = true
    renderer.render(scene, camera)
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