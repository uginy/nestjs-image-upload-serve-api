import { prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

export class ApiImage {
    readonly _id: Schema.Types.ObjectId;

    @prop({required: true})
    name: string;

    @prop()
    type: string;

    @prop({ default: { data: null, contentType: null } })
    image_file: {
        data: Buffer;
        contentType: string;
    }

    @prop({default: Date.now() })
    createdAt: Date;

    url: string;
}
