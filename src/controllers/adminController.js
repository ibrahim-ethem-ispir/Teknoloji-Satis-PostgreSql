const { users } = require("../models/userModel")
const bcrypt = require("bcrypt")
const { validationResult } = require("express-validator")
const { product, brand, category } = require("../models/productCategoryOrderModel")


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
            if (req.file) {
                currentInformation.profileImg = req.file.filename
            }
            if (req.body.password) {
                currentInformation.password = await bcrypt.hash(req.body.password, 12)
            }
            
            console.log(currentInformation);
            const result = await users.findByPk(req.user.id)
            result.set(currentInformation)
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

const addProduct = async (req, res, next) => {
    const categorys = await category.findAll()
    const brands = await brand.findAll()
    res.render("addProduct", { category: categorys, brand: brands, title: "Ürün Ekle" })
}

const addProductPost = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("validationError", errors.array())
        req.flash("productDetail", req.body.productDetail)
        console.log("ürün ekleme sayfasında hata çıktı");
        res.redirect("/admin/add-product")
    }
    else {
        try {
            await product.create({
                productCode: req.body.productCode,
                productName: req.body.productName,
                productImage: req.file.filename,
                unitPrice: req.body.unitPrice,
                productDetail: req.body.productDetail,
                stokAmount: req.body.stokAmount,
                categoryId: req.body.categoryId,
                brandId: req.body.brandId
            })
                .then(() => {
                    console.log("kayıt Başarılı");
                    res.redirect("/admin/add-product")
                })
                .catch((err) => {
                    console.log("kayıt başarısız === " + err);
                    res.redirect("/admin/add-product")
                })

        } catch (err) {
            console.log("Kayıt İşleminde hata çıktı === " + err);
        }
    }

}

const administrators = async (req,res,next) => {
    const _foundUsers = await users.findAll()
    res.render("administrators",{users:_foundUsers ,title:"Personeller"})
}

module.exports = {
    admin,
    profile,
    profileUpdate,
    addProduct,
    addProductPost,
    administrators
}