import path from 'path';
import { getRepository } from 'typeorm';
import fs from 'fs';
import AppError from '../errors/AppError';
import uploadConfig from '../config/upload';
import User from '../models/User';

interface Request {
    user_id: string;
    avatarFilename: string;
}
export default class UpdateUserAvatarService {
    public async execute({ user_id, avatarFilename }: Request): Promise<User> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(user_id);

        if (!user) {
            throw new AppError('Only valid users can change avatar', 401);
        }

        if (user.avatar) {
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );
            const userAvatarFileExists = await fs.promises.stat(
                userAvatarFilePath,
            );

            if (userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFilename;
        usersRepository.save(user);

        return user;
    }
}
