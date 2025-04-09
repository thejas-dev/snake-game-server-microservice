import {motion} from 'framer-motion' ;
import {userDetailsState,userLicenseState} from '../atoms/userAtom';
import {ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useState} from 'react';
import {useRouter} from 'next/router';
import { getUserDetails, getUserLicense, loginUser, registerUser } from '../utils/ApiRoutes';
import axiosInstance from '../utils/axiosInstance';
import { useRecoilState } from 'recoil';

export default function Form() {
    const [username, setUsername]= useState('');
    const [password, setPassword]= useState('');
    const [isRegister, setIsRegister]= useState(false);
    const [_, setUserDetails] = useRecoilState(userDetailsState);
    const [userLicense, setUserLicense] = useRecoilState(userLicenseState);
    const router = useRouter();

    async function getUserPermissions(userId){
        return new Promise(async(resolve, reject) => {
            try {
                const {data} = await axiosInstance.post(getUserLicense,{userId});
                if(data.success){
                    resolve(data.permissions);
                }else {
                    resolve([]);
                }
            } catch (error) {
                resolve([]);   
            }
            
        });
    }

    async function getUserDataAndRedirect(userId){
        try {
            const {data} = await axiosInstance.post(getUserDetails,{
                userId
            })
            if(data.success){
                setUserDetails(data.user)
                const permissions = await getUserPermissions(data.user._id);
                console.log(permissions);
                setUserLicense(permissions);
                router.push('/');
            }else{
                toast.error("Failed to fetch user details");
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Failed to fetch user data');
        }
    }

    async function checkSubmit(e){
        e.preventDefault();
        if(username.length < 5 || password.length < 5){
            toast.error("Username and password must be at least 5 characters long")
            return;
        }
        if(isRegister){
            try {
                const {data} = await axiosInstance.post(registerUser,{username,password})
                toast.success("User created successfully")
                await sessionStorage.setItem("userTokens",JSON.stringify({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    userId: data.userId
                }))

                getUserDataAndRedirect(data.userId);

            } catch (error) {
                toast.error(error?.response?.data?.message || 'Failed to login user');
            }
        }else{
            try {
                const {data} = await axiosInstance.post(loginUser,{username,password});
                toast.success("Logged in successfully")
                await sessionStorage.setItem("userTokens",JSON.stringify({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    userId: data.userId
                }))

                getUserDataAndRedirect(data.userId);

            } catch (error) {
                toast.error(error?.response?.data?.message || 'Failed to login user');
            }
            
        }
    }
	
	return(
		<div className="relative w-full flex" >
			
			<ToastContainer/>
			<form 
			onSubmit={(e)=>{checkSubmit(e)}}
			className="z-1 w-full overflow-hidden mt-10 flex items-center gap-5 flex-col justify-center" >
                <h1 className='md:text-2xl text-lg font-mono text-white font-bold' >
                    {
                        isRegister ?
                        "Creating new account" 
                        :
                        "Login to your account"
                    }
                </h1>	
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
					<input type="text" id="username"
					placeholder="Enter User Name"
					className="text-center p-5 outline-none bg-transparent"
					onChange={(e)=>setUsername(e.target.value)}
					value={username}
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
				className="mt-4 rounded-full bg-black/70 text-white 
				border-2 border-red-500 shadow-xl shadow-orange-500/40
				focus-within:border-sky-500 focus-within:shadow-sky-500/40 transition-shadow
				font-semibold duration-400 ease-in-out" >
					<input type="text" id="password"
					placeholder={`Enter ${isRegister ? "New" : "Your"} Password`}
					className="text-center p-5 outline-none bg-transparent"
					onChange={(e)=>setPassword(e.target.value)}
					value={password}
					/>
				</motion.div>
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
                className="mt-5 rounded-full text-white bg-sky-500/70 pr-5 pl-5 pt-2 pb-2 text-lg border-2 border-orange-500 
                shadow-orange-500/40 mb-10 font-semibold shadow-xl">
                    {isRegister ? "Register":"Login"}
                </motion.button>
                <motion.div 
				initial={{
					opacity:0,
					x:-200
				}}
				transition={{duration:2.5,
				type: "spring", stiffness: 400, damping: 10 }}
				whileInView={{opacity:1,x:0}}
				whileHover={{
				    scale: 1.1
				  }}
				  whileTap={{ scale: 0.8 }}
				>
					<p onClick={()=>setIsRegister(!isRegister)} className='text-white'>
                        {
                            isRegister ? 
                        <>
                            <span>Already Have an account? </span>
                            <span className='text-blue-500 cursor-pointer hover:text-blue-400'>Login Now</span>
                        </>
                        : 
                        <>
                            <span>New User? </span>
                            <span className='text-blue-500 cursor-pointer hover:text-blue-400'>Register Now</span>
                        </>
                        }
                    </p>
				</motion.div>
				
				
				

			</form>
		</div>

		)
}