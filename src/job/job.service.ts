import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobEntity } from './job.entity';
import { Repository } from 'typeorm';
import { CreateJobParams, UpdateJobParams } from './job.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(JobEntity) private jobRepository: Repository<JobEntity>,
  ) {}

  getJobs() {
    return this.jobRepository.find();
  }

  async createJob(jobDetails: CreateJobParams) {
    const newUser = this.jobRepository.create({
      ...jobDetails,
      createdAt: new Date(),
    });
    return await this.jobRepository.save(newUser);
  }

  async updateJob(updateJobDetails: UpdateJobParams) {
    await this.jobRepository
      .createQueryBuilder()
      .update(JobEntity)
      .set({
        name: updateJobDetails.name,
        status: updateJobDetails.status,
        camera: updateJobDetails.camera,
      })
      .where('id = :id', { id: updateJobDetails.id })
      .execute();

    return this.jobRepository.findBy({ id: updateJobDetails.id });
  }

  async deleteJob(id: string) {
    return await this.jobRepository.delete(id);
  }
}
