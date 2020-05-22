import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
export default class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({
        provider_id,
        day,
        month,
        year,
    }: IRequest): Promise<Appointment[]> {
        let appointments = await this.cacheProvider.recover<Appointment[]>(
            `provider-appointments:${provider_id}:${year}-${month}-${day}`,
        );

        if (!appointments) {
            appointments = await this.appointmentsRepository.findByDayAndProvider(
                {
                    provider_id,
                    day,
                    month,
                    year,
                },
            );
            appointments = classToClass(appointments);

            await this.cacheProvider.save(
                `provider-appointments:${provider_id}:${year}-${month}-${day}`,
                appointments,
            );
        }

        return appointments;
    }
}
