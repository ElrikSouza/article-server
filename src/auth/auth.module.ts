import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashService } from './hash/hash.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtGuard } from './jwt-auth.guard';

@Module({
  providers: [AuthService, HashService, JwtStrategy, JwtGuard],
  controllers: [AuthController],
  exports: [JwtGuard],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({ secret: 'temp', signOptions: { expiresIn: '24d' } }),
  ],
})
export class AuthModule {}
