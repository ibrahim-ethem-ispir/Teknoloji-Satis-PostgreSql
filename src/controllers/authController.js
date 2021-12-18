const {validationResult} = require("express-validator")
const {adminRegistration} = require("../models/userModel")
const passport = require("passport")
require("../config/passportLocal")(passport)
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")



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
        try {
            const _admin = await adminRegistration.findOne({where: {email:req.body.email}})
            
            if (_admin && _admin.emailActive == true) {
                req.flash("validationError", [{msg : "this email is in use"}])
                req.flash("name", req.body.name)
                req.flash("surname", req.body.surname)
                req.flash("email", req.body.email)
                req.flash("password", req.body.password)
                req.flash("passwordAgain", req.body.passwordAgain)
                res.redirect("/admin-register")
            }
            else if ((_admin && _admin.emailActive == false) || _admin == null) {
                /* burada eğer bu mail ile ilgili kayıt varsa ve email aktif 
                değilse önce veri tabanından o kaydı siler ve bizim yeni
                yapmış olduğumuz kaydı ekler */
                if (_admin){
                    const deleteRecord = await adminRegistration.findOne({where:{id:_admin.id}})
                    await deleteRecord.destroy()
                        .then(() => {
                            console.log("Silme işlemi başarılı")
                        })   
                        .catch((err) => {
                            console.log("Delete failed === "+err)
                        })  
                }
                const newAdmin = await adminRegistration.create({
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    password: await bcrypt.hash(req.body.password, 12) 
                })
                    /* .then((result) => {
                        req.flash("successMessage",[{msg : "Registration Successfully Added"}])
                        res.redirect("/admin-login")
        
                    })
                    .catch((err) => {
                        console.log("Error Output ===  "+err)
                    }) */
                console.log(newAdmin.email)
                // jwt bilgileri
                const jwtInformation = {
                    id:newAdmin.id,
                    mail:newAdmin.email
                }
                const jwtToken = jwt.sign(jwtInformation,process.env.CONFIRM_MAIL_JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
                console.log("Token ===  "+jwtToken)

                // mail gönderme işlemleri
                const url = process.env.WEB_SITE_URL+"verify?id="+jwtToken
                console.log("Giden Mesaj ===  "+url)

                let transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASSWORD
                    }
                })
                console.log("mail gönderme alanı bir üst satır")
                await transporter.sendMail({
                    from: "teknoloji-satis sitesi minare yazilim <info@teknolojisatisprojesi.com",
                    to:newAdmin.email,
                    subject: "Please Confirm Your Email",
                    text: "Please click the link to confirm your mail : "+url
                }, (error,info) => {
                    if (error) {
                        console.log("Error Output === "+error)
                    }
                    console.log("Email sent")
                    console.log(info)
                    transporter.close()

                }) 
                req.flash("successMessage",[{msg: "Please Check Your Email Box"}])
                res.redirect("/admin-login")
                
            }
        } catch (err) {
            console.log("registration is incorrect"+err)
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

verifyMail = (req, res, next) => {
    const token = req.query.id
    if (token) {
        try {
            jwt.verify(token,process.env.CONFIRM_MAIL_JWT_SECRET, async (e, decoded) => {
                if (e) {
                    req.flash("error","the code is incorrect or the token has expired")
                    res.redirect("/admin-login")                    
                }
                else{
                    console.log("verify try ilk else === "+token)
                    const idInToken = decoded.id
                    console.log("bulmamız gereken id === "+idInToken)
                    const result = await adminRegistration.findOne({where:{id:idInToken}})
                    await result.update({emailActive:true})
                    await result.save()
                    console.log("verify try ilk else içerisinde if den önce === "+token)
                    if (result) {
                        req.flash("successMessage",[{msg : "email has been successfully confirmed"}])
                        res.redirect("/admin-login")
                    }
                    else{
                        req.flash("error","please register again")
                        res.redirect("/admin-login")
                    }
                }
            })
        } catch (err) {
            console.log("verify catch alanı içerisinde")
        }
    }
    else {
        req.flash("error","No Token or invalid, please register again")
        res.redirect("/admin-register")
    }
}

module.exports = {
    login,
    loginPost,
    register,
    registerPost,
    forgetPassword,
    forgetPasswordPost,
    adminLogout,
    verifyMail
}