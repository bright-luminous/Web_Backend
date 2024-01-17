import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobModule } from './job/job.module';
import { DataSource } from 'typeorm';
import { JobEntity } from './job/job.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'eauu0244',
    entities: [JobEntity],
    database:'web-db',
    synchronize: true
  }), JobModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
