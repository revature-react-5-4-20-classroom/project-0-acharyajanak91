 import express,{Router,Request,Response,NextFunction} from 'express';
import { Reimbursement } from "../models/Reimbursement";
 //import { User } from '../model/User';
 import {authReadOnlyMiddleware,authRoleFactory} from '../middleware/authMiddleware';
 //import { getReimbursementById, getAllReimbursement, addNewReimbursement } from '../repository/reimbursement-data-access';
 import { getReimbursementById, getAllReimbursement } from '../repository/reimbursement-data-access';

 export const reimbursementRouter:Router=express.Router();
 //lets use the authentication in the book router too.
reimbursementRouter.use(authRoleFactory(['Finance_Manager']));  // I commented this for later use.
reimbursementRouter.use(authReadOnlyMiddleware);
// //get methods for users reimbursement reading
 reimbursementRouter.get('/',async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const users :Reimbursement[]=await getAllReimbursement();
        res.json(users);
    } catch(e){
        next(e);
    }
    
});
//lets get book by ID
reimbursementRouter.get('/:id',(req:Request,res:Response)=>{
    const id=+req.params.id; // + change to number ie dynamic type
    if(isNaN(id)){
        res.status(400).send('Must include numerric id in path');
    } else {
        res.json(getReimbursementById(id));
    }
});
// //now lets see the post method for Book endpoint.

// bookRouter.post('/',(req:Request,res:Response)=>{
//     // lets use object destructuring for checking the object's existance.
//     let{id,title,author,yearPublished,pageCount}=req.body;
//     if(id&&title&&author&&yearPublished){
//         addNewBook(new Book(id,title,author,yearPublished,pageCount));
//         res.sendStatus(201);
//     }else{
//         res.status(400).send('please input all required field')
//     }
// });
// //Functions for BOOKS
// function getAllBooks():Book[]{
//     return books;
// }
// function getBookById(id:number): Book {
//     return books.filter((book)=>{
//         return book.id===id;
//     })[0];
// }
// function addNewBook(book:Book): Book {
//     const booksMatchingId: Book[]=books.filter(
//         (bookElement:Book)=>{
//             return bookElement.id===book.id;
//         }
//     );
//     if (booksMatchingId.length===0){
//         books.push(book);
//         return book;
//     }else{
//         throw new Error('Book Id already taken');
//     }
// }

