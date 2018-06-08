import { Query, Resolver, Subscription, Mutation } from '@nestjs/graphql';
import { PrismaService } from './prisma.service';

@Resolver('post')
export class AppResolvers {
  constructor(private readonly prismaService: PrismaService) {}

  @Query('posts')
  async getPosts(obj, args, context, info): Promise<any> {
    return await this.prismaService.query.posts(args, info);
  }

  @Query('post')
  async getPost(obj, args, context, info): Promise<any> {
    return await this.prismaService.query.post(args, info);
  }

  @Mutation('createPost')
  async createPost(obj, args, context, info): Promise<any> {
    return await this.prismaService.mutation.createPost(args, info);
  }

  @Subscription('post')
  onUserMutation() {
    return {
      subscribe: (obj, args, ctx, info) => {
        return this.prismaService.subscription.post(args, info);
      },
    };
  }
}
