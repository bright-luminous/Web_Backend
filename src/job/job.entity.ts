import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { JobStatus } from "./job.dto";

@Entity({ name: 'jobs' })
export class JobEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({
        type: "enum",
        enum: JobStatus,
        default: JobStatus.WAITING,
    })
    status: JobStatus

    @Column()
    camera: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedDate: Date

}