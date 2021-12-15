const ifTheSessionIsOpen = (req, res, next) =>{
    // burada oturum açıksa admin sayfasına erişem sağlayabilecek
    if (req.isAuthenticated()){
        return next()
    }
    else{
        // eğer oturum kapalı ise admin e erişim sağlayamasın
        req.flash("error",["please login first"])
        res.redirect("/admin-login")
    }
}

const ifLoggedOut = (req, res, next) => {
    if (!req.isAuthenticated()){
        return next()
    }
    else {
        res.redirect("/admin")
    }
}
module.exports = {
    ifTheSessionIsOpen,
    ifLoggedOut
}