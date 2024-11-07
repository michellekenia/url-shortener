import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/adapters/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async createUser(data: CreateUserDto) {
        return this.prismaService.user.create({
            data
        })
    }

    async findAllUsers() {
        return this.prismaService.user.findMany()
    }

    async findUserById(id: string) {
        return this.prismaService.user.findUnique({
            where: { id }
        })
    }

    async findUserByEmail(email: string) {
      return this.prismaService.user.findUnique({
            where: { email }
        })
    }

    async updateUser(id: string, data: UpdateUserDto) {
      return this.prismaService.user.update({
        where: { id },
        data
      })

    }
    
    async deleteUser(id: string) {
        
        return this.prismaService.user.delete({
            where: { id }
        })
    }

}