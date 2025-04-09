/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation:{
        reveal:'reveal 4s linear 1',
        snakeFromLeft:'snakeFromLeft 4s linear 1',
        snakeFromRight:'snakeFromRight 4s linear 1',
        revealbg:'revealbg 4s linear 1',
      },
    	gridTemplateRows:{
    		'10':'repeat(10, minmax(0, 1fr))',
    	},
      keyframes:{
        reveal:{
        '0%':{transform:'scale(1)',opacity:'10%' },
        '10%':{transform: 'scale(1.2)',opacity:'30%'},
        '20%':{transform: 'scale(6.5)',opacity:'50%' },
        '40%':{transform: 'scale(6.7)',opacity:'100%' },
        '70%':{transform: 'scale(7.1)',opacity:'100%' },
        '85%':{transform: 'scale(7.2)',opacity:'90%' },
        '100%':{transform: 'scale(1.7)',opacity:'0%' },
        },
        snakeFromLeft:{
          '0%':{left:'-100%',opacity:'100%'},
          '100%':{left: '100%',opacity:'80'} 
        },
        snakeFromRight:{
          '0%':{right:'-100%',opacity:'100%'},
          '100%':{right:'100%',opacity:'80%'},
        },
        revealbg:{
          '0%':{opacity:'20%'},
          '20%':{opacity: '70%'},
          '80%':{opacity:'70%'},
          '100%':{opacity: '20%'},
        },
      },
    },
  },
  plugins: [],
}
