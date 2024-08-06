import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Min, Max } from 'class-validator';

@Entity()
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Min(5, { message: 'Slot duration must be at least 5 minutes' })
  slotDuration: number;

  @Column()
  @Min(1)
  @Max(5)
  maxSlotsPerAppointment: number;

  @Column({ type: 'time' })
  operationalStartTime: string;

  @Column({ type: 'time' })
  operationalEndTime: string;

  @Column({
    type: 'text',
    transformer: {
      to: (value: number[]) => value.join(','),
      from: (value: string) => value.split(',').map(Number),
    },
  })
  operationalDays: number[];
}
