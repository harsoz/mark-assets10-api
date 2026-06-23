import { JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Project } from "./project.entity";

export abstract class ChildProject {

    @PrimaryColumn({ type: 'uuid' })
    projectId!: string;

    @ManyToOne(() => Project, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId' })
    project?: Project;
}