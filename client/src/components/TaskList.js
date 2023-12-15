import React, { useEffect } from "react";
import getCookie from "../helpers/BrowserHelper";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TaskBox from "./TaskBox";

export default function TaskList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = React.useState([]);

  useEffect(() => {
    const token = getCookie("userToken");

    if (token === undefined) navigate("/");
    else {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/all`, {
          params: {
            token: token
          }
        })
        .then(res => {
          setTasks(res.data.tasks);
        })
        .catch(err => console.log(err));
    }
  }, []);

  return (
    <>
      {tasks.map((task, index) => (
        <TaskBox key={index} task={task} />
      ))}
    </>
  );
}
