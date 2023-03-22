import { api } from ".";

export function sendMessage(content) {
    return api("/message", "post", { content });
}

export function getMessages(from) {
    return api("/messages?from=" + from, "get");
}