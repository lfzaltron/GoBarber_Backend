import { getRepository, Repository, Raw } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindByMonthFromProviderDTO from '@modules/appointments/dtos/IFindByMonthFromProviderDTO';
import IFindByDayFromProviderDTO from '@modules/appointments/dtos/IFindByDayFromProviderDTO';
import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async create({
        provider_id,
        user_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            provider_id,
            user_id,
            date,
        });
        await this.ormRepository.save(appointment);
        return appointment;
    }

    public async findByDate(
        date: Date,
        provider_id: string,
    ): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { date, provider_id },
        });

        return findAppointment;
    }

    public async findByMonthAndProvider({
        provider_id,
        month,
        year,
    }: IFindByMonthFromProviderDTO): Promise<Appointment[]> {
        const strMonth = String(month).padStart(2, '0');

        const findAppointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'MM-YYYY') = '${strMonth}-${year}'`,
                ),
            },
        });

        return findAppointments;
    }

    public async findByDayAndProvider({
        provider_id,
        day,
        month,
        year,
    }: IFindByDayFromProviderDTO): Promise<Appointment[]> {
        const strDay = String(day).padStart(2, '0');
        const strMonth = String(month).padStart(2, '0');

        const findAppointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${strDay}-${strMonth}-${year}'`,
                ),
            },
            relations: ['user'],
        });

        return findAppointments;
    }
}

export default AppointmentsRepository;
