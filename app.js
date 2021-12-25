const express = require("express")
const app = express()
const path = require("path")
const dotenv = require("dotenv").config({path:"./src/config/.env"})
const session = require("express-session")
const flash = require("connect-flash")
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const passport = require("passport")

// model
const { product, category, order, orderDetail, brand } = require("./src/models/productCategoryOrderModel")
const {userRegistration, adress, city, town} = require("./src/models/userModel")

// database bağlantısı
const sequelize = require("./src/config/database")
// public e erişim sağlamak için 
app.use(express.static(__dirname))
app.use("/uploads",express.static(path.join(__dirname,"/src/uploads")))
// ejs
app.set("view engine","ejs")
app.set("views",path.resolve(__dirname,"./src/views"))

// formdan gelen verileri okumak için
app.use(express.urlencoded({extended:true}))

// router  
const adminRouter = require("./src/routers/adminRouter")
const authRouter = require("./src/routers/authRouter")



{
// session veri tabanına kayıt
/*const myStore = new SequelizeStore({
    db: sequelize,
    checkExpirationInterval : 15 * 60 * 1000
  });
  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY,
      store: myStore,
      resave: false,
      saveUninitialized:true,
      proxy: true
    })
  );
  myStore.sync();*/}

app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY,
      store: new SequelizeStore({
        db: sequelize,
        checkExpirationInterval: 15 * 60 * 1000,  // süresi dolan sessions ( oturumları ) her 15 dakikada bir veritabanından siler
        expiration: 24 * 60 * 60 * 1000 // sessions süresi 1 gün
      }),
      resave: false, // we support the touch method so per the express-session docs this should be set to false
      proxy: true, // if you do SSL outside of node.
      saveUninitialized:true,
      cookie:{
        maxAge:1000*60*60*24  
    }
    })
);


{/*  // mongo da bu şekilde kayıt yapılıyor 
    const MongoDBStore = require("connect-mongodb-session")(session)
    const sessionStore = new MongoDBStore({
    uri: process.env.MONGO_CONNECTION_STRING,
      collection: "sessions"
   })
  */

// session ve flash message
/*app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*60*24  
    }
}))*/}              // not

// Hata Mesajları
app.use(flash())
app.use((req,res,next) => {
    res.locals.validationError = req.flash("validationError")
    res.locals.successMessage = req.flash("successMessage")
    res.locals.name = req.flash("name")
    res.locals.surname = req.flash("surname")
    res.locals.email = req.flash("email")
    res.locals.password = req.flash("password")
    res.locals.passwordAgain = req.flash("passwordAgain")
    res.locals.loginError = req.flash("error")

    /* add product page */
    res.locals.productDetail = req.flash("productDetail")
    next()
})
app.use(passport.initialize())
app.use(passport.session())

// veritabanına bağlantı kontrol
const connectionTest = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
connectionTest()



// router ler
app.use("/admin",adminRouter)
app.use(authRouter)


app.get("/",(req,res) => {
    res.status(404).render("index",{title:"Anasayfa"})
})

app.use((req,res) => {
    res.render("404",{title:"Sayfa Bulunamadı"})
})

category.hasMany(product,{foreignKey: {
  allowNull: false,
}})
product.belongsTo(category,{foreignKey: {
  allowNull: false,
}})

brand.hasMany(product,{foreignKey: {
  allowNull: false
}})
product.belongsTo(brand,{foreignKey: {
  allowNull: false,
}})


// force:true tüm tabloları siler ve tablolar tekrar oluşturulur
sequelize
  //.sync({force:true})
  .sync()
  .then(() => {
    console.log("Tables added to database")
  })
  .catch((err) => {
    console.log("Error Output ===  "+err)
  })

app.listen(process.env.PORT,() => {
    console.log(`server is running successfully ${process.env.PORT}`)
})