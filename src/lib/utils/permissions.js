export const PERMISSIONS = {
    ALL: 0,
    VIEW_USERS: 1,
    MANAGE_USERS: 2,
    CREATE_USER: 3,
    VIEW_ROLES: 4,
    SEND_MESSAGE: 5,
    VIEW_MESSAGES: 6
};

export function hasPermission(user, ...permissions) {
    if (!permissions || permissions.length === 0) return true;
    if (!user) return false;
    return permissions.every(p => user.role.permissions?.includes(p)) || user.role.permissions?.includes(PERMISSIONS.ALL);
}