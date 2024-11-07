import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) { }

  async createUser(createUserDto: CreateUserDto) {
    const existUser = await this.repository.findUserByEmail(createUserDto.email)
    if (existUser) {
      throw new ConflictException('Email already in use.')
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt)

    const user = await this.repository.createUser({
      ...createUserDto,
    password: hashedPassword
    })

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async getAllUsers() {
    return this.repository.findAllUser()
  }

  async getUserById(id: string) {
    const user = await this.repository.findUserById(id)

    if (!user) {
      throw new NotFoundException('User not found.')
    }
    return user
  }

  async getUserByEmail(email: string) {
    const user = await this.repository.findUserByEmail(email)

    if (!user) {
      throw new NotFoundException('User not found.')
    }
    return user
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.getUserById(id)

    if (!user) {
      throw new NotFoundException('User not found.')
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    return this.repository.updateUser(id, updateUserDto)
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id)
    if (!user) {
      throw new NotFoundException('User not found.')
    }

    return this.repository.deleteUser(id)
  }

}
