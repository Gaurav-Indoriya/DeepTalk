import API from "../api/api";

// Create User
export const createUser = (data) => {
    return API.post("/users", data);
};

// Login
export const verifyLogin = (user) => {
    return API.post("/VerifyLogin", user);
};

// Logout
export const logout = async (id) => {
    return API.post(`/logout/${id}`);
};

// Search user
export const search = async (username) => {
    return API.get(`/findUser/${username}`);
};

//add contact
export const addContact = (ownerId, contactId) => {
    return API.post("/addContact", {
        ownerId,
        contactId
    });
};

//get contact list
export const getContacts = (ownerId) => {
    return API.get(`/contacts/${ownerId}`);
};

export const sendMessage = (senderId, receiverId, message) => {
    return API.post("/sendMessage", {
        senderId,
        receiverId,
        message
    });
};

export const getMessages = (senderId, receiverId) => {
    return API.get(`/messages/${senderId}/${receiverId}`);
};


export const getUnreadCounts = (receiverId) => {
    return API.get(`/unread/${receiverId}`);
};


export const markAsRead = (senderId, receiverId) => {
    return API.put("/markAsRead", {
        senderId,
        receiverId
    });
};

export const register = (data) => {
    return API.post(
        "/createUser",
        data
    );
};


export const clearChat = (userId, contactId) => {
    return API.delete(`/clear-chat/${userId}/${contactId}`);
};


