import { api } from ".";

export function fetchUser(id = "@me") {
    return api("/user/" + id, "get")
}

export function pacthUser(user = "@me", data) {
    return api("/user/" + user, "patch", data);
}

export function fetchUsers() {
    return api("/users", "get");
}

export function deleteUser(id) {
    return api("/user/" + id, "delete");
}