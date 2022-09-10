import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Messenger from "./pages/messenger/Messenger";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import { createBrowserHistory } from "history";
import { useSelector } from "react-redux";

function App() {
  const history = createBrowserHistory();
  const user = useSelector((state) => state.currentUser.currentUser);

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;

    return children;
  };

  return (
    <Router>
      <Routes history={history}>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile/:username"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="messenger"
            element={
              <ProtectedRoute>
                <Messenger />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register />}
        />
      </Routes>
    </Router>
  );
}

export default App;

/* <Routes history={history}>
  <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
  <Route
    path="/profile/:username"
    element={user ? <Profile /> : <Navigate to="/login" />}
  />

  <Route
    path="/login"
    element={user ? <Navigate to={"/"} replace /> : <Login />}
  />
  <Route
    path="/register"
    element={user ? <Navigate to={"/"} replace /> : <Register />}
  />
</Routes> */
