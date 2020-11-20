import {LaserBeam} from "./LaserBeam";
import {
    AdditiveBlending,
    Intersection,
    PointLight,
    Raycaster, Scene,
    Sprite,
    SpriteMaterial,
    TextureLoader,
    Vector3
} from "three";

export class LaserCooked {

    light: PointLight;
    lastIntersects: Intersection[] = [];
    raycaster: Raycaster;

    constructor(readonly beam: LaserBeam, readonly scene: Scene) {
        this.buildSprite();

        this.raycaster = new Raycaster();
        this.raycaster.ray.origin.copy(this.beam.position);
    }

    buildSprite() {
        const textureUrl = './images/blue_particle.jpg';
        const texture = new TextureLoader().load(textureUrl);
        const material = new SpriteMaterial({
            map: texture,
            blending: AdditiveBlending,
        });
        const sprite = new Sprite(material);
        sprite.scale.x = 0.5;
        sprite.scale.y = 2;

        sprite.position.x = 1 - 0.01;
        this.beam.add(sprite);
        this.createLight(sprite);
    }

    createLight(sprite: Sprite) {
        const light = new PointLight(0x4444ff);
        light.intensity = 0.5;
        light.distance = 4;
        light.position.x = -0.05;
        this.light = light;
        sprite.add(light);
    }

    update() {
        // get laserBeam matrixWorld
        this.beam.updateMatrixWorld();
        const matrixWorld = this.beam.matrixWorld.clone()
        // set the origin
        this.raycaster.ray.origin.setFromMatrixPosition(matrixWorld)
        // keep only the rotation
        matrixWorld.setPosition(new Vector3(0, 0, 0))
        // set the direction
        this.raycaster.ray.direction.set(1, 0, 0)
            .applyMatrix4(matrixWorld)
            .normalize()

        const intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            const position = intersects[0].point;
            this.beam.scale.x = position.distanceTo(this.raycaster.ray.origin)
        } else {
            this.beam.scale.x = 10
        }
        // backup last intersects
        this.lastIntersects = intersects
    }

}
