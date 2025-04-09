import React from 'react';
import Body from '../components/Body';
import LoginForm from '../components/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen w-full bg-[url('https://ik.imagekit.io/d3kzbpbila/thejashari_RaG0GWDzz')] bg-center
            bg-cover bg-no-repeat">
        <div className='bg-black/50 min-h-screen w-full flex items-center justify-center' >
            <div className="max-w-6xl h-full flex items-center flex-col" >
                <Body/>
                {/* <Form stopAudio1={stopAudio1} stopAudio2={stopAudio2} /> */}
                <LoginForm />
            </div>
        </div>

    </div>
    
  );
}