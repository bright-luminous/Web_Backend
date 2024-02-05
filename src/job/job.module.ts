import { Module } from '@nestjs/common';
import { JobEntity } from './job.entity';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { AzureCosmosDbModule } from '@nestjs/azure-database';

@Module({
    imports: [AzureCosmosDbModule.forFeature([{
        collection: 'jobContainer1',
        dto: JobEntity
    }])],
    controllers: [JobController],
    providers: [JobService]
})
export class JobModule {}
