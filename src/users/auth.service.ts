import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  async signUp(email: string, password: string) {
    const user = await this.userService.findOneEmail(email);
    console.log(user);
    if (user) {
      throw new BadRequestException('Email in use');
    }
    //make a 16 character hex string
    const salt = randomBytes(8).toString('hex');
    //A Buffer is a Node.js object used to handle binary data.
    //32 specifies the length of the derived key (in bytes).
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //combine salt with hash with a period as our separator (our strategy)
    const result = salt + '.' + hash.toString('hex');

    const newUser = await this.userService.create(email, result);
    return newUser;
  }
  async signIn(email: string, password: string) {
    const user = await this.userService.findOneEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('failed to login');
    }
    return user;
  }
}
