import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobParams, UpdateJobParams } from './job.dto';

@Controller('job')
export class JobController {
    constructor(private jobService: JobService) { }

    @Get()
    getUsers() {
        return this.jobService.getJobs();
    }

    @Post()
    createUser(@Body() createUserDto: CreateJobParams) {
        return this.jobService.createJob(createUserDto);
    }

    @Put()
    async updateUser(@Body() updateJobDto: UpdateJobParams) {
        await this.jobService.updateJob(updateJobDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        await this.jobService.deleteJob(id);
    }
}
