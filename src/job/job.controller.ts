import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobParams, PageFilter, UpdateJobParams, UpdateJobResultLinkParams } from './job.dto';

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

    @Get('nameLike')
    getJobNameLike(@Query('jobName') jobName: string) {
        return this.jobService.getJobByNameLike(jobName);
    }

    @Get('asPage')
    getJobAsPage(@Body() pageFilter: PageFilter) {
        return this.jobService.getJobAsPages(pageFilter);
    }

    @Post()
    createJob(@Body() createUserDto: CreateJobParams) {
        return this.jobService.createJob(createUserDto);
    }

    @Put()
    async updateJob(@Body() updateJobDto: UpdateJobParams) {
        return await this.jobService.updateJob(updateJobDto);
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
