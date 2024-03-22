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
import { createWriteStream, mkdirSync, readFileSync, rmSync } from 'fs';

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

  async getJobAsPages(page: number, pageSize: number, jobName?: string) {
    page = page - 1;
    const offset = page * pageSize;
    const limit = pageSize;
    var sqlQuery = `SELECT * FROM jobContainer1 j ORDER BY j._ts DESC OFFSET ${offset} LIMIT ${limit}`;

    if (jobName) {
      sqlQuery = `SELECT * FROM jobContainer1 j WHERE j.jobName LIKE "%${jobName}%" ORDER BY j._ts DESC OFFSET ${offset} LIMIT ${limit}`;
    }

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

  async getJobProgress(jobID: string) {
    const ResultContainerName = 'results';
    const connStr =
      'DefaultEndpointsProtocol=https;AccountName=blobhell;AccountKey=Zhj7QSoSXa+yWavz9BBH23zhwLV/oI1cUhbos70j1Dm38bclGOufBrQ9PuZjimICFlcYW3/+AzQE+AStiCZ2Xw==;EndpointSuffix=core.windows.net';
    const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
    const resultContainerClient =
      blobServiceClient.getContainerClient(ResultContainerName);
    const blobClient = resultContainerClient.getBlobClient(
      `${jobID}/jobProcess.json`,
    );
    blobClient.download();
    const downloadBlockBlobResponse = await blobClient.download(0);
    console.log('\nDownloaded blob content...');
    console.log(
      '\t',
      this.streamToString(downloadBlockBlobResponse.readableStreamBody),
    );
    return this.streamToString(downloadBlockBlobResponse.readableStreamBody);
  }

  streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }

  async getResultPic(jobID: string) {
    const ResultContainerName = 'results';

    const connStr =
      'DefaultEndpointsProtocol=https;AccountName=blobhell;AccountKey=Zhj7QSoSXa+yWavz9BBH23zhwLV/oI1cUhbos70j1Dm38bclGOufBrQ9PuZjimICFlcYW3/+AzQE+AStiCZ2Xw==;EndpointSuffix=core.windows.net';
    const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
    const resultContainerClient =
      blobServiceClient.getContainerClient(ResultContainerName);
    const blobClient = resultContainerClient.getBlobClient(
      `${jobID}/result.json`,
    );
    mkdirSync(`sample-${jobID}`);

    await blobClient.downloadToFile(`sample-${jobID}/result.json`);

    const jsonSource = JSON.parse(
      readFileSync(`sample-${jobID}/result.json`, 'utf8'),
    );

    const pictureContainerName = 'frames';
    const pictureContainerClient =
      blobServiceClient.getContainerClient(pictureContainerName);

    for (let i = 0; i < 10; i++) {
      const blobClient = pictureContainerClient.getBlobClient(
        `${jsonSource[i].source}`,
      );
      await blobClient.downloadToFile(
        `sample-${jobID}/${jsonSource[i].source.split('/')[5]}`,
      );
    }

    rmSync(`sample-${jobID}/result.json`);

    var output = createWriteStream(`zipArchive/sample-${jobID}.zip`);
    var archiver2 = require('archiver');
    var archive = archiver2('zip');

    archive.on('error', function (err) {
      throw err;
    });

    archive.pipe(output);
    archive.directory(`sample-${jobID}`, `sample-${jobID}`);
    archive.finalize();

    await this.sleep(1000);

    rmSync(`sample-${jobID}`, { recursive: true, force: true });
    return `sample-${jobID}`;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async jobQuery(
    inputDescription: string,
    inputClientId: string,
    jobID: string,
  ) {
    this.updateJobStatus({ id: jobID, status: JobStatus.WORKING });
    const uri = `https://capstone-model.lemonbush-60506fc5.southeastasia.azurecontainerapps.io/query`;
    // const uri = `http://localhost:8000/query`;

    const response = await axios.get(uri, {
      params: {
        clientId: inputClientId,
        description: inputDescription,
        jobId: jobID,
      },
      validateStatus: () => true,
    });

    if (response.status != 200) {
      this.updateJobStatus({ id: jobID, status: JobStatus.FAILED });
      return 'unable to start the job';
    }

    this.updateJobStatus({ id: jobID, status: JobStatus.WORKING });

    return response.toString();
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

    this.jobQuery(jobDetails.description, jobDetails.camera, resource.id);

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
