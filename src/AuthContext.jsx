import {createContext, useState} from 'react';
import {CONFIG} from "./config.js";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [authenticated, setAuthenticated] = useState(null); // null is logged out, true is logged in, false is error

    const login = (username, password) => {
        fetch(`${CONFIG.BASE_URL}/login`, {
            method: 'POST',
            credentials: 'include',
            body: new URLSearchParams({ username, password }),
        })
        .then(response => {
            setAuthenticated(response.ok && !response.url.endsWith('error'));
        })
        .catch(error => {
            console.error('Error:', error);
            setAuthenticated(false);
        });
    };

    const logout = () => {
        fetch(`${CONFIG.BASE_URL}/logout`, {
            credentials: 'include',
        })
        .then(response => {
            if (response.ok) {
                setAuthenticated(null);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <AuthContext.Provider value={{authenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
