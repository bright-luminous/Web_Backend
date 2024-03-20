import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobModule } from './job/job.module';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { CameraModule } from './camera/camera.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AzureCosmosDbModule.forRoot({
      dbName: 'Job',
      endpoint: process.env.DB_ENDPOINT,
      key: process.env.DB_KEY,
    }),
    JobModule,
    CameraModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
