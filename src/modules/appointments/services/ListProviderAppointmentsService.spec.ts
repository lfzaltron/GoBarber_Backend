import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviderAppointmentsService = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
            fakeCacheProvider,
        );
    });

    it('Should be able to list all appointments for a provider in a day', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 20, 10, 0, 0),
        });
        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 20, 12, 0, 0),
        });

        const appointments = await listProviderAppointmentsService.execute({
            provider_id: 'provider',
            year: 2020,
            month: 5,
            day: 20,
        });
        const appointmentsWithCache = await listProviderAppointmentsService.execute(
            {
                provider_id: 'provider',
                year: 2020,
                month: 5,
                day: 20,
            },
        );

        expect(appointments).toEqual([appointment1, appointment2]);
        expect(appointmentsWithCache).toEqual([appointment1, appointment2]);
    });

    it('Should not be able to list appointments for another provider in a day', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 20, 10, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'another_provider',
            user_id: 'user',
            date: new Date(2020, 4, 20, 12, 0, 0),
        });

        const appointments = await listProviderAppointmentsService.execute({
            provider_id: 'provider',
            year: 2020,
            month: 5,
            day: 20,
        });

        expect(appointments).toEqual([appointment1]);
    });

    it('Should not be able to list appointments for a provider in a different day', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 20, 10, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 21, 12, 0, 0),
        });

        const appointments = await listProviderAppointmentsService.execute({
            provider_id: 'provider',
            year: 2020,
            month: 5,
            day: 20,
        });

        expect(appointments).toEqual([appointment1]);
    });
});
