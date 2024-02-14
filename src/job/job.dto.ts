import { CameraEntity } from "src/camera/camera.entity";

export class CreateJobParams {
    jobName: string;
    jobPeriodStart: Date;
    jobPeriodEnd: Date;
    camera: CameraEntity;
 }

 export class UpdateJobParams {
    id: string;
    jobName: string;
    status: JobStatus;
    camera: CameraEntity;
 }

 export class ReturnJob {
   id: string;
   jobName: string;
   status: JobStatus;
   jobPeriodStart: Date;
   jobPeriodEnd: Date;
   camera: CameraEntity;
   createdAt: Date;
   updatedDate: Date
}

 export enum JobStatus {
    WAITING = "waiting",
    WORKING = "working",
    DONE = "done",
}