import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Task() {
  const params = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${params.taskId}`)
      .then(res => console.log(res, "Res"))
      .catch(err => console.log(err, "Err"));
  }, []);

  return <div>Task</div>;
}
