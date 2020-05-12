import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
    beforeEach(async () => {
        fakeUsersRepository = new FakeUsersRepository();
        listProvidersService = new ListProvidersService(fakeUsersRepository);
    });

    it('Should be able to list the providers', async () => {
        const provider1 = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'johndoespass',
        });

        const provider2 = await fakeUsersRepository.create({
            name: 'John Jr',
            email: 'johnjr@example.com',
            password: 'johnjrspass',
        });

        const currentUser = await fakeUsersRepository.create({
            name: 'Nick',
            email: 'nick@example.com',
            password: 'nickspass',
        });

        const providers = await listProvidersService.execute({
            user_id: currentUser.id,
        });

        expect(providers).toContain(provider1);
        expect(providers).toContain(provider2);
        expect(providers).not.toContain(currentUser);
    });
});
