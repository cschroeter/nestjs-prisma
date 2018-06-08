import { createServer } from 'http';

export const createSubscriptionProviders = (port: number = 5001) => [
  {
    provide: 'SUBSCRIPTION_SERVER',
    useFactory: () => {
      const server = createServer();
      return new Promise(resolve => server.listen(port, () => resolve(server)));
    }
  }
];
