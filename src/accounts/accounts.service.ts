import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateAccountDto,
  CreateInitialVenueManagerAccountDto,
} from './dto/create-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword, isAccountVenueManager } from 'src/utils';
import { AccountFrontEnd, RequestWithAccount } from 'src/types';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) { }

  async findByEmail(email: string) {
    return await this.prisma.account.findUniqueOrThrow({
      where: {
        email: email,
      },
    });
  }

  async getAccountCount() {
    return await this.prisma.account.count()
  }

  async createInitialVenueManager(
    createInitialVenueManagerAccountDto: CreateInitialVenueManagerAccountDto,
  ): Promise<AccountFrontEnd> {
    const accountCount = await this.prisma.account.count();

    if (accountCount > 0) {
      throw new BadRequestException('an account already exists');
    }

    const venueManagerRoleId = await this.prisma.role.findFirst({
      where: {
        name: 'venue manager',
      },
    });

    if (!venueManagerRoleId) {
      throw new NotFoundException(
        'venue manager role has not been created. Check your seed file.',
      );
    }

    const accountPassword = await hashPassword(
      createInitialVenueManagerAccountDto.password,
    );

    const newVenueManagerAccount = await this.prisma.account.create({
      data: {
        email: createInitialVenueManagerAccountDto.email.toLowerCase().trim(),
        name: createInitialVenueManagerAccountDto.name.toLowerCase().trim(),
        password: accountPassword,
        roleId: venueManagerRoleId.id,
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
      omit: {
        roleId: true,
        password: true,
      },
    });

    return newVenueManagerAccount;
  }

  async create(
    request: RequestWithAccount,
    createAccountDto: CreateAccountDto,
  ): Promise<AccountFrontEnd> {
    const requestAccount = await this.prisma.account.findUniqueOrThrow({
      where: {
        id: request.account.sub,
      },
    });

    const hasVenueManagerRole = await isAccountVenueManager(
      requestAccount.roleId,
      this.prisma,
    );

    if (!hasVenueManagerRole) {
      throw new HttpException('account not admin', HttpStatus.FORBIDDEN)
    }

    const accountPassword = await hashPassword(createAccountDto.password);

    const role = await this.prisma.role.findFirst({
      where: {
        id: createAccountDto.roleId,
      },
    });

    if (!role) {
      throw new NotFoundException('could not find role');
    }
    return await this.prisma.account.create({
      data: {
        email: createAccountDto.email.toLowerCase().trim(),
        name: createAccountDto.name.toLowerCase().trim(),
        password: accountPassword,
        roleId: role.id,
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
      omit: {
        roleId: true,
        password: true,
      },
    });
  }

  async findAll(): Promise<AccountFrontEnd[]> {
    return await this.prisma.account.findMany({
      orderBy: {
        role: {
          name: 'asc',
        },
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
      omit: {
        roleId: true,
        password: true,
      },
    });
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('id given is not valid number');
    }

    return await this.prisma.account.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
      omit: {
        roleId: true,
        password: true,
      },
    });
  }

  // update(id: number, updateAccountDto: UpdateAccountDto) {
  //   return `This action updates a #${id} account`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} account`;
  // }
}
