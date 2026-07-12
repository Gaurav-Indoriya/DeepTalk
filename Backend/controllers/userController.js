const { userModel, contactModel } = require('../models');
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

class userController {

    static createUser = async (req, res) => {

        try {

            let { username, name, mobile, password } = req.body;

            username = username?.trim().toLowerCase();
            name = name?.trim();
            mobile = mobile?.trim();

            // ================= Required Fields =================

            if (!username || !name || !mobile || !password) {

                return res.status(400).json({
                    success: false,
                    message: "All fields are required."
                });

            }

            // ================= Username Validation =================

            if (!/^[a-zA-Z0-9_]{4,20}$/.test(username)) {

                return res.status(400).json({
                    success: false,
                    message: "Username must be 4-20 characters and contain only letters, numbers and underscore."
                });

            }

            // ================= Mobile Validation =================

            if (!/^[6-9]\d{9}$/.test(mobile)) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid mobile number."
                });

            }

            // ================= Password Validation =================

            if (password.length < 6) {

                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 6 characters."
                });

            }

            // ================= Username Already Exists =================

            const existingUsername = await userModel.findOne({
                where: {
                    USERNAME: username
                }
            });

            if (existingUsername) {

                return res.status(409).json({
                    success: false,
                    message: "Username already exists."
                });

            }

            // ================= Mobile Already Exists =================

            const existingMobile = await userModel.findOne({
                where: {
                    MOBILE: mobile
                }
            });

            if (existingMobile) {

                return res.status(409).json({
                    success: false,
                    message: "Mobile number is already registered."
                });

            }

            // ================= Password Hash =================

            const hashedPassword = await bcrypt.hash(password, 10);

            // ================= Create User =================

            await userModel.create({

                USERNAME: username,
                NAME: name,
                MOBILE: mobile,
                USRPWD: hashedPassword,
                ONLINE: false

            });

            return res.status(201).json({

                success: true,
                message: "Registration successful. Please login."

            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({

                success: false,
                message: "Internal Server Error."

            });

        }

    };


    static verifyLogin = async (req, res) => {

        try {

            const { username, password } = req.body;

            if (!username || !password) {

                return res.status(400).json({
                    success: false,
                    message: "Username and Password are required."
                });

            }

            const user = await userModel.findOne({
                where: {
                    USERNAME: username.trim().toLowerCase()
                }
            });

            if (!user) {

                return res.status(401).json({
                    success: false,
                    message: "User not found."
                });

            }

            const isMatch = await bcrypt.compare(
                password,
                user.USRPWD
            );

            if (!isMatch) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid password."
                });

            }

            await user.update({
                ONLINE: true
            });

            return res.status(200).json({

                success: true,
                message: "Login successful.",

                user: {

                    ID: user.ID,
                    NAME: user.NAME,
                    USERNAME: user.USERNAME,
                    ONLINE: true

                }

            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({

                success: false,
                message: "Internal Server Error."

            });

        }

    };

    static logout = async (req, res) => {

        try {

            const { id } = req.params;

            const user = await userModel.findByPk(id);

            if (!user) {

                return res.status(404).json({
                    message: "User not found"
                });

            }

            await user.update({
                ONLINE: false
            });

            return res.status(200).json({
                message: "Logged Out Successfully"
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message: "Internal Server Error"
            });

        }

    };

}

module.exports = userController;