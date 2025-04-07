require('dotenv').config();

const express = require('express');
const logger = require('./utils/logger');
const cors = require('cors');
const helmet = require('helmet');
const socket = require('socket.io');
const { logRequests } = require('./utils/loggerHelper');

const app = express();
const PORT = process.env.PORT || 4005;

app.use(helmet());
app.use(cors());
app.use(express.json());

const Server = app.listen(PORT, () => {
    logger.info(`Socket Service running on port ${PORT}`);
})

process.on('unhandledRejection',(reason, promise) => {
    logger.error('Unhandled Rejection at', promise, "reason: " + reason);
});


const io = socket(Server,{
	cors:{
		origin: process.env.CLIENT_URL,
		credentials:true,
	},
})

global.onlineUsers = new Map();

io.on("connection",(socket)=>{
    logRequests("connection",`New connectection from ${socket.id}`);

    console.log(`socket ${socket.id} connected`);

	socket.on('joinroom',({room,name,data})=>{
		socket.join(room);
		let res = {
			name:name,
			data:data
		}
		io.sockets.in(room).emit("userJoined",res);
        logRequests("joinroom",`User Joined in ${room}, Socket Id : ${socket.id}`);
	})
	socket.on('removeRoom',({currentRoom})=>{
		socket.leave(currentRoom)
        logRequests("removeRoom",`User Left in ${currentRoom}, Socket Id : ${socket.id}`);
	})
	socket.on('showplayers',(room)=>{
		const users = io.sockets.adapter.rooms.get(room);
		socket.emit('players',users)
        logRequests("showplayers",`Showing players in ${room}, Socket Id : ${socket.id}`);
	})
	socket.on('userRemoved',({currentRoom,name,data})=>{
		let res = {
			name:name,
			data:data
		}

		io.sockets.in(currentRoom).emit('userRemovedMsg',res);
        logRequests("userRemoved",`User Removed Message for ${currentRoom}, Room Name : ${name} , Socket Id : ${socket.id}`);
	})
	socket.on('result',(resWithRoom)=>{
		const room = resWithRoom.room;
		io.sockets.in(room).emit("recieve",resWithRoom.response);
        logRequests("result",`Roll Dice Result from ${room}, Socket Id : ${socket.id}`);
	})
	socket.on('changePosition',({newUsers,currentRoom})=>{
        io.sockets.in(currentRoom).emit("recievePosition",newUsers);
        logRequests("changePosition",`Changing Position in ${currentRoom}, Socket Id : ${socket.id}`);
	})
	socket.on('extraMoveOn',({currentRoom})=>{
		io.sockets.in(currentRoom).emit('extraMoveGoing',currentRoom);
	})
	socket.on('extraMoveOff',({currentRoom})=>{
		io.sockets.in(currentRoom).emit('extraMoveStopped',currentRoom);
	})
	socket.on('snakeBite',({room})=>{
		io.sockets.in(room).emit('recieveSnakeBite',room);
	})
	socket.on('ladderBite',({room})=>{
		io.sockets.in(room).emit('recieveLadderBite',room);
	})
	socket.on('showSnake',({currentRoom})=>{
		io.sockets.in(currentRoom).emit('snakeShow',currentRoom);
	})
	socket.on('winner',({name,currentRoom})=>{
		let res = {
			name:name,
			currentRoom:currentRoom
		}
		socket.broadcast.emit('winnerIn',res)
        logRequests("winner",`Winner in ${currentRoom} and emitted winnerIn event, Socket Id : ${socket.id}`);
	})

})