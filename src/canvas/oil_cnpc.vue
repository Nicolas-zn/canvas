_<!-- canvas 中国石油 -->
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
    let circleRadius = (canvas.width <= canvas.height
        ? canvas.width / 2 - ctx.lineWidth
        : canvas.height / 2 - ctx.lineWidth) * 0.8;

    // 填充圆的内部
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius, 0, Math.PI * 2);
    ctx.fill()

    // 分成十份
    let angle = Math.PI * 2 / 10

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.save()
    ctx.rotate(Math.PI / 10)
    ctx.fillStyle = 'rgba(255,0,0,0.2)'
    for (let i = 0; i < 10; i++) {
        ctx.beginPath()
        // ctx.moveTo(0, 0)
        // ctx.lineTo(circleRadius * Math.cos(i * angle), circleRadius * Math.sin(i * angle))
        let little = 0
        if (i > 3) {
            little = Math.PI / 360
        }
        let center = [
            (circleRadius * Math.cos(i * angle + little) + circleRadius * Math.cos((i + 1) * angle + little)) / 2,
            (circleRadius * Math.sin(i * angle - little) + circleRadius * Math.sin((i + 1) * angle + little)) / 2,
        ]
        let cp1 = [center[0] * 1.2, center[1] * 1.2]
        let cp2 = [center[0] * 1.2, center[1] * 1.2]

        ctx.moveTo(circleRadius * Math.cos(i * angle + little), circleRadius * Math.sin(i * angle + little))
        ctx.bezierCurveTo(cp1[0], cp1[1], cp2[0], cp2[1], circleRadius * Math.cos((i + 1) * angle - little), circleRadius * Math.sin((i + 1) * angle - little))
        let c_angle = i * angle + angle / 2

        if (i < 4) {
            ctx.lineTo(0, 0)
        } else {
            ctx.lineTo(center[0] * 0.2, center[1] * 0.2)
        }

        ctx.closePath()
        if (i < 4) {
            ctx.fillStyle = 'red'
            ctx.fill()

        } else {
            ctx.fillStyle = 'orange'
            ctx.fill()
            let c = [circleRadius * Math.cos(c_angle) * 0.3, circleRadius * Math.sin(c_angle) * 0.3]
            // ctx.beginPath()
            let angle_ = Math.PI * 1.5
            if (i === 4) {
                angle_ = Math.PI * 1.4
            }
            let x = [center[0] * 0.2, center[1] * 0.2]
            ctx.beginPath()
            drawCircle(c, Math.tan(angle / 2) * 0.15 * circleRadius, angle_ + (i - 4) * Math.PI / 6, x)
        }
    }

    //ctx.restore()
    ctx.beginPath()
    ctx.moveTo(0, 0)
    let inner_radius = circleRadius * 0.7
    ctx.arc(0, 0, inner_radius, angle * 4, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,0,0.3)'
    ctx.fill()


    // 圆心
    function drawCircle(center: number[], rad: number, start: number, x: number[]) {
        ctx.fillStyle = 'white'
        ctx.moveTo(x[0], x[1])
        ctx.arc(center[0], center[1], rad, start, start + Math.PI)
        ctx.closePath()
        ctx.fill()
    }

    // ctx.restore()
    // function drawY() {
    //     ctx.moveTo(0, canvas.height / 2)
    //     ctx.lineTo(0, -canvas.height / 2)
    //     ctx.lineWidth = 1
    //     ctx.stroke()
    // }
    // drawY()
}

onMounted(() => {
    draw()
    three_logic()
    create_gui()
})


onBeforeUnmount(() => {
    renderer.dispose()
    renderer.domElement.remove()
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
</style>s