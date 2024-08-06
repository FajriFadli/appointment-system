import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('available-slots')
  getAvailableSlots(@Query('date') date: string) {
    return this.appointmentsService.getAvailableSlots(date);
  }

  @Post('book')
  bookAppointment(@Body() appointmentData: { date: string; time: string }) {
    return this.appointmentsService.bookAppointment(appointmentData.date, appointmentData.time);
  }

  @Delete(':id')
  cancelAppointment(@Param('id') id: string) {
    return this.appointmentsService.cancelAppointment(+id);
  }
}
