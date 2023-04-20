import React, { useState, useEffect } from "react";
import { useStateValue } from "./StateProvider";
import { auth, db } from "./firebase-setup/firebase";
import { Link } from "react-router-dom";

export default function Tasks() {
  //for user auth purposes
  const [{ user }, dispatch] = useStateValue();
  const [name, setName] = useState("No User");
  const [tasks, setTasks] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [toggleAddTask, setToggleAddTask] = useState(false);
  const [editTask, setEditTask] = useState(null);
  // init filtered task for search functionality
  useEffect(() => {
    const results = tasks.filter((task) =>
      task.data.name.toLowerCase().includes(searchPhrase.toLowerCase())
    );
    setFilteredTasks(results);
  }, [searchPhrase, tasks]);
  // user log out
  const signOut = () => {
    if (user) {
      auth.signOut();
    }
  };

  // //this should retrieve names and tasks
  useEffect(() => {
    db.collection("user_names")
      .doc(user.uid)
      .onSnapshot((doc) => setName(doc.data().name));
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .onSnapshot((snapshot) =>
        setTasks(
          snapshot.docs.map((doc) => ({
            name: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);

  return (
    <div className="main">
      <Header name={name} signOut={signOut} />
      <TasksLayout>
        <TasksHeader
          setFilteredTasks={setFilteredTasks}
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          setToggleAddTask={setToggleAddTask}
        />
        <TasksItems filteredTasks={filteredTasks} setEditTask={setEditTask} setFilteredTasks={setFilteredTasks}/>
      </TasksLayout>
      {/* logic allows add task form to be opened and closed */}
      {toggleAddTask && (
        <AddTaskForm
          user={user}
          tasks={tasks}
          setTasks={setTasks}
          setToggleAddTask={setToggleAddTask}
        />
      )}
      {editTask && (
        <EditTaskForm
          user={user}
          editTask={editTask}
          setEditTask={setEditTask}
        />
      )}
    </div>
  );
}

// ****** COMPONENTS ***** //

// tasks page header
function Header({ name, signOut }) {
  return (
    <div className="header">
      <h1 className="header__title">Task Tracker</h1>
      <h2 className="header__user">{name}</h2>
      <Link to='/'>
          <button className="header__log-out" onClick={signOut}>Log Out</button>
        </Link>
    </div>
  );
}
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
  
    const sortTasks = (prop) => {
      setFilteredTasks((tasks) => {
        let newTasks = [...tasks];
        newTasks.sort((a, b) => {
          const aLower = a.data[prop].toLowerCase();
          const bLower = b.data[prop].toLowerCase();
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
    const sortName = () => {
      sortTasks('name');
    };
    
    const sortStatus = () => {
      sortTasks('status');
    };
    
    const sortDue = () => {
      sortTasks('due');
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
        +
      </button>
    </div>
  );
}




// task items content
function TasksItems({ user, filteredTasks, setEditTask,setFilteredTasks }) {
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
    const updatedTasks = filteredTasks.filter((t) => t.name !== task.name);
    setFilteredTasks(updatedTasks);
    // console.log(filteredTasks);
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
            <span>
              <button id={`task-${task.name}`} className="task-box__task-btn"
          onMouseOver={() => document.getElementById(`task-${task.name}`).innerText = task.data.text}
          onMouseOut={() => document.getElementById(`task-${task.name}`).innerText = 'Task'}>
        Task
        </button>
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
            <button className="task-box__edit-button"
              type="button"
              key={task.name}
              onClick={() => handleEdit(task)}
            >
              Edit
            </button>
            <button className="task-box__delete-button" type="button" onClick={() => handleDelete(task)}>
              Delete
            </button>
         </span>
        </div>
        </li>
      ))}
    </ul>
  );
}

// pop out form to add new task
function AddTaskForm({ user, tasks, setTasks, setToggleAddTask }) {
  console.log(`User.uid ${user.uid}`);
  // init new task state
  const [newTask, setNewTask] = useState({
    name: "",
    due: "",
    description: "",
    status: "to-do",
  });
  // handle update of form input
  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  // append new task to db
  const add = (task) => {
    console.log(`Add user: ${user}`);
    db.collection("users")
      .doc(user?.uid)
      .collection("tasks")
      .doc(task.name)
      .set({
        name: task.name,
        due: task.due,
        text: task.description,
        status: task.status,
      });

    alert("Task was created!");
  };
  // appends new task to tasks
  const handleSubmitTask = (e) => {
    e.preventDefault();
    add(newTask);
    // closes new task form
    setToggleAddTask(false);
  };

  return (
    <div className="form__container">
      
      <form
        className="form"
        id="add-task"
        onSubmit={(e) => handleSubmitTask(e)}
      >
        <h2 className="form__title">New Task</h2>
        
        <label htmlFor="name">Task</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={(e) => handleChange(e)}
          value={newTask.name}
          required
        ></input>
        <label htmlFor="due">Due Date</label>
        <input
          type="date"
          id="for"
          name="due"
          onChange={(e) => handleChange(e)}
          value={newTask.due}
          required
        ></input>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          onChange={(e) => handleChange(e)}
          value={newTask.description}
        ></textarea>
        <div className="form__radio-group">
          <div>
            <input
              type="radio"
              id="to-do"
              name="status"
              value="to-do"
              checked={newTask.status === "to-do"}
              onChange={(e) => handleChange(e)}
            ></input>
            <label htmlFor="to-do">To-do</label>
          </div>
          <div>
            <input
              type="radio"
              id="in-progress"
              name="status"
              value="in-progress"
              checked={newTask.status === "in-progress"}
              onChange={(e) => handleChange(e)}
            ></input>
            <label htmlFor="in-progress">In Progress</label>
          </div>
          <div>
            <input
              type="radio"
              id="complete"
              name="status"
              value="complete"
              checked={newTask.status === "complete"}
              onChange={(e) => handleChange(e)}
            ></input>
            <label htmlFor="complete">Complete</label>
          </div>
        </div>
        <button className="form__close-btn" type="submit" form="add-task">
          Add
        </button>
        <button
        className="form__close-btn"
        type="button"
        onClick={() => setToggleAddTask(false)}
      >
        Close
      </button>
      </form>
    </div>
  );
}

function EditTaskForm({ user, editTask, setEditTask }) {
  const [updatedTask, setUpdatedTask] = useState(editTask);
  // handle update of form input
  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setUpdatedTask({
      ...updatedTask,
      data: { ...updatedTask.data, [name]: value },
    });
  };
  // reformats date from form
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  // update task data on db
  const edit = (task) => {
    db.collection("users")
      .doc(user?.uid)
      .collection("tasks")
      .doc(task.name)
      .update({
        name: task.data.name,
        due: formatDate(task.data.due),
        text: task.data.text,
        status: task.data.status,
      });

    alert("Task was updated!");
  };
  // handle update task
  const handleSubmitEdit = (e) => {
    e.preventDefault();
    edit(updatedTask);
    // closes edit task form
    setEditTask(null);
  };

  return (
    <div className="form__container">
     
      <form
        className="form"
        id="edit-task"
        onSubmit={(e) => handleSubmitEdit(e)}
      >
        <h2 className="form__title">Edit Task</h2>
        <label htmlFor="name">Task</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={(e) => handleChange(e)}
          value={updatedTask.data.name}
          required
        ></input>
        <label htmlFor="due">Due Date</label>
        <input
          type="date"
          id="for"
          name="due"
          onChange={(e) => handleChange(e)}
          value={updatedTask.data.due}
          required
        ></input>
        <label htmlFor="text">Description</label>
        <textarea
          id="text"
          name="text"
          onChange={(e) => handleChange(e)}
          value={updatedTask.data.text}
        ></textarea>
        <div className="form__radio-group">
          <div>
            <input
              type="radio"
              id="to-do"
              name="status"
              value="to-do"
              checked={updatedTask.data.status === "to-do"}
              onChange={(e) => handleChange(e)}
            ></input>
            <label htmlFor="to-do">To-do</label>
          </div>
          <div>
            <input
              type="radio"
              id="in-progress"
              name="status"
              value="in-progress"
              checked={updatedTask.data.status === "in-progress"}
              onChange={(e) => handleChange(e)}
            ></input>
            <label htmlFor="in-progress">In Progress</label>
          </div>
          <div>
            <input
              type="radio"
              id="complete"
              name="status"
              value="complete"
              checked={updatedTask.data.status === "complete"}
              onChange={(e) => handleChange(e)}
            ></input>
            <label htmlFor="complete">Complete</label>
          </div>
        </div>
        <button className="form__close-btn" type="button" onClick={() => setEditTask(null)}>
        Cancel
      </button>
        <button className="form__close-btn" type="submit" form="edit-task">
          Save Edit
        </button>
      </form>
    </div>
  );
}