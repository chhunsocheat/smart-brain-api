const express = require('express');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors= require('cors')
const knex=require('knex')
 const database1=knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'socheat56',
      database : 'smart_brain'
    }
  });
database1.select('*').from('users')
.then(data=>{
    console.log(data)
})

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
    const  {name,email} = req.body
    database1('users').insert({
        email:email,
        name:name,
        joined:new Date()
    }).then(console.log)
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
            found = true;
            user.entries++
          return res.json(user.entries)
        }   if(!found){
          return  res.json("not found")
        }  
    })
})
app.listen(3000,()=>{
    console.log('app is running')

});