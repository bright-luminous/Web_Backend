import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobModule } from './job/job.module';
import { DataSource } from 'typeorm';
import { JobEntity } from './job/job.entity';
import { CameraModule } from './camera/camera.module';
import { CameraEntity } from './camera/camera.entity';
import { AzureCosmosDbModule } from '@nestjs/azure-database';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'eauu0244',
    //   entities: [JobEntity, CameraEntity],
    //   database: 'web-db',
    //   synchronize: true,
    // }),
    AzureCosmosDbModule.forRoot({
      dbName: 'Job',
      endpoint: 'https://job-db.documents.azure.com:443/',
      key: 'rJGRcIZk8SDHtsiHlzmXtm2FgKXqMvH5gL41kJE6q8MXdRFB8CXqOo3SwYkwYP3vpoQlGBhzM2iqACDbGLaZMg==',
    }),
    JobModule,
    // CameraModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
