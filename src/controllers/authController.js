const { validationResult } = require("express-validator")
const { users } = require("../models/userModel")
const passport = require("passport")
require("../config/passportLocal")(passport)
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")



const login = (req, res) => {
    res.render("login", { title: "Giriş Yap" })
}
const loginPost = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("validationError", errors.array())
        req.flash("email", req.body.email)
        // hatalı işlemde burada flash a email aktarılır ve sayfa yenilendiğinde silinmesini engeller
        res.redirect("/login")
    }
    else {
        passport.authenticate("local", {
            successRedirect: "/", // başarılı girişte
            failureRedirect: "/login", // başarısız girişte
            failureFlash: true // hata mesajlaını aç
        })(req, res, next)
    }
}


const register = (req, res) => {
    res.render("register", { title: "Kayıt Ol" })
}
const registerPost = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("validationError", errors.array())
        req.flash("name", req.body.name)
        req.flash("surname", req.body.surname)
        req.flash("email", req.body.email)
        req.flash("password", req.body.password)
        req.flash("passwordAgain", req.body.passwordAgain)
        res.redirect("/register")
    }
    else {
        try {
            const _admin = await users.findOne({ where: { email: req.body.email } })

            if (_admin && _admin.emailActive == true) {
                req.flash("validationError", [{ msg: "this email is in use" }])
                req.flash("name", req.body.name)
                req.flash("surname", req.body.surname)
                req.flash("email", req.body.email)
                req.flash("password", req.body.password)
                req.flash("passwordAgain", req.body.passwordAgain)
                res.redirect("/register")
            }
            else if ((_admin && _admin.emailActive == false) || _admin == null) {
                /* burada eğer bu mail ile ilgili kayıt varsa ve email aktif 
                değilse önce veri tabanından o kaydı siler ve bizim yeni
                yapmış olduğumuz kaydı ekler */
                if (_admin) {
                    const deleteRecord = await users.findOne({ where: { id: _admin.id } })
                    await deleteRecord.destroy()
                        .then(() => {
                            console.log("Silme işlemi başarılı")
                        })
                        .catch((err) => {
                            console.log("Delete failed === " + err)
                        })
                }
                const newAdmin = await users.create({
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    authorizationId:1,
                    password: await bcrypt.hash(req.body.password, 12)
                })
                /* .then((result) => {
                    req.flash("successMessage",[{msg : "Registration Successfully Added"}])
                    res.redirect("/login")
    
                })
                .catch((err) => {
                    console.log("Error Output ===  "+err)
                }) */
                console.log(newAdmin.email)
                // jwt bilgileri
                const jwtInformation = {
                    id: newAdmin.id,
                    mail: newAdmin.email
                }
                const jwtToken = jwt.sign(jwtInformation, process.env.CONFIRM_MAIL_JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
                console.log("Token ===  " + jwtToken)

                // mail gönderme işlemleri
                const url = process.env.WEB_SITE_URL + "verify?id=" + jwtToken
                console.log("Giden Mesaj ===  " + url)

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
                    to: newAdmin.email,
                    subject: "Please Confirm Your Email",
                    text: "Please click the link to confirm your mail : " + url
                }, (error, info) => {
                    if (error) {
                        console.log("Error Output === " + error)
                    }
                    console.log("Email sent")
                    console.log(info)
                    transporter.close()

                })
                req.flash("successMessage", [{ msg: "Please Check Your Email Box" }])
                res.redirect("/login")

            }
        } catch (err) {
            console.log("registration is incorrect" + err)
        }


    }
}


const forgetPassword = (req, res) => {
    res.render("forgetPassword", { title: "Şifre Sıfırla" })
}
const forgetPasswordPost = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("validationError", errors.array())
        req.flash("email", req.body.email)
        res.redirect("/forget-password")
    }
    else {
        try {
            const _admin = await users.findOne({ where: { email: req.body.email, emailActive: true } })

            // jwt Bilgileri
            if (_admin) {
                const jwtInformation = {
                    id: _admin.id,
                    mail: _admin.email
                }
                /*
                 burada secret yapmamızdaki sebep güvenliği artırmak için tek
                 kullanımlık bir secret key oluşturduk. 
                 isteseydik direk env den gelen ( reset password jwt secret ) 
                 keyi de kullanabilirdik ama bu şekilde daha güvenli olur 
                 ve secret key içerisine önceki şifreyi koyduğumuz için 
                 şifre değiştikten sonra bu linki tekrar kullanamayacak
                */
                const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _admin.password
                const jwtToken = jwt.sign(jwtInformation, secret, { expiresIn: process.env.JWT_EXPIRE })

                const url = process.env.WEB_SITE_URL + "reset-password/" + _admin.id + "/" + jwtToken
                console.log("Gidecek Mesaj === " + url);

                // mail gönderme

                let transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASSWORD
                    }
                })

                await transporter.sendMail({
                    from: "teknoloji satis projesi <info@teknolojisatisProjesi.com",
                    to: _admin.email,
                    subject: "Password Update",
                    text: "Reset Your Password : " + url
                }, (error, info) => {
                    if (error) {
                        console.log("Error Output === " + error);
                    }
                    console.log("Email Sent");
                    console.log(info);
                    transporter.close()
                })
                req.flash("successMessage", [{ msg: "please check your email box" }])
                res.redirect("/login")

            }
            else {
                req.flash("validationError", [{ msg: "This mail is not registered or the admin is inactive" }])
                req.flash("email", req.body.email)
                res.redirect("/forget-password")
            }

        } catch (err) {
            console.log("Error in password reset === " + err);
        }
    }
}


const adminLogout = (req, res) => {
    req.logout()
    req.session.destroy((error) => {
        res.clearCookie("connect.sid")
        /* Temizlenecek cookie yi bilirmemiz fayda sağlar çünkü birden çok cookie olabilir */
        /* session sildiğimiz için hata mesajı çalışmayacaktır bu nedenler render ile mesaj yazdıralım */
        res.render("login", { title: "Giriş Yap", successMessage: [{ msg: "exit successful" }] })
        // res.redirect("/login")
    })

}

const verifyMail = (req, res, next) => {
    const token = req.query.id
    if (token) {
        try {
            jwt.verify(token, process.env.CONFIRM_MAIL_JWT_SECRET, async (e, decoded) => {
                if (e) {
                    req.flash("error", "the code is incorrect or the token has expired")
                    res.redirect("/login")
                }
                else {
                    console.log("verify try ilk else === " + token)
                    const idInToken = decoded.id
                    console.log("bulmamız gereken id === " + idInToken)
                    const result = await users.findOne({ where: { id: idInToken } })
                    await result.update({ emailActive: true })
                    await result.save()
                    console.log("verify try ilk else içerisinde if den önce === " + token)
                    if (result) {
                        req.flash("successMessage", [{ msg: "email has been successfully confirmed" }])
                        res.redirect("/login")
                    }
                    else {
                        req.flash("error", "please register again")
                        res.redirect("/login")
                    }
                }
            })
        } catch (err) {
            console.log("verify catch alanı içerisinde")
        }
    }
    else {
        req.flash("error", "No Token or invalid, please register again")
        res.redirect("/register")
    }
}

const adminResetPassword = async (req, res, next) => {
    const linkInId = req.params.id
    const linkInToken = req.params.token

    if (linkInId && linkInToken) {
        console.log("id ve token değeri var veritabanında arama yapalım");
        const _foundAdmin = await users.findOne({ where: { id: linkInId } })

        const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _foundAdmin.password

        try {
            jwt.verify(linkInToken, secret, async (e, decoded) => {
                if (e) {
                    req.flash("error", "the code is incorrect or the token has expired")
                    res.redirect("/forget-password")
                }
                else {
                    res.render("newPassword", { id: linkInId, token: linkInToken, title: "Şifre Sıfırla" })
                }
            })

        } catch (err) {

        }
    }
    else {
        req.flash("validationError", [{ msg: "Please click the link in the mail or there is no token" }])
        res.redirect("/forget-password")
    }
}
const adminResetPasswordPost = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("validationError", errors.array())
        req.flash("password", req.body.password)
        req.flash("passwordAgain", req.body.passwordAgain)
        console.log("formdan gelene veriler");

        console.log(req.body);
        res.redirect("/reset-password/" + req.body.id + "/" + req.body.token)
    }
    else {
        const _foundAdmin = await users.findOne({ where: { id: req.body.id, emailActive: true } })
        const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _foundAdmin.password
        try {
            jwt.sign(req.body.token, secret, async (e, decoded) => {
                if (e) {
                    req.flash("error", "the code is incorrect or the token has expired")
                    res.redirect("/forget-password")
                }
                else {
                    const hashedPassword = await bcrypt.hash(req.body.password,12)
                    const result = await users.findOne({where:{id: req.body.id}})
                    await result.update({password: hashedPassword})
                    await result.save()
                    if (result) {
                        req.flash("successMessage", [{msg : "Password update successful"}])
                        res.redirect("/login")
                    }
                    else {
                        req.flash("error", "Please Reset Your Password Again")
                        res.redirect("/forget-password")
                    }

                }
            })
            
        } catch (err) {
            console.log("şifre sıfırlama yapılırken hata çıktı === "+err);
        }
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
    verifyMail,
    adminResetPassword,
    adminResetPasswordPost
}