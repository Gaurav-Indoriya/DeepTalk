const connectdb = require('../database/connectdb');
const { DataTypes } = require("sequelize");

const UserModel = connectdb.define(
    "USER_INFO", 
    {
    ID: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
    },
    USERNAME: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
    },
    NAME: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    ONLINE: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    MOBILE:{
        type: DataTypes.INTEGER(12),
        allowNull: false
    },
    USRPWD:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
}, {
    tableName: 'user_info',
    timestamps: false,
});

module.exports = UserModel;