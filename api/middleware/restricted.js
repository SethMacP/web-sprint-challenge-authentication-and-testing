
const jwt = require('jsonwebtoken')

const model = require('../auth/auth-model')

const restricted = () => async(req,res,next)=>{
    try{
        //grab the token from the header
        const token = req.headers.authorization
        //verify that token exists
        if(!token){
           return res.status(418).json({message:"token required"})
        }
        //verify integrity of token
        jwt.verify(token, "topSecret", (err,decoded)=>{
            if(err){
                return res.status(401).json({message:"token invalid"})
            }
            req.token = decoded
        })
        //pass down decoded token
        next()
        
    }catch(err){
        next(err)
    }
    /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
}

const containsContent = () => async(req,res,next)=>{
    try{
        if(!req.body.username || !req.body.password){
            return res.status(418).json({message: "username and password required"})
        }
        next();
        
    }catch(err){
        next(err)
    }
}

const usernameCheck = () => async(req,res,next)=>{
    try{
        const existence = await model.grabByUsername(req.body.username)
        // console.log('exists:' ,existence)
        if(existence){
            //check if test fails on this status code. Keep otherwise.
            return res.status(418).json({message:"username taken"})
        }
        
        next();
    }catch(err){
        next(err)
    }
}


module.exports = {
    restricted,
    containsContent,
    usernameCheck
}