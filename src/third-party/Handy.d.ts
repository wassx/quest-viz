import {Group, Vector3} from "three";
import {XRHandModel} from "../../third-party/Three/XRHandModelFactory";

export interface Handy {
    REVISION: number,
    VECTOR3_ZERO: Vector3,
    jointNames: string[],
    digitNames: string[],
    digitTipNames: string[],
    fingerNames: string[],

    isDigitTipIndex(): boolean;
    isFingerTipIndex(): boolean;

    shapes: {
        left: HandShape,
        right: HandShape
    },

    searchLoopDurationLimit: number,
    protos: any,
    hands: XRHandy[],

    update(callbacks: any): void;
    makeHandy(obj: XRHandy): void;

}


export interface XRHandy extends Group {
    models: XRHandModel[],
    modelIndex: number,
    handedness: string,
    isDefaultColor: boolean,

    checkHandedness(): string,
}

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