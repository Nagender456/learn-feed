import axios from 'axios';

// const BASE_URL = 'http://localhost:5000';
// const BASE_URL = 'http://192.168.1.40:5000';
const BASE_URL = 'https://itday-hackathon.onrender.com';

export default axios.create({
    baseURL: BASE_URL,
	withCredentials: true
});

export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true
});