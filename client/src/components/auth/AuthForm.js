import React from "react";
import "./styles.css";
import ajax from "superagent";
import Loader from "../Loader";
import { Link, useNavigate } from "react-router-dom";
import { addCookie } from "../../helpers/BrowserHelper";

export default function AuthForm({ type, checkIfUserSignedIn }) {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const authenticate = e => {
    e.preventDefault();
    setLoading(true);

    ajax
      .post("http://localhost:8000/api/auth/login")
      .send({
        email: email,
        password: password
      })
      .then(res => {
        addCookie("userToken", res.body.token);
        setLoading(false);
        navigate("/");
        checkIfUserSignedIn();
      });
  };

  const register = e => {
    e.preventDefault();
    setLoading(true);

    ajax
      .post("http://localhost:8000/api/auth/register")
      .send({
        email: email,
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
    
    ajax
      .post("http://localhost:8000/api/auth/forgot")
      .send({
        email: email,
        password: password
      })
      .then(res => {
        if (res.status === 200) {
          setLoading(false);
          navigate(`/reset?token=${res.body.link}`);
        }
      })
      .catch(err => console.log(err.message));
  };

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
      <div>Login Page</div>
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
      </form>
    </>
  );
}

export function Register(props) {
  return (
    <>
      <div>Sign Up Page</div>
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
