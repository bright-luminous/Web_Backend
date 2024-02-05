import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobEntity } from './job.entity';
import { Repository } from 'typeorm';
import { CreateJobParams, ReturnJob, UpdateJobParams } from './job.dto';
import { Container } from '@azure/cosmos';
import { InjectModel } from '@nestjs/azure-database';

@Injectable()
export class JobService {
  constructor(
    // @InjectRepository(JobEntity) private jobRepository: Repository<JobEntity>,
    @InjectModel(JobEntity) private readonly jobContainer: Container,
  ) {}

  async getJobs() {
    var sqlQuery = 'select * from jobContainer';

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
        createdAt: value.createdAt,
        updatedDate: value.updatedDate,
      };
    });
    return final;
  }

  async createJob(jobDetails: CreateJobParams) {
    var newJob = new JobEntity();
    newJob.jobName = jobDetails.jobName;
    newJob.jobPeriodStart = jobDetails.jobPeriodStart;
    newJob.jobPeriodEnd = jobDetails.jobPeriodEnd;
    newJob.camera = jobDetails.camera;

    var { resource } = await this.jobContainer.items.create(newJob);

    return resource;
  }

  // async updateJob(updateJobDetails: UpdateJobParams) {
  //   await this.jobRepository
  //     .createQueryBuilder()
  //     .update(JobEntity)
  //     .set({
  //       name: updateJobDetails.name,
  //       status: updateJobDetails.status,
  //       jobPeriodStart: updateJobDetails.jobPeriodStart,
  //       jobPeriodEnd: updateJobDetails.jobPeriodEnd,
  //       camera: updateJobDetails.camera,
  //     })
  //     .where('id = :id', { id: updateJobDetails.id })
  //     .execute();

  //   return this.jobRepository.findBy({ id: updateJobDetails.id });
  // }

  // async deleteJob(id: string) {
  //   return await this.jobRepository.delete(id);
  // }
}
