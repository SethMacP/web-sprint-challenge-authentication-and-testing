const router = require('express').Router();
const model = require('../auth/auth-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {restricted, containsContent, usernameCheck} = require('../middleware/restricted');
const dbConfig = require('../../data/dbConfig');


router.post('/register', containsContent(), usernameCheck(), async(req, res, next) => {
//   res.end('implement register, please!');
    
    try{
        const {username, password} = req.body
               //begin adding user
        const newUser = await model.add({
            username,
            password: await bcrypt.hash(password, 10)
        })
        //when passing
        res.status(201).json(newUser)

    }catch(err){
        next(err)
    }
  
  
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', containsContent(), async(req, res, next) => {
//   res.end('implement login, please!');

    try{
        const {username, password}= req.body
        //Check that the user exists in the db && grab the hash
        const user = await model.grabByUsername(username)
        if(!user){
            return res.status(404).json({message:"invalid credentials"})
        }
        //compare the submitted hash to the db
        const passwordValidation = await bcrypt.compare(password, user.password)
        if(passwordValidation===false){
            return res.status(401).json({message:"invalid credentials"})
        }
        //create token if true
        const token = jwt.sign({
            username:user.username,
            expiresIn: '60m',
        }, 'topSecret')
        //normally this secret would be hidden in a .env file.

        //bake the cookie and deliver it
        res.cookie("token", token)
        res.json({
            message:`Welcome ${user.username}!`,
            token: token
        })
     
    }catch(err){
        next(err)
    }


  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

router.get('/users', async(req,res,next)=>{
    try{
        const users = await model.grabAll()
        if(!users){
            res.status(418).json({message:'no users found'})
        }
        res.status(200).json(users)
    }catch(err){
        next(err)
    }
})

router.get('/users/:id', async(req,res,next)=>{
    try{
        const users = await model.grabByID(req.params.id)
        if(!users){
            res.status(418).json({message:'no users found'})
        }
        res.status(200).json(users)
    }catch(err){
        next(err)
    }
})

module.exports = router;
