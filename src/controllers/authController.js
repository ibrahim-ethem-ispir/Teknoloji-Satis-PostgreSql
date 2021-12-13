const {validationResult} = require("express-validator")
const {adminRegistration} = require("../models/userModel")

login = (req,res) => {
    res.render("login", {title:"Giriş Yap"})
}
loginPost = (req,res) => {

}


register = (req,res) => {
    res.render("register", {title:"Kayıt Ol"})
}
registerPost = async (req,res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        req.flash("validationError", errors.array())
        req.flash("name", req.body.name)
        req.flash("surname", req.body.surname)
        req.flash("email", req.body.email)
        req.flash("password", req.body.password)
        req.flash("passwordAgain", req.body.passwordAgain)
        res.redirect("/register")
    }
    else{  
        console.log("Hata mesajı yok Kayıt bölümünde else içerisinde")
        adminRegistration.create({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password
        })
            .then((result) => {
                console.log("Registration Successfully Added")
                res.redirect("/register")

            })
            .catch((err) => {
                console.log("Error Output ===  "+err)
            })   
    }    
}

forgetPassword = (req,res) => {
    res.render("forgetPassword", {title:"Şifre Sıfırla"})
}
forgetPasswordPost = (req,res) => {
    
}


module.exports = {
    login,
    loginPost,
    register,
    registerPost,
    forgetPassword,
    forgetPasswordPost
}