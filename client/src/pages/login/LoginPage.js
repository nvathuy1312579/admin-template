/* eslint-disable */
import React, { useState } from 'react';
import { useDispatch,useSelector  } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { login } from 'api/loginApi';
import Login from './Login.js';

function LoginPage() {
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const token = useSelector((state) => state.user.token);
  
  const onChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.id]: e.target.value });
  };

  const onClick = (e) => {
    e.preventDefault();
    dispatch(login(userInfo));
  };

  return token ? (
    <Redirect to="/" />
  ) : (
      <Login
        onChange={(e) => onChange(e)}
        onClick={(e) => onClick(e)}
        email={userInfo.email}
        password={userInfo.password}
      />
    );
}

export default LoginPage;
