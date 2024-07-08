const passport = require("passport");
const local = require("passport-local");
const GithubStrategy = require("passport-github2");
const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");


const LocalStrategy = local.Strategy; 

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age, role} = req.body;

        try {
            let user = await UserModel.findOne({email:email});
            if(user) return done(null, false);

            const newCart = new CartModel();
            await newCart.save();


            let newUser = {
                first_name,
                last_name,
                email,
                age,
                role,
                cart: newCart._id, 
                password: createHash(password)
            }

            let result = await UserModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }))


    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({email});
            if(!user) {
                console.log("This email is not registered");
                return done(null, false);
            }
            if(!isValidPassword(password, user)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({_id:id});
        done(null, user);
    })

    passport.use("github", new GithubStrategy({
        clientID: "Iv1.99d1193a36a52cd6",                                 
        clientSecret: "f57c0fd4a5d9f201950dd3b6bf026e7078e1d301",         
        callbackURL : "http://localhost:8080/api/sessions/githubcallback" 
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
            let user = await UserModel.findOne({email: profile._json.email});
            if(!user){
                
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "secreto",
                    role: "user",
                    email: profile._json.email,
                    age: 22,
                    password: "secreto"
                }
            
                let result = await UserModel.create(newUser);
                done(null, result);
            }else{
                done(null, user); 
            }

        } catch (error){
            return done(error);
        }
    }))

}

module.exports = initializePassport;