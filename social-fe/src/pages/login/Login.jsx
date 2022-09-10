import { useState } from "react";
import "./login.css";
import { useDispatch } from "react-redux";
import { login } from "../../redux/apiCalls";
import { useSelector } from "react-redux";

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const user = useSelector((state) => state.currentUser);
  let error = user.error;
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    login(dispatch, { username, password });
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Mysslife</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Mysslife social.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleLogin}>
            <input
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              required
              className="loginInput"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              type="password"
              className="loginInput"
              required
              minLength="6"
            />
            {error && (
              <span className="wrong">Wrong username or password!</span>
            )}
            <button className="loginButton">Login</button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton">
              Create a new account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
