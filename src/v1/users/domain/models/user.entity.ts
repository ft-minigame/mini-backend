import { Game } from 'src/v1/game/domain/models/game.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EUserCoalitions {
  GUN = 'gun',
  GON = 'gon',
  GAM = 'gam',
  LEE = 'lee',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30, unique: true })
  intraId: string;

  @Column({
    type: 'enum',
    enum: EUserCoalitions,
  })
  coalitions: EUserCoalitions;

  @Column({ default: 0 })
  character: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Game, (game) => game.user)
  games: Game[];
}
