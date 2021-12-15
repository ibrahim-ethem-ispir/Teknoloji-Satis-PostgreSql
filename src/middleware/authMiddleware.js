const ifTheSessionIsOpen = (req, res, next) =>{
    // burada oturum açıksa admin sayfasına erişem sağlayabilecek
    if (req.isAuthenticated()){
        return next()
    }
    else{
        // eğer oturum kapalı ise admin e erişim sağlayamasın
        req.flash("error",["please login first"])
        res.redirect("/login")
    }
}


module.exports = {
    ifTheSessionIsOpen
}