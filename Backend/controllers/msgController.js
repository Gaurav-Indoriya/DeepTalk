const { msgModel, Sequelize } = require("../models");
const { Op } = require("sequelize");

class msgController {


    static sendMessage = async (req, res) => {

        try {

            const {
                senderId,
                receiverId,
                message
            } = req.body;

            if (!senderId || !receiverId || !message) {

                return res.status(400).json({
                    message: "All fields are required."
                });

            }

            const newMessage = await msgModel.create({

                SENDER_ID: senderId,
                RECEIVER_ID: receiverId,
                MESSAGE: message

            });

            return res.status(201).json({

                message: "Message sent successfully.",
                data: newMessage

            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message: "Internal Server Error"
            });

        }

    };



    static getMessages = async (req, res) => {

        try {

            const { senderId, receiverId } = req.params;

            const messages = await msgModel.findAll({

                where: {

                    [Op.or]: [

                        {
                            SENDER_ID: senderId,
                            RECEIVER_ID: receiverId
                        },

                        {
                            SENDER_ID: receiverId,
                            RECEIVER_ID: senderId
                        }

                    ]

                },

                order: [
                    ["CREATED_AT", "ASC"]
                ]

            });

            return res.status(200).json(messages);

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message: "Internal Server Error"
            });

        }

    };


    static markAsRead = async (req, res) => {

        try {

            const { senderId, receiverId } = req.body;

            await msgModel.update(
                {
                    IS_READ: true
                },
                {
                    where: {
                        SENDER_ID: senderId,
                        RECEIVER_ID: receiverId,
                        IS_READ: false
                    }
                }
            );

            return res.status(200).json({
                message: "Messages marked as read."
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message: "Internal Server Error"
            });

        }

    };


    static getUnreadCounts = async (req, res) => {

        try {

            const { receiverId } = req.params;

            const unread = await msgModel.findAll({

                attributes: [

                    "SENDER_ID",

                    [
                        Sequelize.fn(
                            "COUNT",
                            Sequelize.col("ID")
                        ),
                        "COUNT"
                    ]

                ],

                where: {

                    RECEIVER_ID: receiverId,
                    IS_READ: false

                },

                group: ["SENDER_ID"]

            });

            return res.status(200).json(unread);

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message: "Internal Server Error"
            });

        }

    };


    static clearChat = async (req, res) => {
        try {
            const { userId, contactId } = req.params;

            await msgModel.destroy({
                where: {
                    [Op.or]: [
                        { SENDER_ID: userId, RECEIVER_ID: contactId },
                        { SENDER_ID: contactId, RECEIVER_ID: userId }
                    ]
                }
            });

            res.status(200).json({ message: "Chat cleared successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Failed to clear chat" });
        }
    };


}

module.exports = msgController;