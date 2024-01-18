import { Injectable } from '@nestjs/common';
import { CameraEntity } from './camera.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCameraParams, UpdateCameraParams } from './camera.dto';

@Injectable()
export class CameraService {
  constructor(
    @InjectRepository(CameraEntity)
    private cameraRepository: Repository<CameraEntity>,
  ) {}

  getCameras() {
    return this.cameraRepository.find();
  }

  async createCamera(cameraDetails: CreateCameraParams) {
    const newCamera = this.cameraRepository.create({
      ...cameraDetails,
      createdAt: new Date(),
    });
    return await this.cameraRepository.save(newCamera);
  }

  async updateCamera(updateCameraDetails: UpdateCameraParams) {
    await this.cameraRepository
      .createQueryBuilder()
      .update(CameraEntity)
      .set({
        name: updateCameraDetails.name,
        address: updateCameraDetails.address
      })
      .where('id = :id', { id: updateCameraDetails.id })
      .execute();

    return this.cameraRepository.findBy({ id: updateCameraDetails.id });
  }

  async deleteCamera(id: string) {
    return await this.cameraRepository.delete(id);
  }
}
