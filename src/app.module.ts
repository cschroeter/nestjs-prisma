import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppResolvers } from './app.resolver';
import { Prisma } from './generated/prisma';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      path: '/',
      installSubscriptionHandlers: true,
      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },
    }),
  ],
  providers: [
    AppResolvers,
    {
      provide: Prisma,
      useFactory: () => {
        return new Prisma({
          endpoint: 'https://eu1.prisma.sh/public-agatepuma-476/my-app/dev',
          debug: false,
        });
      },
    },
  ],
})
export class ApplicationModule {}
