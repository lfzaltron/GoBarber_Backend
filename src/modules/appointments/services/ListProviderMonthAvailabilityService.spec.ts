import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
    beforeEach(async () => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('Should be able to list the month availability from provider', async () => {
        const fakeAppointments: Promise<Appointment>[] = [];
        for (let hour = 8; hour < 18; hour += 1) {
            fakeAppointments.push(
                fakeAppointmentsRepository.create({
                    provider_id: 'fake-id',
                    user_id: 'user_id',
                    date: new Date(2020, 4, 20, hour, 0, 0),
                }),
            );
        }
        await Promise.all(fakeAppointments);

        await fakeAppointmentsRepository.create({
            provider_id: 'fake-id',
            user_id: 'user_id',
            date: new Date(2020, 4, 21, 8, 0, 0), // 05/20/2020 08:00 am
        });

        jest.spyOn(Date, 'now').mockImplementation(() =>
            new Date(2020, 4, 17, 11, 0, 0).getTime(),
        );

        const availability = await listProviderMonthAvailabilityService.execute(
            {
                provider_id: 'fake-id',
                year: 2020,
                month: 5,
            },
        );

        expect(availability).toEqual(
            expect.arrayContaining([
                { day: 15, available: false },
                { day: 16, available: false },
                { day: 17, available: true },
                { day: 19, available: true },
                { day: 20, available: false },
                { day: 21, available: true },
                { day: 22, available: true },
            ]),
        );
    });
});
