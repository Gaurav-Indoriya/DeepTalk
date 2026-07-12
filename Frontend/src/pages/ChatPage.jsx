import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(() => {
    const saved = localStorage.getItem("selectedUser");
    return saved ? JSON.parse(saved) : null;
  });

  const openChat = (user) => {

    setSelectedUser(user);

    localStorage.setItem(
      "selectedUser",
      JSON.stringify(user)
    );

  };

  const handleBack = () => {

    setSelectedUser(null);

    localStorage.removeItem("selectedUser");

  };

  useEffect(() => {

    if (selectedUser) {

      localStorage.setItem(
        "selectedUser",
        JSON.stringify(selectedUser)
      );

    }

  }, [selectedUser]);

  return (

    <div className="h-screen bg-slate-950 flex overflow-hidden">

      <Sidebar
        search={search}
        setSearch={setSearch}
        openChat={openChat}
        selectedUser={selectedUser}
      />

      <ChatBox
        selectedUser={selectedUser}
        onBack={handleBack}
      />

    </div>

  );

};

export default ChatPage;
