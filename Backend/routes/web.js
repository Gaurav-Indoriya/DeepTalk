const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController');
const msgController = require('../controllers/msgController')
const contactController = require('../controllers/contactController');

//user routes
route.post('/createUser',userController.createUser);
route.post('/verifyLogin',userController.verifyLogin);
route.post('/logout/:id',userController.logout);

//contact routes
route.get("/findUser/:username", contactController.findUser);
route.post("/addContact", contactController.addContact);
route.get("/contacts/:ownerId", contactController.getContacts);

//message route
route.post("/sendMessage", msgController.sendMessage);
route.get("/messages/:senderId/:receiverId",msgController.getMessages);
route.put("/markAsRead",msgController.markAsRead);
route.get("/unread/:receiverId",msgController.getUnreadCounts);
route.delete("/clear-chat/:userId/:contactId",msgController.clearChat);


module.exports = route;