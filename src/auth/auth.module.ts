import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { HttpModule } from '@nestjs/axios';
import { FriendGateway } from './socket/friend.gateway';
import { Role, RoleSchema } from './schemas/role.schema';

@Module({

  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{ name: Role.name, schema: RoleSchema },]),
    HttpModule
  ],
  exports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService, FriendGateway]
})
export class AuthModule {}
