export const HOST = process.env.NEXT_PUBLIC_SERVER_API_GATEWAY || "http://localhost:4000";

export const registerUser = `/v1/auth/register`;
export const loginUser = `/v1/auth/login`;
export const getUserDetails = `/v1/user/getUserDetails`;
export const getUserLicense = `/v1/license/getLicense`;
export const createRoom = `/v1/room/createRoom`;
export const joinRoom = `/v1/room/joinRoom`;
export const checkRoom = `/v1/room/checkRoom`;
export const editPosition = `/v1/room/editPosition`;