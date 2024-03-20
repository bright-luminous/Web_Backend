import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CameraService } from './camera.service';
import { CreateCameraParams } from './camera.dto';

@Controller('camera')
export class CameraController {
  constructor(private cameraService: CameraService) {}

  @Get()
  getJobs() {
    return this.cameraService.getCameras();
  }

  @Post()
  createJob(@Body() createCameraDto: CreateCameraParams) {
    return this.cameraService.createCamera(createCameraDto);
  }

  @Delete()
  async deleteJob(@Query('id') id: string) {
    const ret = await this.cameraService.deleteCamera(id);
    return ret;
  }
}
