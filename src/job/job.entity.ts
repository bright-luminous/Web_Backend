import { Column, PrimaryGeneratedColumn } from "typeorm";
import { JobStatus } from "./job.dto";
import { CameraEntity } from "src/camera/camera.entity";
import { CosmosPartitionKey } from "@nestjs/azure-database";

@CosmosPartitionKey('id')
export class JobEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    jobName: string;

    @Column({
        type: "enum",
        enum: JobStatus,
        default: JobStatus.WAITING,
    })
    status: JobStatus

    @Column({ type: "timestamp" })
    jobPeriodStart: Date;

    @Column({ type: "timestamp" })
    jobPeriodEnd: Date;

    @Column({ type: "string" })
    camera: CameraEntity;

    @Column({ type: "string" })
    description: string;

    @Column("string", { array: true })
    results: String[];
}