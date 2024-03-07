import { Injectable } from '@nestjs/common';
import { JobEntity } from './job.entity';
import {
  CreateJobParams,
  JobStatus,
  ReturnJob,
  UpdateJobParams,
  UpdateJobResultLinkParams,
  UpdateJobStatusParams,
} from './job.dto';
import { Container } from '@azure/cosmos';
import { InjectModel } from '@nestjs/azure-database';
import axios from 'axios';
import { BlobServiceClient } from '@azure/storage-blob';
import {
  createWriteStream,
  mkdirSync,
  readFileSync,
  rmSync,
} from 'fs';
import { v4 } from 'uuid';
import * as JSZip from 'jszip';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(JobEntity) private readonly jobContainer: Container,
  ) {}

  async getJobs() {
    var sqlQuery = 'select * from jobContainer1 j ORDER BY j._ts DESC';

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
        createAt: value.createAt,
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
    var final = await consmosResults.resources.map<ReturnJob>((value) => {
      return {
        id: value.id,
        jobName: value.jobName,
        status: value.status,
        jobPeriodStart: value.jobPeriodStart,
        jobPeriodEnd: value.jobPeriodEnd,
        createAt: value.createAt,
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
        createAt: value.createAt,
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
        createAt: value.createAt,
        camera: value.camera,
        description: value.description,
        results: value.results,
      };
    });
    return { data: final, totalCount: (await this.getJobCount()).resources[0] };
  }

  async getResultPic(jobID: string) {
    var sqlQuery = `SELECT * FROM jobContainer1 j WHERE j.id="${jobID}"`;

    var consmosResults = await this.jobContainer?.items
      ?.query<JobEntity>(sqlQuery)
      .fetchAll();

    var urlArr = consmosResults.resources[0].results;
    let splitUrlArr = [];
    for await (const source of urlArr) {
      splitUrlArr.push(source.split('/'));
    }
    const containerName = splitUrlArr[0][3];

    const queryId = v4();
    mkdirSync(`sample-${queryId}`);

    const connStr =
      'DefaultEndpointsProtocol=https;AccountName=blobhell;AccountKey=Zhj7QSoSXa+yWavz9BBH23zhwLV/oI1cUhbos70j1Dm38bclGOufBrQ9PuZjimICFlcYW3/+AzQE+AStiCZ2Xw==;EndpointSuffix=core.windows.net';
    const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    let imgNames = [];

    for await (const item of splitUrlArr) {
      const blobClient = containerClient.getBlobClient(`${item[4]}/${item[5]}`);
      await blobClient.downloadToFile(`sample-${queryId}/${item[5]}`);
      imgNames.push(`sample-${queryId}/${item[5]}`);
    }

    const zip = new JSZip();
      const img = zip.folder(`sample-${queryId}`);
      for (const image of imgNames) {
        const imageData = readFileSync(image);
        img.file(image, imageData);
      }
      zip
        .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        .pipe(createWriteStream(`zipArchive/sample-${queryId}.zip`))

      rmSync(`sample-${queryId}`, { recursive: true, force: true });
      await this.sleep(1000);
      return `sample-${queryId}`;

  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async jobQuery(inputDescription: string, inputClientId: string, jobID: string) {
    this.updateJobStatus({id:jobID,status:JobStatus.WORKING})
    const uri = `https://tps-func-test.azurewebsites.net/api/query`;

      const response = await axios.get(uri,{
        params: {
          clientId: inputClientId,
          description: inputDescription
        },
      });
    const sortByScore = (a: { score: number }, b: { score: number }) =>
      b.score - a.score;
    const sortedByScoreMock = response.data.sort(sortByScore);
    const topThree = sortedByScoreMock.slice(0, 3);
    const imagesSource = topThree.map(
      (data) =>
        `https://blobhell.blob.core.windows.net/pictures/${data.source}`,
    );

    await this.updateJobResultLink({ id: jobID, resultLinks: imagesSource });

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
    newJob.createAt = new Date(new Date().toISOString());
    newJob.description = jobDetails.description;
    newJob.camera = jobDetails.camera;

    var { resource } = await this.jobContainer.items.create(newJob);

    this.jobQuery(jobDetails.description ,jobDetails.camera, resource.id);

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

    this.updateJobStatus({id:updateJobDetails.id,status:JobStatus.DONE})

    return resource;
  }

  async deleteJob(id: string) {
    const ret = await this.jobContainer.item(id, id).delete();
    return ret.item.id;
  }
}
