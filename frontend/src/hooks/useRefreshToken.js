import axios from '../api/axios';
import useAuth from './useAuth';
import { toast } from 'react-toastify';

const useRefreshToken = () => {
	const { setAuth } = useAuth();

	const refresh = async () => {
		try {
			const response = await axios.get('/user/refresh');
			const accessToken = response?.data?.accessToken;
			const username = response?.data?.username;
			const avatar = response?.data?.avatar
			if (accessToken) {
				setAuth(prev => {
					return {
						...prev,
						isLogin: true,
						username,
						avatar,
						accessToken
					}
				})
			}
		} catch (err) {
			console.log(err);
		}
	}

	return refresh;
}

export default useRefreshToken;