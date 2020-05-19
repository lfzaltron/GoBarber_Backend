import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointmentService: CreateAppointmentService;
describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository,
            fakeCacheProvider,
        );
    });

    it('Should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() =>
            new Date(2020, 4, 10, 10, 0, 0).getTime(),
        );
        const appointment = await createAppointmentService.execute({
            date: new Date(2020, 4, 11, 10, 0, 0),
            provider_id: '123456',
            user_id: '111111',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123456');
    });

    it('Should not be able to create two appointments on the same date/time', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() =>
            new Date(2020, 4, 10, 8, 0, 0).getTime(),
        );

        const date = new Date(2020, 4, 10, 11);
        await createAppointmentService.execute({
            date,
            provider_id: '123456',
            user_id: '111111',
        });

        await expect(
            createAppointmentService.execute({
                date,
                provider_id: '123456',
                user_id: '111111',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to create an appointment at a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const date = new Date(2020, 4, 10, 11);

        await expect(
            createAppointmentService.execute({
                date,
                provider_id: '123456',
                user_id: '111111',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to create an appointment with the user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 10, 8).getTime();
        });

        const date = new Date(2020, 4, 10, 13);

        await expect(
            createAppointmentService.execute({
                date,
                provider_id: '123456',
                user_id: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to create an appointment before 8 am', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 10, 8).getTime();
        });

        const date = new Date(2020, 4, 12, 7);

        await expect(
            createAppointmentService.execute({
                date,
                provider_id: 'provider',
                user_id: 'user',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to create an appointment after 5 pm', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 10, 8).getTime();
        });

        const date = new Date(2020, 4, 12, 18);

        await expect(
            createAppointmentService.execute({
                date,
                provider_id: 'provider',
                user_id: 'user',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
