import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CameraService } from './camera.service';
import { CreateCameraParams, UpdateCameraParams } from './camera.dto';

@Controller('camera')
export class CameraController {
    constructor(private cameraService: CameraService) { }

    @Get()
    getUsers() {
        return this.cameraService.getCameras();
    }

    @Post()
    createUser(@Body() createUserDto: CreateCameraParams) {
        return this.cameraService.createCamera(createUserDto);
    }

    @Put()
    async updateUser(@Body() updateJobDto: UpdateCameraParams) {
        await this.cameraService.updateCamera(updateJobDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        await this.cameraService.deleteCamera(id);
    }
}
