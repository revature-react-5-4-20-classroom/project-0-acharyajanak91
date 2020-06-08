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
            `SELECT * FROM users;`
            );
        for(let row of result.rows){
            console.log(row.username);
        }
        return result.rows;
    }catch (e){
        throw new Error(`Failed to query for all users: ${e.message}`);
    } finally {
        client && client.release();
    }
}
// export async function getUserById(id:number):Promise<User> {
//     let client : PoolClient;
//     client =await connectionPool.connect();
//     try{
//         console.log(id);
//         let result: QueryResult;
//         result=await client.query(
//            `SELECT * FROM users WHERE users.id=${id};`);
//         //return result.rows;
//         console.log(result.rows);
//             return result.rows.map((u)=>{
//             return new User(u.id, u.username, u.password,u.f_name,u.l_name,u.email,u.role_name);
//          })[0];
//     }catch (e){
//         throw new Error(`Failed to query for all users: ${e.message}`);
//     } finally {
//         client && client.release();
//     }
    
// }

export async function addNewUser(user:User):Promise<User>{
    let client: PoolClient=await connectionPool.connect();
    try{
        const roleIdResult : QueryResult=await client.query(
            `SELECT * FROM roles WHERE roles.id=$1`,[user.role]
        );
        const roleId=roleIdResult.rows[0].id;
        console.log(roleId);
        let insertUserResult : QueryResult = await client.query(
            `INSERT INTO users(id,username,"password",first_name,last_name,email,role_id) VALUES
            ($1,$2,$3,$4,$5,$6,$7);`,[user.id,user.username,user.password,user.f_name,user.l_name,user.email,user.role]
        )
        console.log(insertUserResult);
        let result:QueryResult =await client.query(
            `SELECT users.id,users.username,users."password",users.first_name,users.last_name,users.email,users.role_id
            FROM users INNER JOIN roles ON users.role_id=roles.id
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
// update user 
// TODO cleanup the function to work::::::::::

//export async function updateUser(myUser:User):Promise<User>{
    // let client: PoolClient=await connectionPool.connect();
    // try{
    //     const IdResult : QueryResult=await client.query(
    //         `SELECT id FROM users WHERE users.id=$1;`,[myUser.id]
    //     );
    //    console.log(`I found ${IdResult.rows[0].id}`);// just to check if the userid exists
    //    await client.query(`UPDATE users
    //         SET username=$1 , "password"=$3, first_name=$4,last_name=$5,email=$6,role_id=$7                   
    //         WHERE id=$2;`,[myUser.username,myUser.id,myUser.password,myUser.f_name,myUser.l_name,myUser.email,myUser.role]);
    //     console.log('I made it here');
    //     const result=await client.query(
    //         `SELECT * FROM users WHERE users.id=$1;`,[myUser.id]);
    //     // let result:QueryResult =await client.query(
    //     //     `SELECT users.id,users.username,users."password",users.first_name,users.last_name,users.email,users.role_id
    //     //     FROM users 
    //     //     WHERE users.id=$1;`,[myUser.id]
    //     // );
    //     return result.rows[0];
    //     //res.send(result.rows);
    //     // return result.rows.map(
    //     //     (u)=>{return new User(u.id,u.username,u.password,u.f_name,u.l_name,u.email,u.role)}
    //     // )[0];
    // } catch (e) {
    //     throw new Error (`Failed to update user to DB: ${e.message}`);
    // }finally{
    //     client && client.release();
    // }
    //await updateUser(myUser);
   
//}
//}


export async function findUserByUsernamePassword(username:string, password:string): Promise<User>{
    let client :PoolClient;
    client =await connectionPool.connect();
    try{
        let result:QueryResult;
        result=await client.query(
            `SELECT users.id, users.username, users."password",users.first_name,users.last_name,users.email,users.role_id
            FROM users RIGHT JOIN roles ON users.role_id=roles.id
            WHERE users.username = $1 AND users.password =$2;`, [username,password]
        );
        const usersMatchingUsernamePassword = result.rows.map((u)=>{
            return new User(u.id, u.username,u.password,u.first_name,u.last_name,u.email,u.role_id);
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