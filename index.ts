import 'regenerator-runtime/runtime'
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
import {Hands} from "./src/hands";
import {Handy, XRHandy} from "./src/third-party/Handy";
import {LaserCooked} from "./src/third-party/threex.laser/LaserCooked";
import {LaserBeam} from "./src/third-party/threex.laser/LaserBeam";


export class Main {

    camera: PerspectiveCamera;
    scene: Scene;
    renderer: WebGLRenderer;
    orbitControls: OrbitControls;
    laserCooked: LaserCooked;

    setupThree(): void {
        const container = document.getElementById('three')

        const fieldOfView = 75;
        const aspectRatio = window.innerWidth / window.innerHeight;
        const near = 0.01;
        const far = 1000;
        const userHeight = 1.65;

        this.camera = new PerspectiveCamera(
            fieldOfView,
            aspectRatio,
            near,
            far
        );
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
        let hands = new Hands(this.renderer, this.scene);
        hands.setupHands();

        let laserBeam = new LaserBeam();
        this.scene.add(laserBeam);
        this.laserCooked = new LaserCooked(laserBeam, this.scene);
    }


}

let main = new Main();

let timePrevious: number;

const loop = (timeNow: number, frame?: XRFrame): void => {
    // @ts-ignore
    Handy.update((hand: XRHandy) => {
        if( hand.isShape( 'fire point', 3000 )){

            if(main.laserCooked) {
                main.laserCooked.beam.matrixWorld.setPosition(hand.position);
            }

        }
    });

    main.laserCooked.update();
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
