import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  create(email: string, password: string) {
    const user = this.repo.create({ email, hashedPassword: password });
    return this.repo.save(user);
  }

  findOne(id: string) {
    return this.repo.findOne({
      where: {
        id,
      },
    });
  }
  findAll() {
    return this.repo.find();
  }
  async update(id: string, attrs: Partial<User>) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }
  async remove(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new Error('user not found');
    }
    return this.repo.remove(user);
  }
}
