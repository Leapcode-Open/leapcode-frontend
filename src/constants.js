
import { auth } from './config/firebase';
export const API_URL = process.env.REACT_APP_APIURL;

export const getToken = async () => {
    const token = auth().currentUser ? await auth().currentUser.getIdToken() : 'notokeb';
    return token
}

export const API_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'authorization': `Bearer ${getToken()}`
}

export const GET_TOKEN_HEADER_v2 = (token) => ({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'authorization': `Bearer ${token}`
})


export const GET_TOKEN_HEADER = async () => ({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'authorization': `Bearer ${await getToken()}`
})


