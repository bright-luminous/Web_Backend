import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateCameraParams {
  cameraName: string;
}

export class UpdateCameraParams {
  id: string;
  cameraName: string;
}

export class ReturnCamera {
  id: string;
  cameraName: string;
}
