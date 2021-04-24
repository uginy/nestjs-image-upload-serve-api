import { Module } from '@nestjs/common';
import { ImageModule } from './image/image.module';
import { TypegooseModule } from "nestjs-typegoose";

@Module({
  imports: [ImageModule,
    TypegooseModule.forRoot('mongodb+srv://ardname:kiev220976@cluster0.5vf6a.mongodb.net/imagesapi?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
