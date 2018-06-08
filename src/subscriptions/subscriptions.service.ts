import * as WebSocket from 'ws';
import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import { ServerOptions, SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { Prisma } from 'prisma-binding';

@Injectable()
export class SubscriptionsService implements OnModuleDestroy {
  private subscriptionServer: SubscriptionServer;

  constructor(@Inject('SUBSCRIPTION_SERVER') private readonly ws) {}

  createSubscriptionServer(
    schema: any,
    options: ServerOptions = {},
    socketOptions: WebSocket.ServerOptions = {},
  ) {
    this.subscriptionServer = new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onOperation: (message, params) => {
          return {
            ...params,
            context: {
              db: new Prisma({
                typeDefs: 'src/generated/prisma.graphql',
                endpoint: '<YOUR ENDPOINT>',
                debug: true,
              }),
            },
          };
        },
        ...options,
      },
      {
        server: this.ws,
        path: '/subscriptions',
        ...socketOptions,
      },
    );
  }

  onModuleDestroy() {
    this.ws.close();
    this.subscriptionServer.close();
  }
}
