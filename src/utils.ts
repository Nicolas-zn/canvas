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
            camera = new PerspectiveCamera(60, domElement.clientWidth / domElement.clientHeight, 1, 1000);
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
    }
}