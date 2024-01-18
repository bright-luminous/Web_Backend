import { CameraEntity } from "src/camera/camera.entity";

export class CreateJobParams {
    name: string;
    jobPeriodStart: Date;
    jobPeriodEnd: Date;
    camera: CameraEntity;
 }

 export class UpdateJobParams {
    id: string;
    name: string;
    status: JobStatus;
    jobPeriodStart: Date;
    jobPeriodEnd: Date;
    camera: CameraEntity;
 }

 export enum JobStatus {
    WAITING = "waiting",
    WORKING = "working",
    DONE = "done",
}