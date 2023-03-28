import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { io } from "socket.io-client";
import { fetchData } from "../../lib/service";
import { isLogged } from "../../lib/service/authentification";
import { getMessages, sendMessage } from "../../lib/service/message";
import { formatDate } from "../../lib/utils/date";
import Header from "../Layout/Header";
import Loading from "../Misc/Loading";

let socket = null;
let isInPage = true;

const notification = new Audio("/sounds/notification.wav");

export default function Chat(props) {
    const [messages, setMessages] = useState(undefined);
    const [newMessage, setNewMessage] = useState(false);
    const [from, setFrom] = useState(0);

    const history = useHistory();

    useEffect(() => {
        if (!isLogged()) return history.replace("/login");

        if (!socket) {
            socket = io({ closeOnBeforeunload: true })
                .on("connected", () => {
                    socket.on("message.send", message => {
                        setMessages(prev => {
                            if (!prev) return;

                            setNewMessage(true);

                            prev.unshift(message);

                            return prev;
                        });

                        if (!isInPage) notification.play().catch(() => { });
                    });
                });
        }

        fetchData(props.addAlert, setMessages, getMessages, true, from);

        return () => {
            if (socket) {
                if (socket.connected) socket.disconnect();
                socket = undefined;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<div className="flex flex-col h-screen">
        <Header fixed={false} {...props} />

        <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto px-4 flex flex-col-reverse gap-8">
                {
                    messages ? messages.map(message => <Message key={message._id} message={message} user={props.user} />) : <div className="w-full h-full flex items-center justify-center"><Loading height="h-12" width="w-12" /></div>
                }
            </div>

            <form onSubmit={e => handleSendMessage(e, props.addAlert)} className="relative px-4 py-4">
                <input type="text" id="message" className="w-full rounded-full text-white text-lg px-6 py-2 border border-white bg-transparent placeholder-white/60" placeholder="Tapez votre message..." />
                <div className="absolute inset-y-0 right-7 flex items-center">
                    <button className="outline-none group" disabled={messages ? false : true}>
                        <PaperAirplaneIcon className="w-7 text-white/80 group-hover:text-white/90 transition" />
                    </button>
                </div>
            </form>
        </div>
    </div>)
}

function Message({ message, user }) {
    const isMe = message.author._id === user._id;

    return (<div>
        <div className={clsx("flex after:border-t-[1rem] after:border-r-[1rem] after:border-r-transparent after:w-0 after:h-0", isMe ? "justify-end after:border-t-white" : "justify-start")}>
            <div className={clsx("rounded-tl-2xl rounded-br-2xl rounded-bl-md py-3 px-5 min-w-[40%]", isMe ? "bg-white" : "border border-white")}>
                <p className={clsx(isMe ? "text-indigo-800" : "text-white")}>{message.content}</p>
            </div>
        </div>
        <div className="flex justify-end pr-5 pt-1">
            <p className="text-xs text-gray-200">{formatDate(new Date(message.date))}</p>
        </div>
    </div>);
}

async function handleSendMessage(event, addAlert) {
    event.preventDefault();

    event.target.querySelectorAll("input").forEach(a => a.disabled = true);
    try {
        const message = event.target.message.value;

        await sendMessage(message);

        event.target.message.value = "";
    } catch (error) {
        addAlert({ type: "error", title: error.message?.message || error.message || "Une erreur est survenue.", ephemeral: true });
    }
    event.target.querySelectorAll("input").forEach(a => a.disabled = false);
    event.target.message.focus();
}