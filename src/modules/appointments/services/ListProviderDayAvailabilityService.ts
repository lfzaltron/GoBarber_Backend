import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        provider_id,
        year,
        month,
        day,
    }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findByDayAndProvider(
            {
                provider_id,
                day,
                month,
                year,
            },
        );

        const maxAppointmentHour = 17;

        const availability: IResponse = [];

        for (let hour = 8; hour <= maxAppointmentHour; hour += 1) {
            const hasAppointmentInHour = appointments.find(
                appointment => getHours(appointment.date) === hour,
            );

            const futureDateTime = isAfter(
                new Date(year, month - 1, day, hour),
                new Date(Date.now()),
            );

            availability.push({
                hour,
                available: !hasAppointmentInHour && futureDateTime,
            });
        }

        return availability;
    }
}
