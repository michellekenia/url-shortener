import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor (private readonly repository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    return this.repository.createUser(createUserDto)
  }

  async getAllUsers() {
    return this.repository.findAllUser()
  }

  async getUserById(id: string) {
    return this.repository.findUserById(id)
  }

  async getUserByEmail(email: string) {
    return this.repository.findUserByEmail(email)
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.repository.updateUser(id,updateUserDto)
  }

  async deleteUser(id: string) {
    return this.repository.deleteUser(id)
  }
}
