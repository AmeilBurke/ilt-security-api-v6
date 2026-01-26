import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVenueDto, CreateVenueManagerDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { RequestWithAccount } from 'src/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { isAccountAdmin } from 'src/utils';

@Injectable()
export class VenuesService {
  constructor(private prisma: PrismaService) { }

  async getVenueCount() {
    return await this.prisma.venue.count()
  }

  async create(
    request: RequestWithAccount,
    createVenueDto: CreateVenueDto,
  ) {
    const requestAccount = await this.prisma.account.findUniqueOrThrow({
      where: {
        id: request.account.sub,
      },
    });

    const hasAdminRole = await isAccountAdmin(
      requestAccount.roleId,
      this.prisma,
    );

    if (!hasAdminRole) {
      throw new HttpException('account not admin', HttpStatus.FORBIDDEN);
    }

    return this.prisma.venue.create({
      data: {
        name: createVenueDto.name,
      },
    });
  }

  async createVenueManager(
    request: RequestWithAccount,
    createVenueDto: CreateVenueManagerDto,
  ) {
    const requestAccount = await this.prisma.account.findUniqueOrThrow({
      where: {
        id: request.account.sub,
      },
    });

    const hasAdminRole = await isAccountAdmin(
      requestAccount.roleId,
      this.prisma,
    );

    if (!hasAdminRole) {
      throw new HttpException('account not admin', HttpStatus.FORBIDDEN);
    }

    // add error checking or error message
    try {
      const result = await this.prisma.venueManager.create({
        data: {
          accountId: createVenueDto.accountId,
          venueId: createVenueDto.venueId
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  async findAll() {
    return await this.prisma.venue.findMany();
  }

  async findOne(id: number) {
    return `This action returns a #${id} venue`;
  }

  async update(id: number, updateVenueDto: UpdateVenueDto) {
    return `This action updates a #${id} venue`;
  }

  async remove(id: number) {
    return `This action removes a #${id} venue`;
  }
}
