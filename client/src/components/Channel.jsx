/* eslint-disable react/prop-types */
import { useState } from "react";
import { socket } from "../socket";

const Channel = ({ toggleJoinChannel, toggleLeaveChannel, currentChannel }) => {
  const [channelNameField, setChannelNameField] = useState("");

  const handleJoinChannel = (event) => {
    event.preventDefault();
    const channelNameLower = channelNameField.toLowerCase();

    socket.emit("subscribe", channelNameLower, (response) => {
      if (response.success) {
        toggleJoinChannel(
          channelNameLower,
          response.pastMessages,
          response.channelId
        );
        setChannelNameField("");
      } else {
        console.error(response.message);
      }
    });
  };

  const handleLeaveChannel = (event) => {
    event.preventDefault();
    socket.emit("unsubscribe", currentChannel);
    toggleLeaveChannel();
  };

  return (
    <>
      {currentChannel && (
        <div className="channel-info-container">
          <p className="channel-info">Current Channel: {currentChannel.name}</p>
          <form onSubmit={handleLeaveChannel}>
            <button type="submit">Leave</button>
          </form>
        </div>
      )}

      {!currentChannel && (
        <form className="join-channel" onSubmit={handleJoinChannel}>
          <input
            type="text"
            placeholder="Channel name"
            value={channelNameField}
            onChange={(e) => setChannelNameField(e.target.value)}
          />
          <button type="submit">Join</button>
        </form>
      )}
    </>
  );
};

export default Channel;
