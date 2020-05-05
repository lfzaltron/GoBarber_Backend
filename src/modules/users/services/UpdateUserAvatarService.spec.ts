import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
    it('Should be able update user`s avatar', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

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
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        expect(
            updateUserAvatarService.execute({
                user_id: 'not a valid user id',
                avatarFilename: 'newAvatar.png',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Should delete old avatar when updating new one', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );
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
