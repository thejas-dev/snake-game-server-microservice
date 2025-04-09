import {currentUserState,musicState,currentUsersState,snakeBiteState,soundState,ladderBiteState,roomUserState,availableState,extraMoveState, currentRoomState} from '../atoms/userAtom';
import {ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRecoilState} from 'recoil';
import useSound from 'use-sound';
import {useEffect,useState} from 'react';
import {FaChessQueen,FaChess} from 'react-icons/fa';
import {AiOutlineRollback,AiFillSound} from 'react-icons/ai';
import {BsChevronDown,BsMusicNoteBeamed} from 'react-icons/bs'
import {socket} from '../service/socket';
import {useRouter} from 'next/router'
import axiosInstance from '../utils/axiosInstance';
import { editPosition } from '../utils/ApiRoutes';

export default function SnakeBoard({stopAudio1,stopAudio2}) {
	const router = useRouter();
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [currentUsers,setCurrentUsers] = useRecoilState(currentUsersState);
	const [currentRoom,setCurrentRoom] = useRecoilState(currentRoomState);
	const [currentRoomName,setCurrentRoomName] = useRecoilState(roomUserState);
	const [available,setAvailable] = useRecoilState(availableState);
	const [extraMove,setExtraMove] = useRecoilState(extraMoveState);
	const [position,setPosition] = useState([]);
	const [name,setName]= useState('');
	const [snakeBite,setSnakeBite] = useRecoilState(snakeBiteState);
	const [ladderBite,setLadderBite] = useRecoilState(ladderBiteState);
	const [sound,setSound] = useRecoilState(soundState);
	const [music,setMusic] = useRecoilState(musicState);
	const [resAnimation,setResAnimation] = useState(false);
	const [result,setResult] = useState('fds')
	const [animate,setAnimate] = useState(false);
	const [reveal,setReveal] = useState(true);
	const [animating,setAnimating] = useState(false);
	let users = currentUsers;
	const [play1,{stop:stopAudio3}] = useSound("/snake.mp3");
	const [play2,{stop:stopAudio4}] = useSound("/happy.mp3");

	const toastOption = {
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
		console.log(currentRoom);
		setCurrentUsers(currentRoom?.users);

		if(localStorage.getItem('snakes')){
			let user = localStorage.getItem('snakes')
			user = JSON.parse(user)
			setName(user.name)
			let ind = '';
			currentRoom?.users?.map((user1,i)=>{
				if(user1.name===user.name){
					ind = i;
					if(user1.hasChance){
						setAvailable(true);
					}else{
						setAvailable(false);
					}
				}
			})
		}
	},[currentRoom])


	useEffect(()=>{
		if(localStorage.getItem('snakes')){
			let user = localStorage.getItem('snakes')
			user = JSON.parse(user)
			setName(user.name)
			let ind = '';
			currentUsers?.map((user2,i)=>{
				if(user2.name===user.name){
					ind = i;
					if(user2.hasChance){
						setAvailable(true);
					}else{
						setAvailable(false);
					}
				}
			})
		}
	},[currentUsers])


	useEffect(()=>{
		const array = [
			[],[],[],[],[],[],[],[],[],[],
			[],[],[],[],[],[],[],[],[],[],
			[],[],[],[],[],[],[],[],[],[],
			[],[],[],[],[],[],[],[],[],[],
			[],[],[],[],[],[],[],[],[],[],
			[],[],[],[],[],[],[],[],[],[],
			[],[],[],[],[],[],[],[],[],[],
			[],[],[],[],[],[],[],[],[],[],
			[],[],[],[],[],[],[],[],[],[],
			[],[],[],[],[],[],[],[],[],[],
		];
		users?.map((user,i)=>{
			if(user.position>0 && user.position<=10){
				let position = 89+user.position;
				let color = user.color;
				let name = user.name;
				let hasChance = user.hasChance;
				array[position].push({position,color,name,hasChance})
			}
			if(user.position>10 && user.position<=20){
				if(user.position===20){
					let position = 80;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})

				}else{
					let position = 90-user.position%10;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})

				}
				
			}
			if(user.position>20 && user.position<=30){
				if(user.position === 30){
					let position = 79;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})

				}else{
					let position = 69+user.position%20;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})
				}
				
			}
			if(user.position>30 && user.position<=40){
				if(user.position === 40){
					let position = 60;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})

				}else{
					let position = 70-user.position%30;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})
				}
				
			}
			if(user.position>40 && user.position<=50){
				if(user.position === 50){
					let position = 59;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})

				}else{
					let position = 49+user.position%40;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})
				}
				
			}
			if(user.position>50 && user.position<=60){
				if(user.position === 60){
					let position = 40;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})

				}else{
					let position = 50-user.position%50;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})
				}
				
			}
			if(user.position>60 && user.position<=70){
				if(user.position === 70){
					let position = 39;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})

				}else{
					let position = 29+user.position%60;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})
				}
				
			}
			if(user.position>70 && user.position<=80){
				if(user.position === 80){
					let position = 20;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})

				}else{
					let position = 30-user.position%70;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})
				}
				
			}
			if(user.position>80 && user.position<=90){
				if(user.position === 90){
					let position = 19;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})

				}else{
					let position = 9+user.position%80;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})
				}
				
			}
			if(user.position>90 && user.position<=100){
				if(user.position === 100){
					let position = 0;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})

				}else{
					let position = 10-user.position%90;
					let color = user.color;
					let name = user.name;
					let hasChance = user.hasChance;
					array[position].push({position,color,name,hasChance})
				}
				
			}
		})
		setPosition(array);
	},[users])

	async function updatePosition(users,roomId) {
		return new Promise(async(resolve, _) => {
			try {
				const {data} = await axiosInstance.post(editPosition,{
					users,
					roomId,
				})
				resolve({data:data}); 
			} catch (error) {
				resolve({data:error?.response?.data});
			}
		})
	}

	const rollDice = async() =>{
		if(available && !extraMove && users.length>1){
			setAnimate(true);
			setAvailable(false);
			let index = ''
			users.map((user,i)=>{
				if(user.name === name){
					index = i;
				}
			});	
			const res = Math.round(Math.random()*5+1);
			setTimeout(function() {
				displayFullScreen(res);
				const resWithRoom = {
					room:currentRoomName,
					response:res,
				};
				socket.emit('result',resWithRoom);
			}, 3000);
			setTimeout(function(){
				setAnimate(false);
				moveCoin(index,res);
			}, 4000);
		}
		if(users.length<=1){
			toast('2 or More Players are Required to Start the Game',toastOption);
		}
	};

	useEffect(()=>{
		if(socket){
			socket.on('recieve',(res)=>{
				displayFullScreen(res);
			})
			socket.on('recievePosition',async(res)=>{
				console.log(res);
				setCurrentUsers(res)
			})
			socket.on('extraMoveGoing',(res)=>{
				setExtraMove(true);
			})
			socket.on('extraMoveStopped',(res)=>{
				setExtraMove(false);
			})
			socket.on('userRemovedMsg',(res)=>{
				toast(`${res.name} has Just Left The Room`,toastOption)
				setCurrentRoom(res.data);
			})
			socket.on('userJoined',(res)=>{
				setCurrentRoom(res.data);
				toast(`${res.name} has Joined The Room`,toastOption)
			})
			socket.on('recieveSnakeBite',(res)=>{
				navigator.vibrate([500,100,300,100,700]);
				setSnakeBite(true);
				setTimeout(function() {setSnakeBite(false)}, 5000);
			})
			socket.on('recieveLadderBite',(res)=>{
				navigator.vibrate([300,100,200,100,500]);
				setLadderBite(true);
				setTimeout(function() {setLadderBite(false)}, 5000);
			})
			socket.on('snakeShow',(res)=>{
				showSnake(res)
			})
		}
		
	},[]);

	useEffect(()=>{
		if(sound && snakeBite){
			play1();
		}
	},[snakeBite])

	useEffect(()=>{
		if(sound && ladderBite){
			play2();
		}
	},[ladderBite])

	const showSnake = (res) =>{
		if(!animating){
			setAnimating(true)
			setResult(res)
			setResAnimation(true)
			setTimeout(function() {
				setResAnimation(false);
				setAnimating(false);
			}, 4000);					
		}
	}

	useEffect(()=>{
		if(localStorage.getItem('snakes')){
			let user = localStorage.getItem('snakes')
			user = JSON.parse(user)
			setName(user.name)			
		}
	},[]);

	const displayFullScreen = (res) =>{
		setResult(res)
		setResAnimation(true)
		setTimeout(function() {setResAnimation(false)}, 4000);
	}
	
	const moveCoin = (index,res) =>{
		let newUsers = users;
		let iterate = 0
		let newPosition = newUsers[index].position;
		let myInterval = setInterval(async function() {
			newPosition++;
			iterate++;
			if(iterate>res){
				clearInterval(myInterval);
				socket.emit('extraMoveOff',{
					currentRoom: currentRoomName
				})
			}else{
				socket.emit('extraMoveOn',{
					currentRoom: currentRoomName
				})
				if(iterate === res){
					if(index+1<newUsers.length){
						const newUser = {
							name:newUsers[index].name,
							color:newUsers[index].color,
							position:newPosition,
							hasChance:false,
						}
						const newUser2 = {
							name:newUsers[index+1].name,
							color:newUsers[index+1].color,
							position:newUsers[index+1].position,
							hasChance:true
						}
						newUsers = JSON.stringify(newUsers);
						newUsers = JSON.parse(newUsers);
						newUsers.splice(index,1,newUser);
						newUsers.splice(index+1,1,newUser2);
						socket.emit('changePosition',{newUsers,currentRoom: currentRoomName});
						const {data} = await updatePosition(newUsers,currentRoom._id);
						setCurrentRoom(data.room);
						switch(newPosition){
							case 1:
								ladderMove(index,37,data.room);
								socket.emit('ladderBite',{
									room:currentRoomName
								})
								break;
							case 4:
								ladderMove(index,10,data.room)
								socket.emit('ladderBite',{
									room:currentRoomName
								})
								break;
							case 8:
								ladderMove(index,22,data.room);
								socket.emit('ladderBite',{
									room:currentRoomName
								})
								break;
							case 28:
								ladderMove(index,48,data.room);
								socket.emit('ladderBite',{
									room:currentRoomName
								})
								break;
							case 21:
								ladderMove(index,21,data.room);
								socket.emit('ladderBite',{
									room:currentRoomName
								})
								break;
							case 32:
								snakeMove(index,22,data.room);
								socket.emit("snakeBite",{
									room:currentRoomName
								})
								break;
							case 36:
								snakeMove(index,30,data.room);
								socket.emit("snakeBite",{
									room:currentRoomName
								})
								break;
							case 48:
								snakeMove(index,22,data.room);
								socket.emit("snakeBite",{
									room:currentRoomName
								})
								break;
							case 50:
								ladderMove(index,17,data.room);
								socket.emit('ladderBite',{
									room:currentRoomName
								})
								break;
							case 62:
								snakeMove(index,44,data.room);
								socket.emit("snakeBite",{
									room:currentRoomName
								})
								break;
							case 71:
								ladderMove(index,21,data.room);
								socket.emit('ladderBite',{
									room:currentRoomName
								})
								break;
							case 80:
								ladderMove(index,19,data.room);
								socket.emit('ladderBite',{
									room:currentRoomName
								})
								break;
							case 88:
								snakeMove(index,64,data.room);
								socket.emit("snakeBite",{
									room:currentRoomName
								})
								break;
							case 95:
								snakeMove(index,39,data.room);
								socket.emit("snakeBite",{
									room:currentRoomName
								})
								break;
							case 97:
								snakeMove(index,19,data.room);
								socket.emit("snakeBite",{
									room:currentRoomName
								})
								break;
							case 100:
								socket.emit('winner',{name,currentRoom: currentRoomName});
								toast(` Congratulations 🦄 ${name} !, You Can Leave the Room To Avoid Getting Chance of Roll.`,{
									position: "bottom-right",
									autoClose: 10000,
									hideProgressBar: false,
									closeOnClick: true,
									pauseOnHover: true,
									draggable: true,
									progress: undefined,
									theme: "dark",
								});
								break;
							default:
								break;
						}								
					}else{
						const newUser = {
							name:newUsers[index].name,
							color:newUsers[index].color,
							position:newPosition,
							hasChance:false,
						}
						const newUser2 = {
							name:newUsers[0].name,
							color:newUsers[0].color,
							position:newUsers[0].position,
							hasChance:true
						}
						newUsers = JSON.stringify(newUsers);
						newUsers = JSON.parse(newUsers);
						newUsers.splice(index,1,newUser);
						newUsers.splice(0,1,newUser2);
						socket.emit('changePosition',{newUsers,currentRoom: currentRoomName});
						const {data} = await updatePosition(newUsers,currentRoom._id);	
						if(data.success){
							setCurrentRoom(data.room);
						}else{
							toast.warn("Cannot update the positions in database",toastOption);
						}
						
						switch(newPosition){
							case 1:
								ladderMove(index,37,data.room);
								socket.emit('ladderBite',{
									room:currentRoomName
								})	
								break;
							case 4:
								ladderMove(index,10,data.room)
								socket.emit('ladderBite',{
									room:currentRoomName
								})
								break;
							case 8:
								ladderMove(index,22,data.room);
								socket.emit('ladderBite',{
									room:currentRoomName
								})
								break;
							case 28:
								ladderMove(index,48,data.room);
								socket.emit('ladderBite',{
									room:currentRoomName
								})
								break;
							case 21:
								ladderMove(index,21,data.room);
								socket.emit('ladderBite',{
									room:currentRoomName
								})
								break;
							case 32:
								snakeMove(index,22,data.room);
								socket.emit("snakeBite",{
									room:currentRoomName
								})
								break;
							case 36:
								snakeMove(index,30,data.room);
								socket.emit("snakeBite",{
									room:currentRoomName
								})
								break;
							case 48:
								snakeMove(index,22,data.room);
								socket.emit("snakeBite",{
									room:currentRoomName
								})
								break;
							case 50:
								ladderMove(index,17,data.room);
								socket.emit('ladderBite',{
									room:currentRoomName
								})
								break;
							case 62:
								snakeMove(index,44,data.room);
								socket.emit("snakeBite",{
									room:currentRoomName
								})
								break;
							case 71:
								ladderMove(index,21,data.room);
								socket.emit('ladderBite',{
									room:currentRoomName
								})
								break;
							case 80:
								ladderMove(index,19,data.room);
								socket.emit('ladderBite',{
									room:currentRoomName
								})
								break;
							case 88:
								snakeMove(index,64,data.room);
								socket.emit("snakeBite",{
									room:currentRoomName
								})
								break;
							case 95:
								snakeMove(index,39,data.room);
								socket.emit("snakeBite",{
									room:currentRoomName
								})
								break;
							case 97:
								snakeMove(index,19,data.room);
								socket.emit("snakeBite",{
									room:currentRoomName
								})
								break;
							case 100:
								socket.emit('winner',{name,currentRoom: currentRoomName});
								toast(` Congratulations 🦄 ${name} !, You Can Leave the Room To Avoid Getting Chance of Roll.`,{
									position: "bottom-right",
									autoClose: 10000,
									hideProgressBar: false,
									closeOnClick: true,
									pauseOnHover: true,
									draggable: true,
									progress: undefined,
									theme: "dark",
								});
								break;
							default:
								break;
						}						
					}
				}else{
					const newUser = {
						name:newUsers[index].name,
						color:newUsers[index].color,
						position:newPosition,
						hasChance:false,
					}
					newUsers = JSON.stringify(newUsers)
					newUsers = JSON.parse(newUsers)
					newUsers.splice(index,1,newUser);
					socket.emit('changePosition',{newUsers,currentRoom: currentRoomName});
					const {data} = await updatePosition(newUsers,currentRoom._id);
					if(data.success){
						setCurrentRoom(data.room);					
					}else{
						toast.warn("Cannot update the positions in database",toastOption);
					}
				}
			}
		}, 1000);
	}

	const snakeMove = (index,res,data) =>{
		let newUsers = data.users;
		let iterate = 0;
		let newPosition = newUsers[index].position;
		let myInterval = setInterval(async function() {
			newPosition--;
			iterate++;
			if(iterate>res){
				clearInterval(myInterval);
				socket.emit('extraMoveOff',{
					currentRoom: currentRoomName
				})
			}else{
				socket.emit('extraMoveOn',{
					currentRoom: currentRoomName
				})
				const newUser = {
					name:newUsers[index].name,
					color:newUsers[index].color,
					position:newPosition,
					hasChance:newUsers[index].hasChance,
				}
				newUsers = JSON.stringify(newUsers)
				newUsers = JSON.parse(newUsers)
				newUsers.splice(index,1,newUser);
				socket.emit('changePosition',{newUsers,currentRoom: currentRoomName});
				const {data} = await updatePosition(newUsers,currentRoom._id);
				setCurrentRoom(data.room);	
			}
		},400)
	}

	const ladderMove = (index,res,data) =>{
		let newUsers = data.users;
		let iterate = 0;
		let newPosition = newUsers[index].position;
		let myInterval = setInterval(async function() {
			newPosition++;
			iterate++;
			
			if(iterate>res){
				clearInterval(myInterval);
				socket.emit('extraMoveOff',{
					currentRoom: currentRoomName
				})
			}else{
				if(newPosition === 100){
					socket.emit('winner',{name,currentRoom: currentRoomName});
				}
				socket.emit('extraMoveOn',{
					currentRoom: currentRoomName
				})
				const newUser = {
					name:newUsers[index].name,
					color:newUsers[index].color,
					position:newPosition,
					hasChance:newUsers[index].hasChance,
				}
				newUsers = JSON.stringify(newUsers)
				newUsers = JSON.parse(newUsers)
				newUsers.splice(index,1,newUser);
				socket.emit('changePosition',{newUsers,currentRoom: currentRoomName});
				const {data} = await updatePosition(newUsers,currentRoom._id);
				setCurrentRoom(data.room);	
			}
		},400)
	}

	const leaveRoom = async() =>{
		if(!extraMove && !available){
			let ind2;
			users.map((user2,i)=>{
				if(user2.name === name){
					ind2 = i;
				}
			})
			console.log(users);
			let newUsers2 = [...users];
			newUsers2.splice(ind2,1);

			if(newUsers2.length > 0){
				const {data} = await updatePosition(newUsers2,currentRoom._id);	
				socket.emit('userRemoved',{currentRoom: currentRoomName,name,data:data?.room})				
				socket.emit('removeRoom',{currentRoom: currentRoomName});
				setCurrentRoomName('')
				localStorage.removeItem('snakes');
				stopAudio1();
				stopAudio2();
				setMusic(false);
				router.push('/')
			}

		}else{
			if(available && users.length === 1){
				if(!extraMove){
					let ind2;
					users.map((user2,i)=>{
						if(user2.name === name){
							ind2 = i;
						}
					})
					let newUsers2 = users;
					newUsers2 = JSON.stringify(newUsers2);
					newUsers2 = JSON.parse(newUsers2);
					newUsers2.splice(ind2,1);
					if(newUsers2.length===0){
						const {data} = await updatePosition(newUsers2,currentRoom._id);	
						socket.emit('userRemoved',{currentRoom: currentRoomName,name,data:data?.room})				
						socket.emit('removeRoom',{currentRoom: currentRoomName});
						setCurrentRoomName('');
						stopAudio1();
						stopAudio2();
						setMusic(false);
						localStorage.removeItem('snakes');
						location.reload();
					}
				} else {
					toast("Please Wait untill all Coins Stop Moving",toastOption);
				}
			}else{
				if(available){
					toast("Please Finish The Move Before Leaving The Match",toastOption);
				}
				if(extraMove){
					toast("Please Wait untill all Coins Stop Moving",toastOption);
				}
			}
		}
	}


	const signOutConfirm = () =>{
		leaveRoom();
	} 
	
	useEffect(()=>{
		if(!sound){
			stopAudio3();
			stopAudio4();
		}
	},[sound])

	return(
		<div 
		className="relative flex w-full justify-center p-2">
			<BsChevronDown 
			onClick={()=>{setReveal(!reveal)}}
			className={`h-9 w-9 rounded-full border-2 shadow-xl shadow-sky-500 bg-black/50
			border-red-500 fixed top-[88px] ${reveal ? "-rotate-[540deg] transition duration-1400 ease-in-out" : ""} p-2 z-20 text-sky-500 left-3 cursor-pointer hover:scale-110 hover:shadow-orange-500 transition-all duration-400 z-20 ease-in-out`} />
			<BsMusicNoteBeamed 
			onClick={()=>{setMusic(!music)}}
			className={`h-9 w-9 rounded-2xl border-2 z-10 shadow-xl ${music ? "shadow-sky-500" : "-rotate-[540deg] shadow-orange-500" } bg-black/50
			border-red-500 fixed  ${reveal ? "top-[135px] opacity-100" : "top-[88px] opacity-0"} p-2 z-20 text-sky-500 left-3 cursor-pointer hover:scale-110 transition-all duration-400 ease-in-out`} />
			<AiFillSound 
			onClick={()=>{setSound(!sound)}}
			className={`h-9 w-9 rounded-2xl border-2 z-10 shadow-xl ${sound ? "shadow-sky-500" : "-rotate-[540deg] shadow-orange-500" } bg-black/50
			border-red-500 fixed  ${reveal ? "top-[182px] opacity-100" : "top-[88px] opacity-0"} p-2 z-20 text-sky-500 left-3 cursor-pointer hover:scale-110 transition-all duration-400 ease-in-out`} />
			<AiOutlineRollback 
			onClick={signOutConfirm}
			className={`h-9 w-9 rounded-2xl border-2 z-10 shadow-xl shadow-orange-500 bg-black/50
			border-red-500 fixed  ${reveal ? "top-[229px] opacity-100" : "top-[88px] opacity-0"} p-2 z-20 text-sky-500 left-3 cursor-pointer hover:scale-110 transition-all duration-400 ease-in-out`} />


			<img
	     	className={`z-20 absolute right-0 transition-all duration-[3000ms] ease-in-out md:right-60 md:bottom-0 -bottom-20 h-20 w-20
	     	${available ? "cursor-pointer" : "opacity-50"} ${animate ? "bottom-3/4 md:bottom-3/4 rotate-[3000deg] transition-bottom duration-40000" : ""}`} 
	     	onClick={rollDice}
	     	src="https://ik.imagekit.io/d3kzbpbila/thejashari_umw1GAvVs?ik-sdk-version=javascript-1.4.3&updatedAt=1665773310721"
	 		alt=""
	     	/>
			<img src="https://ik.imagekit.io/d3kzbpbila/board_CPYfhd15d.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1665253611737"
			alt=""
			className="shadow-xl shadow-violet-500/50 w-10/12 md:w-5/12 md:h-[41vw] h-[75vw]"
			/>
			<div className="absolute p-[11px] bg-black/10 md:p-[21px] w-[80%] md:w-5/12 md:h-[41vw] h-[75vw] ">
				<div className=" grid grid-cols-10 grid-rows-10 w-full h-full">
					
					{position.map((arr,i)=>{
						// if(i!==100)
							return(
							
								<div key={i} className="flex overflow-hidden z-20 items-center justify-center">
									{arr.length>0 ?
										<div key={i}>
										{arr.map((arr2,i)=>(
										i<=1?
											i === 1 ?
											<FaChess onClick={()=>{
												toast(`🦄  ${arr2.name}`,{
												position: "bottom-right",
												autoClose: 3000,
												hideProgressBar: false,
												closeOnClick: true,
												pauseOnHover: true,
												draggable: true,
												progress: undefined,
												theme: "dark",
												})
											}} key={i} className={`md:h-7 h-[23px] md:w-7 w-[23px] p-[2px] cursor-pointer z-20 rounded-full shadow-md ${arr2.hasChance? "shadow-red-500":"shadow-sky-500"} border-2 border-red-500/50 bg-black/70`} style={{color:`${arr2.color}`}}/> 	
											:
											<FaChessQueen onClick={()=>{
												toast(`🦄  ${arr2.name}`,{
												position: "bottom-right",
												autoClose: 3000,
												hideProgressBar: false,
												closeOnClick: true,
												pauseOnHover: true,
												draggable: true,
												progress: undefined,
												theme: "dark",
												})
											}} key={i} className={`md:h-7 h-[23px] md:w-7 w-[23px] p-[2px] cursor-pointer z-20 rounded-full shadow-md ${arr2.hasChance? "shadow-red-500":"shadow-sky-500"} border-2 border-red-500/50 bg-black/70`} style={{color:`${arr2.color}`}}/>
										: <></>
										))}
										</div>
									: 
									<div key={i} className="text-white"></div>
									}
								</div>
							
							)							
						}
					)}
				</div>
			</div>
			<img src="https://ik.imagekit.io/d3kzbpbila/snakeres_NqZKsFrYk.gif?ik-sdk-version=javascript-1.4.3&updatedAt=1665850866863" alt="" className="hidden" />
			<div className="fixed  w-[100vw] h-[100vh] top-0 flex items-center justify-center ">
				{resAnimation?
				<div>
				<div className="fixed top-0 left-0 animate-revealbg bg-black opacity-0 w-[100vw] h-[100vh]"></div>
					<h1 className={`text-white animate-reveal opacity-0 z-30 text-xl font-serif text-yellow-300`}>{result}</h1>
						<img src="https://ik.imagekit.io/d3kzbpbila/snakeres_NqZKsFrYk.gif?ik-sdk-version=javascript-1.4.3&updatedAt=1665850866863"
						className="animate-snakeFromLeft h-30 w-30 z-30 fixed top-50 left-[100%]" alt=""/>
						<img src="https://ik.imagekit.io/d3kzbpbila/snakeres_NqZKsFrYk.gif?ik-sdk-version=javascript-1.4.3&updatedAt=1665850866863"
						className="animate-snakeFromRight h-30 w-30 z-30 fixed top-20 right-[100%] rotate-180" alt=""/>
				</div>
				: ""
				}
			</div>	
			<ToastContainer/>			
		</div>

		)
}



// <div className="bg-red-500 w-[94%] lg:w-[50%] lg:h-[92vh] md:h-[90vh] md:w-[60%] xl:w-[45%] xl:h-[93vh] sm:h-[80vh] sm:w-[70%] h-[42vh] bg-no-repeat bg-cover bg-center
// 			bg-[url('https://ik.imagekit.io/d3kzbpbila/board_CPYfhd15d.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1665253611737')]">
// 			</div>