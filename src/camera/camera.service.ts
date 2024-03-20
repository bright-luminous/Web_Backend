import { Injectable } from '@nestjs/common';
import { CameraEntity } from './camera.entity';
import { Container } from '@azure/cosmos';
import { InjectModel } from '@nestjs/azure-database';
import { CreateCameraParams, ReturnCamera, UpdateCameraParams } from './camera.dto';

@Injectable()
export class CameraService {
  constructor(
    @InjectModel(CameraEntity) private readonly cameraContainer: Container,
  ) {}

  async getCameras() {
    var sqlQuery = 'select * from jobContainer1 j ORDER BY j._ts DESC';

    var consmosResults = await this.cameraContainer?.items
      ?.query<CameraEntity>(sqlQuery)
      .fetchAll();
    var final = consmosResults.resources.map<ReturnCamera>((value) => {
      return {
        id: value.id,
        cameraName: value.cameraName,
      };
    });
    return { data: final, totalCount: consmosResults.resources.length };
  }

  async createCamera(cameraDetails: CreateCameraParams) {
    var newCamera = new CameraEntity();
    newCamera.cameraName = cameraDetails.cameraName;

    var { resource } = await this.cameraContainer.items.create(newCamera);
    return resource;
  }

  async updateCamera(updateJobDetails: UpdateCameraParams) {
    var { resource } = await this.cameraContainer
      .item(updateJobDetails.id, updateJobDetails.id)
      .patch({
        operations: [
          { op: 'set', path: '/cameraName', value: updateJobDetails.cameraName }
        ],
      });

    return resource;
  }

  async deleteCamera(id: string) {
    const ret = await this.cameraContainer.item(id, id).delete();
    return ret.item.id;
  }
}
