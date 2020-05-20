import {Reimbursement} from '../models/Reimbursement';
import {PoolClient, QueryResult} from 'pg';
import {connectionPool} from '.';
//import { userRouter } from '../routers/userRouter';

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
        for(let row of result.rows){
            console.log(row.amount);
        }
        return result.rows.map((u)=>{
            return new Reimbursement(u.id, u.author, u.amount,u.datesubmitted,u.dateresolved,u.description,u.reslover,u.status,u.reimbursement_type);
        });
    }catch (e){
        throw new Error(`Failed to query for all users: ${e.message}`);
    } finally {
        client && client.release();
    }
}
export async function getReimbursementById(id:number):Promise<Reimbursement[]> {
    let client : PoolClient;
    client =await connectionPool.connect();
    console.log(id);
    try{
        let result: QueryResult;
        result=await client.query(
           `SELECT * FROM Reimbursement WHERE reimbursement.reimbursement_id=$1;`,[id]);
        return result.rows;
           // return result.rows.map((u)=>{
        //     return new User(u.id, u.username, u.password,u.f_name,u.l_name,u.email,u.role_name);
        // })[0];
    }catch(e){
        throw new Error(`Failed to query for all users: ${e.message}`);
    } finally {
        client && client.release();
    }
    
}

export async function addNewReimbursement(reimburseemnt:Reimbursement)  {
    let client: PoolClient=await connectionPool.connect();
    try{
        const roleIdResult : QueryResult=await client.query(
            `SELECT * FROM reimbursement WHERE reimbursement.author=$1 or reimbursement.resolver=$2`,[reimburseemnt.author,reimburseemnt.resolver]
        );
        const roleId=roleIdResult.rows[0].id;
        let insertUserResult : QueryResult = await client.query(
            `INSERT INTO reimbursement(id,author,amount,date_submitted,date_resolved,description,resolver,status,"type") VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9);`,[reimburseemnt.id,reimburseemnt.author,reimburseemnt.author,reimburseemnt.date_submitted,reimburseemnt.date_resolved,reimburseemnt.description,reimburseemnt.resolver,reimburseemnt.status,reimburseemnt.reimbursement_type]
        )
    } catch (e) {
        throw new Error (`Failed to add user to DB: ${e.message}`);
    }finally{
        client && client.release();
    }
}

