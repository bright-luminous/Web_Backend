import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobParams, PageFilter, UpdateJobParams, UpdateJobResultLinkParams, UpdateJobStatusParams } from './job.dto';

@Controller('job')
export class JobController {
    constructor(private jobService: JobService) { }

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
    getJobAsPage(@Query('page') page: number, @Query('pageSize') pageSize: number) {
        return this.jobService.getJobAsPages(page,pageSize);
    }

    @Post()
    createJob(@Body() createUserDto: CreateJobParams) {
        return this.jobService.createJob(createUserDto);
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
    async updateJobResultLink(@Body() updateJobLinkDto: UpdateJobResultLinkParams) {
        return await this.jobService.updateJobResultLink(updateJobLinkDto);
    }

    @Delete()
    async deleteJob(@Query('id') id: string) {
        const ret = await this.jobService.deleteJob(id);
        return ret
    }
}
