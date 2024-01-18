import { CameraEntity } from "src/camera/camera.entity";

export class CreateCameraParams {
    name: string;
    address: string;
 }

 export class UpdateCameraParams {
    id: string;
    name: string;
    address: string;
 }