import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    it('Should be able to create a new user', async () => {
        const user = await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(user).toHaveProperty('id');
        expect(user.name).toBe('John Doe');
        expect(user.email).toBe('johndoe@example.com');
    });

    it('Should not be able to create a new user with an email already used', async () => {
        await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(
            createUserService.execute({
                name: 'John Doe 2',
                email: 'johndoe@example.com',
                password: '123456789',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
