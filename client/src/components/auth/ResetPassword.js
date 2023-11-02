import React from "react";
import ajax from "superagent";

export default function ResetPassword() {
  const [password, setPassword] = React.useState("");

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const resetPassword = e => {
    e.preventDefault();

    ajax
      .post("http://localhost:8000/api/auth/reset", {
        token: urlParams.get("token"),
        password: password
      })
      .then(res => {
        if (res.status === 200) {
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <div>Forgot Password Page</div>
      <form>
        <div className="form-group">
          <label>Enter new password</label>
          <input
            className="form-control"
            type="password"
            onChange={e => setPassword(e.target.value)}
          />
          <button className="btn btn-primary" onClick={e => resetPassword(e)}>
            Reset
          </button>
        </div>
      </form>
    </>
  );
}
