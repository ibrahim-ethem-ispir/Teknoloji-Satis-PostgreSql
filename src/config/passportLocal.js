const LocalStrategy = require("passport-local").Strategy
const {adminRegistration} = require("../models/userModel")
const bcrypt = require("bcrypt")

module.exports = function (passport) {
    const options = {
        usernameField: "email",
        passwordField: "password"
    }
    passport.use( new LocalStrategy(options, async (email, password, done) => {
        try {
            const _foundAdmin = await adminRegistration.findOne({ where : {email:email}})
            if (!_foundAdmin) {
                return done(null, false, { message: "admin not found" })
            }
            const passwordCheck = await bcrypt.compare(password,_foundAdmin.password)
            if (!passwordCheck){
                return done(null, false, { message: "the password is incorrect" })
            }
            else{
                if (_foundAdmin && _foundAdmin.emailActive === false){
                    return done(null, false ,{message: "Please confirm your email"})
                }else{
                    return done(null, _foundAdmin)
                }
            }
           
        } catch (err) {
            return done(err)
        }
    }))
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })
    
    passport.deserializeUser(function (id, done) {
        adminRegistration.findByPk(id).then(function ( user) {
            done(null, user)
        })
        .catch(function(err){
            done(err, false);
        });
    })
}