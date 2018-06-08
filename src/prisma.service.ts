import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma-binding';

@Injectable()
export class PrismaService extends Prisma {
  constructor() {
    super({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: '<YOUR ENDPOINT>',
      debug: false,
    });
  }
}
