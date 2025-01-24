import React from "react";
import Logo from "../../assets/ElectroMapLogo.png";

const LoginHeader = () => {
  return (
    <div className="loginHeader">
      <img src={Logo} alt="Logo" width={"160"} height={"160"} />
      <label>Welcome! to</label>
      <label>ElectroMap</label>
    </div>
  );
};

export default LoginHeader;
