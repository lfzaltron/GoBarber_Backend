import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    it('Shoud be able to reset the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        await resetPasswordService.execute({ token, password: 'newPassword' });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(updatedUser?.password).toBeDefined();
        if (updatedUser?.password) {
            expect(
                fakeHashProvider.compareHash(
                    updatedUser?.password,
                    'newPassword',
                ),
            ).toBeTruthy();
        }
        expect(updatedUser?.password).toBe('newPassword');
    });

    it('Should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPasswordService.execute({
                token: 'non-existing-token',
                password: 'newPassword',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to reset the password with non-existing user', async () => {
        const { token } = await fakeUserTokensRepository.generate(
            'non-existing-userid',
        );

        await expect(
            resetPasswordService.execute({
                token,
                password: 'newPassword',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Shoud not be able to reset the password with more than two hours token', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();
            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPasswordService.execute({ token, password: 'newPassword' }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
