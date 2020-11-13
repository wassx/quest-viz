declare module 'handyjs' {

    import {Group, Object3D} from "three";

    export class XRHandModelFactory {

        constructor();

        XRHandModelFactory(): XRHandModelFactory;

        setPath(path: string): XRHandModelFactory;

        createHandModel(controller: XRHandy, profile: string, options?): XRHandModel;
    }

    export class XRHandModel extends Object3D {
        constructor(controller: Group);

        updateMatrixWorld(force: boolean): void;

    }

    export interface XRHandy extends Group {
        models: XRHandModel[],
        modelIndex: number,
        handedness: string,
        isDefaultColor: boolean,

        checkHandedness(): string,

    }


    export function makeHandy(obj: XRHandy): void;


    export interface ShapeChangedEvent {
        type: 'shape changed',
        resultWas: { shape: HandShape },
        resultIs: { shape: HandShape },
        message: string
    }

    export interface FirstShapeEvent extends Event {
        hand: XRHandy
    }

    export interface ConnectedEvent extends Event {
        data: HandShape
    }

    export interface HandShape {
        names: string[],
        handedness: string,
        handyRevision: number,
        time: number,
        headPosition: number[],
        headRotation: number[],
        jointPositions: number[][],
        digitTipPositions: number[][],
    }

}