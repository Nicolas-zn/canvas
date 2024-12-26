<!-- canvas 杜比音效 -->
<script lang="ts" setup>

import { utils } from '@/utils';
import { CanvasTexture, DoubleSide, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, SRGBColorSpace, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { onMounted, ref } from 'vue';
let canvasCon = ref()
let canvas: HTMLCanvasElement
let slotColor: string = "black"
function draw() {

    // 绘制杜比音效标志
    let radio = 0.618
    canvas ? '' : canvas = document.createElement('canvas')
    canvas.height = 512
    canvas.width = 300
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.reset()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'pink'
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
    // ctx.restore()
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

// Gui逻辑啊
let new_canvas: HTMLCanvasElement
let params = {
    log: () => {
        logCode()
    },
    style: '黑色',
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
let style_list = ['黑色', "银色"]
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
    gui.add(params, 'style', style_list).onFinishChange(v => {

        console.log(v);
        if (v == '银色') {
            slotColor = 'silver'
            draw()
        } else {
            slotColor = 'black'
            draw()
        }
        canvas_texture.needsUpdate = true
        renderer.render(scene, camera)

    })
}

function logCode() {
    let string = draw.toString()
    string = string.replace(/canvas.*/, `let canvas = document.createElement('canvas')`);
    string = string.replace(/slotColor/g, `'${slotColor}'`);
    string = string.replace(/canvasCon.value.*/, 'return canvas')
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