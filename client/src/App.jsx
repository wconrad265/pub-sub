import { useState, useEffect } from "react";
import { socket } from "./socket";
import "./App.css";
import Username from "./components/Username";
import Channel from "./components/Channel";
import SendMessageForm from "./components/SendMessageForm";
import DisplayMessages from "./components/DisplayMessages";

const App = () => {
  const [user, setUser] = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    if (user) {
      socket.connect();
      socket.on("new message", handleMessage);
    }

    return () => {
      socket.off("new message", handleMessage);
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [user]);

  const handleUsernameSubmit = (username) => {
    setUser(username);
  };

  const handleJoinChannel = (channelName) => {
    setCurrentChannel(channelName);
    setMessages([`You joined ${channelName}`]);
  };

  const handleLeaveChannel = () => {
    if (currentChannel) {
      setMessages([]);
      setCurrentChannel(null);
    }
  };

  return (
    <div className="container">
      {!user ? (
        <Username toggleUsernameSubmit={handleUsernameSubmit} />
      ) : (
        <>
          <p className="welcome">Welcome, {user}!</p>
          <Channel
            toggleJoinChannel={handleJoinChannel}
            toggleLeaveChannel={handleLeaveChannel}
            currentChannel={currentChannel}
          />
          {currentChannel && (
            <>
              <DisplayMessages messages={messages} />
              <SendMessageForm user={user} currentChannel={currentChannel} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
