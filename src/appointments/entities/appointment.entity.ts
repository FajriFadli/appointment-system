import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;  // Change this to string

  @Column({ type: 'time' })
  time: string;

  @Column()
  slots: number;
}
