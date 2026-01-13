import { Prisma } from '@prisma/client';
import type { Request } from 'express';

export type AccountFrontEnd = Prisma.AccountGetPayload<{
    select: {
        id: true;
        email: true;
        name: true;
        role: {
            select: {
                name: true;
            };
        };
    };
}>;

export type RequestWithAccount = Request & {
  account: {
    sub: number;
    email: string;
    iat: number;
    exp: number;
  };
};