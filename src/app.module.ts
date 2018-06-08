import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { GraphQLModule, GraphQLFactory } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolvers } from './app.resolver';
import { SubscriptionsService } from './subscriptions/subscriptions.service';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { Prisma } from './generated/prisma';

@Module({
  imports: [GraphQLModule, SubscriptionsModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolvers,
    {
      provide: Prisma,
      useFactory: () => {
        return new Prisma({
          endpoint: '<YOUR ENDPOINT>',
          debug: false,
        });
      },
    },
  ],
})
export class ApplicationModule implements NestModule {
  constructor(
    private readonly graphQLFactory: GraphQLFactory,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const typeDefs = this.graphQLFactory.mergeTypesByPaths('src/**/*.graphql');
    const schema = this.graphQLFactory.createSchema({ typeDefs });

    this.subscriptionsService.createSubscriptionServer(schema);

    consumer
      .apply(
        graphiqlExpress({
          endpointURL: '/graphql',
          subscriptionsEndpoint: `ws://localhost:5001/subscriptions`,
        }),
      )
      .forRoutes('/graphiql')
      .apply(
        graphqlExpress(req => ({
          schema,
          rootValue: req,
          context: req,
        })),
      )
      .forRoutes('/graphql');
  }
}
