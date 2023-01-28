//jshint esversion:6
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const https = require('https');
const ejs = require('ejs');
const mongoose  = require('mongoose');
const {Schema}= mongoose;

app.use(express.json()); // for parsing application/json instead of body-parser
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname,'public')))

const bcrypt = require('bcrypt');
const saltRounds = 10;
// const myPlaintextPassword = process.env.SECRET;

app.set('view engine', 'ejs');
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/userDb");


const userSchema = new Schema({
    email:String,
    password:String,
});


 
const User = new mongoose.model('User', userSchema);

app.get("/", (req,res) => {
    res.render('home');
});

app.get("/login", (req,res) => {
    res.render('login');
});

app.get("/register", (req,res) => {
    res.render('register');
});


app.post('/register', (req,res)=>{
    bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
        const user = new User({
            email: req.body.username,
            password: hash
        });
    
        user.save(err =>{
            if(!err){
                res.render('secrets')
            } else {
                console.log(err)
            }
        })
    });
});

app.post('/login', (req,res) => {
    const email = req.body.username;
    const password = req.body.password;
  
    User.findOne({ email: email}, (err, usr)=>{
       if (err) {
        console.log(err);
       } else if (usr){
        bcrypt.compare(password, usr.password).then(function(result) {
            if(result){
                res.render("secrets")
            } else{res.render("login")}
        }); 
    }
         
})

});


app.listen(3000,()=>{
    console.log("Server is running on http//localhost:3000 ");
});

