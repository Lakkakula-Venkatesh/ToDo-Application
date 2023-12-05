import React from "react";
import axios from "axios";
import moment from "moment";

export default function Task(props) {
  const task = props.task;

  const closeTask = taskId => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/complete`, { taskId: taskId })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  return (
    <div className="task-card">
      <div className="card">
        <div className="card-header">{task.name}</div>
        <div className="card-body">
          <h5 className="card-title">{task.bookedUserEmail}</h5>
          <p className="card-text">{task.description}</p>
          <p className="card-text">
            {moment(task.endDate).format("YYYY-MM-DD")}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => closeTask(task._id)}
          >
            Mark as Done
          </button>
        </div>
      </div>
    </div>
  );
}
