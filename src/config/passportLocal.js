const LocalStrategy = require("passport-local").Strategy
const {adminRegistration} = require("../models/userModel")

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
            if (_foundAdmin.password !== password ) {
                return done(null, false, { message: "the password is incorrect" })
            } else {
                return done(null, _foundAdmin)
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