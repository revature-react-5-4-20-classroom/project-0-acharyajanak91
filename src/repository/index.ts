import {Pool} from 'pg';

//some important exports not to hard code the connection parameter to the code.
//export PG_HOST=URL TO THE DB
//export PG_USER= THE USERNAME OF YOUR DB
//export PG_PASSWORD=WASSPORD
//export PG_DATABASE= THE NAME OF YOUR DATABASE.
export const connectionPool : Pool= new Pool({
    host:process.env['PG_HOST'],
    user:process.env['PG_USER'],
    password:process.env['PG_PASSWORD'],
    database:process.env['PG_DATABASE'],
    port:5432,
    max:5   // this is the maximum number of connection allowed to the database at a time.

});