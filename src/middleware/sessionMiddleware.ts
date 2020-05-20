import session from 'express-session';

//this is the third party midleware which handles the session for express sessions

const sessionConfig ={
    secret:'thisIsSecret',
    cookie:{secure:false},
    resave:false,
    saveUninitialized: false
}

// lets pass this object to the function of the session middlewware.
export const sessionMiddleware = session(sessionConfig);
