import {io} from 'socket.io-client'
let server = process.env.NEXT_PUBLIC_SOCKET_SERVER_BASE;
export const socket = io(server)