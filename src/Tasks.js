import React from "react";

function Tasks() {
  const Header = () => {
    return (
      <div className="header">
        <h1 className="header__title">Task Tracker</h1>
        <h2 className="header__user">User</h2>
        <button className="header__log-out">Log Out</button>
      </div>
    );
  };
  const Tasks = () => {
    return (
      <div className="tasks">
        <h2 className="tasks__title">Tasks</h2>
        <ul className="tasks__list">
          <li className="tasks__list-item">
            <span className="tasks__task-name">Task</span>
            <span>Status</span>
            <span>Due</span>
            <button>Edit</button>
            <button>Delete</button>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div className="main">
      <Header />
      <Tasks />
    </div>
  );
}

export default Tasks;
