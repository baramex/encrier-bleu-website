import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { AlertContainer } from './components/Misc/Alerts';
import Home from './components/Home';
import Login from './components/Login';
import { fetchData } from './lib/service';
import { canRefresh, isLogged, refreshToken } from './lib/service/authentification';
import { fetchUser } from './lib/service/user';
import "./styles/main.css";
import "./styles/tailwind.css";
import Chat from './components/Chat';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

function App() {
    const [user, setUser] = useState(null);
    const [data, setData] = useState({});
    const [alerts, setAlerts] = useState([]);

    function addAlert(alert) {
        setAlerts(a => [...a, { id: Date.now() + Math.round(Math.random() * 1000), ...alert }]);
    }

    useEffect(() => {
        (async () => {
            const suser = JSON.parse(sessionStorage.getItem('user'));
            const lastupdate = sessionStorage.getItem('lastupdate') || 0;
            if (isLogged()) {
                if (!user) {
                    if (suser && Date.now() - lastupdate < 1000 * 20) {
                        setUser(suser);
                        return;
                    }
                    else {
                        const tuser = await fetchData(addAlert, setUser, fetchUser);
                        if (tuser) sessionStorage.setItem("lastupdate", Date.now());
                        return;
                    }
                }

                sessionStorage.setItem('user', JSON.stringify(user));
            } else {
                try {
                    if (!canRefresh()) throw new Error();
                    const tuser = await refreshToken();
                    if (!tuser) throw new Error();
                    setUser(tuser);
                    sessionStorage.setItem("lastupdate", Date.now());
                    return;
                } catch (error) {
                    if (user) setUser(null);
                    if (suser) sessionStorage.removeItem('user');
                }
            }
        })();
    }, [user]);

    const props = { user, setUser, data, setData, addAlert };

    return (
        <>
            <AlertContainer alerts={alerts} setAlerts={setAlerts} />
            {
                (isLogged() ? user : true) &&
                <Router>
                    <Route exact path="/"><Home {...props} /></Route>
                    <Route exact path="/login"><Login {...props} /></Route>

                    <Route exact path="/chat"><Chat {...props} /></Route>
                </Router>
            }
        </>
    );
}