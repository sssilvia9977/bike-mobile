import { DataVisReference } from "./consts";

export class ProjectThingDto{
    thingId: number;
    projectReference: string;
    deviceId: string;

    constructor(thingId, deviceId){
        this.projectReference = DataVisReference.projectReference;
        this.thingId = thingId;
        this.deviceId = deviceId;
    }
}