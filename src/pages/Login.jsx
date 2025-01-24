import React from "react";
import LoginForm from "../components/LoginPage/LoginForm";
import LoginFooter from "../components/LoginPage/LoginFooter";
import LoginHeader from "../components/LoginPage/LoginHeader";

const Login = () => {
  return (
    <div className="login">
      <div className="loginContainer">
        <LoginHeader />
        <LoginForm />
      </div>

      <LoginFooter />
    </div>
  );
};

export default Login;
