import { createContext, useState, useEffect } from "react";
import { login as loginAPI, register as registerAPI } from "../api/authApi";
import { getProfile } from "../api/userApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem("isAuthenticated") === "true";
    });

    // Vérification de l'auth Google via session
    useEffect(() => {

        fetch("http://localhost:5000/auth/user", { credentials: "include" })
            .then(res => {
                if (!res.ok) {
                    setUser(null);
                    setIsAuthenticated(false);
                    sessionStorage.setItem("isAuthenticated", "false"); // Stocker l'état pour éviter le fetch après un refresh
                    return null;
                }
                return res.json();
            })
            .then(data => {
                if (data) {
                    setUser(data);
                    setIsAuthenticated(true);
                    sessionStorage.setItem("isAuthenticated", "true");
                }
            })
            .catch(error => {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
                setIsAuthenticated(false);
                sessionStorage.setItem("isAuthenticated", "false");
            });
    }, []);

    // Vérification de l'auth avec JWT uniquement si `token` est présent
    useEffect(() => {
        if (!token) return;
        
        getProfile(token)
            .then((data) => {
                setUser(data);
                // setIsAuthenticated(true);
                // sessionStorage.setItem("isAuthenticated", "true");
            })
            .catch((err) => console.log(err));
    }, [token]);

    // Connexion classique (JWT)
    const login = async (email, password) => {
        try {
            const data = await loginAPI(email, password);
            setToken(data.token);
            localStorage.setItem("token", data.token);
            setIsAuthenticated(true);
            sessionStorage.setItem("isAuthenticated", "true");
        } catch (error) {
            console.error("Erreur de connexion", error);
        }
    };

    // Connexion via Google OAuth
    const loginWithGoogle = () => {
        window.location.href = "http://localhost:5000/auth/google"; // Redirige vers Google
    };

    // Inscription
    const register = async (username, email, password) => {
        try {
            await registerAPI(username, email, password);
        } catch (error) {
            console.error("Erreur d'inscription", error);
        }
    };


    const logout = () => {
        fetch("http://localhost:5000/auth/logout", { credentials: "include" })
            .then(() => {
                setUser(null);
                setToken(null);
                setIsAuthenticated(false);
                localStorage.removeItem("token");
                sessionStorage.setItem("isAuthenticated", "false");
                window.location.replace("/login");
            })
            .catch((error) => console.error("Erreur de déconnexion :", error));
    };


    const updateUsernameContext = (newUsername) => {
        setUser((user) => ({
            ...user,
            username: newUsername
        }));
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
            updateUsernameContext, 
            login, 
            register, 
            logout, 
            token, 
            loginWithGoogle 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
