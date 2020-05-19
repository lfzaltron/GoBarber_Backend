import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateteUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
        authenticateUserService = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('Should be able to authenticate', async () => {
        const user = await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const response = await authenticateUserService.execute({
            email: 'johndoe@example.com',
            password: '123456',
        });

        delete user.password;

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('Should not be able to authenticate a not registered user', async () => {
        await expect(
            authenticateUserService.execute({
                email: 'johndoe@example.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to authenticate with wrong password', async () => {
        await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(
            authenticateUserService.execute({
                email: 'johndoe@example.com',
                password: '123456789',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
