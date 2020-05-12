import { injectable, inject } from 'tsyringe';
import { differenceInMinutes } from 'date-fns';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    token: string;
    password: string;
}

@injectable()
export default class ResetPasswordService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('UserTokensRepository')
        private userTokenRepository: IUserTokensRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ token, password }: IRequest): Promise<void> {
        const userToken = await this.userTokenRepository.findByToken(token);

        if (!userToken) {
            throw new AppError('Invalid token');
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        if (!user) {
            throw new AppError('Invalid token');
        }

        const timeOfTokensLife = differenceInMinutes(
            Date.now(),
            userToken.created_at,
        );
        if (timeOfTokensLife > 120) {
            throw new AppError('Token expired');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        user.password = hashedPassword;
        await this.usersRepository.save(user);
    }
}
