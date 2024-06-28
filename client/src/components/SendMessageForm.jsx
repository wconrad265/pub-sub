/* eslint-disable react/prop-types */
import { socket } from "../socket";
import { useState } from "react";

const SendMessageForm = ({ user, currentChannel }) => {
  const [messageField, setMessageField] = useState("");

  const sendMessage = (event) => {
    event.preventDefault();
    const messageSend = `${user}: ${messageField}`;
    socket.emit(
      "send message",
      currentChannel.name,
      messageSend,
      currentChannel.id
    );
    setMessageField("");
  };

  return (
    <form className="send" onSubmit={sendMessage}>
      <input
        type="text"
        placeholder="Message"
        value={messageField}
        onChange={(e) => setMessageField(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default SendMessageForm;
