import { connect } from 'mongoose';

interface Options {
    mongoUrl: string,
    dbName: string,
}

export class MongodbInit {
    static async connect(options: Options) {

        const { mongoUrl, dbName } = options;

        try {
            await connect(mongoUrl, { dbName });
            console.log('Mongodb was connected with successfully');
        } catch (error) {
            console.log(error);
        }

    }
}
