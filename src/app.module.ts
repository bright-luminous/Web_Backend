import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobModule } from './job/job.module';
import { DataSource } from 'typeorm';
import { JobEntity } from './job/job.entity';
import { CameraModule } from './camera/camera.module';
import { CameraEntity } from './camera/camera.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'eauu0244',
    entities: [JobEntity,CameraEntity],
    database:'web-db',
    synchronize: true
  }), JobModule, CameraModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
