import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/Menu.css";

const Menu = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <menu>
      <span>Wordle FR</span>
      <nav>
        {user ? (
          <>
            <Link to="/">Jouer</Link>
            <Link to="/settings">{user.username}</Link>
            <button onClick={handleLogout}>Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/">Jeu</Link>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        )}
      </nav>
    </menu>
  );
};

export default Menu;
