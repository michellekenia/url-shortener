import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

async validateUser(email: string, password: string) {
  const user = await this.userService.getUserByEmail(email)
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
    
}

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
