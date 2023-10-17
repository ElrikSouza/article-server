import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from 'src/users/dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDTO } from 'src/users/dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDTO) {
    const token = await this.authService.signIn(signInDto);

    return { token };
  }
}
