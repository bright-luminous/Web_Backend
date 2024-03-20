import { Column, PrimaryGeneratedColumn } from "typeorm";
import { CosmosPartitionKey } from "@nestjs/azure-database";

@CosmosPartitionKey('id')
export class CameraEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    cameraName: string;
}