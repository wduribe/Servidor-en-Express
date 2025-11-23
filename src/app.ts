import { envsAdapter } from "./config/envs.adapter";
import { MongodbInit } from "./database/mongo.initi";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";


(async () => {
    main();
})();

async function main() {

    await MongodbInit.connect({
        mongoUrl: envsAdapter.MONGO_URL,
        dbName: envsAdapter.MONGO_NAME,
    });

    const server = new Server({
        port: envsAdapter.PORT,
        routes: AppRoutes.routes,
    });

    server.start();
}