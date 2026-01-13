import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export const hashPassword = async (
  unencryptedPassword: string,
): Promise<string> => {
  return await bcrypt.hash(unencryptedPassword, 10);
};

export const checkPassword = async (
  unencryptedPassword: string,
  hashedString: string,
): Promise<boolean> => {
  return await bcrypt.compare(unencryptedPassword, hashedString);
};

export const isAccountAdmin = async (
  roleId: number,
  prisma: PrismaService,
): Promise<boolean> => {
  const adminRole = await prisma.role.findFirstOrThrow({
    where: {
      name: 'admin',
    },
  });

  if (roleId === adminRole.id) {
    return true;
  }

  return false;
};
