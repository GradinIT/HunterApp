import {useEffect, useContext} from "react";
import '../css/forms.css';
import { AuthContext } from '../AuthContext.jsx';

function LoginView() {
    const {authenticated, login} = useContext(AuthContext);

    useEffect(() => {
    }, []);

    if (authenticated) {
        return (
            <div>
                <h2>Du är redan inloggad</h2>
            </div>
        );
    }

    const handleLogin = (data) => {
        const username = data.get('username');
        const password = data.get('password');

        login(username, password);
    }

    return (
        <div>
            <h2>Logga in</h2>
            <form id="login-form" action={handleLogin}>
                <div className="form-group">
                    <label htmlFor="username">Användare:</label>
                    <input type="text" name="username" id="username" placeholder="Ange användare" required/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Lösenord:</label>
                    <input type="password" name="password" id="password" placeholder="Ange lösenord" required/>
                </div>
                <div className="form-buttons">
                    <button type="submit" className="submit-btn">Logga in</button>
                </div>
            </form>
            { authenticated === false && (
                <div className="error-message">
                    Ogiltigt användarnamn eller lösenord.
                </div>
            )}
        </div>
    )
}

export default LoginView;
