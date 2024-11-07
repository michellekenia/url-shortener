import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) { }

  private sanitizeUser(user: any) {
    if (!user) return null
    const { password, ...sanitizedUser } = user
    return sanitizedUser
  }

  private sanitizeUsers(users: any[]) {
    return users.map(this.sanitizeUser)
  }

  async createUser(data: CreateUserDto) {
    const existUser = await this.repository.findUserByEmail(data.email)
    if (existUser) {
      throw new ConflictException('Email already in use.')
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt)

    const user = await this.repository.createUser({
      ...data,
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

  async updateUser(id: string, data: UpdateUserDto) {
    const user = await this.getUserById(id)

    if (!user) {
      throw new NotFoundException('User not found.')
    }

    if (data.password) {
      const salt = await bcrypt.genSalt()
      data.password = await bcrypt.hash(data.password, salt)
    }

    const updatedUser = await this.repository.updateUser(id, data)
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
