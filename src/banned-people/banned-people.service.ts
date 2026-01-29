import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateBannedPersonDto } from './dto/create-banned-person.dto';
import { UpdateBannedPersonDto } from './dto/update-banned-person.dto';
import { RequestWithAccount } from 'src/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { isAccountVenueManager } from 'src/utils';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

@Injectable()
export class BannedPeopleService {
  constructor(private prisma: PrismaService) { }

  async create(
    request: RequestWithAccount,
    file: Express.Multer.File,
    createBannedPersonDto: CreateBannedPersonDto,
  ) {
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
      throw new HttpException(
        'account not venue manager',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!file) {
      throw new HttpException('image is required', HttpStatus.BAD_REQUEST);
    }

    const outputForFile = path.resolve(
      process.cwd(),
      'images',
      'compressed',
      'banned-people',
      file.filename,
    );

    try {
      const compressedImageBuffer = await sharp(file.path).webp({ quality: 75 }).toBuffer();
      await fs.writeFile(outputForFile, compressedImageBuffer);
      await fs.rm(file.path, { force: true });

      const newBannedPersonResult = await this.prisma.$transaction(async (prisma) => {
        const newBannedPerson = await this.prisma.bannedPerson.create({
          data: {
            name: createBannedPersonDto.name,
            imagePath: `/images/compressed/banned-people/${file.filename}`,
          },
        });

        await this.prisma.banDetail.create({
          data: {
            personId: newBannedPerson.id,
            reason: createBannedPersonDto.reason,
            startDate: dayjs(createBannedPersonDto.startDate).toDate(),
            endDate: dayjs(createBannedPersonDto.endDate).toDate(),
          },
        });

        return newBannedPerson
      });


      let bannedPersonWithBans = await this.prisma.bannedPerson.findUniqueOrThrow({
        where: {
          id: newBannedPersonResult.id,
        },
        include: {
          bans: true,
        },
      });

      const bannedPersonWithBansDto = {
        ...bannedPersonWithBans,
        imagePath: `${process.env.API_URL}images/compressed/banned-people/${file.filename}`,
      };
      return bannedPersonWithBansDto;

    } catch (error) {
      await fs.rm(outputForFile, {
        force: true,
      });

      console.log(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException('unknown error');
    }
  }

  async findAll() {
    // const allBannedPeople = await this.prisma
  }

  findOne(id: number) {
    return `This action returns a #${id} bannedPerson`;
  }

  update(id: number, updateBannedPersonDto: UpdateBannedPersonDto) {
    return `This action updates a #${id} bannedPerson`;
  }

  remove(id: number) {
    return `This action removes a #${id} bannedPerson`;
  }
}
