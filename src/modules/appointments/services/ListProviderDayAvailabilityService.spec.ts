import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
    beforeEach(async () => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('Should be able to list the day availability from provider', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'fake-id',
            user_id: 'user',
            date: new Date(2020, 4, 20, 8, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'fake-id',
            user_id: 'user',
            date: new Date(2020, 4, 20, 10, 0, 0),
        });

        jest.spyOn(Date, 'now').mockImplementation(() =>
            new Date(2020, 4, 19, 11, 0, 0).getTime(),
        );

        const availability = await listProviderDayAvailabilityService.execute({
            provider_id: 'fake-id',
            year: 2020,
            month: 5,
            day: 20,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { hour: 8, available: false },
                { hour: 9, available: true },
                { hour: 10, available: false },
                { hour: 11, available: true },
            ]),
        );
    });

    it('Should list past hours as unavailable', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'fake-id',
            user_id: 'user',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });

        jest.spyOn(Date, 'now').mockImplementation(() =>
            new Date(2020, 4, 20, 11, 0, 0).getTime(),
        );

        const availability = await listProviderDayAvailabilityService.execute({
            provider_id: 'fake-id',
            year: 2020,
            month: 5,
            day: 20,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { hour: 9, available: false },
                { hour: 13, available: true },
                { hour: 14, available: false },
                { hour: 15, available: true },
            ]),
        );
    });
});
