import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/adapters/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async createUser(data: CreateUserDto) {
        const existUser = await this.prismaService.user.findUnique({
            where: {email: data.email}
        })

        if (existUser) {
            throw new ConflictException('Email already in use.')
        }
        return this.prismaService.user.create({data})
    }

    async finAllUser(){
        return this.prismaService.user.findMany()
    }

    async findUserById(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {id}
        })

        if (!user) {
            throw new NotFoundException('User not found.')
        }
        return user

    }

    async updateUser(id: string, data:UpdateUserDto) {
        const user = await this.findUserById(id)
        if(!user) {
            throw new NotFoundException ('User not found.')
        }

        return this.prismaService.user.update({
            where: {id}, 
            data
        })
    }

    async deleteUser(id: string) {
        const user = await this.findUserById(id)
        if(!user) {
            throw new NotFoundException ('User not found.')
        }

        return this.prismaService.user.delete ({
            where: {id}
        })
    }

}