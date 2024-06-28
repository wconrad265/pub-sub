/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
const DisplayMessages = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleScroll = () => {
    const container = messageContainerRef.current;
    if (container.scrollTop === 0 && !isLoading) {
      setIsLoading(true);
    }
  };

  return (
    <div ref={messageContainerRef} onScroll={handleScroll}>
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
