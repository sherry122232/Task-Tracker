import React, { useState, useEffect } from "react";
import { useStateValue } from './StateProvider';
import { auth, db } from './firebase-setup/firebase';
import { Link } from "react-router-dom";

function Tasks() {

  //for user auth purposes
  const [{ user }, dispatch] = useStateValue();

  const signOut = () => {
    if (user) {
        auth.signOut();
    }
  }

  const [name, setName] = useState("No User");
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskText, setTaskText] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [taskStatus, setTaskStatus] = useState("");

  //this should retireve names and tasks
  useEffect(() => {
    db.collection("user_names").doc(user.uid)
        .onSnapshot(doc => setName(doc.data().name));
    db.collection("users").doc(user.uid).collection("tasks")
        .onSnapshot(snapshot => (
            setTasks(snapshot.docs.map(doc => ({
              name: doc.id,
              data: doc.data()
            })))
        ))
  }, [])
  

  const add = () => {

    db
      .collection("users")
      .doc(user?.uid)
      .collection("tasks")
      .doc(taskName)
      .set({
        name: taskName,
        due: taskDue,
        text: taskText,
        status: taskStatus
      });

      alert("Task was created!");
  }

  const edit = () => {

    db
      .collection("users")
      .doc(user?.uid)
      .collection("tasks")
      .doc(taskName)
      .update({
        name: taskName,
        due: taskDue,
        text: taskText,
        status: taskStatus
      });

      alert("Task was updated!");
  }

  const remove = () => {

    db
      .collection("users")
      .doc(user?.uid)
      .collection("tasks")
      .doc(taskName)
      .delete();

      alert("Task was deleted!");
  }

  const Header = () => {
    return (
      <div className="header">
        <h1 className="header__title">Task Tracker</h1>
        <h2 className="header__user">User</h2>
        <Link to='/'>
          <button className="header__log-out" onClick={signOut}>Log Out</button>
        </Link>
      </div>
    );
  };
  // tasks section layout
function TasksLayout({ children }) {
  return (
    <div className="tasks">
      <h2 className="tasks__title">Tasks</h2>

      {children}
    </div>
  );
}
// tasks section header with search, sort, and add task ui
function TasksHeader({
  setFilteredTasks,
  searchPhrase,
  setSearchPhrase,
  setToggleAddTask,
}) {
  
    // sorts tasks by name into filteredTasks
  const sortName = () => {
    setFilteredTasks((tasks) => {
      let newTasks = [...tasks];
      newTasks.sort((a, b) => {
        const aLower = a.data.name.toLowerCase();
        const bLower = b.data.name.toLowerCase();
        if (aLower < bLower) {
          return -1;
        } else if (aLower > bLower) {
          return 1;
        } else {
          return 0;
        }
      });
      return newTasks;
    });
  };
  // sorts tasks by status into filteredTasks
  const sortStatus = () => {
    setFilteredTasks((tasks) => {
      let newTasks = [...tasks];
      newTasks.sort((a, b) => {
        const aLower = a.data.status.toLowerCase();
        const bLower = b.data.status.toLowerCase();
        if (aLower < bLower) {
          return -1;
        } else if (aLower > bLower) {
          return 1;
        } else {
          return 0;
        }
      });
      return newTasks;
    });
  };
  // sorts tasks by due date into filteredTasks
  const sortDue = () => {
    setFilteredTasks((tasks) => {
      let newTasks = [...tasks];
      newTasks.sort((a, b) => {
        const aLower = a.data.due.toLowerCase();
        const bLower = b.data.due.toLowerCase();
        if (aLower < bLower) {
          return -1;
        } else if (aLower > bLower) {
          return 1;
        } else {
          return 0;
        }
      });
      return newTasks;
    });
  };

  return (
    <div className="tasks__list-header">
      <div className="tasks__search-group">
        <label className="offscreen" htmlFor="search">
          Search Tasks
        </label>
        <input
          type="text"
          id="search"
          name="search"
          key="search"
          onChange={(e) => setSearchPhrase(e.target.value)}
          value={searchPhrase}
        ></input>
      </div>
      <div className="tasks__sort-group">
        <button className="" type="button" onClick={() => sortName()}>
          Name
        </button>
        <button className="" type="button" onClick={() => sortStatus()}>
          Status
        </button>
        <button className="" type="button" onClick={() => sortDue()}>
          Due
        </button>
      </div>

      <button
        className="tasks__new-btn"
        type="button"
        onClick={() => setToggleAddTask(true)}
      >
        Add new task
      </button>
    </div>
  );
}


// task items content
function TasksItems({ user, filteredTasks, setEditTask }) {
  // handle edit task
  const handleEdit = (taskName) => {
    console.log({ taskName });
    setEditTask(taskName);
  };
  // delete task from db
  const remove = (task) => {
    console.log(task);
    db.collection("users")
      .doc(user?.uid)
      .collection("tasks")
      .doc(task.name)
      .delete();

    alert("Task was deleted!");
  };
  // handle delete task from db
  const handleDelete = (task) => {
    console.log(`Delete task: ${task.name}`);
    remove(task);
  };
  // reformats date from form
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  return (
    <ul className="tasks__list">
      {filteredTasks.map((task) => (
        <li className="tasks__list-item" key={task.name}>
          <div className="tasks__item-main">
            <span className="tasks__task-name">{task.data.name}</span>
            <span>{task.data.status}</span>
            <span>{formatDate(task.data.due)}</span>
            <button
              type="button"
              key={task.name}
              onClick={() => handleEdit(task)}
            >
              Edit
            </button>
            <button type="button" onClick={() => handleDelete(task)}>
              Delete
            </button>
          </div>
          <span className="tasks__task-description">{task.data.text}</span>
        </li>
      ))}
    </ul>
  );
}

  const Tasks = () => {
    return (
      <div className="tasks">
        {/* <h2 className="tasks__title">Tasks</h2> */}
        <ul className="tasks__list">
  {tasks.map((task) => (
    <li className="tasks__list-item" key={task.name}>
      <div className="task-box" id={`task-box-${task.name}`}>
        <span className="task-box__name">{task.data.name}</span>
        
        <button id={`status-${task.name}`} className="task-box__status-btn" 
          onMouseOver={() => document.getElementById(`status-${task.name}`).innerText = task.data.status}
          onMouseOut={() => document.getElementById(`status-${task.name}`).innerText = 'Status'}>
        Status
        </button>
        
        <button id={`due-${task.name}`} className="task-box__due-btn"
          onMouseOver={() => document.getElementById(`due-${task.name}`).innerText = task.data.due}
          onMouseOut={() => document.getElementById(`due-${task.name}`).innerText = 'Due'}>
        Due
        </button>

<button className="task-box__edit-button">Edit</button>
        <button className="task-box__delete-button">Delete</button>
      </div>
    </li>
  ))}
</ul>

      </div>
    );
  };
  

  return (
    <div className="main">
      <Header />
      <Tasks />
      <button className="addbutton" onClick={add}>+</button> {/* add this line */}
    </div>
  );
}

export default Tasks;