import { Module } from '@nestjs/common';
import { CameraService } from './camera.service';
import { CameraController } from './camera.controller';
import { CameraEntity } from './camera.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([CameraEntity])],
  providers: [CameraService],
  controllers: [CameraController]
})
export class CameraModule {}
