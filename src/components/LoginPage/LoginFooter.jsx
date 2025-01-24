import React from "react";
import { Link } from "react-router-dom";

const LoginFooter = () => {
  return (
    <div className="loginFooter">
      <label>Don't have an account yet?</label>
      <br />
      <Link to={"/register"}>Register here</Link>
    </div>
  );
};

export default LoginFooter;
