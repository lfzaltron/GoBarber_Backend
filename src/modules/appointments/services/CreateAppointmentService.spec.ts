import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;
describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );
    });

    it('Should be able to create a new appointment', async () => {
        const appointment = await createAppointmentService.execute({
            date: new Date(),
            provider_id: '123456',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123456');
    });

    it('Should not be able to create two appointments on the same date/time', async () => {
        const date = new Date(2020, 4, 10, 11);
        await createAppointmentService.execute({
            date,
            provider_id: '123456',
        });

        await expect(
            createAppointmentService.execute({
                date,
                provider_id: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
