import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ProductSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'User', schema: ProductSchema}
    ])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
