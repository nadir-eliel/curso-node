import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Property } from "./property.entity";

@Entity({ name: 'node' })
export class Nodes {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    name: string

    @Column({ name: 'parent_id' })
    parentId: number

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ name: 'deleted_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    deletedAt: Date;

    // Revisar esta relacion
    @OneToMany(() => Property, property => property.nodeId)
    properties: Property[];
}