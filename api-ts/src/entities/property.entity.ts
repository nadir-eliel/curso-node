import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Nodes } from './node.entity'

@Entity({ name: 'property' })
export class Property {
  @PrimaryColumn({ name: 'node_id' })
    nodeId: number

  @PrimaryColumn()
    key: string

  @Column()
    value: number

  @ManyToOne(() => Nodes, node => node.properties)
  @JoinColumn({ name: 'node_id' })
    node: Nodes
}
