import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { GraphQLModule, GraphQLFactory } from '@nestjs/graphql';
import { Prisma } from 'prisma-binding';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolvers } from './app.resolver';

@Module({
  imports: [GraphQLModule],
  controllers: [AppController],
  providers: [AppService, AppResolvers],
})
export class ApplicationModule implements NestModule {
  constructor(private readonly graphQLFactory: GraphQLFactory) {}

  configure(consumer: MiddlewareConsumer) {
    const typeDefs = this.graphQLFactory.mergeTypesByPaths('src/**/*.graphql');
    const schema = this.graphQLFactory.createSchema({ typeDefs });

    consumer
      .apply(graphiqlExpress({ endpointURL: '/graphql' }))
      .forRoutes('/graphiql')
      .apply(
        graphqlExpress(req => ({
          schema,
          rootValue: req,
          resolverValidationOptions: {
            requireResolversForResolveType: false,
          },
          context: {
            db: new Prisma({
              typeDefs: 'src/generated/prisma.graphql',
              endpoint: '<YOUR ENDPOINT>',
              debug: true,
            }),
          },
        })),
      )
      .forRoutes('/graphql');
  }
}
