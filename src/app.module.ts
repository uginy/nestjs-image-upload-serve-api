import { Module } from '@nestjs/common';
import { ImageModule } from './image/image.module';
import { TypegooseModule } from "nestjs-typegoose";

@Module({
  imports: [ImageModule,
    TypegooseModule.forRoot('mongodb://localhost:53353/images', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
