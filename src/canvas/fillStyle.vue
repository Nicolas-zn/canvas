<!-- canvas 绘制文字 -->
<script lang="ts" setup>

import { utils } from '@/utils';
import { CanvasTexture, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import { onMounted, ref } from 'vue';
let canvasCon = ref()
function draw() {
    const canvas = document.createElement('canvas')
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
    // ctx.fillText("nico's space", canvas.width / 2, canvas.height / 2)

    return canvas
}
onMounted(() => {
    draw()
    three_logic()
})

// 3d逻辑
let threeCon = ref()
function three_logic() {
    let domElement = threeCon.value as HTMLDivElement
    let { scene, camera, renderer, controls } = utils.initScene(domElement)
    camera.position.set(0, 10, 0)
    camera.lookAt(0, 0, 0)
    controls.addEventListener('change', () => {
        renderer.render(scene, camera)
    })

    // 停车位
    const canvas = draw()
    canvasCon.value.appendChild(canvas)


    const canvas_texture = new CanvasTexture(canvas)
    const plane = new PlaneGeometry(2.7, 5, 5)
    plane.rotateX(-Math.PI / 2)
    const material = new MeshBasicMaterial({ map: canvas_texture, side: DoubleSide })
    const mesh = new Mesh(plane, material)
    scene.add(mesh)
    renderer.render(scene, camera)

}
</script>
<template>
    <div class="container">
        <div ref="canvasCon" class="canvasCon"></div>
        <div ref="threeCon" class="threeCon"></div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    height: 100%;
    width: 100%;
    display: flex;

    >div {
        width: 50%;
        height: 100%;
    }
}
</style>