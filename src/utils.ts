import { BoxGeometry, MeshBasicMaterial, Mesh, Scene, WebGLRenderer, PMREMGenerator, AmbientLight, DirectionalLight, PerspectiveCamera, Color } from "three"
import { DRACOLoader, GLTFLoader, OrbitControls, RoomEnvironment } from "three/examples/jsm/Addons.js"
export const utils = {
    initScene: (domElement: HTMLDivElement) => {
        let scene: Scene,
            camera: PerspectiveCamera,
            renderer: WebGLRenderer,
            controls: OrbitControls;
        let init_scene = () => {
            scene = new Scene();
            scene.background = new Color("#3f3f3f")
            camera = new PerspectiveCamera(60, domElement.clientWidth / domElement.clientHeight, 0.1, 1000);
            camera.position.set(0, 5, 20);
            renderer = new WebGLRenderer({ antialias: true });
            renderer.setSize(domElement.clientWidth, domElement.clientHeight);
            domElement.appendChild(renderer.domElement);
            window.addEventListener("resize", () => {
                camera.aspect = domElement.clientWidth / domElement.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(domElement.clientWidth, domElement.clientHeight);
                renderer.render(scene, camera)
            });
            controls = new OrbitControls(camera, renderer.domElement);
            controls.update()
            let light = new DirectionalLight(0xffffff, 0.25);
            light.position.setScalar(1);
            scene.add(light, new AmbientLight(0xffffff, 0.75));
            return { scene, camera, renderer, controls }

        };
        return init_scene()
    },
    loadGLTFModel: async (url: string) => {
        const draco = new DRACOLoader()
        draco.setDecoderPath(import.meta.env.VITE_MODEL_URL + '/draco/')
        const modelLoader = new GLTFLoader()
        modelLoader.setDRACOLoader(draco)
        let model = await modelLoader.loadAsync(url)
        return model
    },
    addBox: (scene: Scene) => {
        const box = new BoxGeometry(10, 10, 10)
        const material = new MeshBasicMaterial({ color: 'green' })
        const mesh = new Mesh(box, material)
        scene.add(mesh)
    },
    setRoomEnvironment(scene: Scene, render: WebGLRenderer) {
        const pmremGenerator = new PMREMGenerator(render)
        pmremGenerator.compileEquirectangularShader();
        let environment = pmremGenerator.fromScene(new RoomEnvironment()).texture;
        scene.environment = environment
    },
    drawAxes(canvas: HTMLCanvasElement) {
        const new_canvas = document.createElement('canvas')
        new_canvas.width = canvas.width
        new_canvas.height = canvas.height
        const ctx = new_canvas.getContext('2d') as CanvasRenderingContext2D
        ctx.clearRect(0, 0, new_canvas.width, new_canvas.height);
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, new_canvas.width, new_canvas.height)

        ctx.lineWidth = 1
        for (let x = 0; x < new_canvas.width; x += 5) {
            ctx.beginPath();
            ctx.moveTo(x, 0)
            ctx.lineTo(x, canvas.height)
            ctx.stroke()
        }
        for (let y = 0; y < new_canvas.height; y += 5) {
            ctx.beginPath();
            ctx.moveTo(0, y)
            ctx.lineTo(canvas.width, y)
            ctx.stroke()
        }
        function event() {
            if (new_canvas.height * 2 > window.innerHeight) {
                new_canvas.style.position = 'absolute'
                new_canvas.style.top = '0px'
                console.log(0.1 * window.innerWidth);
                console.log();

                new_canvas.style.left = `${canvas.width + 0.05 * window.innerWidth}px`
            }
        }
        event()
        // 鼠标移动事件
        const tooltip = document.createElement('div');
        tooltip.style.position = 'absolute'
        tooltip.style.display = 'none'
        tooltip.style.background = 'white'
        tooltip.style.padding = '5px'
        tooltip.style.color = 'black'
        document.body.appendChild(tooltip)
        new_canvas.addEventListener('mousemove', (event) => {
            console.log(event);

            const rect = new_canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            // 转换为坐标系中的坐标
            const coordX = Math.round(mouseX - new_canvas.width / 2);
            const coordY = Math.round(new_canvas.height / 2 - mouseY);

            // 显示提示框
            tooltip.style.left = `${event.clientX + 10}px`;
            tooltip.style.top = `${event.clientY + 10}px`;
            tooltip.style.display = 'block';
            tooltip.textContent = `X: ${coordX}, Y: ${coordY}`;
        });

        // 鼠标离开时隐藏提示框
        new_canvas.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
        return new_canvas
    },
    drawGrid(new_canvas: HTMLCanvasElement) {
        const ctx = new_canvas.getContext('2d') as CanvasRenderingContext2D
        for (let x = 0; x < new_canvas.width; x += 5) {
            ctx.beginPath();
            ctx.moveTo(x, 0)
            ctx.lineTo(x, new_canvas.height)
            ctx.stroke()
        }
        for (let y = 0; y < new_canvas.height; y += 5) {
            ctx.beginPath();
            ctx.moveTo(0, y)
            ctx.lineTo(new_canvas.width, y)
            ctx.stroke()
        }

    }
}