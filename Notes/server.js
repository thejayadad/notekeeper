const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const User = require("./models/User");
const bodyParser = require("body-parser");
dotenv.config({ path: './config/config.env' })
const session = require('express-session')
const passport = require("passport")
const Notes = require("./models/Notes")



const app = express()
const PORT = process.env.PORT || 3000

mongoose.set("strictQuery", false);
connectDB()

//PATH TO SETUP EJS & FRONTEND VIEW
const path = require('path')
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));


//SETUP SESSION//
app.use(session({
    secret: "secretword",
    resave: false,
    saveUninitialized: true,
}))

//USE PASSPORT//
app.use(passport.initialize());
app.use(passport.session());





app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/register", (req, res) =>{
    res.render("register")
})
//CREATE A NEW NOTE//
app.get("/new", function(req, res) {
    if(req.isAuthenticated()){
        res.render("new");
    } else{
        res.redirect("/login");
    }
})

//POST NEW NOTE//

app.post("/new", function(req, res){
    const submittedSecret = req.body.secret;

  //Once the user is authenticated and their session gets saved, their user details are saved to req.user.

    User.findById(req.user.id, function(err, foundUser){
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          foundUser.secret = submittedSecret;
          req.body.
          foundUser.save(function(){
            res.redirect("/home");
          });
        }
      }
    });
  });

//HOME LOGGED IN DASHBOARD//
app.get("/home", (req, res) => {
    if(req.isAuthenticated()){
        res.render("home");
    } else{
        res.redirect("/login");
    }
})

//LOGOUT ROUTE//
app.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });

app.get("/logout", (req, res) => {
    res.redirect("/login");
})



//GET ALL NOTES//
app.get("/home", async function(req, res){
   if(req.isAuthenticated()) {
    const users = await User.find({})
    res.render("home", {users})
   } else{
    res.redirect("/login")
   }
  });


// REGISTER USER//
app.post("/register", function(req, res){
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        } else{
            passport.authenticate("local")(req, res, function (){
                res.redirect("/home");
            })
        }
    })

})


//LOGIN USER ROUTE


app.post("/login", function(req, res){

    const user = new User({
      username: req.body.username,
      password: req.body.password
    });

    req.login(user, function(err){
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/home");
        });
      }
    });

  });




app.listen(
    PORT,
    console.log(`Server running on port ${PORT}`)
  )
