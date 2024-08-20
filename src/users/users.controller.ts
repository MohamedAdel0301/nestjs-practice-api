import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Delete,
  Session,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  @Get()
  findAllUsers() {
    return this.userService.findAll();
  }
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(id);
  }
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(id, {
      email: body.email,
      password: body.password,
    });
  }
}
