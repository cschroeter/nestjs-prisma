import { Query, Resolver, Subscription, Mutation } from '@nestjs/graphql';
import { forwardTo } from 'prisma-binding';

@Resolver('post')
export class AppResolvers {
  @Query('posts')
  async getPosts(obj, args, context, info): Promise<any> {
    return forwardTo('db')(obj, args, context, info);
  }

  @Query('post')
  async getPost(obj, args, context, info): Promise<any> {
    return forwardTo('db')(obj, args, context, info);
  }

  @Mutation('createPost')
  async createPost(obj, args, context, info): Promise<any> {
    return forwardTo('db')(obj, args, context, info);
  }

  @Subscription('post')
  onUserMutation() {
    return {
      subscribe: (obj, args, ctx, info) => {
        return ctx.db.subscription.post(args, info);
      },
    };
  }
}
