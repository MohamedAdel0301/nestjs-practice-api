import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';
import { User } from './user.entity';

let service: AuthService;
let fakeUserService;

describe('AuthService', () => {
  beforeEach(async () => {
    fakeUserService = {
      findOneEmail: (email: string) => Promise.resolve(),
      create: (email: string, password: string) =>
        Promise.resolve({ id: '1', email, password }),
    };

    const module = await Test.createTestingModule({
      providers: [
        //creating fake DI container that relies on userService which is fake
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });
  it('can create user with salted password', async () => {
    const user = await service.signUp('asdf@asdf.com', 'asdf');
    console.log(user);
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUserService.findOneEmail = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' }]);
    //fine will resolve with an item, this invalidates the sign up process
    await expect(service.signUp('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });
});
