import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobParams, UpdateJobParams } from './job.dto';

@Controller('job')
export class JobController {
    constructor(private jobService: JobService) { }

    @Get()
    getUsers() {
        return this.jobService.getJobs();
    }

    @Get('byID')
    getUserByID(@Query('id') id: string) {
        return this.jobService.getJobByID(id);
    }

    @Get('nameLike')
    getUserNameLike(@Query('jobName') jobName: string) {
        return this.jobService.getJobByNameLike(jobName);
    }

    @Post()
    createUser(@Body() createUserDto: CreateJobParams) {
        return this.jobService.createJob(createUserDto);
    }

    @Put()
    async updateUser(@Body() updateJobDto: UpdateJobParams) {
        return await this.jobService.updateJob(updateJobDto);
    }

    @Delete()
    async deleteUser(@Query('id') id: string) {
        const ret = await this.jobService.deleteJob(id);
        return ret
    }
}
