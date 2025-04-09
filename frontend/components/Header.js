import {useState,useEffect} from 'react'
import Backdrop from '@mui/material/Backdrop';
import {roomUserState} from '../atoms/userAtom';
import {useRecoilState} from 'recoil';
import {socket} from '../service/socket';
import {ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Header() {
	const [open1, setOpen1] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [currentRoom,setCurrentRoom] = useRecoilState(roomUserState);
	
	const handleClose1 = () => {
	setOpen1(false);
	};
	const handleToggle1 = () => {
	setOpen1(!open1);
	};
	const handleClose2 = () => {
	setOpen2(false);
	};
	const handleToggle2 = () => {
	setOpen2(!open2);
	};

	const showSnake = () =>{
		socket.emit('showSnake',{currentRoom});
	}

	useEffect(()=>{
		if(socket){
			socket.on('winnerIn',(res)=>{
				toast(`${res.name} Won The Match in ${res.currentRoom} Room`)
			})
		}
	},[])

	return(
		<div className="fixed z-50 flex grid top-0 w-[100vw] grid-cols-3 border-b-2 border-orange-500 rounded-xl shadow-xl shadow-orange-600/40 bg-gray-900/70" >
			<Backdrop
		        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
		        open={open1}
		        onClick={handleClose1}
		    >
		    	<div className="h-screen overflow-y-scroll flex items-center justify-center m-7 md:m-40 flex-col">
		    		<h1 className="text-xl bg-gray-900/40 p-[5px] md:p-[10px] rounded-full shadow-xl shadow-orange-600/70   text-orange-500 font-bold">Multiplayer Snake Game</h1>
		    		<p className="text-md mt-2 md:mt-10 font-semibold bg-gray-900/40 p-5 rounded-lg shadow-xl shadow-orange-600/70">
		    			A Simple Real Time Multiplayer Snake and Ladder Game. <b className="text-yellow-500"> Concept is Simple join a Room with any Random Words and ask Your Friends To join the Same Room By Sharing the Room Name You used to Join in,</b> Roll the Dice in Your Chance and Make Your Move. 
		    			<br/>
		    			<br/>
		    			<b className="text-green-500" >Everyone in a Room Get a Chance to Roll Dice Depending on the Order of Members Joining in a Room.</b>
		    			<br/>
		    			<br/>
		    			No Limit for Players to Join in The Same Room and Play Together.
		    			<br/>
		    			<br/>
		    			<b className="text-sky-500">Player who makes 100th Position First will Win the Match</b> and their Name Will be Broadcasted to Everyone. 
		    			<br/>
		    			<br/>
		    			Made With ♥️ by <a href="https://instagram.com/nuthejashari" className="text-sky-500">Thejas Hari</a>
		    		</p>
		    	</div>
		    </Backdrop>
		    <Backdrop
		        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
		        open={open2}
		        onClick={handleClose2}
		    >
		    	<div className="h-screen overflow-y-scroll flex items-center justify-center m-7 md:m-40 flex-col">
		    		<h1 className="text-xl bg-gray-900/40 p-[5px] md:p-[10px] rounded-full shadow-xl shadow-orange-600/70   text-orange-500 font-bold">Frequently Asked Questions</h1>
		    		<p className="text-md mt-2 md:mt-10 font-semibold bg-gray-900/70 p-5 rounded-lg shadow-xl shadow-orange-600/70">
		    			<b className="text-yellow-500"> Q: How to Join a Room?</b>
		    			<br/>
		    			<b className="text-green-500">&nbsp;&nbsp;&nbsp; Enter The Room Name, Your Name, Select Your Favorite Color then Press Play Button to Join a Room.</b>
		    			<br/>
		    			<br/>
		    			<b className="text-yellow-500"> Q: How to Invite Our Friends to the Room?</b>
		    			<br/>
		    			<b className="text-green-500">&nbsp;&nbsp;&nbsp; Make your Friends to use the Same Room Name Used by you to Get inside a Room.</b>
		    			<br/>
		    			<br/>
		    			<b className="text-yellow-500"> Q: Can I Reload the Site or Use Another Website while Playing?</b>
		    			<br/>
		    			<b className="text-green-500">&nbsp;&nbsp;&nbsp; Yes Your Progress will be Automatically Saved.</b>
		    			<br/>
		    			<br/>
		    			<b className="text-yellow-500"> Q: How to Stop the Music or Exit from a Room?</b>
		    			<br/>
		    			<b className="text-green-500">&nbsp;&nbsp;&nbsp; By Music Icon and Fall Back Icon in Drop Down Menu(Top Left).</b>
		    			<br/>
		    			<br/>
		    			<b className="text-yellow-500"> Q: How to Report an Bug?</b>
		    			<br/>
		    			<b className="text-green-500">&nbsp;&nbsp;&nbsp; By Insta, Link in About Section.</b>
		    		</p>	
		    	</div>
		    </Backdrop>
		    
			<div className="items-center flex justify-center p-5 text-white" >
				<h1 
				onClick={showSnake}
				className="text-lg md:text-xl font-semibold text-red-500 hover:text-red-300 hover:scale-110 cursor-pointer transition duration-400 ease-out">Snakes</h1>
			</div>
			<div className="items-center flex justify-center p-5 text-white">
				<h1 
				onClick={handleToggle1}
				className="text-lg md:text-xl font-semibold text-red-500 hover:text-red-300 hover:scale-110 cursor-pointer transition duration-400 ease-out">About</h1>
			</div>
			<div className="items-center flex justify-center p-5 text-white">
				<h1 
				onClick={handleToggle2}
				className="text-lg md:text-xl font-semibold text-red-500 hover:text-red-300 hover:scale-110 cursor-pointer transition duration-400 ease-out">FAQ ?</h1>
			</div>
			<ToastContainer/>
		</div>


		)
}