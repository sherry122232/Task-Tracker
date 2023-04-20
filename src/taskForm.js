import React, { useState } from "react";
import { auth, db } from "./firebase-setup/firebase";


// pop out form to add new task
export function AddTaskForm({ user, setToggleAddTask }) {
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
  
export function EditTaskForm({ user, editTask, setEditTask }) {
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
