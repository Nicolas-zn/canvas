_<!-- canvas 大众车标 -->
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


// function drawSign(ctx: CanvasRenderingContext2D) {
//     ctx.lineWidth = 15;
//     let circleRadius = canvas.width <= canvas.height
//         ? canvas.width / 2 - ctx.lineWidth
//         : canvas.height / 2 - ctx.lineWidth;
//     // 填充圆的内部
//     ctx.translate(canvas.width / 2, canvas.height / 2)
//     // 上V
//     let len_y = 6, len_x = 40

//     let base_coords = [
//         [-len_x / 2, -len_y], [len_x / 2, -len_y],
//     ]
//     let base_coords_2 = [
//         [-len_x / 2, len_y], [len_x / 2, len_y],
//     ]


//     ctx.beginPath()
//     let radio = 1
//     let angles = [Math.PI / 3 * 2, Math.PI / 3, Math.PI / 3 + Math.PI, Math.PI / 3 * 2 + Math.PI]
//     angles.forEach((angle, index) => {
//         let coords = base_coords

//         if (index > 1) {
//             coords = base_coords_2
//             radio = 0.8
//         }
//         let base = coords[0]
//         let base_2 = coords[1]
//         ctx.moveTo(base[0], base[1])
//         ctx.lineTo(base_2[0], base_2[1])
//         let c = [Math.cos(angle) * circleRadius * radio, -Math.sin(angle) * circleRadius * radio]
//         let angle2 = Math.PI / 2 - (Math.PI - angle)
//         let c2 = [c[0] - len_x / 2 * Math.cos(angle2), c[1] + len_x / 2 * Math.sin(angle2)]
//         let c1 = [c[0] + len_x / 2 * Math.cos(angle2), c[1] - len_x / 2 * Math.sin(angle2)]
//         if (index <= 1) {
//             ctx.lineTo(c1[0], c1[1])
//             ctx.lineTo(c2[0], c2[1]);
//         } else {
//             ctx.lineTo(c2[0], c2[1]);
//             ctx.lineTo(c1[0], c1[1])

//         }

//         ctx.closePath
//         ctx.fill()
//     })

//     ctx.restore()

//     // w双臂
//     let v = [Math.PI / 3 + Math.PI, Math.PI / 3 * 2 + Math.PI]
//     let lr_angles = [-Math.PI + Math.PI / 6, -Math.PI / 6]
//     ctx.fillStyle = 'red'

//     v.forEach((angle, index) => {
//         let x = circleRadius * radio * Math.cos(angle)
//         let y = -circleRadius * radio * Math.sin(angle)
//         let x1 = circleRadius * Math.cos(lr_angles[index])
//         let y1 = circleRadius * Math.sin(lr_angles[index])

//         // ctx.moveTo(x, y)
//         // ctx.moveTo(x1, y1)
//         // ctx.
//         ctx.fillRect(x, y, 15, 15)
//         ctx.fillRect(x1, y1, 15, 15)
//     })

//     // 外界圆
//     ctx.beginPath()
//     ctx.arc(0, 0, circleRadius, 0, Math.PI * 2)
//     ctx.stroke()
// }
function drawSign(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 30;
    let circleRadius = canvas.width <= canvas.height
        ? canvas.width / 2 - ctx.lineWidth
        : canvas.height / 2 - ctx.lineWidth;
    // 填充圆的内部
    ctx.translate(canvas.width / 2, canvas.height / 2)
    // 上V
    let len_y = 10

    let base_coords =
        [0, -len_y]

    let base_coords_2 = [0, len_y + 10]
    // ctx.fillStyle = 'red'
    // ctx.fillRect(0, -len_y, 15, 16)

    let xb = ctx.lineWidth
    let xx = Math.sqrt(xb * xb - len_y * len_y)

    console.log(xx);


    ctx.beginPath()
    ctx.moveTo(-xx / 2 + 1, -1)
    ctx.lineTo(xx / 2 - 1, -1)
    ctx.lineTo(0, -len_y - 10)
    ctx.fillStyle = 'black'

    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(-xx / 2 + 1, 1 + 11)
    ctx.lineTo(xx / 2 - 1, 1 + 11)
    ctx.lineTo(0, len_y + + 10)
    ctx.fillStyle = 'black'

    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    let radio = 1
    // let angles = [Math.PI / 3 * 2]
    let angles = [Math.PI / 3 * 2, Math.PI / 3, Math.PI / 3 + Math.PI, Math.PI / 3 * 2 + Math.PI]
    angles.forEach((angle, index) => {
        let coords = base_coords

        if (index > 1) {
            coords = base_coords_2
        }
        ctx.moveTo(coords[0], coords[1])
        let c = [Math.cos(angle) * circleRadius * radio, -Math.sin(angle) * circleRadius * radio]
        ctx.lineTo(c[0], c[1])
        ctx.stroke()
    })

    // w双臂
    let v = [Math.PI / 3 + Math.PI, Math.PI / 3 * 2 + Math.PI]
    let lr_angles = [-Math.PI + Math.PI / 6, -Math.PI / 6]
    ctx.fillStyle = 'red'

    v.forEach((angle, index) => {
        let x = circleRadius * radio * Math.cos(angle)
        let y = -circleRadius * radio * Math.sin(angle)
        let x1 = circleRadius * Math.cos(lr_angles[index])
        let y1 = circleRadius * Math.sin(lr_angles[index])

        ctx.moveTo(x, y)
        ctx.lineTo(x1, y1)
        ctx.stroke()
    })

    // 外界圆
    ctx.beginPath()
    ctx.arc(0, 0, circleRadius, 0, Math.PI * 2)
    ctx.stroke()
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
</style>