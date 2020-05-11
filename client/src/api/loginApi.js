/* eslint-disable */
import axios from 'axios';
import { loginSuccessfully, loginFailed } from '../store/actions/authAction';
import { LOGIN_URI, USER_TOKEN } from '../constants';
import { setTokenToLocalStorage } from '../utils';

// eslint-disable-next-line import/prefer-default-export
export const login = (userData) => (dispatch) => {
  console.log(userData);

  axios
    .post(LOGIN_URI, { ...userData, user_agent: navigator.userAgent })
    .then((res) => {
      // Set userToken to Local Storage
      setTokenToLocalStorage(USER_TOKEN, res.data.token).then(() => {
        dispatch(loginSuccessfully(res.data.data));
      });
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      dispatch(loginFailed(err));
    });
};
