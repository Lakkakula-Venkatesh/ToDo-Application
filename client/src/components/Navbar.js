import React from "react";
import { NavLink as Link } from "react-router-dom";

export default function Navbar({ authenticated, logoutUser }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      {authenticated ? (
        <button className="btn btn-primary" onClick={e => logoutUser(e)}>
          Logout
        </button>
      ) : (
        <div className="btn-container">
          <Link className="btn btn-primary" to={"/auth/login"}>
            Login
          </Link>
          <Link className="btn btn-primary" to={"/auth/register"}>
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
