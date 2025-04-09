import {atom} from 'recoil'

export const userDetailsState = atom({
	key:"userDetailsState",
	default:null,
})

export const userLicenseState = atom({
	key:"userLicenseState",
	default:null
});

export const currentUserState = atom({
	key:"currentUserState",
	default:null,
})

export const currentRoomState = atom({
	key:"currentRoomState",
	default:null,
})

export const roomUserState = atom({
	key:"roomUserState",
	default:null,
})

export const positionState = atom({
	key:"positionState",
	default:0,
})

export const currentColorState = atom({
	key:"currentColorState",
	default:null,
})

export const availableState = atom({
	key:"availableState",
	default:false,
})

export const extraMoveState = atom({
	key:"extraMoveState",
	default:false,
})

export const snakeBiteState = atom({
	key:"snakeBiteState",
	default:false,
})

export const ladderBiteState = atom({
	key:"ladderBiteState",
	default:false,
})

export const currentUsersState = atom({
	key:"currentUsersState",
	default:[]
})

export const musicState = atom({
	key:"musicState",
	default:false
})

export const soundState = atom({
	key:"soundState",
	default:true
})

