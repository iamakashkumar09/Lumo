import * as path from "path";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";


export default(): PostgresConnectionOptions=> ({
    url:process.env.DB_URL,
    type:'postgres',
    port:Number(process.env.DB_PORT)||5432,
    entities:[path.join(__dirname, '..', '**', '*.entity{.ts,.js}')],
    synchronize:true,
})