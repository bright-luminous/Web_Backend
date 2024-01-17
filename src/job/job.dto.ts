export class CreateJobParams {
    name: string;
    camera: string;
 }

 export class UpdateJobParams {
    id: string;
    name: string;
    status: JobStatus;
    camera: string;
 }

 export enum JobStatus {
    WAITING = "waiting",
    WORKING = "working",
    DONE = "done",
}