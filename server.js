const express = require('express');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors= require('cors')


const app = express();
app.use(bodyParser.json())
app.use(cors())
const database={
    user: [
                {
                    id: "123",
                    name: "John",
                    email : "john@gmail.com",
                    password :"cookie",
                    entries: 0,
                    joined: new Date()
                },
                {
                    id: "124",
                    name: "Sally",
                    email : "sally@gmail.com",
                    password :"bananas",
                    entries: 0,
                    joined: new Date()
                }
    ]
}
/*
- Signin => post 
-register => post
-profile/ userID => Get = user
-Image => PUT = user*/

app.get('/', (req,res)=>{
res.send(database)

})

app.post('/signin', (req,res)=>{
    if (req.body.email===database.user[0].email
        &&req.body.password===database.user[0].password){
            res.json("success")
        } else {
            res.status(400).json("error")
        } 
    })
app.post('/register', (req,res)=>{
    const  {name,email,password,} = req.body
    database.user.push({ 
                    id: '125',
                    name: name,
                    email : email,
                    password :password,
                    entries: 0,
                    joined: new Date()
                })
    res.json(database.user[database.user.length-1])

})
app.get('/profile/:id',(req,res)=>{
    const {id} = req.params;
    let found = false;
    database.user.forEach(user=>{
        if(user.id===id){
            found =true;
          return res.json(user)
        }      
    })
    if (!found){
        res.json('not found')
    }
})
app.put('/image',(req,res)=>{
    const {id} = req.body
    let found = false;
    database.user.forEach(user=>{
        if(user.id===id){
            user.entries++
          return res.json(user.entries)
        }    if(!found){
          return  res.json("not found")
        }  
    })
})
app.listen(3000,()=>{
    console.log('app is running')

});