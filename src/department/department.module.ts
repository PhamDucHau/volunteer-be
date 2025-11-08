import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';


@Module({
  imports: [
    // MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
  ],
  providers: [DepartmentService],
  controllers: [DepartmentController],
})
export class DepartmentModule {}
