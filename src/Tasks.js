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
      <button className="addbutton" onClick={add}>+</button> {/* add this line */}
    </div>
  );
}

export default Tasks;
