import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
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

    @ManyToOne((type) => CameraEntity, (cameraEntity) => cameraEntity.jobs, {
        onDelete: 'CASCADE',
    })
    camera: CameraEntity;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedDate: Date

}