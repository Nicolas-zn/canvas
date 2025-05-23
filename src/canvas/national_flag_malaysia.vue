_<!-- canvas america(usa)国旗 -->
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
    canvas.height = 300
    canvas.width = canvas.height * 1.9
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    drawSign(ctx)
    canvasCon.value.appendChild(canvas)
}


function drawSign(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 8;


    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //条
    ctx.fillStyle = 'red'
    let offset = canvas.height / 13
    for (let i = 0; i < 13; i++) {
        if (i % 2 == 0) {
            ctx.fillRect(0, 0 + offset * i, canvas.width, offset)
        }

    }


    let blue_h = canvas.height * 7 / 13, blue_w = canvas.height

    ctx.fillStyle = 'rgb(10,49,97)'
    ctx.fillRect(0, 0, blue_w, blue_h)
    ctx.fill()

    // 绘制月亮
    ctx.fillStyle = 'yellow'
    // 绘制月亮
    const centerX = blue_w * 0.4;
    const centerY = blue_h / 2;
    const outerRadius = blue_h * 0.4;
    const innerRadius = outerRadius * 0.8;

    // 外圆
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = 'yellow';
    ctx.fill();

    // 内圆
    ctx.fillStyle = 'rgb(10,49,97)'

    // ctx.globalCompositeOperation = 'destination-out'; // 切除部分
    ctx.beginPath();
    ctx.arc(centerX + 15, centerY, outerRadius * 0.95, 0, Math.PI * 2, false);
    ctx.fill();
    // ctx.globalCompositeOperation = 'source-over';

    const starRadiusOuter = outerRadius * 0.5;
    const starRadiusInner = starRadiusOuter * 0.5;
    const starCenterX = centerX + outerRadius * 0.4;
    const starCenterY = centerY;

    ctx.beginPath();
    for (let i = 0; i < 14; i++) {
        const angle = (Math.PI * 2 / 14) * i;
        const outerX = starCenterX + Math.cos(angle) * starRadiusOuter;
        const outerY = starCenterY + Math.sin(angle) * starRadiusOuter;

        const innerAngle = angle + Math.PI / 14;
        const innerX = starCenterX + Math.cos(innerAngle) * starRadiusInner;
        const innerY = starCenterY + Math.sin(innerAngle) * starRadiusInner;

        if (i === 0) {
            ctx.moveTo(outerX, outerY);
        } else {
            ctx.lineTo(outerX, outerY);
        }
        ctx.lineTo(innerX, innerY);
    }
    ctx.closePath();
    ctx.fillStyle = 'yellow';
    ctx.fill();
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
    camera.position.set(0, canvas.width / 10 * 1.5, 0)
    camera.lookAt(0, 0, 0)
    controls.addEventListener('change', () => {
        renderer.render(scene, camera)
    })


    canvas_texture = new CanvasTexture(canvas)
    canvas_texture.colorSpace = SRGBColorSpace
    const plane = new PlaneGeometry(canvas.width / 10, canvas.height / 10, canvas.width, canvas.height)
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