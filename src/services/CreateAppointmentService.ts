import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';

interface Request {
    provider: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({ provider, date }: Request): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository,
        );
        const parsedDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(
            parsedDate,
        );

        if (findAppointmentInSameDate) {
            throw Error('This appointment is already booked.');
        }

        const appointment = appointmentsRepository.create({
            provider,
            date: parsedDate,
        });
        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
