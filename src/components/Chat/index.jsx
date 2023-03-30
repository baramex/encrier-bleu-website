import { UserCircleIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { createRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { io } from "socket.io-client";
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
    const [fetchMessage, setFetchMessage] = useState(undefined);
    const [fetching, setFetching] = useState(true);
    const [fetchedAll, setFetchedAll] = useState(false);

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
                            setFrom(prev.length + 1);

                            return [message, ...prev];
                        });

                        if (!isInPage) notification.play().catch(() => { });
                    });
                });
        }

        fetchMessages(0, messages, setMessages, setFrom, setFetching, setFetchMessage, setFetchedAll).catch(err => {
            props.addAlert({ type: "error", message: err.message?.message || err.message || "Une erreur est survenue.", ephemeral: true });
        });

        return () => {
            if (socket) {
                if (socket.connected) socket.disconnect();
                socket = undefined;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="flex flex-col h-screen">
        <Header fixed={false} {...props} />

        <div className="flex-1 overflow-y-auto px-4 flex flex-col-reverse gap-8" onScroll={fetchedAll ? null : fetching ? e => e.target.scrollTop === -e.target.scrollHeight - e.target.clientHeight ? e.target.scrollTop = -e.target.scrollHeight - e.target.clientHeight + 1 : null : e => handleChatScrolling(e, messages, from, setFrom, setMessages, setFetchedAll, setFetching, setFetchMessage, props.addAlert)}>
            {
                messages && messages.map((message, i) => <Message key={message._id} scroll={(i === 0 && messages.length <= 20) || newMessage || message._id === fetchMessage} behavior={newMessage ? "smooth" : "auto"} message={message} user={props.user} />)
            }
            {fetching ?
                <div className="w-full h-full flex items-center justify-center"><Loading height="h-12" width="w-12" /></div> : fetchedAll && messages && messages.length > 0 ? <p className="text-center text-sm text-gray-300/60 m-0">Vous êtes arrivé au début de la discussion.</p> : null
            }
        </div>

        <form onSubmit={e => handleSendMessage(e, props.addAlert)} className="relative px-4 py-4">
            <input required type="text" id="message" className="w-full rounded-full text-white text-lg px-6 py-2 border border-white bg-transparent placeholder-white/60" placeholder="Tapez votre message..." />
            <div className="absolute inset-y-0 right-7 flex items-center">
                <button className="outline-none group" disabled={messages ? false : true}>
                    <PaperAirplaneIcon className="w-7 text-white/80 group-hover:text-white/90 transition" />
                </button>
            </div>
        </form>
    </div>)
}

function Message({ message, user, scroll, behavior }) {
    const messageRef = createRef();

    const isMe = message.author._id === user._id;

    useEffect(() => {
        let element = messageRef.current;
        if (!element) return;

        if (scroll && (behavior === "smooth" ? -element.parentElement.scrollTop < 200 : true)) {
            let scroll = element.parentElement.scrollTop;
            element.scrollIntoView({ behavior: behavior || "auto" });
            let i = 0;
            if (behavior === "smooth") checkScroll();
            let messageCopy = element;

            function checkScroll() {
                if (i >= 3) return;
                setTimeout(() => {
                    if (messageCopy) {
                        let diff = messageCopy.parentElement.scrollTop - scroll;
                        if (diff === 0) {
                            messageCopy.scrollIntoView({ behavior: behavior || "auto" });
                            checkScroll();
                        }
                    }
                }, 25);
                i++;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<div ref={messageRef}>
        <div className={clsx("flex", isMe ? "justify-end" : "justify-start")}>
            <div className="flex flex-col min-w-[40%]">
                <div className={clsx("py-3 px-5", isMe ? "bg-indigo-50 rounded-tl-2xl rounded-br-2xl rounded-bl-md" : "border border-indigo-50 rounded-tr-2xl rounded-bl-2xl rounded-br-md")}>
                    {!isMe ? <div className="flex gap-2 mb-2 font-medium items-center"><UserCircleIcon className="w-7 text-white" /><p className="text-white text-lg">{message.author.username}</p></div> : null}
                    <p className={clsx(isMe ? "text-indigo-900" : "text-white")}>{message.content}</p>
                </div>
                <div className="flex justify-end pr-1 pt-1">
                    <p className="text-xs text-indigo-100">{formatDate(new Date(message.date))}</p>
                </div>
            </div>
            <div className={clsx(isMe ? "relative w-4 h-4 after:block after:border-t-indigo-50 after:border-t-[1rem] after:border-r-[1rem] after:border-r-transparent" : "")}></div>
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

async function handleChatScrolling(event, messages, from, setFrom, setMessages, setFetchedAll, setFetching, setFetchMessage, addAlert) {
    const relativeScroll = event.target.scrollHeight + event.target.scrollTop - event.target.clientHeight;
    if (relativeScroll === 0) event.target.scrollTop = -event.target.scrollHeight - event.target.clientHeight + 1;

    if (!messages || messages.length < 20) return;
    if (relativeScroll <= 50) {
        setFetching(true);

        try {
            await fetchMessages(from, messages, setMessages, setFrom, setFetching, setFetchMessage, setFetchedAll);
        } catch (error) {
            addAlert({ type: "error", title: error.message?.message || error.message || "Une erreur est survenue.", ephemeral: true });
        }
    }
}

async function fetchMessages(from, messages, setMessages, setFrom, setFetching, setFetchMessage, setFetchedAll) {
    let m = await getMessages(from);
    setMessages(prev => {
        if (!prev) prev = [];
        m = m.filter(a => !prev.find(b => b._id === a._id));
        prev.push(...m);
        return prev;
    });
    setFrom(from + 20);
    setFetching(false);
    if (messages && messages[0]) setFetchMessage(messages[0]?._id);
    if (m.length < 20) setFetchedAll(true);
}

function handleMouseEnter() {
    isInPage = true;
}

function handleMouseLeave() {
    isInPage = false;
}