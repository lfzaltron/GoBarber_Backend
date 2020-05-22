import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, isSameDay, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
}

type IResponse = Array<{
    day: number;
    available: boolean;
}>;

const MAX_APPOINTMENTS_IN_DAY = 10;

@injectable()
export default class ListProviderMonthAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        provider_id,
        year,
        month,
    }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findByMonthAndProvider(
            {
                provider_id,
                month,
                year,
            },
        );

        const daysInMonth = getDaysInMonth(new Date(year, month - 1));

        const availability: IResponse = [];

        for (let day = 1; day <= daysInMonth; day += 1) {
            const qtdAppointmentsInDay = appointments.reduce(
                (qtdInDay, appointment) => {
                    return isSameDay(
                        appointment.date,
                        new Date(year, month - 1, day),
                    )
                        ? qtdInDay + 1
                        : qtdInDay;
                },
                0,
            );

            const thisDay = new Date(year, month - 1, day, 23, 59);

            availability.push({
                day,
                available:
                    qtdAppointmentsInDay < MAX_APPOINTMENTS_IN_DAY &&
                    isAfter(thisDay, Date.now()),
            });
        }

        return availability;
    }
}
