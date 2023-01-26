//jshint esversion:6
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const https = require('https');
const ejs = require('ejs');
var encrypt = require('mongoose-encryption');
const mongoose  = require('mongoose');
const {Schema}= mongoose;

app.use(express.json()); // for parsing application/json instead of body-parser
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname,'public')))

app.set('view engine', 'ejs');
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/userDb");


const userSchema = new Schema({
    email:String,
    password:String,
});


 

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
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
    const user = new User({
        email: req.body.username,
        password: req.body.password
    });

    user.save(err =>{
        if(!err){
            res.render('secrets')
        } else {
            console.log(err)
        }
    })
});

app.post('/login', (req,res) => {
    const email = req.body.username;
    const password = req.body.password;
    User.findOne({ email: email}, (err, usr)=>{
       if (err) {
        console.log(err);
       } else if (usr){
         if (usr.password === password) {
            res.render('secrets');
         }
         else {
            console.log("Username or password are not correct!")
         }
       }
    })
})


app.listen(3000,()=>{
    console.log("Server is running on http//localhost:3000 ");
});

