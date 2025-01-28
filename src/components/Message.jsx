import React from 'react';

function Message({ message }) {
  if (!message) return null;

  return (
    <div className="message">
      <p>{message}</p>
    </div>
  );
}

export default Message;
