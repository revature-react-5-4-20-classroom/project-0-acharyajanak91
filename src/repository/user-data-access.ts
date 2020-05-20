import {User} from '../models/User';
import {PoolClient, QueryResult} from 'pg';
import {connectionPool} from '.';
//import { userRouter } from '../routers/userRouter';

//async function can await promises instead of using callbacks
//async function return promises
export async function getAllUsers(): Promise<User[]>{
    let client : PoolClient;
    client =await connectionPool.connect();
    try{
        let result: QueryResult;
        result=await client.query(
           `SELECT users.id, users.username, users.first_name,users.last_name,users.password, users.email, roles.role_name
           FROM users INNER JOIN roles ON users.role_id=roles.id;` 
        );
        for(let row of result.rows){
            console.log(row.username);
        }
        return result.rows.map((u)=>{
            return new User(u.id, u.username, u.password,u.f_name,u.l_name,u.email,u.role_name);
        });
    }catch (e){
        throw new Error(`Failed to query for all users: ${e.message}`);
    } finally {
        client && client.release();
    }
}
export async function getUserById(id:number):Promise<User[]> {
    let client : PoolClient;
    client =await connectionPool.connect();
    console.log(id);
    try{
        let result: QueryResult;
        result=await client.query(
           `SELECT * FROM users WHERE users.id=$1;`,[id]);
        return result.rows;
           // return result.rows.map((u)=>{
        //     return new User(u.id, u.username, u.password,u.f_name,u.l_name,u.email,u.role_name);
        // })[0];
    }catch (e){
        throw new Error(`Failed to query for all users: ${e.message}`);
    } finally {
        client && client.release();
    }
    
}

export async function addNewUser(user:User) : Promise<User> {
    let client: PoolClient=await connectionPool.connect();
    try{
        const roleIdResult : QueryResult=await client.query(
            `SELECT * FROM roles WHERE roles.id=$1`,[user.role]
        );
        const roleId=roleIdResult.rows[0].id;
        let insertUserResult : QueryResult = await client.query(
            `INSERT INTO users(id,username,"password",first_name,last_name,email,role_id) VALUES
            ($1,$2,$3,$4,$5,$6,$7);`,[user.id,user.username,user.password,user.f_name,user.l_name,user.email,user.role]
        )
        let result:QueryResult =await client.query(
            `SELECT user.id,users.username,users."password",users.first_name,users.last_name,users.email,roles.role_name
            FROM users INNER JOIN roles ON users.roles_id=roles.id
            WHERE users.username=$1;`,[user.username]
        );
        return result.rows.map(
            (u)=>{return new User(u.id,u.username,u.password,u.f_name,u.l_name,u.email,u.role_name)}
        )[0];
    } catch (e) {
        throw new Error (`Failed to add user to DB: ${e.message}`);
    }finally{
        client && client.release();
    }
}

export async function findUserByUsernamePassword(username:string, password:string): Promise<User>{
    let client :PoolClient;
    client =await connectionPool.connect();
    try{
        let result:QueryResult;
        result=await client.query(
            ` SELECT users.id, users.username, users.password,users.first_name,users.last_name,users.email,roles.role_name
            FROM users INNER JOIN roles ON users.role_id=roles.id
            WHERE users.username = $1 AND users.password =$2;`, [username,password]
        );
        const usersMatchingUsernamePassword = result.rows.map((u)=>{
            return new User(u.id, u.username,u.password,u.f_name,u.l_name,u.email,u.role_name);
        })
        if(usersMatchingUsernamePassword.length>0){
            return usersMatchingUsernamePassword[0];
        }else{
            throw new Error('Username and Password not matched to a valid user');
        }
    }catch (e){
        throw new Error(`Failed to validate user with DB: ${e.message}`);
    } finally{
        client&&client.release();
    }
}