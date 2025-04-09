import {motion} from 'framer-motion' ;
import {
	currentUserState,currentColorState,roomUserState,
	userLicenseState,positionState,musicState,
	userDetailsState,
	currentRoomState
} from '../atoms/userAtom';
import {useRecoilState} from 'recoil';
import {ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import { checkRoom, createRoom, joinRoom } from '../utils/ApiRoutes';

export default function Form({stopAudio1,stopAudio2}) {

	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [currentRoom,setCurrentRoom] = useRecoilState(currentRoomState);
	const [_,setCurrentRoomName] = useRecoilState(roomUserState);
    const [userLicense, setUserLicense] = useRecoilState(userLicenseState);
	const [music,setMusic] = useRecoilState(musicState);
	const [currentColor,setCurrentColor] = useRecoilState(currentColorState)
	const [position,setPosition] = useRecoilState(positionState);
	const [name,setName] = useState('');
	const [submitted,setSubmitted] = useState(false)
	const [room,setRoom] = useState('');
	const [color,setColor] = useState('#f745e6');
	const router = useRouter();
    const [userDetails, setUserDetails] = useRecoilState(userDetailsState);

	const toastOptions={
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	}

	useEffect(()=>{
		if(userDetails){
			setName(userDetails.username);
		}else{
			router.push('/login');
		}
	},[userDetails])

	const checkSubmit = (e) =>{
		e.preventDefault();
		
		// if(!userLicense.includes('join')){
		// 	toast("You are not allowed to join room, please contact support", toastOptions);
		// 	return;
		// }

		if(room.length>3){
			if(name.length>3){
				handleSubmit();
				setSubmitted(true)
			}else{
				console.log("Name Must Have More than 3 Characters")
			}
		}else{
			console.log("Room Name must have more than 3 Characters")
		}
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


	const handleSubmit = async() =>{
		setCurrentRoomName(room);
		setCurrentColor(color);
		const user = {
			name:name,
			room:room,
			color:color,
		}
		const data = await checkRoomExists(room);
		
		
		const RoomId = data?.room?._id;
		const users = data?.room?.users;
		const allUsers = users?.map((user)=>{
			return (user.name)
		})
		if(allUsers && allUsers.includes(name)){
			toast("Player With Same Name Already Exists in this Room",toastOptions)
		}else{
			if(data.success === false){
				if(!userLicense.includes('create')){
					toast.warn("You are not allowed to create room, please contact support", toastOptions);
					return;
				}
				const {data} = await axiosInstance.post(createRoom,{
					name:room,
					users:[
						{
							name:name,
							position:position,
							color:color,
							hasChance:true,						
						},
					]
				})
				setCurrentRoom(data.room);
				stopAudio1();
				stopAudio2();
				setMusic(false);
				router.push('/play')
			}
			if(data.success === true){
				const newUser ={
					name:name,
					position:position,
					color:color,
					hasChance: data?.users.length < 1,
				}
				users.unshift(newUser)
				const {data} = await axiosInstance.post(`${joinRoom}/${RoomId}`,{
					users
				})
				setCurrentRoom(data.room);
				stopAudio1();
				stopAudio2();
				setMusic(false);
				router.push('/play');
			}
			localStorage.setItem('snakes',JSON.stringify(user));
			setName('');
			setRoom('');			
		}
	}


	return(



		<div className="relative w-full flex" >
			<img className="absolute z-0 w-4/12 md:w-2/12 top-[90px] opacity-20 " 
			src="https://ik.imagekit.io/d3kzbpbila/snakeform_LbOEGN1WH.gif?ik-sdk-version=javascript-1.4.3&updatedAt=1665238880828"
			
			alt=""
			/>
			<ToastContainer/>
			<form 
			onSubmit={(e)=>{checkSubmit(e)}}
			className="z-1 w-full overflow-hidden mt-10 flex items-center gap-5 flex-col justify-center" >	
				<motion.div 
				initial={{
					opacity:0,
					y:280
				}}
				transition={{duration:2.5,
					type: "spring", stiffness: 400, damping: 10}}
				whileInView={{opacity:1,y:0}}
				whileHover={{
				    scale: 1.1
				  }}
				  whileTap={{ scale: 0.8 }}
				className="mt-10 rounded-full bg-black/70 text-white 
				border-2 border-red-500 shadow-xl shadow-orange-500/40
				focus-within:border-sky-500 focus-within:shadow-sky-500/40 transition-shadow
				font-semibold duration-400 ease-in-out" >
					<input type="text" id="room name"
					placeholder="Enter Room Name"
					className="text-center p-5 outline-none bg-transparent"
					onChange={(e)=>setRoom(e.target.value)}
					value={room}
					/>
				</motion.div>
				<motion.div 
				initial={{
					opacity:0,
					y:-200
				}}
				transition={{duration:2.5,
				type: "spring", stiffness: 400, damping: 10 }}
				whileInView={{opacity:1,y:0}}
				whileHover={{
				    scale: 1.1
				  }}
				  whileTap={{ scale: 0.8 }}
				className="mt-10 rounded-full bg-black/70 text-white 
				border-2 border-red-500 shadow-xl shadow-orange-500/40
				focus-within:border-sky-500 focus-within:shadow-sky-500/40 transition-shadow
				font-semibold duration-400 ease-in-out" >
					<input type="text" id="room name"
					placeholder="Enter Your Name"
					className="text-center p-5 outline-none bg-transparent"
					onChange={(e)=>setName(e.target.value)}
					value={name}
					/>
				</motion.div>
				<motion.div 
				initial={{
					opacity:0,
					y:-200
				}}
				transition={{duration:2.5}}
				whileInView={{opacity:1,y:0}}
				whileHover={{
				    scale: 1.1
				}}
				whileTap={{ scale: 0.8 }}
				className="mt-5 rounded-full bg-black/70 text-white 
				border-2 border-red-500 shadow-xl shadow-orange-500/40
				focus-within:border-sky-500 focus-within:shadow-sky-500/40 transition-shadow
				font-semibold duration-400 ease-in-out" >
					<input type="color" id="color"
					className="text-center p-[0.3rem] b-0 cursor-pointer rounded-full outline-none bg-transparent"
					onChange={(e)=>setColor(e.target.value)}
					value={color}
					/>
				</motion.div>
				{
					submitted  ?  "" : 
						<motion.button 
						initial={{
							scale:0.3,
							opacity:0
						}}
						transition={{duration:4,
						 type: "spring", stiffness: 400, damping: 10 }}
						whileInView={{opacity:1,scale:1}}
						whileHover={{
						    scale: 1.1
						  }}
						  whileTap={{ scale: 0.8 }}
						type="submit" 
						className="mt-10 rounded-full text-white bg-sky-500/70 pr-5 pl-5 pt-2 pb-2 text-xl border-2 border-orange-500 
						shadow-orange-500/40 mb-10 font-semibold shadow-xl">
							{!userLicense?.includes('join') ? "Blocked" : "Join"}
						</motion.button>
				}
				

			</form>
		</div>

		)
}