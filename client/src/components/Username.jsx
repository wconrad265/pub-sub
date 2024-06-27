import { useState } from "react";

/* eslint-disable react/prop-types */
const Username = ({ toggleUsernameSubmit }) => {
  const [usernameField, setUsernameField] = useState("");

  const handleUsernameFieldSubmit = (event) => {
    event.preventDefault();
    toggleUsernameSubmit(usernameField);
    setUsernameField("");
  };
  return (
    <form className="userName" onSubmit={handleUsernameFieldSubmit}>
      <input
        type="text"
        placeholder="Enter your username"
        value={usernameField}
        onChange={(e) => setUsernameField(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Username;
