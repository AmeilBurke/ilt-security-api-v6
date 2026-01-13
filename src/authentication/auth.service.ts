import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from 'src/accounts/accounts.service';
import { checkPassword } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private accountsService: AccountsService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    accountEmail: string,
    accountPassword: string,
  ): Promise<{ access_token: string }> {
    const account = await this.accountsService.findByEmail(accountEmail);

    if (!(await checkPassword(accountPassword, account.password))) {
      throw new UnauthorizedException();
    }

    const payload = { sub: account.id, username: account.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}