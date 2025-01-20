_<!-- canvas 指南针 -->
<script lang="ts" setup>

import { utils } from '@/utils';
import { CanvasTexture, DoubleSide, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, SRGBColorSpace, WebGLRenderer } from 'three';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
let canvasCon = ref(), ctx: CanvasRenderingContext2D
let canvas: HTMLCanvasElement
function draw() {
    canvas = document.createElement('canvas')
    canvas.height = 400
    canvas.width = 400
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    drawSign()
    canvasCon.value.appendChild(canvas)
}

let circleRadius: number
function drawSign() {
    ctx.lineWidth = 2;
    ctx.translate(canvas.width / 2, canvas.height / 2)
    circleRadius = canvas.width <= canvas.height
        ? canvas.width / 2 - ctx.lineWidth
        : canvas.height / 2 - ctx.lineWidth;
    let outerRadius = circleRadius * 0.8
    let innerRadius = outerRadius * 0.8
    let scale = 1
    ctx.save()
    ctx.rotate(-Math.PI / 2)
    for (let i = 0; i < 360; i = i + 2) {
        scale = 1
        if (i % 30 == 0) {
            scale = 1.1
        }
        ctx.strokeStyle = 'black'

        if (
            i == 0
        ) {
            ctx.strokeStyle = 'red'
        }

        let p1x = innerRadius * Math.cos(Math.PI * i / 180)
        let p1y = -innerRadius * Math.sin(Math.PI * i / 180)
        let p2x = outerRadius * Math.cos(Math.PI * i / 180) * scale
        let p2y = -outerRadius * Math.sin(Math.PI * i / 180) * scale
        ctx.beginPath()
        ctx.moveTo(p1x, p1y)
        ctx.lineTo(p2x, p2y)
        ctx.stroke()
    }
    ctx.restore()
    // ctx.rotate(-Math.PI / 2)

    function drawDirectionText() {
        const texts = ['东', '北', '西', '南']
        let p = circleRadius * 0.9
        let coord = [
            [p, 0],
            [0, -p],
            [-p, 0],
            [0, p],
        ]
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        for (let i = 0; i < texts.length; i++) {
            const text = texts[i];
            ctx.fillText(text, coord[i][0], coord[i][1])
        }
    }
    drawDirectionText()
}

onMounted(() => {
    draw()
    three_logic()
    create_gui()
})

let angle = ref(0)
window.addEventListener('mousemove', mouseMove)
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;
function mouseMove(event: any) {
    // 获取鼠标位置
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // 计算与屏幕中心点的差值
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;


    // 使用 Math.atan2 计算角度，结果是弧度
    let angleInRadians = Math.atan2(dy, dx);

    if (angleInRadians < 0) {
        angleInRadians = angleInRadians + Math.PI * 2
    }
    angle.value = angleInRadians
    // 将弧度转换为角度
    //  let angleInDegrees = angleInRadians * (180 / Math.PI);

    // 输出角度

}

watch(angle, () => {
    ctx.resetTransform()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawSign()
    let px = Math.cos(angle.value) * circleRadius
    let py = Math.sin(angle.value) * circleRadius
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(px, py)
    ctx.stroke()
    canvas_texture.needsUpdate = true
})
onBeforeUnmount(() => {
    renderer.dispose()
    renderer.domElement.remove()
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
    function animate() {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
    }
    animate()
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
            <div class="tip">
                显示的是鼠标相对于屏幕中心点的方向
            </div>
        </div>
        <div ref="threeCon" class="threeCon"></div>

    </div>
</template>

<style lang="scss" scoped>
.tip {
    position: fixed;
}

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