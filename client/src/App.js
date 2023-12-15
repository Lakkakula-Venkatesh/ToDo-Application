import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/auth/AuthForm";
import Home from "./components/pages/Home";
import Cookies from "js-cookie";
import getCookie, { deleteCookie } from "./helpers/BrowserHelper";
import ajax from "superagent";
import ResetPassword from "./components/auth/ResetPassword";
import TaskList from "./components/TaskList";
import Task from "./components/Task";

function App() {
  const [authenticated, setAuthenticated] = React.useState(false);

  const checkIfUserSignedIn = () => {
    if (Cookies.get("userToken") != null) {
      setAuthenticated(true);
    }
  };

  const logoutUser = e => {
    e.preventDefault();
    const token = getCookie("userToken");
    ajax
      .post("http://localhost:8000/api/auth/logout")
      .send({ token: token })
      .then(res => {
        setAuthenticated(false);
        deleteCookie("userToken");
      });
  };

  useEffect(() => {
    const token = getCookie("userToken");
    if (token !== undefined) setAuthenticated(true);
  }, []);

  return (
    <div className="App">
      <Router>
        <Navbar authenticated={authenticated} logoutUser={logoutUser} />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route
            path="/auth/register"
            element={
              <AuthForm
                type={"register"}
                checkIfUserSignedIn={checkIfUserSignedIn}
              />
            }
          />
          <Route
            path="/auth/login"
            element={
              <AuthForm
                type={"login"}
                checkIfUserSignedIn={checkIfUserSignedIn}
              />
            }
          />
          <Route
            path="/auth/forgot"
            element={
              <AuthForm
                type={"forgot"}
                checkIfUserSignedIn={checkIfUserSignedIn}
              />
            }
          />
          <Route path="/task/:taskId" element={<Task />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/reset" element={<ResetPassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
