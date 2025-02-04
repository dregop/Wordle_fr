import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/user" });


export const saveUserStats = async (stats, token) => {
    console.log("Token envoyé:", token); // Vérifiez que le token est bien défini
    try {
        const response = await API.post('/stats', stats, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            withCredentials: "include"

        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des statistiques', error);
        throw error;
    }
};



export const getProfile = async (token) => {
  try {
    const response = await API.get("/me", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            withCredentials: "include"
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du profil", error);
    throw error;
  }
};


export const updateUsername = async (newUsername, token) => {
  console.log("Requete API pour changer le pseudo")
  try {
    const response = await API.patch(
      "/username",
      { newUsername },
      {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            withCredentials: "include"
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du pseudo", error);
    throw error;
  }
};


export const getUserStats = async (token, isGoogleUser) => {
  try {
    const response = await API.get("/stats", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            withCredentials: isGoogleUser
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques", error);
    throw error;
  }
};