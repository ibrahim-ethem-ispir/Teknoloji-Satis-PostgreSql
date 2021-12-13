const {body} = require("express-validator")

const validateNewUser = () => {
    return [
        body("name")
            .trim()
            .isLength({min:2}).withMessage("your name must be at least 2 characters")
            .isLength({max:30}).withMessage("your name must be a maximum of 30 characters")
        ,
        body("surname")
            .trim()
            .isLength({min:2}).withMessage("your surname must be at least 2 characters")
            .isLength({max:30}).withMessage("your surname must be a maximum of 30 characters")
        ,
        body("email")
            .trim()
            .isEmail().withMessage("Plase enter a valid e-mail")
        ,   
        body("password")
            .trim()
            .isLength({min:6}).withMessage("your password must be at least 6 character")
            .isLength({max:25}).withMessage("Your password can be a maximum of 25 characters.")
        ,
        body("passwordAgain")
            .trim()
            .custom((value, {req}) => {
                if (value !== req.body.password){
                    throw new Error("The passwords you entered are not the same")
                }
                return true
                /* burada custom diğerek kendi hata mesaj kodumuzu oluşturduk
                Sonrasında value yani passwordAgain den gelen değer ve req i aldık 
                ve req 'deki şifre alanı ile tekrar girilen şifrenin aynı olup olmadığın kontrol ettik */

                // eğer bir hata yoksa return true ile geçelim
            })
    ]
}

module.exports = {
    validateNewUser
}