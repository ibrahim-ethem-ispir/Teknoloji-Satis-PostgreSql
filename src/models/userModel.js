const { Sequelize, DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const users = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    emailActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    authorizationId:{
        type:DataTypes.SMALLINT,
        allowNull:false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profileImg: {
        type: DataTypes.STRING,
        defaultValue: "usersImage.png"
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


const authorization = sequelize.define("authorization", {
    id: {
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    authorizationName: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
})

const adress = sequelize.define("adress", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cityId: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    townId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

const city = sequelize.define("city", {
    id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

const town = sequelize.define("town", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    town: {
        type: DataTypes.STRING,
        allowNull: false
    }
})


module.exports = {
    users,
    authorization,
    adress,
    city,
    town
}