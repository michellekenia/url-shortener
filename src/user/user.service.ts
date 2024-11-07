import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) { }

  private sanitizeUser(user: any) {
    if (!user) return null;
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  private sanitizeUsers(users: any[]) {
    return users.map(this.sanitizeUser);
  }

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

    return this.sanitizeUser(user)
  }

  async getAllUsers() {
    const users = await this.repository.findAllUsers()
    return this.sanitizeUsers(users)
  }

  async getUserById(id: string) {
    const user = await this.repository.findUserById(id)

    if (!user) {
      throw new NotFoundException('User not found.')
    }
    return this.sanitizeUser(user)
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
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt)
    }

    const updatedUser = await this.repository.updateUser(id, updateUserDto)
    return this.sanitizeUser(updatedUser)
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id)
    if (!user) {
      throw new NotFoundException('User not found.')
    }

    const deletedUser = await this.repository.deleteUser(id)
    return this.sanitizeUser(deletedUser)
  }

}
