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
import { Cron } from '@nestjs/schedule';

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
      await sharp(file.path).webp({ quality: 75 }).toFile(outputForFile);

      const newBannedPersonResult = await this.prisma.$transaction(
        async (prisma) => {
          const newBannedPerson = await prisma.bannedPerson.create({
            data: {
              name: createBannedPersonDto.name,
              imagePath: `/images/compressed/banned-people/${file.filename}`,
            },
          });

          await prisma.banDetail.create({
            data: {
              personId: newBannedPerson.id,
              reason: createBannedPersonDto.reason,
              startDate: dayjs(createBannedPersonDto.startDate).toDate(),
              endDate: dayjs(createBannedPersonDto.endDate).toDate(),
            },
          });
          return newBannedPerson;
        },
      );

      let bannedPersonWithBans =
        await this.prisma.bannedPerson.findUniqueOrThrow({
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
      console.log(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException('unknown error');
    } finally {
      await fs.rm(file.path, { force: true }).catch(() => { });
    }
  }

  async findAll() {
    const peopleWithActiveBans = await this.prisma.bannedPerson.findMany({
      where: {
        bans: {
          some: {
            endDate: {
              gt: dayjs().toDate()
            }
          }
        }
      },
      include: {
        bans: true,
      },
    });

    const peopleWithExpiredBans = await this.prisma.bannedPerson.findMany({
      where: {
        bans: {
          every: {
            endDate: {
              lt: dayjs().toDate()
            }
          }
        }
      },
      include: {
        bans: true,
      },
    });

    return {
      peopleWithActiveBans: peopleWithActiveBans,
      peopleWithExpiredBans: peopleWithExpiredBans
    }

    // const peopleWithActiveBans = allBannedPeople.filter((people) => {
    //   return people.bans.map((ban) => {
    //     const currentDate = dayjs();
    //     const banEndDate = dayjs(ban.endDate);

    //     if (banEndDate.isAfter(currentDate)) {
    //       return people;
    //     }
    //   });
    // });

    // const peopleWithExpiredBans = allBannedPeople.map((people) => {
    //   return people.bans.filter((ban) => {
    //     const currentDate = dayjs();
    //     const banEndDate = dayjs(ban.endDate);

    //     if (banEndDate.isBefore(currentDate)) {
    //       return ban;
    //     }
    //   });
    // });

    // return allBannedPeople.map((person) => {
    //   return {
    //     ...person,
    //     imagePath: `${process.env.API_URL}images/compressed/banned-people/${path.basename(person.imagePath)}`,
    //   };
    // });
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

  @Cron('0 5 * * *')
  private async removeUncompressedImages() {
    const uncompressedImagesFilePath = path.resolve(
      process.cwd(),
      'images',
      'compressed',
    );

    const images = await fs.readdir(uncompressedImagesFilePath);

    await Promise.all(
      images.map((image) => {
        fs.rm(path.resolve(uncompressedImagesFilePath, image), { force: true });
      }),
    );

    console.log(`removed ${images.length} uncompressed images`);
  }
}
