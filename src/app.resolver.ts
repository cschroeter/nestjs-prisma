import { Query, Resolver, Subscription, Mutation } from '@nestjs/graphql';
import { Prisma } from './generated/prisma';

@Resolver('post')
export class AppResolvers {
  constructor(private readonly prisma: Prisma) {}

  @Query('posts')
  async getPosts(obj, args, context, info): Promise<any> {
    return await this.prisma.query.posts(args, info);
  }

  @Query('post')
  async getPost(obj, args, context, info): Promise<any> {
    return await this.prisma.query.post(args, info);
  }

  @Mutation('createPost')
  async createPost(obj, args, context, info): Promise<any> {
    return await this.prisma.mutation.createPost(args, info);
  }

  @Subscription('post')
  onUserMutation() {
    return {
      subscribe: (obj, args, ctx, info) => {
        return this.prisma.subscription.post(args, info);
      },
    };
  }
}
