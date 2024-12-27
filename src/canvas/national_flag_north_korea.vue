_<!-- canvas 朝鲜国旗 -->
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
    canvas.height = 300
    canvas.width = canvas.height * 2
    canvas.style.border = 'solid 1px black'
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    drawSign(ctx)
    canvasCon.value.appendChild(canvas)
}


function drawSign(ctx: CanvasRenderingContext2D) {

    const H = canvas.height; // 国旗高度
    const W = 2 * H; // 国旗宽度

    const blueHeight = H / 6; // 蓝色条带高度
    const whiteHeight = H / 24; // 白色分隔线高度
    const redHeight = H - 2 * (blueHeight + whiteHeight); // 红色条带高度

    const circleDiameter = (2 / 5) * H; // 白色圆直径
    const starDiameter = (3 / 5) * circleDiameter; // 五角星外圆直径

    // 绘制蓝色条带
    ctx.fillStyle = "#024FA2";
    ctx.fillRect(0, 0, W, blueHeight);
    ctx.fillRect(0, H - blueHeight, W, blueHeight);

    // 绘制白色分隔线
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, blueHeight, W, whiteHeight);
    ctx.fillRect(0, H - blueHeight - whiteHeight, W, whiteHeight);

    // 绘制红色条带
    ctx.fillStyle = "#ED1C27";
    ctx.fillRect(0, blueHeight + whiteHeight, W, redHeight);

    // 绘制白色圆
    ctx.beginPath();
    const circleX = W / 4;
    const circleY = H / 2;
    const circleRadius = circleDiameter / 2;
    ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    // 绘制红色五角星
    function drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, fillColor: string | CanvasGradient | CanvasPattern) {
        const step = Math.PI / spikes;
        let rotation = -Math.PI / 2;
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = cx + radius * Math.cos(rotation);
            const y = cy + radius * Math.sin(rotation);
            ctx.lineTo(x, y);
            rotation += step;
        }
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    const starOuterRadius = starDiameter * 0.9;
    const starInnerRadius = starOuterRadius * 0.382; // 内圈半径近似黄金比例
    drawStar(circleX, circleY, 5, starOuterRadius, starInnerRadius, "#ED1C27");
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