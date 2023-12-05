import React from "react";
import "./styles.css";
import axios from "axios";
import Loader from "../Loader";
import { Link, useNavigate } from "react-router-dom";
import { addCookie } from "../../helpers/BrowserHelper";

export default function AuthForm({ type, checkIfUserSignedIn }) {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [userNotFound, setUserNotFound] = React.useState(false);
  const [wrongPassword, setWrongPassword] = React.useState(false);
  const navigate = useNavigate();

  const authenticate = e => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`/api/auth/login`, {
        email: email,
        password: password
      })
      .then(res => {
        if (res.status === 200) {
          addCookie("userToken", res.data.token);
          setLoading(false);
          navigate("/tasks");
          setUserNotFound(false);
          setWrongPassword(false);
          checkIfUserSignedIn();
        }
      })
      .catch(err => {
        setLoading(false);
        if (err.response.status === 401) {
          if (invalidUser(err.response)) {
            setUserNotFound(true);
          } else if (invalidPassword(err.response)) {
            setWrongPassword(true);
          }
        }
      });
  };

  const register = e => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
        name: name,
        email: email,
        mobile: mobile,
        password: password
      })
      .then(res => {
        if (res.status === 200) {
          addCookie("userToken", res.body.token);
          setLoading(false);
          navigate("/");
          checkIfUserSignedIn();
        }
      })
      .catch(err => console.log(err.message));
  };

  const forgotPassword = e => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/forgot`, {
        email: email,
        password: password
      })
      .then(res => {
        if (res.status === 200) {
          setLoading(false);
          navigate(`/reset?token=${res.data.link}`);
        }
      })
      .catch(err => console.log(err.message));
  };

  const invalidUser = obj =>
    obj.data.message === "User not found with given parameters";

  const invalidPassword = obj => obj.data.message === "Invalid Credentials";

  const getComponent = () => {
    switch (type) {
      case "login":
        return (
          <Login
            authenticate={authenticate}
            email={email}
            updateEmail={email => setEmail(email)}
            password={password}
            updatePassword={password => setPassword(password)}
            notFound={userNotFound}
            wrongPassword={wrongPassword}
          />
        );
      case "register":
        return (
          <Register
            register={register}
            email={email}
            updateEmail={email => setEmail(email)}
            password={password}
            updatePassword={password => setPassword(password)}
            name={name}
            updateName={name => setName(name)}
            mobile={mobile}
            updateMobile={mobile => setMobile(mobile)}
          />
        );
      case "forgot":
        return (
          <Forgot
            forgotPassword={forgotPassword}
            email={email}
            updateEmail={email => setEmail(email)}
            password={password}
            updatePassword={password => setPassword(password)}
          />
        );
      default:
        break;
    }
  };

  return <>{loading ? <Loader /> : getComponent(type)}</>;
}

export function Login(props) {
  return (
    <>
      <form>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={props.email}
            onChange={e => props.updateEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            value={props.password}
            onChange={e => props.updatePassword(e.target.value)}
          />
        </div>
        <Link to={"/auth/forgot"}>Forgot Password</Link>
        <button
          className="btn btn-primary"
          onClick={e => props.authenticate(e)}
        >
          Submit
        </button>
        {props.notFound && <div>User not found!!</div>}
        {props.wrongPassword && <div>Invalid Credentials!!</div>}
      </form>
    </>
  );
}

export function Register(props) {
  return (
    <>
      <form>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Name</label>
          <input
            className="form-control"
            placeholder="Enter Name"
            value={props.name}
            onChange={e => props.updateName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            required={true}
            value={props.email}
            onChange={e => props.updateEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            required={true}
            value={props.password}
            onChange={e => props.updatePassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Mobile</label>
          <input
            className="form-control"
            placeholder="Enter mobile"
            value={props.mobile}
            onChange={e => props.updateMobile(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={e => props.register(e)}>
          Submit
        </button>
      </form>
    </>
  );
}

export function Forgot(props) {
  return (
    <>
      <div>Forgot Password</div>
      <form>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={props.email}
            onChange={e => props.updateEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            value={props.password}
            onChange={e => props.updatePassword(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={e => props.forgotPassword(e)}
        >
          Submit
        </button>
      </form>
    </>
  );
}
