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
  database1.select('email','hash').from('login')
  .where('email','=',req.body.email)
  .then(data=>{
      const isValid= bcrypt.compareSync(req.body.password,data[0].hash)
      if(isValid){
          return database1.select('*').from('users')
          .where('email','=',req.body.email)
          .then(user=>{
              res.json(user[0])
          })
          .catch(err=>res.status(400).json('Error grabbing user'))
      }else {
          res.status(400).json('Wrong Credential')
      }
  })
  .catch(err=>{res.status(400).json("Wrong Credentials")})
    })
app.post('/register', (req,res)=>{
    const  {name,email,password} = req.body
    const hash = bcrypt.hashSync(password)
    database1.transaction(trx=>{
        trx.insert({
            hash:hash,
            email:email
        })
        .into('login')
        .returning('email')
        .then(loginEmail=>{
            return database1('users')
            .returning('*')
            .insert({
                email:loginEmail[0],
                name:name,
                joined:new Date()
            }).then(user=>{
                res.json(user[0])
            })
            .catch(err=>res.json("error register"))  
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err=>res.status(400).json("Unable to Register"))
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
    database1('users')
    .where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries=>{
        res.json(entries[0])
    })
})
app.listen(process.env.PORT || 3000,()=>{
    console.log('app is running')

});