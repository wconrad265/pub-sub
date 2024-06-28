/* eslint-disable react/prop-types */
import { useRef, useEffect } from "react";
const DisplayMessages = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
        <div ref={messagesEndRef} />
      </ul>
    </div>
  );
};

export default DisplayMessages;
