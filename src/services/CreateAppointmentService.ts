import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';
import AppError from '../errors/AppError';

interface Request {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({ provider_id, date }: Request): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository,
        );
        const parsedDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(
            parsedDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked.');
        }

        const appointment = appointmentsRepository.create({
            provider_id,
            date: parsedDate,
        });
        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
