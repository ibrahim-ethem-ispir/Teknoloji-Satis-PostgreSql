const { Sequelize, DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const adminRegistration = sequelize.define("adminRegistration", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    emailActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adminProfileImg: {
        type: DataTypes.STRING,
        defaultValue: "adminProfileImg.png"
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

const userRegistration = sequelize.define("userRegistration", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userEmailActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userSurname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userPassword: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userPhone: {
        type: DataTypes.STRING(11),
        allowNull: false
    },
    userGender: {
        type: DataTypes.STRING(1),
        allowNull: false
    }
})

const adress = sequelize.define("adress", {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    cityId:{
        type: DataTypes.SMALLINT,
        allowNull:false
    },
    townId: {
        type: DataTypes.INTEGER,
        allowNull:false
    }
})

const city = sequelize.define("city",{
    id:{
        type:DataTypes.SMALLINT,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    city:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

const town = sequelize.define("town",{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    town:{
        type:DataTypes.STRING,
        allowNull:false
    }
})


module.exports = {
    adminRegistration,
    userRegistration,
    adress,
    city,
    town
}