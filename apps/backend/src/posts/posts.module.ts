import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './schemas/post.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { Reaction, ReactionSchema } from './schemas/reaction.schema';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
            { name: Comment.name, schema: CommentSchema },
            { name: Reaction.name, schema: ReactionSchema },
        ]),
        UsersModule,
    ],
    controllers: [PostsController],
    providers: [PostsService],
    exports: [PostsService],
})
export class PostsModule { }
