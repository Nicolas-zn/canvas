_<!-- canvas 禁止掉头 -->
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

// drawCircle
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
    let ratio = 0.95
    ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius * ratio, Math.PI / 3, Math.PI * 2 + Math.PI / 3);
    // ctx.lineWidth = 35;
    ctx.fillStyle = "rgb(1,94,193)"
    ctx.fill();
    ctx.translate(canvas.width / 2, canvas.height / 2)
    // 绘制左转
    // let x_base = canvas.width / 2,y_base = canvas.height / 2
    ctx.fillStyle = "white"
    let rectX = 25, rectY = 50
    ctx.fillRect(rectX, -rectY, rectX * 2, 180)
    // 左转上部分
    let width = 100, height = rectX * 2
    ctx.fillRect(rectX - width, -rectY - height, width, height)
    ctx.beginPath()
    ctx.moveTo(rectX, -rectY)
    ctx.arc(rectX, -rectY, height, 0, -Math.PI / 2, true)
    ctx.fill()

    // 箭头
    function drawHead() {
        ctx.beginPath()
        // let rectX = 20, rectY = 60
        let angle = Math.PI / 4, len = 80
        const x = len / 2 * Math.cos(angle)
        const y = len / 2 * Math.sin(angle)
        let x_c = rectX - width, y_c = -rectY - height
        let sevenCoords = [
            [x_c, y_c],
            [x_c + x, y_c - y],
            [x_c + x - height, y_c - y],
            [x_c - height - x, y_c + y],
            [x_c + x - height, y_c + height + y],
            [x_c + x, y_c + height + y],
            [x_c, y_c + height],

        ]
        sevenCoords.forEach((coord, index) => {
            if (index == 0) {
                ctx.moveTo(coord[0], coord[1])
            } else {
                ctx.lineTo(coord[0], coord[1])

            }
            // ctx.fillStyle = 'black'
            // ctx.fillRect(coord[0], coord[1], 15, 15)
        })

        ctx.fill()
    }
    drawHead()
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