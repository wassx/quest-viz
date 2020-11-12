import {
    ACESFilmicToneMapping,
    PCFSoftShadowMap,
    PerspectiveCamera,
    Scene,
    sRGBEncoding,
    WebGLRenderer, XRFrame
} from "three";
import {OrbitControls} from "./src/third-party/Three/OrbitControls";
import {VRButton} from "./src/third-party/Three/VRButton";
import {Scenery} from "./src/scenery";


export class Main {

    camera: PerspectiveCamera;
    scene: Scene;
    renderer: WebGLRenderer;
    orbitControls: OrbitControls;

    setupThree(): void {
        const container = document.getElementById('three')

        const
            fieldOfView = 75,
            aspectRatio = window.innerWidth / window.innerHeight,
            near = 0.01,
            far = 1000,
            userHeight = 1.65

        this.camera = new PerspectiveCamera(
            fieldOfView,
            aspectRatio,
            near,
            far
        )
        this.camera.position.set(0, userHeight, 6)

        this.scene = new Scene()
        this.scene.add(this.camera)

        this.renderer = new WebGLRenderer({antialias: true})
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = PCFSoftShadowMap
        this.renderer.physicallyCorrectLights = true
        this.renderer.toneMapping = ACESFilmicToneMapping
        this.renderer.outputEncoding = sRGBEncoding
        this.renderer.xr.enabled = true
        container.appendChild(VRButton.createButton(this.renderer))
        container.appendChild(this.renderer.domElement)

        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbitControls.target.set(0, userHeight, 0)
        this.orbitControls.update()

        this.renderer.setAnimationLoop(loop)

        let scenery = new Scenery(this.scene, this.camera);
        scenery.setupContent();
    }


}

let main = new Main();

const loop = (time: number, frame?: XRFrame): void => {
    main.renderer.render(main.scene, main.camera);
}

window.addEventListener('DOMContentLoaded', () => {
    main.setupThree();
});

window.addEventListener('resize', function () {

    main.camera.aspect = window.innerWidth / window.innerHeight
    main.camera.updateProjectionMatrix()
    main.renderer.setSize(window.innerWidth, window.innerHeight)
    main.orbitControls.update()

}, false);