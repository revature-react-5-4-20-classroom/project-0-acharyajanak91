import express,{Router,Request,Response, NextFunction} from 'express';
import { User } from "../models/User";
import { authReadOnlyMiddleware , authRoleFactory } from '../middleware/authMiddleware';
import { getUserById, getAllUsers, addNewUser } from '../repository/user-data-access';

export const userRouter:Router=express.Router();
userRouter.use(authRoleFactory(['Admin','Finance_Manager']));
//userRouter.use(authReadOnlyMiddleware);
//NOW ONWARDS USERS.........
userRouter.get('/',async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const users :User[]=await getAllUsers();
        res.json(users);
    } catch(e){
        next(e);
    }
    
});
userRouter.get('/:id',(req:Request,res:Response)=>{
    const id=+req.params.id; // this + will change it to number dynamic typing
    if(isNaN(id)){
        res.status(400).send('Please pass the Numeric ID')
    } else{
        const user=getUserById(id);
        res.json(user);
    }
});
userRouter.post('/',async (req:Request,res:Response)=>{
    // lets use object destructuring for checking the object's existance.
    let{id,username,password,f_name,l_name,email,role}=req.body;
    if(id && username && password && f_name && l_name && email && role){
       await addNewUser(new User(id,username,f_name,l_name,password,email,role));
        res.sendStatus(201);
    }else{
        res.status(400).send('please input all required field')
    }
});


