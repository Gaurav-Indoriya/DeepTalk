const {contactModel, userModel} = require ('../models')
const { Op } = require("sequelize");

class contactController {


    static findUser = async (req, res) => {

        try {

            const { username } = req.params;

            const users = await userModel.findAll({
                where: {
                    USERNAME: {
                        [Op.like]: `%${username}%`
                    }
                },
                attributes: [
                    "ID",
                    "NAME",
                    "USERNAME",
                    "ONLINE"
                ]
            });

            return res.status(200).json(users);

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message: "Internal Server Error"
            });

        }
    };


    static addContact = async (req, res) => {

        try {

            const { ownerId, contactId } = req.body;

            if (!ownerId || !contactId) {
                return res.status(400).json({
                    message: "Owner Id and Contact Id are required"
                });
            }

            if (ownerId == contactId) {
                return res.status(400).json({
                    message: "You cannot add yourself."
                });
            }

            const exists = await contactModel.findOne({
                where: {
                    OWNER_ID: ownerId,
                    CONTACT_ID: contactId
                }
            });

            if (exists) {
                return res.status(400).json({
                    message: "Contact already added."
                });
            }

            await contactModel.create({
                OWNER_ID: ownerId,
                CONTACT_ID: contactId
            });

            return res.status(200).json({
                message: "Contact added successfully."
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message: "Internal Server Error"
            });

        }

    };


    static getContacts = async (req, res) => {

        try {

            const { ownerId } = req.params;

            const contacts = await contactModel.findAll({

                where: {
                    OWNER_ID: ownerId
                },

                include: [
                    {
                        model: userModel,
                        as: "contact",
                        attributes: [
                            "ID",
                            "NAME",
                            "USERNAME",
                            "ONLINE"
                        ]
                    }
                ]

            });

            return res.status(200).json(contacts);

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message: "Internal Server Error"
            });

        }

    };

}

module.exports = contactController;