_<!-- canvas 道路指示牌 -->
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
    canvas.height = 450
    canvas.width = 700
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    drawSign(ctx)
    canvasCon.value.appendChild(canvas)
}

// drawCircle
function drawSign(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5

    let parts = 5
    ctx.fillStyle = "rgb(1,94,193)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.moveTo(10, 10)
    ctx.lineTo(10, canvas.height - 10)
    ctx.lineTo(canvas.width - 10, canvas.height - 10)
    ctx.lineTo(canvas.width - 10, 10)
    ctx.closePath()
    ctx.strokeStyle = 'white'
    ctx.stroke()
    let startX = 20
    let offset = (canvas.width - (startX * 2 + 10)) / parts

    ctx.fillStyle = "white"
    ctx.lineWidth = 3

    for (let i = 0; i <= parts; i++) {

        ctx.resetTransform()
        if (i == 0 || i == parts) {
            ctx.beginPath()
            ctx.setLineDash([]);
            ctx.fillRect(startX + offset * i, 20, 5, canvas.height - 45)
            ctx.closePath()
        } else {
            ctx.beginPath()
            ctx.setLineDash([15, 5]);
            ctx.moveTo(startX + offset * i, 15);
            ctx.lineTo(startX + offset * i, canvas.height - 20)
            ctx.stroke()
        }
        if (i >= 1 && i <= 3) {
            draw_arrow_content(startX + offset * i)
        }
        if (i == 0) {
            draw_turn_left(startX + offset * i)

        }

        if (i == 4) {
            draw_turn_left(startX + offset * i, true)

        }
    }

    // 绘制箭头
    function draw_arrow_content(left_corner_x: number) {
        const temp_center = [left_corner_x + offset / 2, canvas.height / 2]

        ctx.translate(temp_center[0], temp_center[1])
        let rectX = 15, rectY = 50
        ctx.fillRect(-rectX, -rectY, rectX * 2, canvas.height / 2);
        let angle = Math.PI / 4, len = 60, height = 30 // 45度角
        let fiveCoords = [
            [0, -rectY],
            [0, -(rectY + len / 2 * Math.sin(angle) + height)],
            [-(len * Math.cos(angle)), -(rectY + len / 2 * Math.sin(angle) + height - len * Math.sin(angle))],
            [-(len * Math.cos(angle)), -(rectY + len / 2 * Math.sin(angle) - len * Math.sin(angle))],
            [-rectX, -rectY]
        ]

        fiveCoords.forEach((item, index) => {
            if (index == 0) {
                ctx.beginPath()
                ctx.moveTo(item[0], item[1])
            } else {
                ctx.lineTo(item[0], item[1])
            }
        })
        ctx.closePath()
        ctx.fill()

        let fiveCoords_r = [
            [0, -rectY],
            [0, -(rectY + len / 2 * Math.sin(angle) + height)],
            [len * Math.cos(angle), -(rectY + len / 2 * Math.sin(angle) + height - len * Math.sin(angle))],
            [len * Math.cos(angle), -(rectY + len / 2 * Math.sin(angle) - len * Math.sin(angle))],
            [rectX, -rectY]
        ]

        fiveCoords_r.forEach((item, index) => {
            if (index == 0) {
                ctx.beginPath()
                ctx.moveTo(item[0], item[1])
            } else {

                ctx.lineTo(item[0], item[1])
            }
        })
        ctx.fill()

    }


    function draw_turn_left(left_corner_x: number, rotate = false) {

        // ctx.setLineDash([]);
        const temp_center = [left_corner_x + offset / 2, canvas.height / 2]
        ctx.translate(temp_center[0], temp_center[1])
        if (rotate) {
            ctx.scale(-1, 1)
        }
        // ctx.fillStyle = 'black'
        // ctx.fillRect(temp_center[0], temp_center[1], 10, 10)
        // ctx.fill()
        // return
        // ctx.fillRect(temp_center[0], canvas.height / 2, 10, 10)
        let rectX = 15, rectY = 50
        ctx.fillRect(rectX, -rectY, rectX * 2, canvas.height / 2)
        let width = 30, height = rectX * 2
        ctx.fillRect(rectX - width, -rectY - height, width, height)
        ctx.beginPath()
        ctx.moveTo(rectX, -rectY)
        ctx.arc(rectX, -rectY, height, 0, -Math.PI / 2, true)
        ctx.fill()
        // 箭头
        function drawHead() {
            ctx.beginPath()
            // let rectX = 20, rectY = 60
            let angle = Math.PI / 4, len = 40
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
    const plane = new PlaneGeometry(6, 4.5)
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
        link.download = 'high-quality-image.png';
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