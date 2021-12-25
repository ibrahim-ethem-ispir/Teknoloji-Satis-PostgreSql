const { Sequelize, DataTypes } = require("sequelize")
const sequelize = require("../config/database")


const product = sequelize.define("product",{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    productCode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    productName:{
        type:DataTypes.STRING,
        allowNull:false 
    },
    productImage: {
        type: DataTypes.STRING,
        defaultValue: "productImage.png"
    },
    unitPrice:{
        type:DataTypes.FLOAT,
        allowNull:false 
    },
    productDetail:{
        type:DataTypes.STRING,
        allowNull:false
    },
    stokAmount:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    categoryId:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    brandId:{
        type: DataTypes.INTEGER,
        allowNull:false
    }
})

const category = sequelize.define("category",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    categoryName:{
        type: DataTypes.STRING,
        allowNull:false
    }
})

const brand = sequelize.define("brand",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    brandName:{
        type: DataTypes.STRING,
        allowNull:false
    }
})

const order = sequelize.define("order",{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    totalPrice:{
        type:DataTypes.FLOAT,
        allowNull:false
    }
})

const orderDetail = sequelize.define("orderDetail",{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull:false 
    },
    productId:{
        type: DataTypes.INTEGER,
        allowNull:false 
    },
    amount:{
        type:DataTypes.INTEGER,
        allowNull:false 
    },
    unitPrice:{
        type:DataTypes.FLOAT,
        allowNull:false 
    },
    totalAmount:{
        type:DataTypes.FLOAT,
        allowNull:false 
    }
})


module.exports = {
    product,
    category,
    order,
    orderDetail,
    brand
}