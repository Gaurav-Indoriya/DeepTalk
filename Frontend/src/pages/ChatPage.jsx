import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const openChat = (user) => {
    //console.log(user);
    setSelectedUser(user);
  };

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
      />

    </div>

  );

};

export default ChatPage;