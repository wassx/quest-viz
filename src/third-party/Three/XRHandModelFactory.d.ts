import {
    Group,
    Object3D,
} from 'three';
import {XRHandy} from "handyjs";

export class XRHandModelFactory {
    constructor();

    setPath(path: string): XRHandModelFactory;

    createHandModel(controller: XRHandy, profile: string, options?): XRHandModel;
}

export class XRHandModel extends Object3D {
    constructor(controller: Group);

    updateMatrixWorld(force: boolean): void;

}