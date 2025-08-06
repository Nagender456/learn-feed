import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';
import useLocalStorage from '../hooks/useLocalStorage';

const PersistLogin = () => {
	const refreshToken = useRefreshToken();
	const [isLoading, setIsLoading] = useState(true);
	const [persist, setPersist] = useLocalStorage('persist', false);
	const { auth } = useAuth();

	useEffect(() => {
		let isMounted = true;
		
		const verifyRefreshToken = async () => {
			try {
				await refreshToken();
			} catch (err) {
				setPersist(false);
			} finally {
				isMounted && setIsLoading(false);
			}
		}
		!auth?.isLogin && persist ? verifyRefreshToken() : setIsLoading(false);

		return () => isMounted = false;
	}, [])

	return (
		<>
			{!persist
				? <Outlet />
				: isLoading
					? <p>Loading...</p>
					: <Outlet />
			}
		</>
	)
}

export default PersistLogin;