import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUserRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
            fakeUserRepository,
            fakeMailProvider,
            fakeUserTokensRepository,
        );
    });

    it('Shoud be able to send recover password email', async () => {
        await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const sendMailFunction = jest.spyOn(fakeMailProvider, 'sendMail');

        await sendForgotPasswordEmailService.execute({
            email: 'johndoe@example.com',
        });

        expect(sendMailFunction).toHaveBeenCalled();
    });

    it('Should not be able to recover a non-existing user`s password', async () => {
        const sendMailFunction = jest.spyOn(fakeMailProvider, 'sendMail');

        await expect(
            sendForgotPasswordEmailService.execute({
                email: 'johndoe@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);

        expect(sendMailFunction).not.toHaveBeenCalled();
    });

    it('Should generate a forgot password token', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const generateFunction = jest.spyOn(
            fakeUserTokensRepository,
            'generate',
        );

        await sendForgotPasswordEmailService.execute({
            email: 'johndoe@example.com',
        });

        expect(generateFunction).toHaveBeenCalledWith(user.id);
    });
});
