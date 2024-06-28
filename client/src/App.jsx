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
  const [channelPresence, setChannelPresence] = useState(null);

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    if (user) {
      socket.connect();
      socket.on("new message", handleMessage);
      socket.emit("user", user);
    }

    return () => {
      socket.off("new message", handleMessage);
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    if (currentChannel) {
      const handleUserJoin = (data) => {
        setChannelPresence((prevState) => prevState.concat(data));
      };

      const handleUserLeave = (data) => {
        console.log(data);
        setChannelPresence((prevState) =>
          prevState.filter((state) => state.socketId !== data.socketId)
        );
      };

      socket.on("user join", handleUserJoin);
      socket.on("user leave", handleUserLeave);

      return () => {
        socket.off("user join", handleUserJoin);
        socket.off("user leave", handleUserLeave);
      };
    }

    console.log("current channel channged", currentChannel);
  }, [currentChannel]);

  const handleUsernameSubmit = (username) => {
    setUser(username);
  };

  const handleJoinChannel = (
    channelName,
    pastMessages,
    channelId,
    channelPresence
  ) => {
    setCurrentChannel({ name: channelName, id: channelId });
    setMessages((prevMessages) =>
      pastMessages.concat([`You joined ${channelName}`], prevMessages)
    );
    setChannelPresence(channelPresence);
  };

  const handleLeaveChannel = () => {
    if (currentChannel) {
      setMessages([]);
      setCurrentChannel(null);
      setChannelPresence(null);
    }
  };

  return (
    <div className={`${currentChannel ? "container-user" : "container"}`}>
      {!user ? (
        <Username toggleUsernameSubmit={handleUsernameSubmit} />
      ) : (
        <>
          <p className="welcome">Welcome, {user}!</p>
          <div className={`${currentChannel ? "message-container" : ""}`}>
            <div className="online-users">
              {" "}
              {channelPresence &&
                channelPresence.map((member, ind) => (
                  <p key={ind}>{member.user}</p>
                ))}
            </div>
            <div>
              <Channel
                toggleJoinChannel={handleJoinChannel}
                toggleLeaveChannel={handleLeaveChannel}
                currentChannel={currentChannel}
                user={user}
              />
              {currentChannel && (
                <>
                  <DisplayMessages messages={messages} />
                  <SendMessageForm
                    user={user}
                    currentChannel={currentChannel}
                  />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
