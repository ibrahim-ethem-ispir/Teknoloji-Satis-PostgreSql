const {validationResult} = require("express-validator")
const {adminRegistration} = require("../models/userModel")
const passport = require("passport")
require("../config/passportLocal")(passport)


login = (req,res) => {
    res.render("adminLogin", {title:"Giriş Yap"})
}
loginPost = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("validationError",errors.array())
        req.flash("email",req.body.email)
        // hatalı işlemde burada flash a email aktarılır ve sayfa yenilendiğinde silinmesini engeller
        res.redirect("/admin-login")
    }
    else{
        passport.authenticate("local", {
            successRedirect: "/admin", // başarılı girişte
            failureRedirect: "/admin-login", // başarısız girişte
            failureFlash: true // hata mesajlaını aç
        })(req, res, next)
    }
}


register = (req,res) => {
    res.render("adminRegister", {title:"Kayıt Ol"})
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
        res.redirect("/admin-register")
    }
    else{  
        console.log("Hata mesajı yok Kayıt bölümünde else içerisinde")
        try {
            const _admin = await adminRegistration.findOne({where: {email:req.body.email}})
            if (_admin) {
                req.flash("validationError", [{msg : "this email is in use"}])
                req.flash("name", req.body.name)
                req.flash("surname", req.body.surname)
                req.flash("email", req.body.email)
                req.flash("password", req.body.password)
                req.flash("passwordAgain", req.body.passwordAgain)
                res.redirect("/admin-register")
            }
            else{
                adminRegistration.create({
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    password: req.body.password
                })
                    .then((result) => {
                        req.flash("successMessage",[{msg : "Registration Successfully Added"}])
                        res.redirect("/admin-login")
        
                    })
                    .catch((err) => {
                        console.log("Error Output ===  "+err)
                    })   
            }
        } catch (err) {
            console.log("registration is incorrect")
        }
        
        
    }    
}


forgetPassword = (req,res) => {
    res.render("adminForgetPassword", {title:"Şifre Sıfırla"})
}
forgetPasswordPost = (req,res) => {
    
}


adminLogout = (req, res) => {
    req.logout()
    req.session.destroy((error) => {
        res.clearCookie("connect.sid") 
        /* Temizlenecek cookie yi bilirmemiz fayda sağlar çünkü birden çok cookie olabilir */
        /* session sildiğimiz için hata mesajı çalışmayacaktır bu nedenler render ile mesaj yazdıralım */
        res.render("adminLogin",{title:"Giriş Yap", successMessage: [{msg : "exit successful"}]})
        // res.redirect("/admin-login")
    })
    
} 



module.exports = {
    login,
    loginPost,
    register,
    registerPost,
    forgetPassword,
    forgetPasswordPost,
    adminLogout
}