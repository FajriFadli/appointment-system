import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private configService: ConfigService,
  ) {}

  async getAvailableSlots(date: string): Promise<any[]> {
    const config = await this.configService.getConfig();
    const dayOfWeek = new Date(date).getDay();

    // Check if the requested date is an operational day
    if (!config.operationalDays.includes(dayOfWeek)) {
      return []; // Return an empty array if it's not an operational day
    }

    const startTime = new Date(`${date}T${config.operationalStartTime}`);
    const endTime = new Date(`${date}T${config.operationalEndTime}`);
    const slots = [];

    while (startTime < endTime) {
      const time = startTime.toTimeString().slice(0, 5);
      const appointment = await this.appointmentRepository.findOne({
        where: { date, time },
      });

      slots.push({
        date,
        time,
        available_slots: appointment ? 0 : 1,
      });

      startTime.setMinutes(startTime.getMinutes() + config.slotDuration);
    }

    return slots;
  }

  async bookAppointment(date: string, time: string): Promise<Appointment> {
    const config = await this.configService.getConfig();
    
    // Validate that the requested time aligns with the configured slot duration
    const [hours, minutes] = time.split(':').map(Number);
    if (minutes % config.slotDuration !== 0) {
      throw new BadRequestException(`Appointment time must align with ${config.slotDuration}-minute slots`);
    }

    // Check if the appointment time is within operational hours
    const appointmentTime = new Date(`${date}T${time}`);
    const startTime = new Date(`${date}T${config.operationalStartTime}`);
    const endTime = new Date(`${date}T${config.operationalEndTime}`);
    if (appointmentTime < startTime || appointmentTime >= endTime) {
      throw new BadRequestException('Appointment time is outside operational hours');
    }

    // Check if the day is an operational day
    const dayOfWeek = new Date(date).getDay();
    if (!config.operationalDays.includes(dayOfWeek)) {
      throw new BadRequestException('Appointments are not available on this day');
    }

    const existingAppointment = await this.appointmentRepository.findOne({
      where: { date, time },
    });

    if (existingAppointment) {
      throw new BadRequestException('This slot is already booked');
    }

    const newAppointment = this.appointmentRepository.create({
      date,
      time,
      slots: 1,
    });

    return this.appointmentRepository.save(newAppointment);
  }

  async cancelAppointment(id: number): Promise<void> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }
    await this.appointmentRepository.remove(appointment);
  }
}
