import {AdditiveBlending, DoubleSide, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Texture} from "three";

export class LaserBeam extends Object3D {
    constructor() {
        super();
        const canvas = this.generateLaserBodyCanvas()
        const texture = new Texture(canvas);
        texture.needsUpdate = true;
        // do the material
        const material = new MeshBasicMaterial({
            map: texture,
            blending: AdditiveBlending,
            color: 0x4444aa,
            side: DoubleSide,
            depthWrite: false,
            transparent: true
        })
        const geometry = new PlaneGeometry(1, 0.1)
        const nPlanes = 16;
        for (let i = 0; i < nPlanes; i++) {
            const mesh = new Mesh(geometry, material)
            mesh.position.x = 1 / 2
            mesh.rotation.x = i / nPlanes * Math.PI
            this.add(mesh)
        }
    }


    generateLaserBodyCanvas(): HTMLCanvasElement {
        // init canvas
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const context: CanvasRenderingContext2D = canvas.getContext('2d');
        canvas.width = 1;
        canvas.height = 64;
        // set gradient
        const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(  0,  0,  0,0.1)');
        gradient.addColorStop(0.1, 'rgba(160,160,160,0.3)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(0.9, 'rgba(160,160,160,0.3)');
        gradient.addColorStop(1.0, 'rgba(  0,  0,  0,0.1)');
        // fill the rectangle
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        // return the just built canvas
        return canvas;
    }

}
