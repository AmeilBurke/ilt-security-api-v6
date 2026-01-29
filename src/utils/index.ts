import bcrypt from 'bcrypt';
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

export const isAccountVenueManager = async (
  roleId: number,
  prisma: PrismaService,
): Promise<boolean> => {
  const venueManagerRole = await prisma.role.findFirstOrThrow({
    where: {
      name: 'venue manager',
    },
  });

  if (roleId === venueManagerRole.id) {
    return true;
  }

  return false;
};