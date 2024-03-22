import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { JobService } from './job.service';
import {
  CreateJobParams,
  PageFilter,
  UpdateJobParams,
  UpdateJobResultLinkParams,
  UpdateJobStatusParams,
} from './job.dto';
import { createReadStream, readdir, readdirSync, unlink } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { folder } from 'jszip';
import { error } from 'console';

@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get()
  getJobs() {
    return this.jobService.getJobs();
  }

  @Get('byID')
  getJobByID(@Query('id') id: string) {
    return this.jobService.getJobByID(id);
  }

  @Get('status')
  getJobStatus(@Query('id') id: string) {
    return this.jobService.getJobStatus(id);
  }

  @Get('count')
  getJobCount() {
    return this.jobService.getJobCount();
  }

  @Get('nameLike')
  getJobNameLike(@Query('jobName') jobName: string) {
    return this.jobService.getJobByNameLike(jobName);
  }

  @Get('asPage')
  getJobAsPage(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('jobName') jobName: string,
  ) {
    return this.jobService.getJobAsPages(page, pageSize, jobName);
  }

  @Get('progress')
  getJobProgress(
    @Query('jobID') jobID: string
  ) {
    return this.jobService.getJobProgress(jobID);
  }

  @Get('trigger')
  getJobQuery(
    @Query('description') description: string,
    @Query('clientId') clientId: string,
    @Query('jobID') jobID: string,
  ) {
    return this.jobService.jobQuery(description, clientId, jobID);
  }

  @Get('pics')
  async getResultPic(@Res() res: Response, @Query('jobID') jobID: string) {
    const zipPath = await this.jobService.getResultPic(jobID);
    res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipPath}.zip"`
    });
    if(zipPath == "can't read result.json"){
      return zipPath
    }
    const fileStream = createReadStream(`zipArchive/${zipPath}.zip`).pipe(res);

      fileStream.on('error', (err)=> {
          console.log(err)
          res.end(err)
        })
        fileStream.on('close', function () {
            /** Close Filestream and delete ZIP File from Server **/
            fileStream.destroy();
        });
  }

  @Post()
  createJob(@Body() createJobDto: CreateJobParams) {
    return this.jobService.createJob(createJobDto);
  }

  @Put()
  async updateJob(@Body() updateJobDto: UpdateJobParams) {
    return await this.jobService.updateJob(updateJobDto);
  }

  @Put('status')
  async updateJobStatus(@Body() updateJobDto: UpdateJobStatusParams) {
    return await this.jobService.updateJobStatus(updateJobDto);
  }

  @Put('updateLink')
  async updateJobResultLink(
    @Body() updateJobLinkDto: UpdateJobResultLinkParams,
  ) {
    return await this.jobService.updateJobResultLink(updateJobLinkDto);
  }

  @Delete()
  async deleteJob(@Query('id') id: string) {
    const ret = await this.jobService.deleteJob(id);
    return ret;
  }
}

