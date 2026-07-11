const connectdb = require('../database/connectdb');
const { DataTypes } = require("sequelize");

const msgModel = connectdb.define(
    "MESSAGES",
    {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        SENDER_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        RECEIVER_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        MESSAGE: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        IS_READ: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        CREATED_AT: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "messages",
        timestamps: false,
    }
);

module.exports = msgModel;