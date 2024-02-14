import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobModule } from './job/job.module';
import { AzureCosmosDbModule } from '@nestjs/azure-database';

@Module({
  imports: [
    AzureCosmosDbModule.forRoot({
      dbName: 'Job',
      endpoint: 'https://job-db.documents.azure.com:443/',
      key: 'rJGRcIZk8SDHtsiHlzmXtm2FgKXqMvH5gL41kJE6q8MXdRFB8CXqOo3SwYkwYP3vpoQlGBhzM2iqACDbGLaZMg==',
    }),
    JobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
