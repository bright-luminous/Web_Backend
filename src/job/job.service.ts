import { Injectable } from '@nestjs/common';
import { JobEntity } from './job.entity';
import {
  CreateJobParams,
  JobStatus,
  PageFilter,
  ReturnJob,
  UpdateJobParams,
  UpdateJobResultLinkParams,
  UpdateJobStatusParams,
} from './job.dto';
import { Container } from '@azure/cosmos';
import { InjectModel } from '@nestjs/azure-database';
import axios from 'axios';

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
        description: value.description,
        results: value.results,
      };
    });
    return { data: final, totalCount: consmosResults.resources.length };
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
        description: value.description,
        results: value.results,
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

  async getJobCount() {
    var sqlQuery = `SELECT VALUE COUNT(j.id) FROM jobContainer1 j`;
    var consmosResults = await this.jobContainer?.items
      ?.query<JobEntity>(sqlQuery)
      .fetchAll();
    return consmosResults;
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
        description: value.description,
        results: value.results,
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
        description: value.description,
        results: value.results,
      };
    });
    return { data: final, totalCount: (await this.getJobCount()).resources[0] };
  }

  async jobQuery(inputClientId: string, jobID: string) {
    const uri = 'https://tps-func-test.azurewebsites.net/api/query';
    try {
      const response = await axios.post(uri, {
        params: {
          clientId: inputClientId,
        },
      });
      // return response.data;
    } catch (error) {
      // console.log(error.response.config)
      // return error;
    }
    const mockData = [
      { score: 37, source: '205e4c6d-372f-4a13-a2f3-2f1f1f1f1f1f.jpg' },
      { score: 82, source: '8234234e-f123-4234-234f-234234234234.jpg' },
      { score: 15, source: '15151515-5151-5151-1515-151515151515.jpg' },
      { score: 61, source: '61616161-6161-6161-6161-616161616161.jpg' },
      { score: 99, source: '99999999-9999-9999-9999-999999999999.jpg' },
    ];
    const sortByScore = (a, b) => b.score - a.score;
    const sortedByScoreMock = mockData.sort(sortByScore);
    const topThree = sortedByScoreMock.slice(0,3);
    const imagesSource = topThree.map((data)=>`https://blobhell.blob.core.windows.net/pictures/${inputClientId}/${data.source}`);

    await this.updateJobResultLink({id: jobID,resultLinks: imagesSource})

    return imagesSource;
    // https://blobhell.blob.core.windows.net/pictures/gay_sex/0e8c3785-7bb6-4265-ac02-38c21b398f4f.jpg
    // url/pictures/clientID/source
  }

  async createJob(jobDetails: CreateJobParams) {
    var newJob = new JobEntity();
    newJob.jobName = jobDetails.jobName;
    newJob.status = JobStatus.WAITING;
    newJob.jobPeriodStart = jobDetails.jobPeriodStart;
    newJob.jobPeriodEnd = jobDetails.jobPeriodEnd;
    newJob.description = jobDetails.description;
    newJob.camera = jobDetails.camera;

    var { resource } = await this.jobContainer.items.create(newJob);

    this.jobQuery('gay_sex',resource.id)

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

  async updateJobStatus(updateJobDetails: UpdateJobStatusParams) {
    var { resource } = await this.jobContainer
      .item(updateJobDetails.id, updateJobDetails.id)
      .patch({
        operations: [
          { op: 'set', path: '/status', value: updateJobDetails.status },
        ],
      });

    return resource;
  }

  async updateJobResultLink(updateJobDetails: UpdateJobResultLinkParams) {
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
