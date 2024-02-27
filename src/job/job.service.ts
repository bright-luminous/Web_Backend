import { Injectable } from '@nestjs/common';
import { JobEntity } from './job.entity';
import { CreateJobParams, JobStatus, PageFilter, ReturnJob, UpdateJobParams, UpdateJobResultLinkParams } from './job.dto';
import { Container } from '@azure/cosmos';
import { InjectModel } from '@nestjs/azure-database';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(JobEntity) private readonly jobContainer: Container,
  ) {}

  async getJobs() {
    var sqlQuery = 'select * from jobContainer1';

    var consmosResults = await this.jobContainer?.items
      ?.query<JobEntity>(sqlQuery)
      .fetchAll();
    var final = consmosResults.resources.map<ReturnJob>((value) => {
      return {
        id: value.id,
        jobName: value.jobName,
        status: value.status,
        jobPeriodStart: value.jobPeriodStart,
        jobPeriodEnd: value.jobPeriodEnd,
        camera: value.camera,
        results: value.results
      };
    });
    return final;
  }

  async getJobByID(id: string) {
    var sqlQuery = `SELECT * FROM jobContainer1 j WHERE j.id="${id}"`;

    var consmosResults = await this.jobContainer?.items
      ?.query<JobEntity>(sqlQuery)
      .fetchAll();
    var final = consmosResults.resources.map<ReturnJob>((value) => {
      return {
        id: value.id,
        jobName: value.jobName,
        status: value.status,
        jobPeriodStart: value.jobPeriodStart,
        jobPeriodEnd: value.jobPeriodEnd,
        camera: value.camera,
        results: value.results
      };
    });
    return final;
  }

  async getJobStatus(id: string) {
    var sqlQuery = `SELECT VALUE {
      id: j.id,
      status: j.status
    } FROM jobContainer1 j WHERE j.id="${id}"`;
    var consmosResults = await this.jobContainer?.items
      ?.query<JobEntity>(sqlQuery)
      .fetchAll();

    return consmosResults.resources;
  }

  async getJobByNameLike(jobName: string) {
    var sqlQuery = `SELECT top 5 * FROM jobContainer1 j WHERE j.jobName LIKE "%${jobName}%"`;

    var consmosResults = await this.jobContainer?.items
      ?.query<JobEntity>(sqlQuery)
      .fetchAll();
    var final = consmosResults.resources.map<ReturnJob>((value) => {
      return {
        id: value.id,
        jobName: value.jobName,
        status: value.status,
        jobPeriodStart: value.jobPeriodStart,
        jobPeriodEnd: value.jobPeriodEnd,
        camera: value.camera,
        results: value.results
      };
    });
    return final;
  }

  async getJobAsPages(page: number, pageSize: number) {
    page = page - 1;
    const offset = page * pageSize;
    const limit = pageSize;
    var sqlQuery = `SELECT * FROM jobContainer1 j OFFSET ${offset} LIMIT ${limit}`;

    var consmosResults = await this.jobContainer?.items
      ?.query<JobEntity>(sqlQuery)
      .fetchAll();
    var final = consmosResults.resources.map<ReturnJob>((value) => {
      return {
        id: value.id,
        jobName: value.jobName,
        status: value.status,
        jobPeriodStart: value.jobPeriodStart,
        jobPeriodEnd: value.jobPeriodEnd,
        camera: value.camera,
        results: value.results
      };
    });
    return final;
  }

  async createJob(jobDetails: CreateJobParams) {
    var newJob = new JobEntity();
    newJob.jobName = jobDetails.jobName;
    newJob.status = JobStatus.WAITING;
    newJob.jobPeriodStart = jobDetails.jobPeriodStart;
    newJob.jobPeriodEnd = jobDetails.jobPeriodEnd;
    newJob.camera = jobDetails.camera;

    var { resource } = await this.jobContainer.items.create(newJob);

    return resource;
  }

  async updateJob(updateJobDetails: UpdateJobParams) {
    var { resource } = await this.jobContainer
      .item(updateJobDetails.id, updateJobDetails.id)
      .patch({
        operations: [
          { op: 'set', path: '/jobName', value: updateJobDetails.jobName },
          { op: 'set', path: '/status', value: updateJobDetails.status },
          { op: 'set', path: '/camera', value: updateJobDetails.camera },
        ],
      });

    return resource;
  }

  async updateJobResultLink(updateJobDetails: UpdateJobResultLinkParams) {
    console.log(updateJobDetails)
    var { resource } = await this.jobContainer
      .item(updateJobDetails.id, updateJobDetails.id)
      .patch({
        operations: [
          { op: 'add', path: '/results', value: updateJobDetails.resultLinks },
        ],
      });

    return resource;
  }

  async deleteJob(id: string) {
    const ret = await this.jobContainer.item(id, id).delete();
    return ret.item.id;
  }
}
