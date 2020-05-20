// another dao object for users endpoint.
export class User{
    id:number;
    username:string;
    password:string;
    f_name:string;
    l_name:string;
    email:string;
    role:number; //just the level of authorization

//constructor
constructor(id:number,username:string,password:string,f_name:string,l_name:string,email:string,role:number){
    this.id=id;
    this.username=username;
    this.password=password;
    this.f_name=f_name;
    this.l_name=l_name;
    this.email=email;
    this.role=role;
}
}