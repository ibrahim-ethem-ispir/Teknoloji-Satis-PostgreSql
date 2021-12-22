const { adminRegistration } = require("../models/userModel")
const bcrypt = require("bcrypt")
const { validationResult } = require("express-validator")

const admin = (req, res) => {
    res.render("admin", { title: "Yönetici" })
}

const profile = (req, res, next) => {
    res.render("adminProfile", { user: req.user, title: "Admin Profil" })
}

const profileUpdate = async (req, res, next) => {
    const errors = validationResult(req)
    const currentInformation = {}
    /*
     buradaki yapmış olduğum 1. if de eğer şifre değişiklik işlemi varsa password
     currentInformation ( şimdiki bilgiler ) objesine gönderilir ve veritabanında değiştirilir
     eğer bu alanlar değiştirilmemiş ise o alanlar bir değişiklik olmasın
    */
    if (!errors.isEmpty()) {
        req.flash("validationError", errors.array())
        req.flash("password", req.body.password)
        req.flash("passwordAgain", req.body.passwordAgain)
        res.redirect("/admin/profile")
    }
    else {
        try {
            
            if (req.body.password) {
                currentInformation.password = await bcrypt.hash(req.body.password, 12)
            }
            if (req.file) {
                currentInformation.adminProfileImg = req.file.filename
            }

            const result = await adminRegistration.findByPk(req.user.id)
            result.set( currentInformation  )
            /*
             Burada set diyerek birden çok alanı güncellemek 
             istediğimizi belirtiyoruz. İçerisine bir tane tanımlamış olduğumuz 
             objeyi gönderdiğimiz için parantez içerisinde bulunan süslü parantezi
             siliyorum çünkü içerisine de obje verdiğimizden dolayı 1 tane fazla süslü 
             parantez olacaktır.
            */
            await result.save()
            if (result) {
                res.redirect("/admin/profile")
            }

        } catch (err) {
            console.log("Error while uploading image === " + err);
        }
    }

}
module.exports = {
    admin,
    profile,
    profileUpdate
}