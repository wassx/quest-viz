import {
    BufferGeometry,
    Color,
    Line,
    Scene,
    Vector3,
    WebGLRenderer,
    Group,
    Mesh, MeshBasicMaterial
} from 'three';
import {XRControllerModelFactory} from './third-party/Three/XRControllerModelFactory';
import {GLTFLoader} from "./third-party/Three/GLTFLoader";
import {XRHandModel, XRHandModelFactory} from "./third-party/Three/XRHandModelFactory";
import {ConnectedEvent, FirstShapeEvent, Handy, ShapeChangedEvent, XRHandy} from "./third-party/Handy";

export class Hands {

    constructor(readonly renderer: WebGLRenderer, readonly scene: Scene) {

    }


    //  We’re about to setup controllers, controller grips, and hands
//  from the renderer -- and also load some hand models.
//  Those aspects are based on these Three.js demos:
//  https://threejs.org/examples/webxr_vr_handinput.html
//  https://threejs.org/examples/webxr_vr_handinput_cubes.html
//  https://threejs.org/examples/webxr_vr_handinput_profiles.html

    setupHands(): void {

        let gltfLoader = new GLTFLoader();
        //  We’re about to set up HANDS,
        //  so what’s this about ‘controller0’ and controller1?
        //  You might describe this as our simplest endeavor.
        //  Just positions in 3D space
        //  and ray beams extending outward for aim.

        //  Also, it’s worth being very comfortable
        //  with ‘raw’ Array literals
        //  and with an Array’s map() function.
        //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map

        const [contoller0, controller1] = [{}, {}]
            .map((controller: Group, i) => {

                controller = this.renderer.xr.getController(i)
                controller.add(new Line(
                    new BufferGeometry().setFromPoints([

                        new Vector3(0, 0, 0),
                        new Vector3(0, 0, -5)
                    ])
                ))
                this.scene.add(controller)

                return controller
            })


        //  Now let’s get a little fancier.
        //  Instead of just positions in 3D space,
        //  these are actual controller visuals!
        // (A model will be fetched from a CDN.)
        //  https://en.wikipedia.org/wiki/Content_delivery_network

        const
            controllerModelFactory = new XRControllerModelFactory(gltfLoader),
            [controllerGrip0, controllerGrip1] = [{}, {}]
                .map((controllerGrip: Group) => {

                    controllerGrip = this.renderer.xr.getControllerGrip(0)
                    controllerGrip.add(controllerModelFactory.createControllerModel(controllerGrip))
                    this.scene.add(controllerGrip)

                    return controllerGrip
                });

        //  And here we go -- time for virtual reality hands!!
        //  These models are not hosted on a CDN,
        //  they’re included right in this code package.

        const handModelFactory = new XRHandModelFactory();
        handModelFactory.setPath('./hands/');

        const cycleHandModel = (event: FirstShapeEvent) => {
                if (!event.hand) {
                    return;
                }
                const hand = event.hand;
                console.log(
                    'Cycling the hand model for the',
                    hand.handedness.toUpperCase(),
                    'hand.'
                )
                hand.models.forEach((model: XRHandModel) => {

                    model.visible = false
                })
                hand.modelIndex = (hand.modelIndex + 1) % hand.models.length
                hand.models[hand.modelIndex].visible = true
            },
            colors = {

                default: new Color(0xFFFFFF),//  White glove.
                left: new Color(0x00FF00),//  Green glove for left.
                right: new Color(0xFF0000) //  Red glove for right.
            }


        const [hand0, hand1] = [{}, {}]
            .map((hand: XRHandy, i) => {


                //  THREE.Renderer now wraps all of this complexity
                //  so you don’t have to worry about it!
                //  getHand() returns an empty THREE.Group instance
                //  that you can immediately add to your scene.

                hand = this.renderer.xr.getHand(i) as XRHandy;
                this.scene.add(hand);

                //  So far we have an abstract model of a hand
                //  but we don’t have a VISUAL model of a hand!
                //  Let’s load four different visual models:
                //
                //      1 - A cube for each joint.
                //      2 - A sphere for each joint.
                //      3 - Low poly hand model.
                //      4 - High poly hand model.
                //
                //  Our intent is to display one at a time,
                //  allowing the user to cycle through them
                //  by making a fist.

                hand.models = [
                    handModelFactory.createHandModel(hand, 'boxes'),
                    handModelFactory.createHandModel(hand, 'spheres'),
                    handModelFactory.createHandModel(hand, 'oculus', {model: 'lowpoly'}),
                    handModelFactory.createHandModel(hand, 'oculus')
                ]
                hand.modelIndex = 0;


                //  This is what makes detecting hand shapes easy!

                // @ts-ignore
                Handy.makeHandy(hand);


                //  When hand tracking data becomes available
                //  we’ll receive this connection event.

                hand.addEventListener('connected', (event: ConnectedEvent) => {

                    // console.log( 'Hand tracking has begun!', event );

                    //  As long as the handedness never changes (ha!)
                    //  this should do us right.

                    hand.handedness = event.data.handedness;


                    //  When the hand joint data comes online
                    //  it will make ALL of the above models visible.
                    //  Let’s hide them all except for the active one.

                    hand.models.forEach((model: XRHandModel) => {

                        hand.add(model);
                        model.visible = false;
                    });
                    hand.models[hand.modelIndex].visible = true;
                });


                //  Speaking of events, here’s how easy it is
                //  to listen to our custom hand shapes.
                //  Make a fist to change hand visual style.

                hand.addEventListener('fist shape began', cycleHandModel);


                //  Let’s trigger a glove color change
                //  when we make a “peace” shape.
                //  Funny thing about peace -- most folks
                //  hold this shape like an ASL 2.
                //  But its etymology coincides with ASL V.
                //  So we’ve labeled BOTH 2 and V as “peace”.
                //  One way to account for that is to use
                //  the “shape changed” event
                //  and check shapeIs and shapeWas to confirm
                //  we’ve only just switched to a “peace” shape.

                //  This is also a useful event listener for debugging.
                //  The event.message property will display the “names” Array
                //  for both the currently detected shape and the prior one.

                hand.addEventListener('shape changed', (event: ShapeChangedEvent) => {
                    console.log( event.message )
                    if (event.resultIs.shape.names.includes('peace') &&
                        !event.resultWas.shape.names.includes('peace')) {

                        hand.checkHandedness()
                        hand.traverse((obj: Mesh) => {

                            if (obj.material) {


                                //  Note this very terse conditional operator here.
                                //  It’s made of a ‘?’ and ‘:’ and called a ternary operator:
                                //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator

                                (obj.material as MeshBasicMaterial).color = hand.isDefaultColor ?
                                    colors[hand.handedness] :
                                    colors.default
                            }
                        })
                        hand.isDefaultColor = !hand.isDefaultColor
                    }
                })


                //  We’re going to make our display frames vsible

                hand.displayFrame.visible = true


                return hand
            })
    }

}
