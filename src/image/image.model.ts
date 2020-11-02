import { modelOptions, prop, Severity } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

type ImageFile = {
    data: Buffer | null;
    contentType: string | null;
}

@modelOptions({
    options: {
        allowMixed: Severity.ALLOW,
        customName: 'notification',
    },
})

export class ApiImage {
    readonly _id: Schema.Types.ObjectId;

    @prop ( { required: true } )
    name: string;

    @prop ()
    type: string;

    @prop ( { default: { data: null, contentType: null } } )
    image_file: ImageFile

    @prop ( { default: Date.now () } )
    createdAt: Date;

    url: string;
}
