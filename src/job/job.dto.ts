import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateJobParams {
  jobName: string;
  jobPeriodStart: Date;
  jobPeriodEnd: Date;
  camera: string;
  description: string;
}

export class UpdateJobParams {
  id: string;
  jobName: string;
  status: JobStatus;
  camera: string;
}

export class UpdateJobStatusParams {
  id: string;
  status: JobStatus;
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
  camera: string;
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

  @IsNumber({}, { message: ' "totalEntry" attribute should be a number ' })
  public totalEntry: number;

  @IsOptional()
  public orderBy?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;
}
