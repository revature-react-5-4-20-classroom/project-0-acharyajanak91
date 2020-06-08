import express,{Router,Request,Response, NextFunction} from 'express';
import { User } from "../models/User";
import { authReadOnlyMiddleware , authRoleFactory } from '../middleware/authMiddleware';
import { getAllUsers, addNewUser } from '../repository/user-data-access';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from '../repository';
import { corsFilter } from '../middleware/corsFilter';
import {sessionMiddleware} from'../middleware/sessionMiddleware'; 

export const userRouter:Router=express.Router();
userRouter.use(authRoleFactory([1,2,3])); 
userRouter.use(corsFilter);
userRouter.use(sessionMiddleware);
//userRouter.use(authReadOnlyMiddleware);
//NOW ONWARDS USERS.........
userRouter.get('/',async (req:Request,res:Response,next:NextFunction)=>{
    try{
        if(req.session!.user.role===3){
        const users :User[]=await getAllUsers();
        res.json(users);}
        else{ res.send('please login with the valid role');}
    } catch(e){
        next(e);
    }
    
});
userRouter.get('/:id',async (req:Request,res:Response)=>{
    const id=+req.params.id; // this + will change it to number dynamic typing
   // console.log(req.session?.user.role);
    if(isNaN(id)){
        res.status(400).send('Please pass the Numeric ID')
    }else if(req.session?.user.id===id || req.session!.user.role===3){
     //   console.log(req.session!.user.id);
       // console.log(req.params.id);
        let client : PoolClient;
    client =await connectionPool.connect();
    try{
        console.log(id);
        let result: QueryResult;
        result=await client.query(
           `SELECT * FROM users WHERE users.id=${id};`);
        //return result.rows;
        res.json(result.rows);
        
    }
    catch (e){
        throw new Error(`Failed to query for all users: ${e.message}`);
    } finally {
        client && client.release();
    }
        // const user=getUserById(id);
        // res.json(user);
    } else {
        res.send('you are not authorized')
    }
});
userRouter.post('/',async (req:Request,res:Response)=>{
    // lets use object destructuring for checking the object's existance.
    if(req.session?.user.role===1){
    let{id,username,password,f_name,l_name,email,role}=req.body;
    if(username && password && f_name && l_name && email&& role){
       await addNewUser(new User(id,username,password,f_name,l_name,email,role));
        res.sendStatus(201);
    }else{
        res.status(400).send('please input all required field')
    }
}else{
    res.send('Not the valid role to insert data')
}
});

//Lets patch the user now
userRouter.patch('/update', async(req:Request,res:Response)=>{
    if(req.session?.user.role!==1){
        res.send('You are not the valid user for updating the user');
        
    } else{
        let{id,username,password,f_name,l_name,email,role}=req.body;
        if(id && username && password && f_name && l_name && email&& role){
            let myUser:User=new User(id,username,password,f_name,l_name,email,role);
            console.log(myUser.id);
            console.log(typeof(myUser.id));
            console.log(myUser.username);
            console.log(typeof(myUser.username));
            console.log(myUser.password);
            console.log(myUser.f_name);
            console.log(myUser.l_name);
            console.log(myUser.email);
            console.log(myUser.role);
            let client: PoolClient=await connectionPool.connect();
    try{
        const IdResult : QueryResult=await client.query(
            `SELECT id FROM users;`);
            console.log(IdResult.rows);
            console.log(`I found ${IdResult.rows[0].id}`);// just to check if the userid exists
            await client.query(`UPDATE users
            SET username=$1 , "password"=$3, first_name=$4,last_name=$5,email=$6,role_id=$7                   
            WHERE id=$2;`,[myUser.username,myUser.id,myUser.password,myUser.f_name,myUser.l_name,myUser.email,myUser.role]);
        console.log('I made it here');
        const result=await client.query(
            `SELECT * FROM users WHERE users.id=$1;`,[myUser.id]);
        // let result:QueryResult =await client.query(
        //     `SELECT users.id,users.username,users."password",users.first_name,users.last_name,users.email,users.role_id
        //     FROM users 
        //     WHERE users.id=$1;`,[myUser.id]
        // );
        //return result.rows[0];
        res.status(201).send(result.rows[0]);
        // return result.rows.map(
        //     (u)=>{return new User(u.id,u.username,u.password,u.f_name,u.l_name,u.email,u.role)}
        // )[0];
    } catch (e) {
        throw new Error (`Failed to update user to DB: ${e.message}`);
    }finally{
        client && client.release();
    } 
}}     
});
