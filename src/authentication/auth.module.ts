import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountsModule } from 'src/accounts/accounts.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AccountsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [AuthService, {
    provide: APP_GUARD,
    useClass: AuthGuard
  }],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }