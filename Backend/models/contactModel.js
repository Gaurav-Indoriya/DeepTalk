const connectdb = require('../database/connectdb');
const { DataTypes } = require("sequelize");

const contactModel = connectdb.define(
    "CONTACTS",
    {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        OWNER_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        CONTACT_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "contacts",
        timestamps: false,
    }
);

module.exports = contactModel;