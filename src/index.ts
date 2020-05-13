import express from 'express';
import bodyparser from 'body-parser';
import {Application,Request,Response} from 'express';
//const express=require('express');
//const app=express();
const app: Application=express();
// this parses our index body whereever we use in the json format.
app.use(bodyparser.json());
app.get('/hello', function(req:Request,res:Response){
    res.json('hello world');
});
app.listen(3000, function(){
    console.log('server started on port 3000....')
});