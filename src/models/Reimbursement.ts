// are creating this as a DAO object for books endpoint.
export class Reimbursement{
    reimbursement_id:number;
    author:number;
    amount:number;
    date_submitted:string;
    date_resolved:string;
    description:string;
    resolver:number;
    status:number;
    rembursement_type:number;
    constructor(reimbursement_id:number,author:number,amount:number,date_submitted:string,date_resolved:string,description:string,resolver:number,status:number,rembursement_type:number){
        this.reimbursement_id=reimbursement_id;
        this.author=author;
        this.amount=amount;
        this.date_submitted=date_submitted;
        this.date_resolved=date_resolved;
        this.description=description;
        this.resolver=resolver;
        this.status=status;
        this.rembursement_type=rembursement_type;
    }
}