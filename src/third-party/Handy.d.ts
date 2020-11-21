import {Group, Object3D, PerspectiveCamera, Vector3, XRHandedness, XRInputSource} from "three";
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
    digitIsExtended(fingername: string): boolean;
    digitIsContracted(fingername: string): boolean;
    digitAngle(fingername: string): number;
    reportDigits(): void;
    checkHandedness(): XRHandedness,
    distanceBetweenJoints(jointNameA: string, jointNameB: string): number,

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
    joints: Group[],

    isShape(gestureName: string, threshold: number): boolean,
    checkHandedness(): string,
    // readLiveShapeData(): void,
    // recordLiveShapeData(name: string, showIt: boolean): void,
    // search(): string,
    lastSearchResult: { name: string },
    liveShapeData: [],

    inputState: { pinching: boolean },


    camera: PerspectiveCamera,
    displayFrameAnchor: Object3D,
    displayFrame: SurfaceText,
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
    type: "connected",
    data: XRInputSource,
    target: XRHandy
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
