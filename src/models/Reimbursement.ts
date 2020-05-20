// are creating this as a DAO object for books endpoint.
export class Reimbursement{
    id:number;
    author:number;
    amount:number;
    date_submitted:Date;
    date_resolved:Date;
    description:string;
    resolver:number;
    status:number;
    reimbursement_type:number;
    constructor(id:number,author:number,amount:number,date_submitted:Date,date_resolved:Date,description:string,resolver:number,status:number,reimbursement_type:number){
        this.id=id;
        this.author=author;
        this.amount=amount;
        this.date_submitted=date_submitted;
        this.date_resolved=date_resolved;
        this.description=description;
        this.resolver=resolver;
        this.status=status;
        this.reimbursement_type=reimbursement_type;
    }
}