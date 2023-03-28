import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { login } from "../../lib/service/authentification";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import { TextField } from "../Misc/Fields";

export default function Login(props) {
    const history = useHistory();

    const _red = new URLSearchParams(window.location.search).get("redirect");
    const redirect = _red && !_red.includes("http") && _red.startsWith("/") ? _red : null;

    const [firstLog, setFirstLog] = useState(false);

    useEffect(() => {
        if (props.user) history.push(redirect || "/chat");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (props.user && !firstLog) return null;

    return (<div className="flex flex-col min-h-screen">
        <Header {...props} />

        <div className="pt-[4.5rem] text-white pb-20 px-6 flex-1">
            <UserCircleIcon className="text-gray-100 mx-auto w-16 mt-11 mb-8" />
            <h1 className="text-center text-4xl font-medium mb-14">Connexion</h1>
            <div className="md:px-6 max-w-xl mx-auto">
                <form onSubmit={e => handleLogin(e, props.addAlert, props.setUser, setFirstLog, history, redirect)} className="flex flex-col gap-6">
                    <TextField
                        id="email"
                        label="Adresse Email"
                        type="email"
                        autoComplete="email"
                        placeholder="exemple@domaine.xyz"
                        required />
                    <TextField
                        id="password"
                        label="Mot de Passe"
                        type="password"
                        autoComplete="current-password"
                        placeholder="•••••••••"
                        required />
                    <button className="transition-colors text-sm bg-white/25 rounded-lg mx-auto w-full py-3 md:py-2 md:w-auto mt-3 px-6 hover:bg-white/30">
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
        <Footer {...props} />
    </div>)
}

async function handleLogin(e, addAlert, setUser, setFirstLog, history, redirect) {
    e.preventDefault();

    const elements = e.target.querySelectorAll("input, button");
    elements.forEach(el => el.disabled = true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        let user = await login(email, password);
        if (user.firstlog) {
            setFirstLog(true);
            user = { ...user, firstlog: undefined };
            setUser(user);
        }
        else {
            user = { ...user, firstlog: undefined };
            setUser(user);
            history.push(redirect || "/chat");
        }
    } catch (error) {
        addAlert({ type: "error", title: error.message?.message || error.message || "Une erreur est survenue.", ephemeral: true });
        elements.forEach(el => el.disabled = false);
    }
}