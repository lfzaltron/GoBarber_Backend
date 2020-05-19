import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    user_id: string;
    avatarFilename: string;
}

@injectable()
export default class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('Only valid users can change avatar', 401);
        }

        if (user.avatar) {
            await this.storageProvider.deleteFile(user.avatar);
        }

        const fileName = await this.storageProvider.saveFile(avatarFilename);

        user.avatar = fileName;
        this.usersRepository.save(user);
        await this.cacheProvider.invalidate(`providers-list:${user_id}`);

        return user;
    }
}
