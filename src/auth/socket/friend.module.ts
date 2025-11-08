import { Module } from '@nestjs/common';
import { FriendGateway } from './friend.gateway';



@Module({
  providers: [FriendGateway],
})
export class FriendModule {}