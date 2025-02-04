import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedAuthRoute from "./components/ProtectedAuthRoute";
import Menu from "./components/Menu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Game from "./pages/Game";

function App() {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<Game />} />
        <Route element={<ProtectedAuthRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;