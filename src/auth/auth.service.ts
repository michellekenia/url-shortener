import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

async login(user: any) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email
    }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
