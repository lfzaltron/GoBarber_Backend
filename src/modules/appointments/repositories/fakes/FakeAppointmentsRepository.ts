import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, isSameDay } from 'date-fns';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindByDayFromProviderDTO from '@modules/appointments/dtos/IFindByDayFromProviderDTO';
import IFindByMonthFromProviderDTO from '@modules/appointments/dtos/IFindByMonthFromProviderDTO';
import Appointment from '../../infra/typeorm/entities/Appointment';

class FakeAppointmentsRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async create({
        provider_id,
        user_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, { id: uuid(), date, provider_id, user_id });

        this.appointments.push(appointment);

        return appointment;
    }

    public async findByDate(
        date: Date,
        provider_id: string,
    ): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(
            appointment =>
                isEqual(appointment.date, date) &&
                appointment.provider_id === provider_id,
        );

        return findAppointment;
    }

    public async findByMonthAndProvider({
        provider_id,
        month,
        year,
    }: IFindByMonthFromProviderDTO): Promise<Appointment[]> {
        const findAppointments = this.appointments.filter(
            appointment =>
                appointment.provider_id === provider_id &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year,
        );
        return findAppointments;
    }

    public async findByDayAndProvider({
        provider_id,
        day,
        month,
        year,
    }: IFindByDayFromProviderDTO): Promise<Appointment[]> {
        const findAppointments = this.appointments.filter(
            appointment =>
                appointment.provider_id === provider_id &&
                isSameDay(appointment.date, new Date(year, month - 1, day)),
        );
        return findAppointments;
    }
}

export default FakeAppointmentsRepository;
