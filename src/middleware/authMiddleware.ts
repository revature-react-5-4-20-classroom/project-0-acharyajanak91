// TODO auth stuff
import express, {Request, Response, NextFunction} from 'express';
import session from 'express-session';
import { User } from '../models/User';

export const authAdminMiddleware=(req:Request, res:Response, next: NextFunction)=>{
    if(!req.session||!req.session.user){
        res.status(401).send('Please Login');
    } else if (req.session.user.role!==1||req.session.user.role!==2||req.session.user.role!==3){
        res.status(403).send('You are not authorized to use this system with that role');
    } else {
        next();
    }
}
// modified to reflect the role changes.
export function authRoleFactory(roles:string[]){
    return(req:Request,res:Response, next:NextFunction)=>{
        if(!req.session||!req.session.user){
            res.status(401).send('please login');
        } else {
            let allowed =false;
            for (let role of roles){
                if(req.session.user.role===role){ // role is passed from respective routers
                    allowed =true;
                }
            }
            if(allowed){
                next();
            }else{
                res.status(403).send(`Not authorized with role: ${req.session.user.role}`);
            }
        }
    }
}

export const authReadOnlyMiddleware=(req:Request, res:Response,next: NextFunction)=>{
    if(req.method==='GET'){
        next();
    }else if(!req.session||!req.session.user){
        res.status(401).send(`can't ${req.method} usless you first login`);
    } else {
        next();
    }
}