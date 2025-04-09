import Header from '../components/Header';
import Body from '../components/Body';
import Form from '../components/Form';
import {useEffect,useState} from 'react';
import useSound from 'use-sound';
import {AiFillSound} from 'react-icons/ai';
import {BsChevronDown,BsMusicNoteBeamed} from 'react-icons/bs'
import {useRouter} from 'next/router';
import {useRecoilState} from 'recoil';
import {musicState,soundState} from '../atoms/userAtom';

export default function index() {
	const router = useRouter();
  const [music,setMusic] = useRecoilState(musicState);
  const [sound,setSound] = useRecoilState(soundState);
  const [songPlaying,setSongPlaying] = useState('1');
  const [reveal,setReveal] = useState(true);
  //const [song1,setSong1] = useState(typeof Audio !=="undefined" &&  new Audio("https://ik.imagekit.io/d3kzbpbila/Audios/thejashari_jpmwcDOYU?ik-sdk-version=javascript-1.4.3&updatedAt=1666427604864"));
  // const [song2] = useState(typeof Audio !=="undefined" &&  new Audio("https://ik.imagekit.io/d3kzbpbila/Audios/thejashari_w2vUtH8u5?ik-sdk-version=javascript-1.4.3&updatedAt=1666427645567"));
  // const [song3] = useState(typeof Audio !=="undefined" &&  new Audio("https://ik.imagekit.io/d3kzbpbila/Audios/thejashari_eNbkbyoed?ik-sdk-version=javascript-1.4.3&updatedAt=1666427691677"));
  //const [song4,setSong4] = useState(typeof Audio !=="undefined" &&  new Audio("https://ik.imagekit.io/d3kzbpbila/Audios/thejashari_GmizVDbYB?ik-sdk-version=javascript-1.4.3&updatedAt=1666427720726"));

  const [play1,{stop:stopAudio1}] = useSound("/thief.mp3",{
    onend:()=>{
      setSongPlaying('2')
    }
  });
  const [play2,{stop:stopAudio2}] = useSound('/cold.mp3',{
    onend:()=>{
      setSongPlaying('1')
    },
  })
 

	useEffect(()=>{
		// if(localStorage.getItem('snakes')){
    //     stopAudio1();
    //     stopAudio2();  
    //     setMusic(false)      
		// 	router.push('/play');
		// }
	},[])

  useEffect(()=>{
    if(music && !localStorage.getItem('snakes')){
        if(songPlaying==='1'){
            play1();         
        }else{
          play2();
        }        
     
    }else{
      stopAudio1();
      stopAudio2();
    }
  },[music,songPlaying])


  return(
    <div className="relative bg-[url('https://images.unsplash.com/photo-1595744043037-68de3376ed59?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80')] 
    bg-cover md:bg-[#060126] md:bg-[url('https://images.unsplash.com/photo-1635028538158-0105e78c2fcf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80')] 
    md:bg-center flex justify-center  md:bg-cover bg-center min-h-screen" >
     <BsChevronDown 
      onClick={()=>{setReveal(!reveal)}}
      className={`h-9 w-9 rounded-full border-2 shadow-xl shadow-sky-500 bg-black/50
      border-red-500 fixed top-[88px] ${reveal ? "-rotate-[540deg] transition duration-1400 ease-in-out" : ""} p-2 z-20 text-sky-500 left-2 md:left-3 cursor-pointer hover:scale-110 hover:shadow-orange-500 transition-all duration-400 z-20 ease-in-out`} />
      <BsMusicNoteBeamed 
      onClick={()=>{setMusic(!music)}}
      className={`h-9 w-9 rounded-2xl border-2 z-10 shadow-xl ${music ? "shadow-sky-500" : "-rotate-[540deg] shadow-orange-500" } bg-black/50
      border-red-500 fixed  ${reveal ? "top-[135px] opacity-100" : "top-[88px] opacity-0"} p-2 z-20 text-sky-500 left-2 md:left-3 cursor-pointer hover:scale-110 transition-all duration-400 ease-in-out`} />
      <AiFillSound 
      onClick={()=>{setSound(!sound)}}
      className={`h-9 w-9 rounded-2xl border-2 z-10 shadow-xl ${sound ? "shadow-sky-500" : "-rotate-[540deg] shadow-orange-500" } bg-black/50
      border-red-500 fixed  ${reveal ? "top-[182px] opacity-100" : "top-[88px] opacity-0"} p-2 z-20 text-sky-500 left-2 md:left-3 cursor-pointer hover:scale-110 transition-all duration-400 ease-in-out`} />
     
      <Header/>
      <div className="max-w-6xl flex items-center flex-col" >
      	<div className="mt-24 md:mt-27">
          <Body/>
        </div>
      	<Form stopAudio1={stopAudio1} stopAudio2={stopAudio2} />
      </div>
    </div>


    )
}

 // <AudioPlayer
 //    autoPlay
 //    muted
 //    className="music1"
 //    src="https://ik.imagekit.io/d3kzbpbila/Audios/thejashari_jpmwcDOYU?ik-sdk-version=javascript-1.4.3&updatedAt=1666427604864"
 //    onPlay={e => console.log("onPlay")}
 //    // other props here
 //    />