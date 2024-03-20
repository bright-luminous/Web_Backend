import { Module } from '@nestjs/common';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { CameraController } from './camera.controller';
import { CameraService } from './camera.service';
import { CameraEntity } from './camera.entity';

@Module({
    imports: [AzureCosmosDbModule.forFeature([{
        collection: 'camContainer1',
        dto: CameraEntity
    }])],
    controllers: [CameraController],
    providers: [CameraService]
})
export class CameraModule {}
