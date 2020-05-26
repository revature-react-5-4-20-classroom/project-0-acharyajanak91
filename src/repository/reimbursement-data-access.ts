import {Reimbursement} from '../models/Reimbursement';
import {PoolClient, QueryResult} from 'pg';
import {connectionPool} from '.';
import { userRouter } from '../routers/userRouter';
import { reimbursementRouter } from '../routers/reimbursementRouter';

//async function can await promises instead of using callbacks
//async function return promises
export async function getAllReimbursement(): Promise<Reimbursement[]>{
    let client : PoolClient;
    client =await connectionPool.connect();
    try{
        let result: QueryResult;
        result=await client.query(
           `SELECT * FROM reimbursement;` 
        );
        return result.rows;
    }catch (e){
        throw new Error(`Failed to query for all users: ${e.message}`);
    } finally {
        client && client.release();
    }
}
// export async function getReimbursementById(id:number):Promise<Reimbursement[]> {
//     let client : PoolClient;
//     client =await connectionPool.connect();
//     console.log(id);
//     try{
//         let result: QueryResult;
//         result=await client.query(
//            `SELECT * FROM Reimbursement WHERE reimbursement.reimbursement_id=$1;`,[id]);
//         return result.rows;
//            // return result.rows.map((u)=>{
//         //     return new User(u.id, u.username, u.password,u.f_name,u.l_name,u.email,u.role_name);
//         // })[0];
//     }catch(e){
//         throw new Error(`Failed to query for all users: ${e.message}`);
//     } finally {
//         client && client.release();
//     }
    
// }
export async function addReimbursement(reimb:Reimbursement){
    let client: PoolClient=await connectionPool.connect();
    try{
        const reimbResult : QueryResult=await client.query(
            `SELECT * FROM reimbursement WHERE reimbursement.author=$1;`,[reimb.author]
        );
        console.log(reimbResult);
        let insertReimbResult : QueryResult = await client.query(
            `INSERT INTO reimbursement (reimbursement_id,author,amount,date_submitted,date_resolved,description,resolver,status,rembursement_type) VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9);`,[reimb.reimbursement_id,reimb.author,reimb.amount,reimb.date_submitted,reimb.date_resolved,reimb.description,reimb.resolver,reimb.status,reimb.rembursement_type]
        );
        console.log(insertReimbResult);
        // let result:QueryResult =await client.query(
        //     `SELECT reimbursement_id,author,amount,date_submitted,date_resolved,description,resolver,status,rembursement_type
        //     WHERE reimbursement.author=$1;`,[reimb.author]
        // );
        // return result.rows;
        // return result.rows.map(
        //     (u)=>{return new Reimbursement(u.id,u.author,u.amount,u.date_submitted,u.date_resolved,u.description,u.resolver,u.status,u.reimbursement_type);}
        // )[0];
    } catch (e) {
        throw new Error (`Failed to add user to DB: ${e.message}`);
    }finally{
        client && client.release();
    }
}

