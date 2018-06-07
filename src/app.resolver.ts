import { Query, Resolver } from '@nestjs/graphql';
import { forwardTo } from 'prisma-binding';

@Resolver('posts')
export class AppResolvers {
  @Query('posts')
  async getPosts(obj, args, context, info): Promise<any> {
    return forwardTo('db')(obj, args, context, info);
  }

  @Query('post')
  async getPost(obj, args, context, info): Promise<any> {
    return forwardTo('db')(obj, args, context, info);
  }
}
