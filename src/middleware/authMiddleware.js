const ifTheSessionIsOpen = (req, res, next) => {
    // burada oturum açıksa admin sayfasına erişem sağlayabilecek
    if (req.isAuthenticated()) {
        return next()
    }
    else {
        // eğer oturum kapalı ise admin e erişim sağlayamasın
        req.flash("error", ["please login first"])
        res.redirect("/login")
    }
}

const ifLoggedOut = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next()
    }
    else {
        res.redirect("/admin")
    }
}


const loggedInAdmin = (req, res, next) => {
    // personel ise normal admin sayfaları eğişim
    if (req.user.authorizationId >= 2) {
        return next()
    }
    else {
        res.render("404",{title:"Sayfa bulunamadı"})
    }
}

const loggedInTeamLeader = (req, res, next) => {
    // takım lideri ise erişebilsin
    if (req.user.authorizationId >= 3) {
        return next()
    }
    else {
        req.flash("error",["you are not authorized to access here"])
        res.redirect("/admin")
    }
}

const loggedInManager = (req, res, next) => {
    // müdür ise erişebilsin ise erişebilsin
    if (req.user.authorizationId >= 4) {
        return next()
    }
    else {
        req.flash("error",["you are not authorized to access here"])
        res.redirect("/admin")
    }
}


module.exports = {
    ifTheSessionIsOpen,
    ifLoggedOut,
    loggedInAdmin,
    loggedInTeamLeader,
    loggedInManager
}