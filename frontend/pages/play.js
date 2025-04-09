import Header from '../components/Header';
import SnakeBoard from '../components/SnakeBoard';
import {socket} from '../service/socket';
import {currentUserState,currentUsersState,snakeBiteState,roomUserState,availableState,ladderBiteState,musicState,soundState, currentRoomState} from '../atoms/userAtom';
import {useEffect,useState} from 'react';
import useSound from 'use-sound';
import {useRecoilState} from 'recoil';
import {useRouter} from 'next/router';
import axios from 'axios';
import {FaChessQueen} from 'react-icons/fa';
import axiosInstance from '../utils/axiosInstance';
import { checkRoom } from '../utils/ApiRoutes';


export default function play() {
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [currentRoom,setCurrentRoom] = useRecoilState(currentRoomState);
	const [currentUsers,setCurrentUsers] = useRecoilState(currentUsersState);
	const [snakeBite,setSnakeBite] = useRecoilState(snakeBiteState);
	const [ladderBite,setLadderBite] = useRecoilState(ladderBiteState);
	const [_,setCurrentRoomName] = useRecoilState(roomUserState);
	const [available,setAvailable] = useRecoilState(availableState);
	const [players,setPlayers] = useState([]);
	const [music,setMusic] = useRecoilState(musicState);
  	const [sound,setSound] = useRecoilState(soundState);
  	const [songPlaying,setSongPlaying] = useState('2');
	const router = useRouter();
 	const [play1,{stop:stopAudio1}] = useSound("/thief.mp3",{
	    onend:()=>{
	      setSongPlaying('2')
	    }
	  });
	const [play2,{stop:stopAudio2}] = useSound('/cold.mp3',{
	    onend:()=>{
	      setSongPlaying('1')
	    },
	    onload:()=>{
      		playSong();
	    }
	})
	
	  const playSong = () =>{
	      setTimeout(function() {
	      	play2();
	      	setMusic(true)
	      }, 3000);
	  }

	function checkRoomExists(room){
		return new Promise(async(resolve, reject) => {
			try {
				const {data} = await axiosInstance.post(checkRoom,{
					name:room,
				})
				resolve(data);
			} catch (error) {
				resolve(error?.response?.data);
			}
		});
	}

	useEffect(()=>{
		async function fetch() {
			if(localStorage.getItem('snakes')){
				let user = localStorage.getItem('snakes')
				user = JSON.parse(user)
				const room = user.room;
				const data = await checkRoomExists(room);
				if(data.success === true){
					setCurrentRoom(data.room);
					setCurrentRoomName(data.room.name);
					const user1 = {
						name:user.name,
						room:user.room,
						data:data.room
					}
					socket.emit('joinroom',user1);
				}else{
					stopAudio1();
					stopAudio2();
					setMusic(false);
					router.push('/')
				}
			}else{
				stopAudio1();
				stopAudio2();
				setMusic(false);
				router.push('/')
			}
		}
		fetch();	
	},[])


	useEffect(()=>{
		if(music && localStorage.getItem('snakes')){
			if(songPlaying==='1'){
				play1();         
			}else{
				play2();
			}
		}else{
			stopAudio1();
			stopAudio2();
			setMusic(false)
		}
	},[music,songPlaying])

	

	return(
		<div className="relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1595744043037-68de3376ed59?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80')] 
	    bg-cover md:bg-[#060126] md:bg-[url('https://images.unsplash.com/photo-1635028538158-0105e78c2fcf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80')] 
	    md:bg-center flex items-center flex-col md:bg-cover bg-center min-h-screen" >
	     
	      <Header/>
	 
	      <div className="w-[100vw] flex items-center flex-col" >
	      	<div className="w-[100%] flex justify-center" >
				<img 
				className="
			 	hover:scale-110 transition duration-500 ease-in-out cursor-pointer w-9/12 -rotate-1 md:w-5/12 mt-24 md:mt-27"
				src=
				"https://ik.imagekit.io/d3kzbpbila/thejashari_acUAOx_of?ik-sdk-version=javascript-1.4.3&updatedAt=1665237423310"
				alt=""/>
			</div>
	     	<SnakeBoard stopAudio1={stopAudio1} stopAudio2={stopAudio2} />
	      </div>
	      <div className="flex flex-col members text-white max-w-6xl m-5 flex items-center text-center justify-center">
	      	<h2 className="font-semibold m-5 text-2xl text-gray-300" >Active Players</h2>
	      	<div className="grid grid-cols-3 gap-[50px]">
	      		<div className="flex items-center justify-center" >
	      			<h2 className="text-xl font-semibold" >Coin</h2>
	      		</div>
	      		<div className="flex items-center justify-center" >
	      			<h2 className="text-xl font-semibold" >Name</h2>
	      		</div>
	      		<div className="flex items-center justify-center" >
	      			<h2 className="text-xl font-semibold" >Position</h2>
	      		</div>
	      	</div>
	      	<div className="mt-5 z-20">
	      		{currentUsers?.map((user)=>(
	      		<div className="grid bg-black/70 rounded-lg cursor-pointer hover:bg-gray-800/70 z-20 mt-2 transition duration-400 ease-in-out grid-cols-3 gap-10" >
	      			<div className="flex mt-4 mb-4 items-center justify-center" >
	      				<FaChessQueen className={`h-7 w-7 ${user.hasChance? "shadow-red-500/80" : "shadow-sky-500/80" } shadow-xl hover:shadow-sky-500 transition duration-400 ease-out`} style={{color:`${user.color}`}} />
	      			</div>
	      			<div className="flex mt-4 mb-4 items-center justify-center" >
	      				<h1 className="text-md md:text-lg text-gray-200 font-semibold" >{user.name}</h1>
	      			</div>
	      			<div className="flex mt-4 mb-4 items-center justify-center" >
	      				<h2 className="text-xl font-semibold">{user.position}</h2>
	      			</div>
	      		</div>
	      		))}
	      	</div>
	    </div>

	    <img 
	    className={`fixed w-70 ${snakeBite ? "opacity-100 transition duration-400 ease-in-out" : "opacity-0 transition duration-400 ease-in-out"} transition duration-500 ease-in-out z-30 rounded-lg h-55 bottom-7 right-7 shadow-lg shadow-red-500`} 
	    src="https://ik.imagekit.io/d3kzbpbila/snake-hisss_LkDDqUmxG.gif?ik-sdk-version=javascript-1.4.3&updatedAt=1666362032255"
		alt=""/>
		<img 
	    className={`fixed w-70 ${ladderBite ? "opacity-80 transition duration-400 ease-in-out" : "opacity-0 transition duration-400 ease-in-out"} transition duration-500 ease-in-out z-30 rounded-lg h-55 bottom-7 right-7 shadow-lg shadow-red-500`} 
	    src="https://ik.imagekit.io/d3kzbpbila/woody-woodpecker-ladder_qgbDsVEFO.gif?ik-sdk-version=javascript-1.4.3&updatedAt=1666364404474"
		alt=""/>

	    </div>


		)
}

// {currentUser?.users?.map((user)=>(
// 	      			<div className="m-2 flex flex-col flex-wrap md:flex-row items-center justify-center" >
// 	      				<GiRattlesnake className={`h-7 w-7 shadow-orange-500/20 shadow-md hover:shadow-sky-500 transition duration-400 ease-out`} style={{color:`${user.color}`}} />
// 	      				<h1 className="ml-1 text-md md:text-lg text-gray-200 font-semibold" >{user.hasChance ? "*": ""} {user.name} ({user.position})</h1>
// 	      			</div>
// 	      		))}