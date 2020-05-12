import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        showProfileService = new ShowProfileService(fakeUsersRepository);
    });

    it('Should be able to show the user`s profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const userProfile = await showProfileService.execute({
            user_id: user.id,
        });

        expect(userProfile.name).toEqual('John Doe');
        expect(userProfile.email).toEqual('johndoe@example.com');
    });

    it('Should not be able to show the profile of non-existing user', async () => {
        await expect(
            showProfileService.execute({
                user_id: 'isdfjdsdklsdjfkdlsjfl',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
