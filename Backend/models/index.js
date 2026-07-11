const userModel = require("./userModel");
const contactModel = require("./contactModel");
const msgModel = require("./msgModel");
const { Sequelize } = require("sequelize");

// One contact belongs to one user
contactModel.belongsTo(userModel, {
    foreignKey: "CONTACT_ID",
    targetKey: "ID",
    as: "contact"
});

// One user can have many contacts
userModel.hasMany(contactModel, {
    foreignKey: "OWNER_ID",
    sourceKey: "ID",
    as: "contacts"
});

module.exports = {
    userModel,
    contactModel,
    msgModel,
    Sequelize
};