import React from 'react';

function NotificationComponent({ notifications }) {
  return (
    <div className="notifications">
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          <div className="notification-title">{notification.title}</div>
          <div className="notification-message">{notification.message}</div>
        </div>
      ))}
    </div>
  );
}

export default NotificationComponent;

