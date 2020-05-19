import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    it('Should be able update user`s profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'New Name for John Doe',
            email: 'newemail@example.com',
        });

        expect(updatedUser.name).toEqual('New Name for John Doe');
        expect(updatedUser.email).toEqual('newemail@example.com');
    });

    it('Should not be able to update the profile of non-existing user', async () => {
        await expect(
            updateProfileService.execute({
                user_id: 'isdfjdsdklsdjfkdlsjfl',
                name: 'New Name',
                email: 'newemail@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to change to anothers user email', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'johnpass',
        });
        const user = await fakeUsersRepository.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'testPass',
        });
        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: user.name,
                email: 'johndoe@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Should be able to update user`s password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'New Name for John Doe',
            email: 'newemail@example.com',
            oldPassword: '123456',
            password: '123123',
        });

        expect(updatedUser.password).toEqual('123123');
    });

    it('Should not be able to update user`s password without give old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'New Name for John Doe',
                email: 'newemail@example.com',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Should not be able to update user`s password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'New Name for John Doe',
                email: 'newemail@example.com',
                oldPassword: 'wrongPass',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
