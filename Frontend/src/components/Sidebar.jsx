import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import socket from "../socket";
import { logout, search as searchUser, addContact as addContactApi, getContacts, getUnreadCounts } from "../services/UserServices";

const Sidebar = ({
    search,
    setSearch,
    openChat,
    selectedUser

}) => {

    const [contacts, setContacts] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    const isAdded = (id) =>
        contacts.some(
            (contact) =>
                contact.ID === id ||
                contact.id === id
        );

    useEffect(() => {
        loadContacts();
        loadUnreadCounts();
    }, []);

    useEffect(() => {

        const reloadHandler = () => {

            //console.log("Reload event received");

            loadUnreadCounts();

        };

        socket.on("reload-unread", reloadHandler);

        return () => {

            socket.off("reload-unread", reloadHandler);

        };

    }, []);

    useEffect(() => {

        const messageHandler = (data) => {

            // Ignore if this chat is currently open
            if (selectedUser?.ID === data.senderId) {
                return;
            }

            setUnreadCounts((prev) => ({

                ...prev,

                [data.senderId]: (prev[data.senderId] || 0) + 1

            }));

        };

        socket.on("receive-message", messageHandler);

        return () => {

            socket.off("receive-message", messageHandler);

        };

    }, [selectedUser]);

    const loadContacts = async () => {
        try {
            const response = await getContacts(currentUser.ID);
            setContacts(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const loadUnreadCounts = async () => {

        try {

            const response = await getUnreadCounts(currentUser.ID);

            //console.log(response.data);   // <-- Add this

            const counts = {};

            response.data.forEach((item) => {

                counts[item.SENDER_ID] = Number(item.COUNT);

            });

            setUnreadCounts(counts);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        if (!search.trim()) {
            setUsers([]);
            return;
        }

        const timer = setTimeout(async () => {

            try {

                setLoading(true);

                const response = await searchUser(search);

                // Remove logged in user from search result
                const filtered = response.data.filter(
                    (user) => user.ID !== currentUser.ID
                );

                setUsers(filtered);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        }, 500);

        return () => clearTimeout(timer);

    }, [search]);


    const handleAddContact = async (user) => {

        try {

            const response = await addContactApi(
                currentUser.ID,
                user.ID
            );

            toast.success(response.data.message);

            // Reload contacts from database
            await loadContacts();

            // Remove from search result
            setUsers((prev) =>
                prev.filter((u) => u.ID !== user.ID)
            );

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to add contact."
            );

        }

    };


    const handleOpenChat = (user) => {

        setUnreadCounts((prev) => {

            const updated = { ...prev };

            delete updated[user.ID];

            return updated;

        });

        openChat(user);

    };

    const handleLogout = async () => {

        try {

            const response = await logout(currentUser.ID);
            localStorage.removeItem("user");

            setTimeout(() => {
                navigate("/Login");
            }, 800);
            toast.success(response.data.message);
        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Logout failed."
            );

        }

    };


    return (

        <div className={`${selectedUser ? "hidden md:flex" : "flex"} w-full md:w-80 lg:w-96 bg-slate-900 border-r border-slate-800 flex-col h-full`}>

            {/* Header */}

            <div className="p-4 sm:p-5 border-b border-slate-800">

                <div className="flex justify-between items-center">

                    <div className="flex items-center gap-2">

                        <i className="fa-solid fa-comments text-2xl sm:text-3xl text-blue-500"></i>

                        <Link to="/">
                            <h2 className="text-xl sm:text-2xl font-bold text-white">
                                DeepTalk
                            </h2>
                        </Link>

                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 h-9 w-9 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center"
                        title="Logout"
                    >
                        <i className="fa-solid fa-power-off text-white text-sm sm:text-base"></i>
                    </button>

                </div>

                {/* Current User */}

                <div className="mt-4 sm:mt-5 bg-slate-800 rounded-xl p-3 sm:p-4 flex items-center gap-3">

                    <div className="relative">

                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-slate-700 flex items-center justify-center">

                            <i className="fa-solid fa-user text-blue-500 text-lg sm:text-xl"></i>

                        </div>

                        <span
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-800 ${Number(currentUser?.ONLINE) === 1
                                ? "bg-green-500"
                                : "bg-red-500"
                                }`}
                        ></span>

                    </div>

                    <div className="min-w-0">

                        <h3 className="text-white font-semibold truncate">
                            {currentUser?.NAME}
                        </h3>

                        <p className="text-slate-400 text-sm truncate">
                            @{currentUser?.USERNAME}
                        </p>

                    </div>

                </div>

            </div>

            {/* Search */}

            <div className="p-3 sm:p-4">

                <div className="relative">

                    <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>

                    <input
                        type="text"
                        placeholder="Search Friend..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-800 rounded-lg py-2.5 sm:py-3 pl-11 pr-4 text-white outline-none border border-slate-700 focus:border-blue-500 text-sm sm:text-base"
                    />

                </div>

            </div>

            {/* Search Result */}

            {search && (

                <div className="px-3 sm:px-4 mb-4">

                    <p className="text-slate-400 text-sm mb-2">
                        Search Results
                    </p>

                    {loading ? (

                        <div className="text-center text-blue-500 py-4">
                            Searching...
                        </div>

                    ) : users.length === 0 ? (

                        <div className="text-center text-slate-500 py-4">
                            No User Found
                        </div>

                    ) : (

                        <div className="space-y-2">

                            {users.map((user) => (

                                <div
                                    key={user.ID}
                                    className="bg-slate-800 rounded-lg p-3 flex justify-between items-center"
                                >

                                    <div className="min-w-0">

                                        <h3 className="text-white truncate">
                                            {user.NAME}
                                        </h3>

                                        <p className="text-slate-400 text-sm truncate">
                                            @{user.USERNAME}
                                        </p>

                                    </div>

                                    {isAdded(user.ID) ? (

                                        <button
                                            onClick={() => handleOpenChat(user)}
                                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-sm shrink-0"
                                        >
                                            Chat
                                        </button>

                                    ) : (

                                        <button
                                            onClick={() => handleAddContact(user)}
                                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm shrink-0"
                                        >
                                            Add
                                        </button>

                                    )}

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            )}

            {/* Contacts */}

            <div className="flex-1 overflow-y-auto p-3 sm:p-4">

                <div className="flex justify-between items-center mb-3 sm:mb-4">

                    <h3 className="text-slate-300 font-semibold">
                        My Contacts
                    </h3>

                    <span className="text-slate-500">
                        {contacts.length}
                    </span>

                </div>

                {contacts.length === 0 ? (

                    <div className="text-center text-slate-500 mt-10">
                        No Contacts Added
                    </div>

                ) : (

                    <div className="space-y-2">

                        {contacts.map((item) => {

                            const user = item.contact;

                            return (

                                <div
                                    key={user.ID}
                                    onClick={() => handleOpenChat(user)}
                                    className="cursor-pointer bg-slate-800 hover:bg-slate-700 rounded-xl p-3 transition flex justify-between items-center"
                                >

                                    <div className="flex items-center gap-3 min-w-0">

                                        <div className="relative shrink-0">

                                            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">

                                                <i className="fa-solid fa-user text-blue-500"></i>

                                            </div>

                                            <span
                                                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-800 ${user.ONLINE
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                                    }`}
                                            ></span>

                                        </div>

                                        <div className="min-w-0">

                                            <h3 className="text-white truncate">
                                                {user.NAME}
                                            </h3>

                                            <p className="text-slate-400 text-sm truncate">
                                                @{user.USERNAME}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">

                                        {unreadCounts[user.ID] > 0 && (

                                            <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">

                                                {unreadCounts[user.ID]}

                                            </span>

                                        )}

                                        <i className="fa-solid fa-comment text-green-500"></i>

                                    </div>
                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

        </div>

    );

};

export default Sidebar;
