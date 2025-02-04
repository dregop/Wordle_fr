import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { updateUsername, getUserStats } from "../api/userApi";

const Settings = () => {
  const { user, updateUsernameContext, token } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");

useEffect(() => {
    if (user) {
        console.log("Utilisateur connecté :", user);
        setUsername(user.username || "Utilisateur Google");

        getUserStats(token, user?.google_id).then((res) => {
            if (res?.stats) {
                setStats(res.stats);
            }
        });
    }
}, [token, user]);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!newUsername) return;
    try {
      await updateUsername(newUsername, token);
      updateUsernameContext(newUsername);
      setNewUsername("");
      setMessage("Pseudo mis à jour avec succès !");
    } catch (error) {
      setMessage("Erreur lors de la mise à jour du pseudo.");
    }
  };

  return (
    <div>
      <h2>Paramètres</h2>
      <p><strong>Pseudo :</strong> {username}</p>
      <form onSubmit={handleUpdateUsername}>
        <input
          type="text"
          placeholder="Nouveau pseudo"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <button type="submit">Mettre à jour</button>
      </form>

      {message && <p>{message}</p>}

      <h3>Statistiques</h3>
        {stats !== null ? (
          <div className="stats">
            <p><strong>Total de parties :</strong> {stats.total_games}</p>
            <p><strong>Parties gagnées :</strong> {stats.wins}</p>
            <p><strong>Taux de victoire :</strong> {stats.win_percentage}%</p>
          </div>
        ) : (
          <div>
            <p>Aucune statistique pour le moment.</p>
          </div>
        )}

    </div>
  );
};

export default Settings;
