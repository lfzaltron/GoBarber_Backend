import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeCacheProvider: FakeCacheProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
        fakeCacheProvider = new FakeCacheProvider();
        updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
            fakeCacheProvider,
        );
    });

    it('Should be able update user`s avatar', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const updatedUser = await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFilename: 'newAvatar.png',
        });

        expect(updatedUser.avatar).toEqual('newAvatar.png');
    });

    it('Should not be able update avatar of a non registered user_id', async () => {
        await expect(
            updateUserAvatarService.execute({
                user_id: 'not a valid user id',
                avatarFilename: 'newAvatar.png',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Should delete old avatar when updating new one', async () => {
        const deleteFileFunction = jest.spyOn(
            fakeStorageProvider,
            'deleteFile',
        );

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFilename: 'firstAvatar.png',
        });

        const lastUpdatedUser = await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFilename: 'lastAvatar.png',
        });

        expect(deleteFileFunction).toHaveBeenCalledWith('firstAvatar.png');

        expect(lastUpdatedUser.avatar).toEqual('lastAvatar.png');
    });
});
