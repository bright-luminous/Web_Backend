import { CameraEntity } from 'src/camera/camera.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateJobParams {
  jobName: string;
  jobPeriodStart: Date;
  jobPeriodEnd: Date;
  camera: CameraEntity;
  description: string;
}

export class UpdateJobParams {
  id: string;
  jobName: string;
  status: JobStatus;
  camera: CameraEntity;
}

export class UpdateJobResultLinkParams {
  id: string;
  resultLinks: string[];
}

export class ReturnJob {
  id: string;
  jobName: string;
  status: JobStatus;
  jobPeriodStart: Date;
  jobPeriodEnd: Date;
  camera: CameraEntity;
  results: String[];
}

export enum JobStatus {
  WAITING = 'waiting',
  WORKING = 'working',
  DONE = 'done',
  FAILED = 'failed',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageFilter {
  @IsNumber({}, { message: ' "page" attribute should be a number' })
  public page: number;

  @IsNumber({}, { message: ' "pageSize" attribute should be a number ' })
  public pageSize: number;

  @IsOptional()
  public orderBy?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;
}
