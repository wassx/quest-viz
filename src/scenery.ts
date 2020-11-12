import {
    AmbientLight, CircleBufferGeometry,
    CubeTextureLoader,
    DirectionalLight, Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    Scene,
} from "three";

export class Scenery {

    constructor(readonly scene: Scene, readonly camera: PerspectiveCamera) {
        this.setupContent();
    }

    setupContent() {

        //  Milky Way galaxy background.
        //  These texture are included this Three VR demo:
        //  https://threejs.org/examples/#webxr_vr_sandbox
        //  https://threejs.org/docs/#api/en/loaders/CubeTextureLoader
        //  Note that CubeTextureLoader is a form of Loader:
        //  https://threejs.org/docs/#api/en/loaders/Loader

        const background = new CubeTextureLoader()
            .setPath('media/milkyway/')
            .load([

                'dark-s_px.jpg',
                'dark-s_nx.jpg',
                'dark-s_py.jpg',
                'dark-s_ny.jpg',
                'dark-s_pz.jpg',
                'dark-s_nz.jpg'
            ])


        //  Now we can set the Milky Way as our scene’s background.

        this.scene.background = background


        //  Let’s create a circular platform to “stand” on in space.
        //  To create a 3D “thing” we must create a “Mesh”:
        //  https://threejs.org/docs/#api/en/objects/Mesh

        const platform = new Mesh(
            //  Every Mesh needs geometry; a collection of 3D points to use.
            //  For this platform we’ll use some pre-defined geometry
            //  that describes a circle:
            //  https://threejs.org/docs/#api/en/geometries/CircleBufferGeometry

            new CircleBufferGeometry(4, 12),


            //  For this Mesh we’ll use the “MeshStandardMaterial”.
            //  https://threejs.org/docs/#api/en/materials/MeshStandardMaterial
            //  This Material uses “Physically based rendering” (PBR).
            //  https://en.wikipedia.org/wiki/Physically_based_rendering

            new MeshStandardMaterial({

                color: 0xFFEECC,
                roughness: 0.2,
                metalness: 1.0,
                envMapIntensity: 1.0,
                transparent: true,
                opacity: 1
            })
        )


        //  In Three.js all flat 2D shapes are drawn vertically.
        //  This means that for any 2D shape
        //  that we’d like to use as a floor,
        //  we  must rotate it 90 degrees (π ÷ 2 radians)
        //  so that it is horizontal rather than vertical.
        //  Here, we’ll rotate negatively (π ÷ -2 radians)
        //  so the visible surface ends up on top.

        platform.rotation.x = Math.PI / -2


        //  By default meshes do not receive shadows.
        // (This keeps rendering speedy!)
        //  So we must turn on shadow reception manually.

        platform.receiveShadow = true


        //  And we want our platform to actually exist in our world
        //  so we must add it to our scene.

        this.scene.add(platform)


        //  Environment map.
        //  https://threejs.org/examples/webgl_materials_envmaps_exr.html
        /*
        const pmremGenerator = new THREE.PMREMGenerator( renderer )
        pmremGenerator.compileCubemapShader()
        THREE.DefaultLoadingManager.onLoad = function(){

            pmremGenerator.dispose()
        }
        let cubeRenderTarget
        new THREE.CubeTextureLoader()
        .setPath( 'media/milkyway/' )
        .load([

            'dark-s_px.jpg',
            'dark-s_nx.jpg',
            'dark-s_py.jpg',
            'dark-s_ny.jpg',
            'dark-s_pz.jpg',
            'dark-s_nz.jpg'

        ], function( texture ){

            texture.encoding = THREE.sRGBEncoding
            const cubeRenderTarget = pmremGenerator.fromCubemap( texture )
            platform.material.envMap = cubeRenderTarget.texture
            platform.material.needsUpdate = true
            texture.dispose()
        })
        */

        //  Let there by light.
        //  Directional lights create parallel light rays.
        //  https://threejs.org/docs/#api/en/lights/DirectionalLight

        const light = new DirectionalLight(0xFFFFFF)
        light.position.set(-2, 4, 0)
        light.castShadow = true
        light.shadow.camera.top = 4
        light.shadow.camera.bottom = -4
        light.shadow.camera.right = 4
        light.shadow.camera.left = -4
        light.shadow.mapSize.set(2048, 2048)
        this.scene.add(light)
        this.scene.add(new AmbientLight(0x888888))


    }

}