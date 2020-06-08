 import express,{Router,Request,Response,NextFunction} from 'express';
import { Reimbursement } from "../models/Reimbursement";
 //import { User } from '../model/User';
 import {authReadOnlyMiddleware,authRoleFactory} from '../middleware/authMiddleware';
 //import { getReimbursementById, getAllReimbursement, addNewReimbursement } from '../repository/reimbursement-data-access';
 import {  getAllReimbursement,addReimbursement } from '../repository/reimbursement-data-access';
 import { PoolClient, QueryResult } from 'pg';
 import { connectionPool } from '../repository';
 export const reimbursementRouter:Router=express.Router();
 //lets use the authentication in the book router too.
reimbursementRouter.use(authRoleFactory([3,1]));  // I commented this for later use.
reimbursementRouter.use(authReadOnlyMiddleware);
// //get methods for users reimbursement reading
 reimbursementRouter.get('/',async (req:Request,res:Response,next:NextFunction)=>{
    
    try{
        if(req.session!.user.role===3){
        const reimb :Reimbursement[]=await getAllReimbursement();
        res.json(reimb);} else { res.send('please login with the valid role');}
    } catch(e){
        next(e);
    }
    
});
// TODO reimbursement by status.
reimbursementRouter.get('/status/:status', async(req:Request,res:Response)=>{
    const id=+req.params.status; // + change to number ie dynamic type
    if(isNaN(id)){
        res.status(400).send('Must include numerric id in path');
    } else {
        //res.json(getReimbursementById(id));
        let client : PoolClient;
    client =await connectionPool.connect();
    console.log(id);
    try{
        let result: QueryResult;
        result=await client.query(
           `SELECT * FROM Reimbursement WHERE reimbursement.status=$1;`,[id]);
        console.log(result.rows[0]);
           res.send(result.rows);
           // return result.rows.map((u)=>{
        //     return new User(u.id, u.username, u.password,u.f_name,u.l_name,u.email,u.role_name);
        // })[0];
    }catch(e){
        throw new Error(`Failed to query for reimbursement: ${e.message}`);
    } finally {
        client && client.release();
    }
    }
});
//lets get book by ID
reimbursementRouter.get('/:id',async (req:Request,res:Response)=>{
    const id=+req.params.id; // + change to number ie dynamic type
    if(isNaN(id)){
        res.status(400).send('Must include numerric id in path');
    } else {
        //res.json(getReimbursementById(id));
        let client : PoolClient;
    client =await connectionPool.connect();
    console.log(id);
    try{
        let result: QueryResult;
        result=await client.query(
           `SELECT * FROM Reimbursement WHERE reimbursement.author=$1;`,[id]);
        res.send(result.rows);
           // return result.rows.map((u)=>{
        //     return new User(u.id, u.username, u.password,u.f_name,u.l_name,u.email,u.role_name);
        // })[0];
    }catch(e){
        throw new Error(`Failed to query for all users: ${e.message}`);
    } finally {
        client && client.release();
    }
    }
});

reimbursementRouter.post('/postReimbursement',async (req:Request,res:Response)=>{
    // lets use object destructuring for checking the object's existance.
    console.log(req.body);
    let {reimbursement_id,author,amount,date_submitted,date_resolved,description,resolver,status,rembursement_type}=req.body;
    if(req.session?.user.id===author ||req.session!.user.role===3){
   
    if(reimbursement_id && author){
       await addReimbursement(new Reimbursement(reimbursement_id,author,amount,date_submitted,date_resolved,description,resolver,status,rembursement_type));
        res.sendStatus(201);
    }else{
        res.status(400).send('please input all required field')
    }
}else{
    res.status(400).send('Not the valid role to insert data')
}
});

//lets now patch the reimbursement
//Lets patch the user now
reimbursementRouter.patch('/update', async(req:Request,res:Response)=>{
    if(req.session?.user.role!==3){
        res.send('You are not the valid user for updating the Reimbursement');
        
    } else{
        let {reimbursement_id,author,amount,date_submitted,date_resolved,description,resolver,status,rembursement_type}=req.body;
        if(reimbursement_id && author && amount && date_submitted && description&& resolver&&status&&rembursement_type){
            
            let client: PoolClient=await connectionPool.connect();
    try{
        const IdResult : QueryResult=await client.query(
            `SELECT reimbursement_id FROM reimbursement;`);
            console.log(IdResult.rows);
            console.log(`I found ${IdResult.rows}`);// just to check if the userid exists
            await client.query(`UPDATE reimbursement
            SET author=$1 , amount=$3, date_submitted=$4,date_resolved=$5,description=$6,resolver=$7,status=$8,rembursement_type=$9                   
            WHERE reimbursement_id=$2;`,[author,reimbursement_id,amount,date_submitted,date_resolved,description,resolver,status,rembursement_type]);
        //console.log('I made it here');
        const result=await client.query(
            `SELECT * FROM reimbursement WHERE reimbursement_id=$1;`,[reimbursement_id]);
        // let result:QueryResult =await client.query(
        //     `SELECT users.id,users.username,users."password",users.first_name,users.last_name,users.email,users.role_id
        //     FROM users 
        //     WHERE users.id=$1;`,[myUser.id]
        // );
        //return result.rows[0];
        //console.log(result);
        res.status(201).send(result.rows);
        // return result.rows.map(
        //     (u)=>{return new User(u.id,u.username,u.password,u.f_name,u.l_name,u.email,u.role)}
        // )[0];
    } catch (e) {
        throw new Error (`Failed to update Reimbursement to DB: ${e.message}`);
    }finally{
        client && client.release();
    } 
}}     
});

