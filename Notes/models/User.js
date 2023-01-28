
const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport")
const LocalStrategy = require('passport-local');


const  userSchema = new mongoose.Schema ({
    username: { type: String},
    password: { type: String },
    notes: { type: String}
})



userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User",  userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = User;