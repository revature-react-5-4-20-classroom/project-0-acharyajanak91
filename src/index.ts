import express from "express";
import bodyParser from "body-parser";
import {Application, Request, Response,NextFunction} from "express";
import {reimbursementRouter} from "./routers/reimbursementRouter";
import {userRouter } from "./routers/userRouter";
import {sessionMiddleware} from './middleware/sessionMiddleware'
import { loggingMiddleware } from "./middleware/loggingMiddleware";
import { findUserByUsernamePassword } from "./repository/user-data-access";
import {PoolClient, QueryResult} from "pg";
import {connectionPool} from "./repository";
import { corsFilter } from "./middleware/corsFilter";


//express() is the top level function 
//invoked for the express appliction.
const app: Application=express();
app.get('/new-endpoint',(req:Request,res:Response)=>{
    res.send('webhook worked');
})
app.use(bodyParser.json());
//lets use the cors filter
//lets ask app to use our middleware

app.use(corsFilter);
app.use(sessionMiddleware);
//app.use(authAdminMiddleware);
// now lets use the loggingMiddleware
app.use(loggingMiddleware);


// just print something on the server console
console.log('Server starting soon.......');



// let's do the view s demo:

app.get('/views',(req:Request,res:Response)=>{
    console.log(req.session);// try to log the session
    if(req.session&&req.session.views){
        req.session.views++;
        res.send(`Reached this end point for ${req.session.views} times`)
    }else if(req.session) {
        req.session.views=1;
        res.send('We have viewed this page for first time')
    }else{
        res.send('Reached the view point without the session');
    }
}
);

app.post('/login', async (req:Request,res:Response)=>{
    const {username,password}=req.body;
    if(!username||!password){
        console.log('hey you cannot get in without it');
        res.status(400).send('Please include username and password fields for login');
    }else{
        try{
        const user= await findUserByUsernamePassword(username,password);
        if(req.session){
            req.session.user=user;
        }
        res.json(user);
    } catch (e){
        console.log(e.message);
        res.status(401).send('Failed to authenticate username and password');
    }

    }

});

app.use('/reimbursement',reimbursementRouter);
app.use('/users',userRouter);


//Listener port for the API for the 
app.listen(1999,()=>{
    console.log("app has started, testing connection:");
    connectionPool.connect().then(
        (client :PoolClient)=>{
            console.log('connected');
            client.query('SELECT * FROM users;').then(
                (result: QueryResult)=>{
                    console.log(result.rows);  // just displays all rows
                }
            ).catch((err)=>{
                console.error(err.message);
            });
        }
    )



})