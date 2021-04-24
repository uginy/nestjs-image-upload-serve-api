import {Module} from '@nestjs/common';
import {ImageModule} from './image/image.module';
import {TypegooseModule} from "nestjs-typegoose";

@Module({
    imports: [ImageModule,
        TypegooseModule.forRoot(process.env.DB_LINK + '?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
